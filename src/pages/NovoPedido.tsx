import React, { useState, useEffect } from "react";
import { Order } from "@/types/order";
import { Product } from "@/types/product";
import { Customer } from "@/types/customers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ProductService } from '@/services/ProductService';
import { CustomerService } from '@/services/CustomerService';
import { OrderService } from '@/services/OrderService';
import OrderForm from "@/components/pedidos/OrderForm";

export default function NovoPedido() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [productsData, customersData] = await Promise.all([
        ProductService.list("weight_in_grams"),
        CustomerService.list("razao_social")
      ]);
      setProducts(productsData.filter((p: Product) => p.is_active));
      setCustomers(customersData.filter(c => c.is_active));

      if (id) {
        const orderData = await OrderService.get(Number(id));
        setOrder(orderData);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setIsLoading(false);
  };

  const handleSaveOrder = async (OrderData: any) => {
    setIsSaving(true);
    try {
      if (id) {
        // Lógica de edição
        await OrderService.update(Number(id), OrderData);
      } else {
        // Lógica de criação
        OrderData.order_number = `PED${Date.now()}`;
        const newOrder = await OrderService.create(Number(id), OrderData);

        // Atualizar estoque dos produtos
        for (const item of OrderData.items) {
          const product = products.find(p => p.id === item.product_id);
          if (product) {
            const newQuantity = Math.max(0, product.stock_quantity - item.quantity);
            await ProductService.update(product.id, { stock_quantity: newQuantity });
          }
        }
      }

      navigate(createPageUrl("Pedidos"));
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
    }
    setIsSaving(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate(createPageUrl("/Pedidos"))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{id ? "Editar Pedido" : "Novo Pedido"}</h1>
            <p className="text-gray-600 mt-1">
              {id ? `Editando o pedido ${order?.order_number || ''}` : "Criar um novo pedido no sistema"}
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              Dados do Pedido
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <OrderForm
                  order={order ?? {
                    id: 0,
                    order_number: "",
                    sale_date: new Date().toISOString(),
                    customer_name: "",
                    customer_cpf_cnpj: "",
                    payment_method: "pix",
                    items: [],
                    subtotal: 0,
                    total_amount: 0,
                    discount_total: 0,
                    shipping_cost: 0,
                    additional_cost: 0,
                    tax_cost: 0,
                    status: "pendente",
                    created_date: new Date().toISOString(),
                    seller: "",
                    delete: false
                  }}
                products={products}
                customers={customers}
                onSave={handleSaveOrder}
                onCancel={() => navigate(createPageUrl("/Pedidos"))}
                isSaving={isSaving}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}