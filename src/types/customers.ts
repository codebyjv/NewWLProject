export interface FormErrors {
  id?: string;
  cpf_cnpj?: string;
  razao_social?: string;
  nome_fantasia?: string;
  tipo_contribuinte?: string;
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
  contatos?: Array<{
    nome?: string;
    celular?: string;
    email?: string;
  }>;
  observacoes?: string;
  is_active?: string;
}

export interface Endereco {
  cep: string;
  cidade_uf: string;
  logradouro: string;
  numero: string;
  bairro: string;
  complemento?: string;
}

export interface Contato {
  nome: string;
  celular: string;
  email: string;
}

export interface Customer {
  id: string;
  cpf_cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  tipo_contribuinte: "pessoa_fisica" | "pessoa_juridica" | "mei" | "simples_nacional";
  ie_rg: string;
  cliente_desde: string;
  endereco: Endereco;
  contatos?: Contato[];
  observacoes?: string;
  is_active: boolean;
  created_date?: string;
  updated_date?: string;
}

export interface CustomerFormData extends Omit<Customer, 'contatos'> {
  contatos: Contato[];
}

export type CustomerField = keyof CustomerFormValues;

export type NestedField = keyof CustomerFormValues['endereco'] | `contatos.${number}.${keyof Contato}`;

export type AllFields = CustomerField | `endereco.${keyof CustomerFormValues['endereco']}` | `contatos.${number}.${keyof Contato}`;

export interface ErrorDictionary {
  [key: string]: string;
}

export interface CustomerFormValues {
  id: string;
  cpf_cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  tipo_contribuinte: "pessoa_fisica" | "pessoa_juridica" | "mei" | "simples_nacional";
  ie_rg: string;
  cliente_desde: string;
  endereco: Endereco;
  contatos: Contato[];
  observacoes?: string;
  is_active: boolean;
}