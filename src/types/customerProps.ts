import { Customer } from "@/types/customers"

export interface CustomerDetailsProps {
  customer: Customer;
  // ... outras props
}

export interface CustomerFormProps {
  customer?: Customer;
  onSave: (formData: Customer) => void;
  onCancel: () => void;
  isSaving?: boolean;
  isEditing?: boolean;
  // ... outras props
}

export interface CustomerTableProps {
  customers: Customer[];
  isLoading: boolean;
  onSelectCustomer: (customer: Customer) => void;
  selectedCustomer?: Customer | null;
  setCustomerToDelete: (customer: Customer) => void;
}