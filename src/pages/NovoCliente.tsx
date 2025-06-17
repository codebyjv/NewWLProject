import React, { useState, useEffect } from "react";
import { Customer } from "@/types/customers";
import { CustomerService } from "@/services/CustomerService.js"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { createPageUrl } from "@/utils";

import CustomerForm from "../components/cadastros/CustomerForm.js";

export default function NovoCliente() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      CustomerService.get(id)
        .then(data => {
          setCustomer(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Erro ao carregar cliente:", err);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const handleSaveCustomer = async (customerData: any) => {
    setIsSaving(true);
    try {
      if (id) {
        await CustomerService.update(Number(id), customerData);
      } else {
        await CustomerService.create(customerData);
      }
      navigate(createPageUrl("Cadastros"));
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
    }
    setIsSaving(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate(createPageUrl("Cadastros"))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{id ? "Editar Cliente" : "Novo Cliente"}</h1>
            <p className="text-gray-600 mt-1">{id ? `Editando o cliente ${customer?.razao_social || ''}` : "Cadastrar um novo cliente no sistema"}</p>
          </div>
        </div>

        {/* Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              Dados do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
               <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <CustomerForm
                customer={customer}
                onSave={handleSaveCustomer}
                onCancel={() => navigate(createPageUrl("Cadastros"))}
                isSaving={isSaving}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}