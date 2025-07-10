import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash2, FileDown, FileText, Send, MoreVertical } from "lucide-react";
import { NotaFiscal, StatusNFe } from "@/types/nfe";
import { useNavigate } from "react-router-dom";
import { toEditNFe } from "@/utils/routes";
import { gerarDanfe, gerarXml, enviarEmailComDanfe } from "@/utils/nfe/actions";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { useNotasFiscais } from "@/store/useNotasFiscais";

const statusLabels = {
  rascunho: "Rascunho",
  aguardando: "Aguardando",
  pronta: "Pronta",
  autorizada: "Autorizada",
  cancelada: "Cancelada"
};

const statusColors = {
  rascunho: "bg-gray-100 text-gray-800 border-gray-300",
  aguardando: "bg-black-100 text-white border-black-300",
  pronta: "bg-blue-100 text-blue-800 border-blue-300",
  autorizada: "bg-green-100 text-green-800 border-green-300",
  cancelada: "bg-red-100 text-red-800 border-red-300"
};

export default function CentralNFe() {
  const navigate = useNavigate();

  const { notas, injetarMock, atualizarNota } = useNotasFiscais();

  const [filtroStatus, setFiltroStatus] = useState<StatusNFe | "todos">("todos");

  const notasFiltradas = filtroStatus === "todos"
  ? notas
  : notas.filter((n) => n.status === filtroStatus);

  const verificarStatusNaSefaz = () => {
    notas.forEach((nota) => {
      if (nota.status === "aguardando") {
        atualizarNota({ ...nota, status: "autorizada" });
      }
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Central de NF-e</h1>
            <p className="text-gray-600 mt-1">Gerencie todas as NF-e do sistema.</p>
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <Button variant="outline" onClick={verificarStatusNaSefaz}>
              Atualizar
            </Button>
            <Button variant="red" onClick={() => navigate("/Fiscal/Editar/nova")}>
              + Nova NF-e
            </Button>
            <Button variant="outline" onClick={injetarMock}>
              Injetar NF-e Mock
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Input
            placeholder="Buscar por cliente ou CNPJ..."
            className="max-w-sm bg-white"
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
            {notasFiltradas.map((nota) => (
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
                  <TableCell>
                    <td className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 rounded hover:bg-gray-100">
                            <MoreVertical className="w-5 h-5"/>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(toEditNFe(nota.id))}>
                            ✏️ Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => gerarDanfe(nota)}>
                            🧾 Gerar DANFE
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => gerarXml(nota)}>
                            📁 Gerar XML
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => enviarEmailComDanfe(nota)}>
                            📨  Enviar E-mail
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
