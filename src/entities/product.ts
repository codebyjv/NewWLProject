export interface Product {
  name: string;
  material: "aco_inox_f1" | "aco_inox_m1" | "ferro_fundido_m1";
  weight: string;
  weight_in_grams: number;
  stock_quantity?: number;
  min_stock?: number;
  unit_price?: number;
  is_active?: boolean;
}

// Mock de exemplo
export const products: Product[] = [
  {
    name: "Peso Padrão Aço Inox F1 1mg",
    material: "aco_inox_f1",
    weight: "1mg",
    weight_in_grams: 0.001,
    stock_quantity: 10,
    min_stock: 5,
    unit_price: 100.0,
    is_active: true,
  },
];