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
    return response.json();
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    });
    return response.json( );
  }
}