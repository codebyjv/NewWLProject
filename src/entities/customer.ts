import { Customer } from "@/types/customers";

export const customersMock: Customer[] = [
  {
    id: "1", // Adicionado
    razao_social: "Cliente Exemplo LTDA", // Adicionado
    nome_fantasia: "Cliente Exemplo",
    tipo_contribuinte: "1",
    ie_rg: "123456789",
    cliente_desde: "2023-01-01",
    endereco: {
      cep: "12345-678",
      cidade_uf: "Cidade/UF",
      logradouro: "Rua Exemplo",
      numero: "123",
      bairro: "Bairro Exemplo",
      complemento: "Apto 1"
    },
    cpf_cnpj: "123.456.789-00",
    is_active: true,
  }
];