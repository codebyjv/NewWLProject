import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, PackageX } from "lucide-react";

interface StockAlertProps {
  lowStockCount?: number;
  outOfStockCount?: number;
}

export default function StockAlert({ lowStockCount, outOfStockCount }: StockAlertProps) {
  return (
    <Card className="bg-amber-50 border-amber-200">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-around items-center">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <div>
              <p className="font-bold text-amber-800">Estoque Baixo</p>
              <p className="text-sm text-amber-700">{lowStockCount} item(ns)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <PackageX className="w-6 h-6 text-red-600" />
            <div>
              <p className="font-bold text-red-800">Fora de Estoque</p>
              <p className="text-sm text-red-700">{outOfStockCount} item(ns)</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}