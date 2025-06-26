import React from "react";

import { TopProductsProps } from "@/types/dashboardProps";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { Package, AlertTriangle } from "lucide-react";

const materialLabels = {
  aco_inox_f1: "Aço Inox F1",
  aco_inox_m1: "Aço Inox M1",
  ferro_fundido_m1: "Ferro Fundido M1"
};

const materialColors = {
  aco_inox_f1: "bg-blue-100 text-blue-800 border-blue-300",
  aco_inox_m1: "bg-green-100 text-green-800 border-green-300",
  ferro_fundido_m1: "bg-gray-100 text-gray-800 border-gray-300"
};

export default function TopProducts({ products, isLoading }: TopProductsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Produtos com Estoque Baixo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex justify-between items-center p-3 border rounded-lg">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          Produtos com Estoque Baixo
        </CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center py-6">
            <Package className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-green-600 font-medium">Estoque OK!</p>
            <p className="text-sm text-gray-500">Todos os produtos estão com estoque adequado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="flex justify-between items-center p-3 border border-red-200 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-red-900">{product.weight}</p>
                  <Badge 
                    className={materialColors[product.material as keyof typeof materialColors] ?? "bg-gray-100 text-gray-800 border-gray-300"}
                    variant="outline"
                    >
                    {materialLabels[product.material as keyof typeof materialLabels] ?? "Material Desconhecido"}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-700">{product.stock_quantity} un</p>
                  <p className="text-xs text-red-600">Mín: {product.min_stock}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}