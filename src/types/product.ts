export interface Product {
  name: string;
  id: string;
  material: "aco_inox_f1" | "aco_inox_m1" | "ferro_fundido_m1";
  weight: string;
  weight_in_grams: number;
  stock_quantity: number;
  min_stock?: number;
  unit_price?: number;
  is_active: boolean;
}