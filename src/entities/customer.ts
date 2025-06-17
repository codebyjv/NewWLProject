import { Customer } from "@/types/customers";

export const customersMock: Customer[] = [
  {
    id: 1, // Adicionado
    name: "Cliente Exemplo LTDA", // Adicionado
    email: "contato@exemplo.com", // Adicionado
    cpf_cnpj: "123.456.789-00",
    razao_social: "Cliente Exemplo LTDA",
    is_active: true,
    // ... resto dos campos
  }
];