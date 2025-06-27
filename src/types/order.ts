export interface Order {
  id: number;
  order_number?: string;
  customer_id?: string;
  customer_cpf_cnpj: string;
  customer_name: string;
  created_date: string; 
  sale_date: string; 
  seller: string;
  items?: {
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    discount?: number;
  }[];
  subtotal?: number;
  discount_total?: number;
  shipping_cost?: number;
  additional_cost?: number;
  tax_cost?: number;
  total_amount?: number;
  payment_method:
    | "boleto_bancario"
    | "pix"
    | "cartao_credito"
    | "cartao_debito";
  installments?: {
    number: number;
    value: number;
    due_date: string;
  }[];
  status: "pendente" | "processando" | "enviado" | "entregue" | "cancelado";
  observations?: string;
  delete: boolean;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  discount?: number;
}

export interface Installment {
  number: number;
  value: number;
  due_date: string;
}

export interface OrderFormData {
  id: number;
  created_date: string;
  customer_cpf_cnpj: string;
  customer_name: string;
  status: "pendente" | "processando" | "enviado" | "entregue" | "cancelado";
  sale_date: string;
  seller: string;
  payment_method: "boleto_bancario" | "pix" | "cartao_credito" | "cartao_debito";
  observations: string;
  items: OrderItem[];
  subtotal: number;
  discount_total: number;
  shipping_cost: number;
  additional_cost: number;
  tax_cost: number;
  installments: Installment[];
  total_amount: number;
  delete: boolean;
}