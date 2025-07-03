export interface FiscalSettings {
  regime_tributario: "simples_nacional" | "lucro_presumido" | "lucro_real";
  cnpj_emitente: string;
  razao_social: string;
  nome_fantasia?: string;
  inscricao_estadual: string;
  uf: string;
  municipio: string;
  cnae_principal: string;
  serie_nfe: string; // ex: 1
  modelo_nfe: string; // ex: 55
  csosn_padrao: string;
  cfop_padrao: string;
  aliquota_icms_padrao: number;
  cest_padrao?: string;
}
