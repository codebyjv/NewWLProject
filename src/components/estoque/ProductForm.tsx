import React, { useState, useEffect } from "react";

import { FormProductErrors } from "@/types/product";
import { ProductFormData, ProductFormProps, MaterialType } from "@/types/product";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const materialOptions = [
  { value: 'aco_inox_f1', label: 'Aço Inox F1' },
  { value: 'aco_inox_m1', label: 'Aço Inox M1' },
  { value: 'ferro_fundido_m1', label: 'Ferro Fundido M1' },
];

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [errors, setErrors] = useState<Partial<FormProductErrors>>({});
  const [formData, setFormData] = useState<ProductFormData>({
    id: product?.id || "",
    name: "",
    material: "aco_inox_f1",
    weight: "",
    weight_in_grams: 0,
    stock_quantity: 0,
    min_stock: 0,
    unit_price: 0,
    is_active: true,

    codigo: "",
    ncm: "",
    cfop: "",
    cest: "",
    unidade_comercial: "",
    origem: "0",
    csosn: "",
    aliquota_icms: 0,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id || "",
        name: product.name || "",
        material: product.material || "",
        weight: product.weight || "",
        weight_in_grams: product.weight_in_grams || 0,
        stock_quantity: product.stock_quantity || 0,
        min_stock: product.min_stock || 5,
        unit_price: product.unit_price || 0,
        is_active: product.is_active !== undefined ? product.is_active : true,

        codigo: product.codigo || "",
        ncm: product.ncm || "",
        cfop: product.cfop || "",
        cest: product.cest || "",
        unidade_comercial: product.unidade_comercial || "",
        origem: product.origem || "",
        csosn: product.csosn || "",
        aliquota_icms: product.aliquota_icms || 0,
      });
    } else {
       setFormData({
        id: "0",
        name: "",
        material: "aco_inox_f1",
        weight: "",
        weight_in_grams: 0,
        stock_quantity: 0,
        min_stock: 5,
        unit_price: 0,
        is_active: true,

        codigo: "",
        ncm: "",
        cfop: "",
        cest: "",
        unidade_comercial: "",
        origem: "0",
        csosn: "",
        aliquota_icms: 0,
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSelectChange = (name: keyof ProductFormData, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [name]: value as MaterialType
    }));
  };

  const handleBooleanChange = (name: keyof ProductFormData, value: boolean) => {
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};
  
  const parseWeight = (weightStr: string): number => {
    if (!weightStr) return 0;
    const value = parseFloat(weightStr.replace(',', '.'));
    const unit = weightStr.toLowerCase().replace(/[0-9,.]/g, '').trim();

    if (isNaN(value)) return 0;
    
    switch (unit) {
      case 'mg':
        return value / 1000;
      case 'g':
        return value;
      case 'kg':
        return value * 1000;
      default:
        return value; // Assume grams if no unit
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormProductErrors> = {};
    let isValid = true;

    if (!formData.id.trim()) {
      newErrors.id = "O campo código do produto é obrigatório.";
      isValid = false;
    }

    if (!formData.ncm.trim()) {
      newErrors.ncm = "O campo NCM é obrigatório.";
      isValid = false;
    }

    if (!formData.unidade_comercial.trim()) {
      newErrors.unidade_comercial = "O campo CFOP é obrigatório.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const finalData: ProductFormData = {
      ...formData,
      id: String(formData.id),
      stock_quantity: Number(formData.stock_quantity),
      material: formData.material as MaterialType,
      min_stock: Number(formData.min_stock),
      unit_price: formData.unit_price ? Number(formData.unit_price) : undefined,
      weight_in_grams: parseWeight(formData.weight),
    };

    if (!finalData.name) {
      const materialLabel = materialOptions.find(opt => opt.value === finalData.material)?.label || '';
      finalData.name = `Peso Padrão ${materialLabel} ${finalData.weight}`;
    }

    onSave(finalData);
  };


  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {product ? "Editar Produto" : "Adicionar Novo Produto"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4"
        >
          <div className="md:col-span-2">
            <Label htmlFor="material">Material</Label>
            <Select
              value={formData.material}
              onValueChange={(value) => handleSelectChange("material", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o material" />
              </SelectTrigger>
              <SelectContent>
                {materialOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="name">Nome do Produto (opcional)</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Gerado automaticamente se deixado em branco"
            />
          </div>

          {/* Código Interno */}
          <div>
            <Label htmlFor="codigo">Código do Produto *</Label>
            <Input
              id="codigo"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              placeholder="Ex: PPF1-001"
              required
            />
            {errors.codigo && (
              <p className="text-red-500 text-sm">{errors.codigo}</p>
            )}
          </div>

          <div>
            <Label htmlFor="weight">Peso (ex: 10g, 5kg, 200mg)</Label>
            <Input
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="unit_price">Preço Unitário (R$)</Label>
            <Input
              id="unit_price"
              name="unit_price"
              type="number"
              step="0.01"
              value={formData.unit_price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="stock_quantity">Quantidade em Estoque</Label>
            <Input
              id="stock_quantity"
              name="stock_quantity"
              type="number"
              value={formData.stock_quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="min_stock">Estoque Mínimo</Label>
            <Input
              id="min_stock"
              name="min_stock"
              type="number"
              value={formData.min_stock}
              onChange={handleChange}
              required
            />
          </div>

          {/* NCM */}
          <div>
            <Label htmlFor="ncm">NCM *</Label>
            <Input
              id="ncm"
              name="ncm"
              type="text"
              value={formData.ncm}
              onChange={handleChange}
              placeholder="Ex: 73102990"
              required
            />
            {errors.ncm && (
              <p className="text-red-500 text-sm mt-1">{errors.ncm}</p>
            )}
          </div>

          {/* Unidade Comercial */}
          <div>
            <Label htmlFor="unidade_comercial">Unidade Comercial *</Label>
            <Select
              value={formData.unidade_comercial}
              onValueChange={(value) =>
                handleChange({
                  target: { name: "unidade_comercial", value },
                } as any)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UN"> UN - Unidade</SelectItem>
                <SelectItem value="KG"> KG - Quilograma</SelectItem>
                <SelectItem value="CX"> CX - Caixa</SelectItem>
                <SelectItem value="PC"> PC - Peça</SelectItem>
                <SelectItem value="LT"> LT - Litro</SelectItem>
                <SelectItem value="MT"> MT - Metro</SelectItem>
              </SelectContent>
            </Select>
            {errors.unidade_comercial && (
              <p className="text-red-500 text-sm">{errors.unidade_comercial}</p>
            )}
          </div>

          {/* Origem */}
          <div>
            <Label htmlFor="origem">Origem da Mercadoria *</Label>
            <Select
              value={formData.origem}
              onValueChange={(value) =>
                handleChange({ target: { name: "origem", value } } as any)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 - Nacional</SelectItem>
                <SelectItem value="1">
                  1 - Estrangeira - Importação direta
                </SelectItem>
                <SelectItem value="2">
                  2 - Estrangeira - Adquirida no mercado interno
                </SelectItem>
                <SelectItem value="3">
                  3 - Nacional, com conteúdo de importação ≥ 40%
                </SelectItem>
                <SelectItem value="4">
                  4 - Nacional, c/ conteúdo de importação ≤ 40%
                </SelectItem>
                <SelectItem value="5">
                  5 - Nacional com processo produtivo básico
                </SelectItem>
                <SelectItem value="6">6 - Nacional sem PPB</SelectItem>
                <SelectItem value="7">
                  7 - Estrangeira com ≤ 40% de conteúdo importado
                </SelectItem>
                <SelectItem value="8">
                  8 - Nacional com conteúdo importado indeterminado
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.origem && (
              <p className="text-red-500 text-sm">{errors.origem}</p>
            )}
          </div>

          <div className="md:col-span-2 flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                handleBooleanChange("is_active", checked)
              }
            />
            <Label htmlFor="is_active">Produto Ativo</Label>
          </div>

          <DialogFooter className="md:col-span-2 mt-4">
            <DialogClose asChild>
              <Button
                // type="button"
                variant="outline"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              // type="submit"
              className="bg-red-600 hover:bg-red-700"
            >
              Salvar Produto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}