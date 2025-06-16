export class CustomerService {
  static async list() {
    const response = await fetch('/api/customers');
    return response.json();
  }
}