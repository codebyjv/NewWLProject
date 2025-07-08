import { Order } from "./order";

export type StatusNFe = "rascunho" | "pronta" | "autorizada" | "cancelada";

export interface NotaFiscal extends Omit<Order, "status"> {
  numero_nfe: string;
  status: StatusNFe;
  xml?: string;
  chave_acesso?: string;
  protocolo?: string;
  data_emissao?: string;
}
