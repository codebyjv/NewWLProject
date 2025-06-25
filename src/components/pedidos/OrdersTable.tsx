import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OrdersTableProps } from "@/types/orderProps";
import { ShoppingCart } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  boleto_bancario: "Boleto",
  pix: "PIX",
  cartao_credito: "Cartão Crédito",
  cartao_debito: "Cartão Débito"
};

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, isLoading, onSelectOrder, selectedOrder }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
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
          <ShoppingCart className="w-5 h-5" />
          Lista de Pedidos ({orders.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum pedido encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow 
                    key={order.id}
                    className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedOrder?.id === order.id ? 'bg-red-50 border-l-4 border-red-500' : ''
                    }`}
                    onClick={() => onSelectOrder(order)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-gray-500">{order.customer_cpf_cnpj}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.sale_date), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.seller}
                    </TableCell>
                    <TableCell className="font-bold text-green-600">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(order.total_amount || 0)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{paymentLabels[order.payment_method]}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status] || statusColors.pendente}>
                        {statusLabels[order.status] || "Pendente"}
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
};

export default OrdersTable;