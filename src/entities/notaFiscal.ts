import { NotaFiscal } from "@/types/nfe";

export const mockNotaFiscal: NotaFiscal = {
  id: 1,
  numero_nfe: "123456789",
  status: "autorizada",
  customer_name: "Empresa Exemplo LTDA",
  customer_cpf_cnpj: "12.345.678/0001-99",
  total_amount: 1500.75,
  created_date: new Date().toISOString(),
  data_emissao: new Date().toISOString().split("T")[0],
  produtos: [
    {
      descricao: "Produto A",
      ncm: "12345678",
      cfop: "5102",
      quantidade: 2,
      valor_unitario: 500,
    },
    {
      descricao: "Produto B",
      ncm: "87654321",
      cfop: "5102",
      quantidade: 1,
      valor_unitario: 500.75,
    },
  ],
  sale_date: new Date().toISOString().split("T")[0],
  seller: "João Vitor",
  payment_method: "boleto_bancario",
  delete: false,
};
