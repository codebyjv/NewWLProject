import { OrderService } from "@/services/OrderService";
import { ProductService } from "@/services/ProductService";
import { CustomerService } from "@/services/CustomerService";

type OrderProps = {
  order: OrderService;
  onDelete: (id: number) => void; 
};

export interface OrderFormProps {
  order: OrderService | null;
  products: ProductService[];
  customers: CustomerService[];
  onSave: (orderData: OrderService) => void;
  onCancel: () => void;
  isSaving: boolean;
}