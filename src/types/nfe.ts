import { Order } from "./order";

export type StatusNFe = "rascunho" | "aguardando" | "pronta" | "autorizada" | "cancelada";

export interface ProdutoNFe {
  descricao: string;
  ncm: string;
  cfop: string;
  quantidade: number;
  valor_unitario: number;
}

export type Parcela = {
  number: number;
  value: number;
  due_date: string;
};

export interface NotaFiscal extends Omit<Order, "status"> {
  id: number;
  numero_nfe: string;
  serie: string;
  tipo_operacao: "entrada" | "saida";

  status: "rascunho" | "aguardando" | "pronta" | "autorizada" | "cancelada";
  natureza_operacao: string;

  data_emissao: string;
  data_saida: string;
  hora_saida?: string;

  customer_name: string;
  customer_cpf_cnpj: string;
  customer_ie?: string;
  customer_endereco: string;
  customer_municipio: string;
  customer_uf: string;
  customer_cep: string;
  customer_fone?: string;

  seller: string;
  seller_cnpj: string;
  seller_ie?: string;
  seller_endereco: string;
  seller_fone?: string;

  chave_acesso?: string;
  protocolo?: string;

  total_amount: number;
  base_icms?: number;
  valor_icms?: number;
  base_icms_subst?: number;
  valor_icms_subst?: number;
  valor_ipi?: number;
  valor_frete?: number;
  valor_seguro?: number;
  desconto?: number;
  outras_despesas?: number;

  payment_method: "boleto_bancario" | "pix" | "cartao_credito" | "cartao_debito";

  transportadora?: {
    nome: string;
    cnpj: string;
    ie?: string;
    endereco: string;
    municipio: string;
    uf: string;
    especie: string;
    marca: string;
    quantidade: number;
    peso_bruto: number;
    peso_liquido: number;
  };

  produtos: {
    codigo?: string;
    descricao: string;
    ncm: string;
    cfop: string;
    cst?: string;
    unidade?: string;
    quantidade: number;
    valor_unitario: number;
  }[];

  informacoes_adicionais?: string;

  created_date: string;
  sale_date: string;
  delete: boolean;
}
