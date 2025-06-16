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

// Mock de exemplo
export const orders: Order[] = [
  {
    id: 1,
    order_number: "001",
    customer_cpf_cnpj: "123.456.789-00",
    customer_name: "Cliente Exemplo LTDA",
    created_date: "2023-06-01",
    sale_date: "2023-06-01",
    seller: "Vendedor Exemplo",
    items: [
      {
        product_id: "1",
        product_name: "Peso Padrão Aço Inox F1 1mg",
        quantity: 2,
        unit_price: 100.0,
        total_price: 200.0,
      },
    ],
    subtotal: 200.0,
    total_amount: 200.0,
    payment_method: "pix",
    status: "pendente",
    delete: false,
  },
];