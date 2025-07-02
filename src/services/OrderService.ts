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

  static async get(id: number) {
    const response = await fetch(`/api/orders/${id}`);

    if (!response.ok) {
      const fallback = await response.text(); // pode ser HTML de erro
      throw new Error(`Erro ao buscar pedido ${id} (${response.status}): ${fallback.slice(0, 80)}...`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return response.json();
    }

    return null;
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