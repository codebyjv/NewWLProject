import { Customer } from "@/types/customers";

export class CustomerService {
  static async list(sortBy?: string): Promise<Customer[]> {
    const response = await fetch(`/api/customers?sort=${sortBy || ''}`);
    return response.json();
  }

  static async get(id: string) {
    const response = await fetch(`/api/orders/${id}`);
    return response.json();
  }

  static async create(customer: Customer) {
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    });
    return response.json();
  }

  static async update(id: string, customer: Customer) {
    const response = await fetch(`/api/orders/${customer.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    });
    return response.json();
  }

  static async delete(id: string) {
    const response = await fetch(`/api/orders/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  static async fetchCNPJData(cnpj: string): Promise<any> {
    try {
      // Remove qualquer pontuação
      const cleaned = cnpj.replace(/\D/g, "");

      const response = await fetch(`https://publica.cnpj.ws/cnpj/${cleaned}`);
      if (!response.ok) {
        throw new Error(`Erro na consulta: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao consultar CNPJ.ws:", error);
      return null;
    }
  }
  
}