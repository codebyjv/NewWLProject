export interface Customer {
  id: number;
  cpf_cnpj: string;
  razao_social: string;
  name: string;  
  email: string; 
  phone?: string;
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