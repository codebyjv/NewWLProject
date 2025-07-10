import { NotaFiscal } from "@/types/nfe";

export const mockNotaFiscal: NotaFiscal = {
  id: 999,
  numero_nfe: "000999",
  serie: "1",
  tipo_operacao: "saida",
  natureza_operacao: "Venda de mercadoria",

  status: "autorizada",
  data_emissao: new Date().toISOString().split("T")[0],
  data_saida: new Date().toISOString().split("T")[0],
  hora_saida: "10:30",

  customer_name: "Cliente Mock",
  customer_cpf_cnpj: "00.000.000/0001-00",
  customer_ie: "1234567890",
  customer_endereco: "Av. Teste, 456 - Rio de Janeiro/RJ",
  customer_municipio: "Rio de Janeiro",
  customer_uf: "RJ",
  customer_cep: "20000-000",
  customer_fone: "(21) 4002-8922",

  seller: "WL COMERCIO E CALIBRACAO EM PESOS PADRAO LTDA",
  seller_cnpj: "10.504.346/0001-80",
  seller_ie: "109953045",
  seller_endereco: "Rua Roberto de Lamenais, 248 - São Paulo/SP",
  seller_fone: "(11) 3641-5974",

  chave_acesso: "35250110504346000180550010000093391523156270",
  protocolo: "135250072741634",

  total_amount: 1234.56,
  base_icms: 0,
  valor_icms: 0,
  base_icms_subst: 0,
  valor_icms_subst: 0,
  valor_ipi: 0,
  valor_frete: 0,
  valor_seguro: 0,
  desconto: 0,
  outras_despesas: 0,

  payment_method: "pix",

  transportadora: {
    nome: "L4B LOGISTICA LTDA",
    cnpj: "24.217.653/0001-95",
    ie: "140538606113",
    endereco: "Alameda Santos",
    municipio: "São Paulo",
    uf: "SP",
    especie: "Caixa Papelão",
    marca: "W Pesos",
    quantidade: 1,
    peso_bruto: 20,
    peso_liquido: 20,
  },

  produtos: [
    {
      codigo: "147",
      descricao: "Jogo de Pesos",
      ncm: "84239010",
      cfop: "6916",
      cst: "0101",
      unidade: "PC",
      quantidade: 1,
      valor_unitario: 400,
    },
  ],

  informacoes_adicionais:
    "DEVOLUÇÃO TOTAL DAS MERCADORIAS DA NF: 228 DO DIA: 10/12/2024. Permite aproveitamento do crédito de ICMS no valor de R$13,92. Documento emitido por ME ou EPP optante pelo Simples Nacional. Não gera direito a crédito fiscal de IPI.",

  created_date: new Date().toISOString(),
  sale_date: new Date().toISOString().split("T")[0],
  delete: false,
};
