
import React, { useState, useEffect } from "react";

import { ProductService } from "@/services/ProductService";
import { Product } from "@/types/product";
import { OrderService } from "@/services/OrderService";
import { Order } from "@/types/order";
import { CustomerService } from "@/services/CustomerService";

import { Package, ShoppingCart, Users, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";

import { format, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

import StatsCard from "../components/dashboard/StatsCard";
import LowStockAlert from "../components/dashboard/LowStockAlert";
import RecentOrders from "../components/dashboard/RecentOrders";
import TopProducts from "../components/dashboard/TopProducts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    lowStockItems: 0,
    monthlyRevenue: 0,
    pendingOrders: 0
  });
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [products = [], orders = [], customers = []] = await Promise.all([
        ProductService.list().catch(() => []),
        OrderService.list("-created_date").catch(() => []),
        CustomerService.list().catch(() => [])
      ]);

      // Produtos com estoque baixo
      const lowStock = Array.isArray(products) ? products.filter(p => p.stock_quantity <= p.min_stock) : [];
      
      // Pedidos do mês atual
      const currentMonth = new Date();
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      
      const monthlyOrders = Array.isArray(orders) ? orders.filter(order => {
        const orderDate = new Date(order.created_date);
        return orderDate >= monthStart && orderDate <= monthEnd;
      }) : [];
      
      const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      const pendingOrders = Array.isArray(orders) ? orders.filter(order => order.status === 'pendente').length : 0;

      setStats({
        totalProducts: Array.isArray(products) ? products.length : 0,
        totalOrders: Array.isArray(orders) ? orders.length : 0,
        totalCustomers: Array.isArray(customers) ? customers.length : 0,
        lowStockItems: lowStock.length,
        monthlyRevenue,
        pendingOrders
      });

      setLowStockProducts(lowStock.slice(0, 5));
      setRecentOrders(Array.isArray(orders) ? orders.slice(0, 5) : []);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Visão geral do sistema -{" "}
              {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total de Produtos"
            value={stats.totalProducts}
            icon={Package}
            color="blue"
            isLoading={isLoading}
            alert={stats.totalProducts > 0 ? "green" : "red"}
          />
          <StatsCard
            title="Pedidos do Mês"
            value={stats.totalOrders}
            icon={ShoppingCart}
            color="green"
            isLoading={isLoading}
            alert={stats.totalOrders > 0 ? "green" : "red"}
          />
          <StatsCard
            title="Clientes Cadastrados"
            value={stats.totalCustomers}
            icon={Users}
            color="purple"
            isLoading={isLoading}
            alert={stats.totalCustomers > 0 ? "green" : "red"}
          />
          <StatsCard
            title="Estoque Baixo"
            value={stats.lowStockItems}
            icon={AlertTriangle}
            color="red"
            isLoading={isLoading}
            alert={stats.lowStockItems > 0}
          />
        </div>

        {/* Revenue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                <DollarSign className="w-5 h-5" />
                Faturamento do Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(stats.monthlyRevenue)}
              </div>
              <p className="text-red-100 text-sm mt-1">
                {format(new Date(), "MMMM yyyy", { locale: ptBR })}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                Pedidos Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.pendingOrders}
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Necessitam processamento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RecentOrders orders={recentOrders} isLoading={isLoading} />
            <TopProducts products={lowStockProducts} isLoading={isLoading} />
          </div>

          <div className="space-y-6">
            <LowStockAlert products={lowStockProducts} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
