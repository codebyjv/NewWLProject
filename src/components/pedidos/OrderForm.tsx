
import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";

import { OrderFormProps } from "@/types/orderProps";
import { OrderFormData, OrderItem, Installment } from "@/types/order";
import { Order, OrderFormErrors } from "@/types/order";

import { Plus, Trash2, Search, Check, ChevronsUpDown } from "lucide-react";
import { addDays, format as formatDate } from "date-fns";

export default function OrderForm({ order, products = [], customers = [], onSave, onCancel, isSaving }: OrderFormProps) {
  const [errors, setErrors] = useState<OrderFormErrors>({});
  const [formData, setFormData] = useState<Partial<OrderFormData>>({
      customer_cpf_cnpj: "",
      customer_name: "",
      sale_date: new Date().toISOString().split('T')[0],
      seller: "",
      payment_method: "pix",
      observations: "",
      items: [],
      subtotal: 0,
      discount_total: 0,
      shipping_cost: 0,
      additional_cost: 0,
      tax_cost: 0,
      installments: [],
      total_amount: 0
  });
  
  const [itemForm, setItemForm] = useState({
    product_id: "",
    quantity: 1,
    unit_price: 0,
    discount: 0
  });

  const [customerSearchOpen, setCustomerSearchOpen] = useState(false);
  const [customerSearchText, setCustomerSearchText] = useState("");
  const [numInstallments, setNumInstallments] = useState(1);

  // Garantir que products e customers sejam arrays válidos
  const safeProducts = Array.isArray(products) ? products : [];
  const safeCustomers = Array.isArray(customers) ? customers : [];

  useEffect(() => {
    if (order) {
      // popula com os dados do pedido existente
      setFormData({
        customer_cpf_cnpj: order.customer_cpf_cnpj || "",
        customer_name: order.customer_name || "",
        sale_date: order.sale_date ? new Date(order.sale_date).toISOString().split('T')[0] : "",
        seller: order.seller || "",
        payment_method: order.payment_method || "pix",
        observations: order.observations || "",
        items: Array.isArray(order.items) ? order.items : [],
        subtotal: order.subtotal ?? 0,
        discount_total: order.discount_total ?? 0,
        shipping_cost: order.shipping_cost ?? 0,
        additional_cost: order.additional_cost ?? 0,
        tax_cost: order.tax_cost ?? 0,
        installments: Array.isArray(order.installments) ? order.installments : [],
        total_amount: order.total_amount ?? 0
      });
      setNumInstallments(order.installments?.length || 1);
    } else {
      // modo criação: inicializa vazio com valores padrão
      setFormData({
        customer_cpf_cnpj: "",
        customer_name: "",
        sale_date: new Date().toISOString().split("T")[0],
        seller: "",
        payment_method: "pix",
        observations: "",
        items: [],
        subtotal: 0,
        discount_total: 0,
        shipping_cost: 0,
        additional_cost: 0,
        tax_cost: 0,
        installments: [],
        total_amount: 0
      });
      setNumInstallments(1);
    }
  }, [order]);

  
  useEffect(() => {
    calculateTotals();
  }, [formData.items, formData.discount_total, formData.shipping_cost, formData.additional_cost, formData.tax_cost]);

  useEffect(() => {
    if (["boleto_bancario", "cartao_credito"].includes(formData.payment_method ?? "")) {
      generateInstallments();
    } else {
      setFormData(prev => ({...prev, installments: []}));
    }
  }, [numInstallments, formData.total_amount, formData.payment_method, formData.sale_date]);
  
  const generateInstallments = () => {
    if (numInstallments > 0 && (formData.total_amount ?? 0) > 0) {
      const installmentValue = (formData.total_amount ?? 0) / numInstallments;
      const newInstallments = Array.from({ length: numInstallments }, (_, i) => ({
        number: i + 1,
        value: installmentValue,
        due_date: formatDate(addDays(new Date(formData.sale_date ?? ""), (i + 1) * 30), 'yyyy-MM-dd')
      }));
      setFormData(prev => ({ ...prev, installments: newInstallments }));
    } else {
      setFormData(prev => ({ ...prev, installments: [] }));
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'customer_cpf_cnpj') {
        const customer = safeCustomers.find(c => c.cpf_cnpj === value);
        if (customer) {
          updated.customer_name = customer.razao_social;
        } else {
          updated.customer_name = "";
        }
      }
      return updated;
    });
  };

  const handleItemChange = (field: string, value: string | number) => {
    setItemForm(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    if (!itemForm.product_id || itemForm.quantity <= 0 || itemForm.unit_price < 0) return;

    const product = safeProducts.find(p => p.id === itemForm.product_id);
    if (!product) return;

    const total_price = (itemForm.quantity * itemForm.unit_price) - (itemForm.discount || 0);
    
    const newItem = {
      product_id: itemForm.product_id,
      product_name: product.name,
      quantity: itemForm.quantity,
      unit_price: itemForm.unit_price,
      total_price,
      discount: itemForm.discount || 0
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items ?? [], newItem]
    }));

    setItemForm({
      product_id: "",
      quantity: 1,
      unit_price: 0,
      discount: 0
    });
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items ?? [].filter((_, i) => i !== index)
    }));
  };

  const calculateTotals = () => {
    setTimeout(() => {
      setFormData(prev => {
        const subtotal = (prev.items ?? []).reduce((sum, item) => sum + item.total_price, 0);
        const total_amount = subtotal - (prev.discount_total || 0) + (prev.shipping_cost || 0) + (prev.additional_cost || 0) + (prev.tax_cost || 0);
        return { ...prev, subtotal, total_amount };
      });
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData as Order);
  };

  // Filter customers based on search text
  const filteredSearchCustomers = customerSearchText
    ? safeCustomers.filter(customer =>
        (customer.razao_social || "").toLowerCase().includes(customerSearchText.toLowerCase()) ||
        (customer.cpf_cnpj || "").includes(customerSearchText)
      )
    : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dados do Cliente */}
      <Card>
        <CardHeader>
          <CardTitle>Dados do Cliente</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customer_cpf_cnpj">Cliente *</Label>
            <Popover
              open={customerSearchOpen}
              onOpenChange={setCustomerSearchOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={customerSearchOpen}
                  className="w-full justify-between"
                >
                  {/* Display selected customer's name */}
                  {formData.customer_name ||
                    "Selecione ou busque um cliente..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              {/* Set popover width to match trigger */}
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput
                    placeholder="Busque por nome ou CPF/CNPJ..."
                    value={customerSearchText}
                    onValueChange={setCustomerSearchText}
                  />
                  <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                  <CommandGroup>
                    {filteredSearchCustomers.map((customer) => (
                      <CommandItem
                        key={customer.id}
                        value={`${customer.razao_social} ${customer.cpf_cnpj}`}
                        onSelect={() => {
                          handleInputChange(
                            "customer_cpf_cnpj",
                            customer.cpf_cnpj
                          );
                          setCustomerSearchText("");
                          setCustomerSearchOpen(false);
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${formData.customer_cpf_cnpj === customer.cpf_cnpj ? "opacity-100" : "opacity-0"}`}
                        />
                        {customer.razao_social} ({customer.cpf_cnpj})
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="customer_name">CPF/CNPJ Selecionado</Label>
            <Input
              id="customer_name"
              value={formData.customer_cpf_cnpj}
              readOnly
              className="bg-gray-100"
            />
          </div>
        </CardContent>
      </Card>

      {/* Dados da Venda */}
      <Card>
        <CardHeader>
          <CardTitle>Dados da Venda</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="sale_date">Data da Venda</Label>
            <Input
              id="sale_date"
              type="date"
              value={formData.sale_date}
              onChange={(e) => handleInputChange("sale_date", e.target.value)}
              required
              className={errors.sale_date ? "border-red-500" : ""}
            />
            {errors.sale_date && (
              <p className="text-red-500 text-sm mt-1">{errors.sale_date}</p>
            )}
          </div>

          <div>
            <Label htmlFor="seller">Vendedor</Label>
            <Input
              id="seller"
              value={formData.seller}
              onChange={(e) => handleInputChange("seller", e.target.value)}
              required
              className={errors.seller ? "border-red-500" : ""}
            />
            {errors.seller && (
              <p className="text-red-500 text-sm mt-1">{errors.seller}</p>
            )}
          </div>

          <div>
            <Label htmlFor="payment_method">Forma de Pagamento</Label>
            <Select
              value={formData.payment_method}
              onValueChange={(value) =>
                handleInputChange("payment_method", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="boleto_bancario">Boleto Bancário</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="cartao_credito">
                  Cartão de Crédito
                </SelectItem>
                <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Parcelamento */}
      {(formData.payment_method === "boleto_bancario" ||
        formData.payment_method === "cartao_credito") && (
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Parcelamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="numInstallments">Número de Parcelas</Label>
              <Input
                id="numInstallments"
                type="number"
                min="1"
                value={numInstallments}
                onChange={(e) =>
                  setNumInstallments(parseInt(e.target.value) || 1)
                }
              />
            </div>
            {formData.installments && formData.installments.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parcela</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.installments.map((inst, index) => (
                    <TableRow key={index}>
                      <TableCell>{inst.number}</TableCell>
                      <TableCell>
                        {formatDate(new Date(inst.due_date), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(inst.value)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Adicionar Item */}
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Item</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <Label htmlFor="product">Produto</Label>
              <Select
                value={itemForm.product_id}
                onValueChange={(value) => {
                  const product = safeProducts.find((p) => p.id === value);
                  handleItemChange("product_id", value);
                  if (product) {
                    handleItemChange("unit_price", product.unit_price || 0);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {safeProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.weight} - {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={itemForm.quantity}
                onChange={(e) =>
                  handleItemChange("quantity", parseInt(e.target.value) || 1)
                }
              />
            </div>

            <div>
              <Label htmlFor="unit_price">Preço Unitário</Label>
              <Input
                id="unit_price"
                type="number"
                step="0.01"
                value={itemForm.unit_price}
                onChange={(e) =>
                  handleItemChange(
                    "unit_price",
                    parseFloat(e.target.value) || 0
                  )
                }
              />
            </div>

            <div>
              <Label htmlFor="discount">Desconto</Label>
              <Input
                id="discount"
                type="number"
                step="0.01"
                value={itemForm.discount}
                onChange={(e) =>
                  handleItemChange("discount", parseFloat(e.target.value) || 0)
                }
              />
            </div>

            <Button
              // type="button"
              onClick={addItem}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Itens */}
      {(formData.items ?? []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Itens do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead>Preço Un.</TableHead>
                  <TableHead>Desconto</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(formData.items ?? []).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item.unit_price)}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item.discount || 0)}
                    </TableCell>
                    <TableCell className="font-bold">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item.total_price)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Valores Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Valores Adicionais</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="discount_total">Desconto Total</Label>
            <Input
              id="discount_total"
              type="number"
              step="0.01"
              value={formData.discount_total}
              onChange={(e) => {
                handleInputChange(
                  "discount_total",
                  parseFloat(e.target.value) || 0
                );
              }}
            />
          </div>

          <div>
            <Label htmlFor="shipping_cost">Frete</Label>
            <Input
              id="shipping_cost"
              type="number"
              step="0.01"
              value={formData.shipping_cost}
              onChange={(e) => {
                handleInputChange(
                  "shipping_cost",
                  parseFloat(e.target.value) || 0
                );
              }}
            />
          </div>

          <div>
            <Label htmlFor="additional_cost">Acréscimo</Label>
            <Input
              id="additional_cost"
              type="number"
              step="0.01"
              value={formData.additional_cost}
              onChange={(e) => {
                handleInputChange(
                  "additional_cost",
                  parseFloat(e.target.value) || 0
                );
              }}
            />
          </div>

          <div>
            <Label htmlFor="tax_cost">Impostos</Label>
            <Input
              id="tax_cost"
              type="number"
              step="0.01"
              value={formData.tax_cost}
              onChange={(e) => {
                handleInputChange("tax_cost", parseFloat(e.target.value) || 0);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Total */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center text-2xl font-bold">
            <span>Total do Pedido:</span>
            <span className="text-green-600">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(formData.total_amount ?? 0)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Observações */}
      <div>
        <Label htmlFor="observations">Observações</Label>
        <Textarea
          id="observations"
          value={formData.observations}
          onChange={(e) => handleInputChange("observations", e.target.value)}
          placeholder="Observações sobre o pedido..."
        />
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={
            isSaving ||
            (formData.items ?? []).length === 0 ||
            !formData.customer_cpf_cnpj ||
            !formData.seller ||
            !formData.payment_method
          }
          className="bg-red-600 hover:bg-red-700"
        >
          {isSaving ? "Salvando..." : "Salvar Pedido"}
        </Button>
      </div>
    </form>
  );
}
