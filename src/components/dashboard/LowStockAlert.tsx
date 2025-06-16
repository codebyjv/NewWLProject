import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  name: string;
  weight: string;
  stock_quantity: number;
}

interface LowStockAlertProps {
  products: Product[];
  isLoading: boolean;
}

const AlertTriangleIcon = AlertTriangle as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const PackageIcon = Package as React.ComponentType<React.SVGProps<SVGSVGElement>>;

export default function LowStockAlert({ products, isLoading }: LowStockAlertProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangleIcon className="w-5 h-5 text-amber-600" />
            Alertas de Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex justify-between items-center p-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            ))};
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangleIcon className="w-5 h-5 text-amber-600" />
          Alertas de Estoque
        </CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center py-6">
            <PackageIcon className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-green-600 font-medium">Estoque OK!</p>
            <p className="text-sm text-gray-500">Todos os produtos estão com estoque adequado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="flex justify-between items-center p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div>
                  <p className="font-medium text-amber-900">{product.name}</p>
                  <p className="text-sm text-amber-700">{product.weight}</p>
                </div>
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                  {product.stock_quantity} un
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}