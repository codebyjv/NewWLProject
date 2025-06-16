export interface Customer {
  cpf_cnpj: string;
  razao_social: string;
  nome_fantasia?: string;
  tipo_contribuinte?: "pessoa_fisica" | "pessoa_juridica" | "mei" | "simples_nacional";
  ie_rg?: string;
  cliente_desde?: string; // formato: "date"
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
  is_active?: boolean;
}

// Mock de exemplo
export const customers: Customer[] = [
  {
    cpf_cnpj: "123.456.789-00",
    razao_social: "Cliente Exemplo LTDA",
    nome_fantasia: "Exemplo",
    tipo_contribuinte: "pessoa_juridica",
    cliente_desde: "2023-01-01",
    endereco: {
      cep: "12345-678",
      cidade_uf: "São Paulo/SP",
      logradouro: "Rua Exemplo",
      numero: "123",
      bairro: "Centro",
    },
    contatos: [
      {
        nome: "João Silva",
        celular: "(11) 99999-9999",
        email: "joao@exemplo.com",
      },
    ],
    observacoes: "Cliente VIP",
    is_active: true,
  },
];