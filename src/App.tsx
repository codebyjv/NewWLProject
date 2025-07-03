import React from "react";
import { Routes as RouterRoutes, Route } from "react-router-dom";
import { Routes } from "@/utils/routes"; // aqui vem o seu objeto com os caminhos

import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Pedidos from "@/pages/Pedidos";
import Estoque from "@/pages/Estoque";
import Cadastro from "@/pages/Cadastro";
import NovoCliente from "@/pages/NovoCliente";
import NovoPedido from "@/pages/NovoPedido";
import ConfiguracoesFiscais from "@/pages/ConfiguracoesFiscais";

function App() {
  return (
    <Layout>
      <RouterRoutes>
        <Route path={Routes.dashboard} element={<Dashboard />} />
        <Route path={Routes.pedidos} element={<Pedidos />} />
        <Route path={Routes.novoPedido} element={<NovoPedido />} />
        <Route path={Routes.estoque} element={<Estoque />} />
        <Route path={Routes.cadastros} element={<Cadastro />} />
        <Route path={Routes.novoCliente} element={<NovoCliente />} />
        <Route path="/novo-cliente" element={<NovoCliente />} />
        <Route path={Routes.configuracoes.fiscais} element={<ConfiguracoesFiscais />} />
      </RouterRoutes>
    </Layout>
  );
}

export default App;