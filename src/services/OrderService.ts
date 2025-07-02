import { ordersMock } from "@/entities/order";
import { Order } from "@/types/order";

export class OrderService {
  static async list(sort?: string) {
    const response = await fetch(`/api/orders?sort=${sort || ''}`);
    return response.json();
  }

    static async delete(id: number) {
    const response = await fetch(`/api/orders/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }

  static async get(id: number): Promise<Order | null> {
    const order = ordersMock.find((o) => o.id === id);
    if (!order) {
      console.warn(`Mock: Pedido com id ${id} não encontrado.`);
      return null;
    }
    return Promise.resolve(order);
  }

  static async update(id: number, order: any) {
    const response = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    });
    return response.json();
  }

  static async create(id: number, order: any) {
  const response = await fetch(`/api/orders/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  });

  // ✅ Verifica se a resposta tem conteúdo JSON
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  // Caso venha sem conteúdo, ainda retorna status
  return { success: response.ok };
}

}