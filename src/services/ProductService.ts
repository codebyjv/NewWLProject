export class ProductService {
  static async list(sortBy?: string) {
    // Implementação real com sua API (fetch/axios/supabase)
    const response = await fetch(`/api/products?sort=${sortBy || ''}`);
    return response.json();
  }

  static async update(id: string, data: any) {
    // Implementação real com sua API (fetch/axios/supabase)
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}