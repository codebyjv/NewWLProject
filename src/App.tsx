import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Pedidos from "@/pages/Pedidos";
import Estoque from "@/pages/Estoque";
import Cadastro from "@/pages/Cadastro";
import NovoCliente from "@/pages/NovoCliente";
import NovoPedido from "@/pages/NovoPedido";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/cadastro" element={<Cadastro />} />
        {/* <Route path="/novo-cliente" element={<NovoCliente />} />
        <Route path="/novo-pedido" element={<NovoPedido />} /> */}
      </Routes>
    </Layout>
  );
}

export default App;