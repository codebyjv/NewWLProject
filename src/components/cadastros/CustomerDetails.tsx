import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, MapPin, Phone, Mail, FileText, Calendar, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Customer } from "@/types/customers";
import { toEditCustomer } from "@/utils/routes";

const tipoContribuinteLabels = {
  pessoa_fisica: "Pessoa Física",
  pessoa_juridica: "Pessoa Jurídica",
  mei: "MEI",
  simples_nacional: "Simples Nacional"
};

interface CustomerDetailsProps {
  customer: Customer | null;
}

const UserIcon = User as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const TrashIcon = Trash2 as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const EditIcon = Edit as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const FileTextIcon = FileText as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const MapPinIcon = MapPin as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const PhoneIcon = Phone as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const MailIcon = Mail as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const CalendarIcon = Calendar as React.ComponentType<React.SVGProps<SVGSVGElement>>;

export default function CustomerDetails({ customer }: CustomerDetailsProps) {
  if (!customer) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            Detalhes do Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Selecione um cliente para ver os detalhes</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const safelyFormatDate = (dateString: string | undefined, formatString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Data Inválida';
    return format(date, formatString, { locale: ptBR });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Detalhes do Cliente
            </div>
            <div className="flex gap-2">
              <Link to={toEditCustomer(customer.id)}>
                <Button variant="outline" size="sm">
                  <EditIcon className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </Link>
            </div>
          </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Status:</span>
          <Badge className={customer.is_active ?
            "bg-green-100 text-green-800 border-green-300" :
            "bg-red-100 text-red-800 border-red-300"
          }>
            {customer.is_active ? "Ativo" : "Inativo"}
          </Badge>
        </div>

        <Separator />

        {/* Dados Básicos */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-medium">
            <FileTextIcon className="w-4 h-4" />
            Dados Básicos
          </div>
          <div className="pl-6 space-y-2 text-sm">
            <div>
              <span className="font-medium">Razão Social:</span>
              <p>{customer.razao_social}</p>
            </div>
            {customer.nome_fantasia && (
              <div>
                <span className="font-medium">Nome Fantasia:</span>
                <p>{customer.nome_fantasia}</p>
              </div>
            )}
            <div>
              <span className="font-medium">CPF/CNPJ:</span>
              <p className="font-mono">{customer.cpf_cnpj}</p>
            </div>
            <div>
              <span className="font-medium">Tipo de Contribuinte:</span>
              <p>{tipoContribuinteLabels[customer.tipo_contribuinte as keyof typeof tipoContribuinteLabels] || customer.tipo_contribuinte}</p>
            </div>
            {customer.ie_rg && (
              <div>
                <span className="font-medium">IE/RG:</span>
                <p>{customer.ie_rg}</p>
              </div>
            )}
            {/* Added validation for cliente_desde to prevent "Invalid Date" */}
            {customer.cliente_desde && new Date(customer.cliente_desde).getTime() && (
              <div>
                <span className="font-medium">Cliente Desde:</span>
                <p>{safelyFormatDate(customer.cliente_desde, "dd/MM/yyyy")}</p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Endereço */}
        {customer.endereco && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium">
              <MapPinIcon className="w-4 h-4" />
              Endereço
            </div>
            <div className="pl-6 space-y-1 text-sm">
              {customer.endereco.logradouro && (
                <p>{customer.endereco.logradouro}, {customer.endereco.numero || 'S/N'}</p>
              )}
              {customer.endereco.complemento && (
                <p>{customer.endereco.complemento}</p>
              )}
              {customer.endereco.bairro && (
                <p>{customer.endereco.bairro}</p>
              )}
              {customer.endereco.cidade_uf && (
                <p>{customer.endereco.cidade_uf}</p>
              )}
              {customer.endereco.cep && (
                <p>CEP: {customer?.endereco?.cep ?? "Não informado"}</p>
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Contatos */}
        {customer.contatos && customer.contatos.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium">
              <PhoneIcon className="w-4 h-4" />
              Contatos
            </div>
            <div className="pl-6 space-y-3">
              {customer.contatos.map((contato:
                        {
                        nome: string;
                        celular: string;
                        email: string;
                        }, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        {contato.nome && (
                        <p className="font-medium text-sm">{contato.nome}</p>
                        )}
                        <div className="space-y-1 text-sm text-gray-600">
                        {contato.celular && (
                          <div className="flex items-center gap-2">
                          <PhoneIcon className="w-3 h-3" />
                          <span>{contato.celular}</span>
                          </div>
                        )}
                        {contato.email && (
                          <div className="flex items-center gap-2">
                          <MailIcon className="w-3 h-3" />
                          <span>{contato.email}</span>
                          </div>
                        )}
                        </div>
                      </div>
                      ))}
            </div>
          </div>
        )}

        {/* Observações */}
        {customer.observacoes && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">Observações</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {customer.observacoes}
              </p>
            </div>
          </>
        )}

        {/* Dados do Sistema */}
        <Separator />
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-medium">
            <CalendarIcon className="w-4 h-4" />
            Informações do Sistema
          </div>
          <div className="pl-6 space-y-1 text-xs text-gray-500">
            {/* Added validation for created_date and updated_date */}
            <p>Cadastrado em: {safelyFormatDate(customer.created_date, "dd/MM/yyyy HH:mm")}</p>
            <p>Última atualização: {safelyFormatDate(customer.updated_date, "dd/MM/yyyy HH:mm")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
