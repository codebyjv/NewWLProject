import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const tipoContribuinteLabels = {
  pessoa_fisica: "Pessoa Física",
  pessoa_juridica: "Pessoa Jurídica",
  mei: "MEI",
  simples_nacional: "Simples Nacional"
};

export default function CustomerTable({ customers, isLoading, onSelectCustomer, selectedCustomer }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Lista de Clientes ({customers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {customers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum cliente encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>CPF/CNPJ</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cliente Desde</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow 
                    key={customer.id}
                    className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedCustomer?.id === customer.id ? 'bg-red-50 border-l-4 border-red-500' : ''
                    }`}
                    onClick={() => onSelectCustomer(customer)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{customer.razao_social}</p>
                        {customer.nome_fantasia && (
                          <p className="text-sm text-gray-500">{customer.nome_fantasia}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {customer.cpf_cnpj}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {tipoContribuinteLabels[customer.tipo_contribuinte] || customer.tipo_contribuinte}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {customer.cliente_desde ? 
                        format(new Date(customer.cliente_desde), "dd/MM/yyyy", { locale: ptBR }) 
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <Badge className={customer.is_active ? 
                        "bg-green-100 text-green-800 border-green-300" : 
                        "bg-red-100 text-red-800 border-red-300"
                      }>
                        {customer.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}