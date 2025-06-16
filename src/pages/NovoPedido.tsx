import React, { useState, useEffect } from "react";
import { Order } from "@/entities/order";
import { Product } from "@/entities/product";
import { Customer } from "@/entities/customer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { createPageUrl } from "@/utils";

import OrderForm from "../components/pedidos/OrderForm.js";

export default function NovoPedido() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [productsData, customersData] = await Promise.all([
        Product.list("weight_in_grams"),
        Customer.list("razao_social")
      ]);
      setProducts(productsData.filter(p => p.is_active));
      setCustomers(customersData.filter(c => c.is_active));

      if (id) {
        const orderData = await Order.get(id);
        setOrder(orderData);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setIsLoading(false);
  };

  const handleSaveOrder = async (orderData) => {
    setIsSaving(true);
    try {
      if (id) {
        // Lógica de edição
        await Order.update(id, orderData);
      } else {
        // Lógica de criação
        orderData.order_number = `PED${Date.now()}`;
        const newOrder = await Order.create(orderData);

        // Atualizar estoque dos produtos
        for (const item of orderData.items) {
          const product = products.find(p => p.id === item.product_id);
          if (product) {
            const newQuantity = Math.max(0, product.stock_quantity - item.quantity);
            await Product.update(product.id, { stock_quantity: newQuantity });
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
            size="icon"
            onClick={() => navigate(createPageUrl("Pedidos"))}
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
                  <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <OrderForm
                order={order}
                products={products}
                customers={customers}
                onSave={handleSaveOrder}
                onCancel={() => navigate(createPageUrl("Pedidos"))}
                isSaving={isSaving}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}