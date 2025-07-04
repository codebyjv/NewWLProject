import { OrderService } from "@/services/OrderService";
import { Order } from "@/types/order";
import { Product } from "@/types/product";
import { Customer } from "@/types/customers";

export type OrderProps = {
  order: Order;
  onDelete: (id: number) => void; 
};

export interface OrderFormProps {
  order: Order | null;
  products: Product[];
  customers: Customer[];
  onSave: (orderData: Order) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export interface RecentOrderProps {
  orders: Order[];
  isLoading: boolean;
}

export interface OrderDetailsProps {
  order: Order | null;
  products: Product[];
  customers: Customer[];
}

export interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  onSelectOrder: (order: Order) => void;
  selectedOrder: Order | null;
  onDeleteOrder: (order: Order) => void;
  onEditOrder: (id: number) => void;
  onPrintOrder: (id: number) => void;
  onGenerateNFe: (pedido: Order) => void;
}