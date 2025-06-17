import { Product } from "@/types/product";

export interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void; 
  lowStockCount?: number; 
  outOfStockCount?: number;
}