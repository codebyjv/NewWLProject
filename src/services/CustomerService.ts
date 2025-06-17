export class CustomerService {
  static async list(sortBy?: string): Promise<Customer[]> {
    const response = await fetch(`/api/customers?sort=${sortBy || ''}`);
    return response.json();
  }

  static async get(id: string) {
    const response = await fetch(`/api/orders/${id}`);
    return response.json();
  }
}