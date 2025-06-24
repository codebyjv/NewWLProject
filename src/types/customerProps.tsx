export interface CustomerDetailsProps {
  customer: Customer;
  onDelete: (id: string | number) => void | Promise<void>;
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