import { Order } from "./order";

export type StatusNFe = "rascunho" | "pronta" | "autorizada" | "cancelada";

export interface ProdutoNFe {
  descricao: string;
  ncm: string;
  cfop: string;
  quantidade: number;
  valor_unitario: number;
}

export interface NotaFiscal extends Omit<Order, "status"> {
  numero_nfe: string;
  status: StatusNFe;
  produtos?: ProdutoNFe[];
  xml?: string;
  chave_acesso?: string;
  protocolo?: string;
  data_emissao?: string;
}
