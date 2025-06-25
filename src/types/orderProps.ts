import { OrderService } from "@/services/OrderService";
import { Order } from "@/types/order";
import { Product } from "@/types/product";

export type OrderProps = {
  order: Order;
  onDelete: (id: number) => void; 
};

export interface OrderFormProps {
  order: Order | null;
  products: Product[];
  customers: Customer[];
  onSave: (orderData: OrderService) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export interface RecentOrderProps {
  orders: Order[];
  isLoading: boolean;
}

export interface OrderDetailsProps {
  order: Order;
  products: Product[];
  customers: Customer[];
  onDelete: (id: number) => void;
}

export interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  onSelectOrder: (order: Order) => void;
  selectedOrder: Order | null; // Alterado para ser um Order ou null
}