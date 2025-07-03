export interface FormProductErrors {
  id: string
  unit_price?: number;
  is_active: boolean;

  // Novos campos fiscais
  codigo: string;
  ncm: string;
  cfop: string;
  cest?: string;
  unidade_comercial: string;
  origem: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
  csosn: string;
  aliquota_icms?: number;
}

export interface Product {
  id: string;
  name: string;
  material: MaterialType;
  weight: string;
  weight_in_grams: number;
  stock_quantity: number;
  min_stock: number;
  unit_price: number;
  is_active: boolean;

  // Novos campos fiscais
  codigo: string;
  ncm: string;
  cfop: string;
  cest?: string;
  unidade_comercial: string;
  origem: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
  csosn: string;
  aliquota_icms?: number;
}

export type MaterialType = "aco_inox_f1" | "aco_inox_m1" | "ferro_fundido_m1";

export interface ProductFormData {
  id: string;
  name: string;
  material: MaterialType;
  weight: string;
  weight_in_grams: number;
  stock_quantity: number;
  min_stock: number;
  unit_price: number | undefined;
  is_active: boolean;

  // Novos campos fiscais
  codigo: string;
  ncm: string;
  cfop: string;
  cest?: string;
  unidade_comercial: string;
  origem: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
  csosn: string;
  aliquota_icms?: number;
}

export interface ProductFormProps {
  product: ProductFormData | undefined;
  onSave: (product: ProductFormData) => void;
  onCancel: () => void;
  isSaving: boolean;
}