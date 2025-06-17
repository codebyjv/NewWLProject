export interface Order {
  id: number;
  order_number?: string;
  customer_id?: string;
  customer_cpf_cnpj: string;
  customer_name: string;
  created_date: string; // formato: "date"
  sale_date: string; // formato: "date"
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
    due_date: string; // formato: "date"
  }[];
  status?: "pendente" | "processando" | "enviado" | "entregue" | "cancelado";
  observations?: string;
  delete: boolean;
}