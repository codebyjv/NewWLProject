interface FormErrors {
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

interface Endereco {
  cep: string;
  cidade_uf: string;
  logradouro: string;
  numero: string;
  bairro: string;
  complemento?: string;
}

interface Contato {
  nome: string;
  celular: string;
  email: string;
}

interface Customer {
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
}

interface CustomerFormData extends Omit<Customer, 'contatos'> {
  contatos: Contato[];
}

type CustomerField = keyof CustomerFormValues;

type NestedField = keyof CustomerFormValues['endereco'] | `contatos.${number}.${keyof Contato}`;

type AllFields = CustomerField | `endereco.${keyof CustomerFormValues['endereco']}` | `contatos.${number}.${keyof Contato}`;

interface ErrorDictionary {
  [key: string]: string;
}

interface CustomerFormValues {
  cpf_cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  tipo_contribuinte: "pessoa_fisica" | "pessoa_juridica" | "mei" | "simples_nacional";
  ie_rg: string;
  cliente_desde: string;
  endereco: Endereco;
  contatos: Contato[];
  observacoes: string;
  is_active: boolean;
}