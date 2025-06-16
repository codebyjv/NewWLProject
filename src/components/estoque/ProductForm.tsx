import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const materialOptions = [
  { value: 'aco_inox_f1', label: 'Aço Inox F1' },
  { value: 'aco_inox_m1', label: 'Aço Inox M1' },
  { value: 'ferro_fundido_m1', label: 'Ferro Fundido M1' },
];

export default function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    material: "aco_inox_f1",
    weight: "",
    weight_in_grams: 0,
    stock_quantity: 0,
    min_stock: 5,
    unit_price: 0,
    is_active: true,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        material: product.material || "aco_inox_f1",
        weight: product.weight || "",
        weight_in_grams: product.weight_in_grams || 0,
        stock_quantity: product.stock_quantity || 0,
        min_stock: product.min_stock || 5,
        unit_price: product.unit_price || 0,
        is_active: product.is_active !== undefined ? product.is_active : true,
      });
    } else {
       setFormData({
        name: "",
        material: "aco_inox_f1",
        weight: "",
        weight_in_grams: 0,
        stock_quantity: 0,
        min_stock: 5,
        unit_price: 0,
        is_active: true,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const parseWeight = (weightStr) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      stock_quantity: Number(formData.stock_quantity),
      min_stock: Number(formData.min_stock),
      unit_price: Number(formData.unit_price),
      weight_in_grams: parseWeight(formData.weight)
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
          <DialogTitle>{product ? "Editar Produto" : "Adicionar Novo Produto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="md:col-span-2">
            <Label htmlFor="material">Material</Label>
            <Select 
              value={formData.material} 
              onValueChange={(value) => handleSelectChange('material', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o material" />
              </SelectTrigger>
              <SelectContent>
                {materialOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="weight">Peso (ex: 10g, 5kg, 200mg)</Label>
            <Input id="weight" name="weight" value={formData.weight} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="unit_price">Preço Unitário (R$)</Label>
            <Input id="unit_price" name="unit_price" type="number" step="0.01" value={formData.unit_price} onChange={handleChange} required />
          </div>
          
          <div>
            <Label htmlFor="stock_quantity">Quantidade em Estoque</Label>
            <Input id="stock_quantity" name="stock_quantity" type="number" value={formData.stock_quantity} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="min_stock">Estoque Mínimo</Label>
            <Input id="min_stock" name="min_stock" type="number" value={formData.min_stock} onChange={handleChange} required />
          </div>

          <div className="md:col-span-2">
             <Label htmlFor="name">Nome do Produto (opcional)</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Gerado automaticamente se deixado em branco"/>
          </div>

          <div className="md:col-span-2 flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleSelectChange('is_active', checked)}
            />
            <Label htmlFor="is_active">Produto Ativo</Label>
          </div>
        
          <DialogFooter className="md:col-span-2 mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">Salvar Produto</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}