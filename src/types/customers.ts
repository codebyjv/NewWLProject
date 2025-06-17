export interface Customer {
  id: number; // Adicione o campo que estava faltando
  cpf_cnpj: string;
  razao_social: string;
  name: string;         // Mantido do types/
  email: string;        // Mantido do types/
  phone?: string;       // Mantido do types/
  nome_fantasia?: string;
  tipo_contribuinte?: "pessoa_fisica" | "pessoa_juridica" | "mei" | "simples_nacional";
  ie_rg?: string;
  cliente_desde?: string;
  endereco?: {
    cep?: string;
    cidade_uf?: string;
    logradouro?: string;
    numero?: string;
    bairro?: string;
    complemento?: string;
  };
  contatos?: {
    nome?: string;
    celular?: string;
    email?: string;
  }[];
  observacoes?: string;
  is_active: boolean;
}