import { Customer } from "@/types/customers";

interface CustomerDetailsProps {
  customer: Customer;
  onDelete: (id: string | number) => void | Promise<void>;
  // ... outras props
}