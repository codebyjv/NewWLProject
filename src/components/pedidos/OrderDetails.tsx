
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, User, Calendar, CreditCard, Edit, Trash2 } from "lucide-react";
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

const statusColors = {
  pendente: "bg-amber-100 text-amber-800 border-amber-300",
  processando: "bg-blue-100 text-blue-800 border-blue-300", 
  enviado: "bg-purple-100 text-purple-800 border-purple-300",
  entregue: "bg-green-100 text-green-800 border-green-300",
  cancelado: "bg-red-100 text-red-800 border-red-300"
};

const statusLabels = {
  pendente: "Pendente",
  processando: "Processando",
  enviado: "Enviado", 
  entregue: "Entregue",
  cancelado: "Cancelado"
};

const paymentLabels = {
  boleto_bancario: "Boleto Bancário",
  pix: "PIX",
  cartao_credito: "Cartão de Crédito",
  cartao_debito: "Cartão de Débito"
};

export default function OrderDetails({ order, onDelete }) {
  if (!order) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Detalhes do Pedido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Selecione um pedido para ver os detalhes</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Detalhes do Pedido
          </div>
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente o pedido
                    <span className="font-bold"> {order.order_number || order.id}</span>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(order.id)} className="bg-red-600 hover:bg-red-700">
                    Sim, excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Link to={createPageUrl(`NovoPedido?id=${order.id}`)}>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
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
          <Badge className={statusColors[order.status] || statusColors.pendente}>
            {statusLabels[order.status] || "Pendente"}
          </Badge>
        </div>

        <Separator />

        {/* Cliente */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-medium">
            <User className="w-4 h-4" />
            Cliente
          </div>
          <div className="pl-6 space-y-1">
            <p className="font-medium">{order.customer_name}</p>
            <p className="text-sm text-gray-600">{order.customer_cpf_cnpj}</p>
          </div>
        </div>

        <Separator />

        {/* Informações do Pedido */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-medium">
            <Calendar className="w-4 h-4" />
            Informações
          </div>
          <div className="pl-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Data da Venda:</span>
              <span>{format(new Date(order.sale_date), "dd/MM/yyyy", { locale: ptBR })}</span>
            </div>
            <div className="flex justify-between">
              <span>Vendedor:</span>
              <span className="font-medium">{order.seller}</span>
            </div>
            <div className="flex justify-between">
              <span>Número do Pedido:</span>
              <span className="font-mono">{order.order_number || order.id}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Pagamento */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-medium">
            <CreditCard className="w-4 h-4" />
            Pagamento
          </div>
          <div className="pl-6">
            <p className="text-sm">{paymentLabels[order.payment_method]}</p>
          </div>
        </div>

        <Separator />

        {/* Itens do Pedido */}
        {order.items && order.items.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Itens do Pedido</h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{item.product_name}</p>
                      <p className="text-xs text-gray-600">
                        {item.quantity}x {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(item.unit_price || 0)}
                      </p>
                    </div>
                    <p className="font-bold text-sm">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(item.total_price || 0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Totais */}
        <div className="space-y-2">
          <h4 className="font-medium">Valores</h4>
          <div className="space-y-1 text-sm">
            {order.subtotal && (
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.subtotal)}</span>
              </div>
            )}
            {order.discount_total > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Desconto:</span>
                <span>-{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.discount_total)}</span>
              </div>
            )}
            {order.shipping_cost > 0 && (
              <div className="flex justify-between">
                <span>Frete:</span>
                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.shipping_cost)}</span>
              </div>
            )}
            {order.additional_cost > 0 && (
              <div className="flex justify-between">
                <span>Acréscimo:</span>
                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.additional_cost)}</span>
              </div>
            )}
            {order.tax_cost > 0 && (
              <div className="flex justify-between">
                <span>Impostos:</span>
                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.tax_cost)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-green-600">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total_amount || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Observações */}
        {order.observations && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">Observações</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {order.observations}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
