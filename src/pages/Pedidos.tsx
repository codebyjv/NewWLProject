
import React, { useState, useEffect } from "react";
import { Customer } from "@/types/customers";
import { Order } from "@/types/order";
import { OrderProps } from "@/types/orderProps"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Plus,
  ShoppingCart,
  Calendar,
  Filter,
  Download
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { OrdersTable, OrderFilters } from "@/components/pedidos";
import OrderDetails from "../components/pedidos/OrderDetails.js";
import { OrderService } from "../services/OrderService";
import { CustomerService } from "../services/CustomerService";


export default function Pedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    dateFrom: "",
    dateTo: "",
    status: "all",
    paymentMethod: "all"
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, filters]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [ordersData = [], customersData = []] = await Promise.all([
        OrderService.list("-created_date").catch(() => []),
        CustomerService.list().catch(() => [])
      ]);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setCustomers(Array.isArray(customersData) ? customersData : []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setOrders([]);
      setCustomers([]);
    }
    setIsLoading(false);
  };

  const filterOrders = () => {
    let filtered = Array.isArray(orders) ? orders : [];

    // Filtro por busca (nome do cliente ou número do pedido)
    if (filters.search) {
      filtered = filtered.filter(order =>
        (order.customer_name || "").toLowerCase().includes(filters.search.toLowerCase()) ||
        (order.order_number || "").toLowerCase().includes(filters.search.toLowerCase()) ||
        (order.customer_cpf_cnpj || "").includes(filters.search)
      );
    }

    // Filtro por data
    if (filters.dateFrom) {
      filtered = filtered.filter(order =>
        order.sale_date && new Date(order.sale_date) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(order =>
        order.sale_date && new Date(order.sale_date) <= new Date(filters.dateTo)
      );
    }

    // Filtro por status
    if (filters.status !== "all") {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // Filtro por método de pagamento
    if (filters.paymentMethod !== "all") {
      filtered = filtered.filter(order => order.payment_method === filters.paymentMethod);
    }

    setFilteredOrders(filtered);
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const OrderComponent: React.FC<OrderProps> = ({ order, onDelete }) => {
    return (
      <div>
        <h2>Pedido #{order.id}</h2>
        <p>Cliente: {order.customer_name}</p>
        <button onClick={() => onDelete(order.id)}>Deletar</button>
      </div>
    );
  };

  const handleDeleteOrder = async (orderId: number) => {
    try {
      await OrderService.delete(orderId);
      setSelectedOrder(null);
      loadData();
    } catch (error) {
      console.error("Erro ao excluir pedido:", error);
    }
  };

  const exportToCSV = () => {
    const safeOrders = Array.isArray(filteredOrders) ? filteredOrders : [];
    
    if (safeOrders.length === 0) {
      console.warn("No orders to export.");
      return;
    }

    const csvData = safeOrders.map(order => ({
      "Número do Pedido": order.order_number || order.id || "",
      "Cliente": order.customer_name || "",
      "CPF/CNPJ": order.customer_cpf_cnpj || "",
      "Data da Venda": order.sale_date ? format(new Date(order.sale_date), "dd/MM/yyyy") : "",
      "Vendedor": order.seller || "",
      "Valor Total": (order.total_amount || 0).toFixed(2),
      "Forma de Pagamento": order.payment_method || "",
      "Status": order.status || "",
      "Data de Criação": order.created_date ? format(new Date(order.created_date), "dd/MM/yyyy HH:mm") : ""
    }));

    type CsvRow = {
      "Número do Pedido": string | number;
      "Cliente": string;
      "CPF/CNPJ": string;
      "Data da Venda": string;
      "Vendedor": string;
      "Valor Total": string;
      "Forma de Pagamento": "boleto_bancario" | "pix" | "cartao_credito" | "cartao_debito";
      "Status": string;
      "Data de Criação": string;
    };

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(';'),
      ...csvData.map(row => headers.map(header => {
        const value = (row as CsvRow)[header as keyof CsvRow];
        // Escape double quotes by doubling them, then wrap the whole field in double quotes
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(';'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pedidos_${format(new Date(), 'ddMMyyyy')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the object URL
  };

  const totalRevenue = Array.isArray(filteredOrders) ? filteredOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0) : 0;
  const pendingOrders = Array.isArray(filteredOrders) ? filteredOrders.filter(order => order.status === 'pendente').length : 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Central de Pedidos</h1>
            <p className="text-gray-600 mt-1">Gerencie todos os pedidos do sistema</p>
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <Button
              variant="outline"
              onClick={exportToCSV}
              disabled={filteredOrders.length === 0}
              className="flex-1 lg:flex-none"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
            <Link to={createPageUrl("NovoPedido")} className="flex-1 lg:flex-none">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Novo Pedido
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total de Pedidos</p>
                  <p className="text-2xl font-bold">{Array.isArray(filteredOrders) ? filteredOrders.length : 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-amber-600" />
                <div>
                  <p className="text-sm text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-amber-600">{pendingOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">R$</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Receita Total</p>
                  <p className="text-lg font-bold text-green-600">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(totalRevenue)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">📊</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ticket Médio</p>
                  <p className="text-lg font-bold text-purple-600">
                    {(Array.isArray(filteredOrders) && filteredOrders.length > 0) ? new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(totalRevenue / filteredOrders.length) : 'R$ 0,00'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <OrderFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OrdersTable
              orders={filteredOrders}
              isLoading={isLoading}
              onSelectOrder={setSelectedOrder}
              selectedOrder={selectedOrder}
            />
          </div>
          <div>
            <OrderDetails
              order={selectedOrder}
              onDelete={handleDeleteOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
