import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Order } from "@/types/order";

export default function ImprimirPedido() {
  const [searchParams] = useSearchParams();
  const [pedido, setPedido] = useState<Order | null>(null);
  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      // Buscar o pedido pelo ID (pode ser via Supabase, API ou local)
      // Exemplo fictício:
      fetch(`/api/pedidos/${id}`)
        .then((res) => res.json())
        .then((data) => setPedido(data));
    }
  }, [id]);

  useEffect(() => {
    if (pedido) {
      setTimeout(() => window.print(), 500); // imprime automaticamente
    }
  }, [pedido]);

  if (!pedido) return <p>Carregando pedido...</p>;

  return (
    <div className="p-6 print:p-0">
      <h1 className="text-xl font-bold mb-4">Pedido #{pedido.id}</h1>
      <p><strong>Cliente:</strong> {pedido.customer_name}</p>
      <p><strong>CPF/CNPJ:</strong> {pedido.customer_cpf_cnpj}</p>
      <p><strong>Data:</strong> {pedido.sale_date}</p>
      <p><strong>Vendedor:</strong> {pedido.seller}</p>
      <hr className="my-4" />
      <h2 className="font-semibold">Itens:</h2>
      <ul className="list-disc ml-6">
        {pedido.items?.map((item, i) => (
          <li key={i}>
            {item.quantity}x {item.product_name} — R$ {item.total_price.toFixed(2)}
          </li>
        ))}
      </ul>
      <hr className="my-4" />
      <p><strong>Total:</strong> R$ {pedido.total_amount?.toFixed(2)}</p>
    </div>
  );
}
