import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash2, FileDown } from "lucide-react";
import { NotaFiscal, StatusNFe } from "@/types/nfe";
import { useNavigate } from "react-router-dom";
import { toEditNFe } from "@/utils/routes";

const statusLabels = {
  rascunho: "Rascunho",
  pronta: "Pronta",
  autorizada: "Autorizada",
  cancelada: "Cancelada"
};

const statusColors = {
  rascunho: "bg-gray-100 text-gray-800 border-gray-300",
  pronta: "bg-blue-100 text-blue-800 border-blue-300",
  autorizada: "bg-green-100 text-green-800 border-green-300",
  cancelada: "bg-red-100 text-red-800 border-red-300"
};

export default function CentralNFe() {
  const navigate = useNavigate();

  const [filtroStatus, setFiltroStatus] = useState<StatusNFe | "todos">("todos");
  const [notasFiscais, setNotasFiscais] = useState<NotaFiscal[]>([]);

  const notasFiltradas = filtroStatus === "todos"
    ? notasFiscais
    : notasFiscais.filter((n) => n.status === filtroStatus);


  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Central de NF-e</h1>
        <Button variant="red" onClick={() => navigate("/Fiscal/Editar/nova")}>
          + Nova NF-e
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Buscar por cliente ou CNPJ..."
          className="max-w-sm"
        />
        <Select value={filtroStatus ?? ""} onValueChange={(value) => setFiltroStatus(value as StatusNFe | "todos")}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="rascunho">Rascunho</SelectItem>
            <SelectItem value="pronta">Pronta</SelectItem>
            <SelectItem value="autorizada">Autorizada</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notasFiscais
            .filter((n) => !filtroStatus || n.status === filtroStatus)
            .map((nota) => (
              <TableRow key={nota.id}>
                <TableCell>{nota.numero_nfe}</TableCell>
                <TableCell>
                  <p className="font-medium">{nota.customer_name}</p>
                  <p className="text-sm text-gray-500">
                    {nota.customer_cpf_cnpj}
                  </p>
                </TableCell>
                <TableCell>{nota.sale_date}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(nota.total_amount || 0)}
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[nota.status]}>
                    {statusLabels[nota.status]}
                  </Badge>
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => navigate(toEditNFe(nota.id))}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
