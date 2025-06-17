import { Order } from "@/types/order";

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