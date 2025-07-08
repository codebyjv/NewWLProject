import { NotaFiscal } from "@/types/nfe";

export const mockNotaFiscal: NotaFiscal = {
  id: 999,
  numero_nfe: "000999",
  status: "autorizada",
  customer_name: "Cliente Mock",
  customer_cpf_cnpj: "00.000.000/0001-00",
  total_amount: 1234.56,
  created_date: new Date().toISOString(),
  data_emissao: new Date().toISOString().split("T")[0],
  data_saida: new Date().toISOString().split("T")[0],
  sale_date: new Date().toISOString().split("T")[0],
  seller: "Vendedor Exemplo",
  payment_method: "pix",
  delete: false,
  produtos: [
    {
      descricao: "Produto Exemplo",
      ncm: "12345678",
      cfop: "5102",
      quantidade: 2,
      valor_unitario: 500,
    },
  ],
};