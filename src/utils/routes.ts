// Rotas fixas
export const Routes = {
  dashboard: "/",
  pedidos: "/Pedidos",
  estoque: "/Estoque",
  cadastros: "/Cadastros",
  novoCliente: "/Cadastros/NovoCliente",
  novoPedido: "/Pedidos/NovoPedido",
  configuracoes: {
    fiscais: "/configuracoes/fiscais",
  },
  fiscal: "/Fiscal",
};

// Helpers de navegação com parâmetros
export const toEditCustomer = (id: string) => `${Routes.novoCliente}?id=${id}`;
export const toEditOrder = (id: string) => `${Routes.novoPedido}?id=${id}`;
export const toCustomerDetails = (id: string) => `${Routes.cadastros}?selected=${id}`;
