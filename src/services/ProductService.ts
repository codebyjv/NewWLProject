export class ProductService {
  static async list(sortBy?: string) {
    // Implementação real com sua API (fetch/axios/supabase)
    const response = await fetch(`/api/products?sort=${sortBy || ''}`);
    return response.json();
  }
}