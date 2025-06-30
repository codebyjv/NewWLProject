import React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Pencil } from 'lucide-react';
import { ProductCardProps } from '@/types/productsProps';

export default function ProductCard({ product, onEdit }: ProductCardProps) {
  return (
    <Card className="hover:shadow-md transition-all cursor-pointer">
      <CardContent className="p-4 space-y-2">
        <div onClick={() => onEdit(product)} role="button" tabIndex={0} className="space-y-2 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
            <Pencil className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">{product.weight} • {product.material.replaceAll('_', ' ')}</p>
          <p className="text-sm text-gray-500">
            Qtd: {product.stock_quantity} • Mín: {product.min_stock}
          </p>
          <p className="text-sm text-green-600 font-medium">
            R$ {product.unit_price.toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
