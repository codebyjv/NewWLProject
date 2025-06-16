
import React, { useState, useEffect } from "react";
import { Customer } from "@/entities/Customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  Plus, 
  Users, 
  Download,
  Filter
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import CustomerTable from "../components/cadastros/CustomerTable";
import CustomerFilters from "../components/cadastros/CustomerFilters";
import CustomerDetails from "../components/cadastros/CustomerDetails";

export default function Cadastros() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    tipoContribuinte: "all",
    isActive: "all"
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, filters]);

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await Customer.list("-created_date").catch(() => []);
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      setCustomers([]);
    }
    setIsLoading(false);
  };

  const filterCustomers = () => {
    let filtered = Array.isArray(customers) ? customers : [];

    // Filtro por busca
    if (filters.search) {
      filtered = filtered.filter(customer =>
        (customer.razao_social || "").toLowerCase().includes(filters.search.toLowerCase()) ||
        (customer.nome_fantasia || "").toLowerCase().includes(filters.search.toLowerCase()) ||
        (customer.cpf_cnpj || "").includes(filters.search)
      );
    }

    // Filtro por tipo de contribuinte
    if (filters.tipoContribuinte !== "all") {
      filtered = filtered.filter(customer => 
        customer.tipo_contribuinte === filters.tipoContribuinte
      );
    }

    // Filtro por status ativo
    if (filters.isActive !== "all") {
      const isActive = filters.isActive === "true";
      filtered = filtered.filter(customer => customer.is_active === isActive);
    }

    setFilteredCustomers(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      await Customer.delete(customerId);
      setSelectedCustomer(null);
      loadCustomers();
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      alert("Não foi possível excluir o cliente. Tente novamente.");
    }
  };

  const exportToCSV = () => {
    const safeCustomers = Array.isArray(filteredCustomers) ? filteredCustomers : [];
    const csvData = safeCustomers.map(customer => ({
      "CPF/CNPJ": customer.cpf_cnpj || "",
      "Razão Social": customer.razao_social || "",
      "Nome Fantasia": customer.nome_fantasia || "",
      "Tipo de Contribuinte": customer.tipo_contribuinte || "",
      "IE/RG": customer.ie_rg || "",
      "Cliente Desde": customer.cliente_desde ? format(new Date(customer.cliente_desde), "dd/MM/yyyy") : "",
      "CEP": customer.endereco?.cep || "",
      "Cidade/UF": customer.endereco?.cidade_uf || "",
      "Logradouro": customer.endereco?.logradouro || "",
      "Número": customer.endereco?.numero || "",
      "Bairro": customer.endereco?.bairro || "",
      "Status": customer.is_active ? "Ativo" : "Inativo",
      "Data de Cadastro": customer.created_date ? format(new Date(customer.created_date), "dd/MM/yyyy HH:mm") : ""
    }));

    if (csvData.length === 0) return;

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(';'),
      ...csvData.map(row => headers.map(header => {
        const value = row[header];
        // Handle quotes and newlines in CSV values
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(';'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clientes_${format(new Date(), 'ddMMyyyy_HHmmss')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the URL object
  };

  const safeCustomers = Array.isArray(customers) ? customers : [];
  const activeCustomers = safeCustomers.filter(c => c.is_active).length;
  const inactiveCustomers = safeCustomers.filter(c => !c.is_active).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Central de Cadastros</h1>
            <p className="text-gray-600 mt-1">Gerencie todos os clientes cadastrados</p>
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <Button 
              variant="outline"
              onClick={exportToCSV}
              disabled={filteredCustomers.length === 0}
              className="flex-1 lg:flex-none"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
            <Link to={createPageUrl("NovoCliente")} className="flex-1 lg:flex-none">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Novo Cliente
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total de Clientes</p>
                  <p className="text-2xl font-bold">{customers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Clientes Ativos</p>
                  <p className="text-2xl font-bold text-green-600">{activeCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-bold">✕</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Clientes Inativos</p>
                  <p className="text-2xl font-bold text-gray-600">{inactiveCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <CustomerFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CustomerTable 
              customers={filteredCustomers} 
              isLoading={isLoading}
              onSelectCustomer={setSelectedCustomer}
              selectedCustomer={selectedCustomer}
            />
          </div>
          <div>
            <CustomerDetails 
              customer={selectedCustomer}
              onDelete={handleDeleteCustomer}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
