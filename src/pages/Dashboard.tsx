
import React, { useState, useEffect } from "react";

import { ProductService } from "@/services/ProductService";
import { Product } from "@/types/product";
import { OrderService } from "@/services/OrderService";
import { Order } from "@/types/order";
import { CustomerService } from "@/services/CustomerService";

import { Package, ShoppingCart, Users, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";

import { ptBR } from "date-fns/locale";

import StatsCard from "../components/dashboard/StatsCard";
import LowStockAlert from "../components/dashboard/LowStockAlert";
import RecentOrders from "../components/dashboard/RecentOrders";
import TopProducts from "../components/dashboard/TopProducts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { customersMock } from "@/entities/customer";
import { ordersMock } from "@/entities/order";
import { productsMock } from "@/entities/product";
import { format, startOfMonth, endOfMonth, isThisMonth } from "date-fns";


export default function Dashboard() {
  const lowStockProducts = productsMock.filter(p => p.stock_quantity <= p.min_stock).slice(0, 5);
  const recentOrders = ordersMock.slice(0, 5);

  const isLoading = false;
  const monthlyOrders = ordersMock.filter(order =>
    isThisMonth(new Date(order.sale_date))
  );
  const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const pendingOrders = ordersMock.filter(order => order.status === "pendente").length;

  const stats = {
    totalProducts: productsMock.length,
    totalOrders: ordersMock.length,
    totalCustomers: customersMock.length,
    lowStockItems: lowStockProducts.length,
    monthlyRevenue: ordersMock
      .filter(order => isThisMonth(new Date(order.sale_date)))
      .reduce((sum, order) => sum + (order.total_amount || 0), 0),
    pendingOrders: ordersMock.filter(order => order.status === "pendente").length
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
            title="Pedidos do Mês"
            value={stats.totalOrders}
            icon={ShoppingCart}
            color="green"
            isLoading={isLoading}
          />
          <StatsCard
            title="Clientes Cadastrados"
            value={stats.totalCustomers}
            icon={Users}
            color="purple"
            isLoading={isLoading}
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
