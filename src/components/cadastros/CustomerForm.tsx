import React, { useState } from "react";

import { CustomerFormProps } from "@/types/customerProps";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormErrors,
  CustomerFormValues,
  Contato,
  Endereco,
  AllFields
} from "@/types/customers";


import { Plus, Trash2 } from "lucide-react";

export default function CustomerForm({ customer, onSave, onCancel, isSaving }: CustomerFormProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<CustomerFormValues>({
    id: customer?.id || "",
    cpf_cnpj: customer?.cpf_cnpj || "",
    razao_social: customer?.razao_social || "",
    nome_fantasia: customer?.nome_fantasia || "",
    tipo_contribuinte: customer?.tipo_contribuinte || "pessoa_fisica",
    ie_rg: customer?.ie_rg || "",
    cliente_desde: customer?.cliente_desde || new Date().toISOString().split('T')[0],
    endereco: {
      cep: customer?.endereco?.cep || "",
      cidade_uf: customer?.endereco?.cidade_uf || "",
      logradouro: customer?.endereco?.logradouro || "",
      numero: customer?.endereco?.numero || "",
      bairro: customer?.endereco?.bairro || "",
      complemento: customer?.endereco?.complemento || ""
    },
    contatos: customer?.contatos?.length ? customer.contatos : [{ nome: "", celular: "", email: "" }],
    observacoes: customer?.observacoes || "",
    is_active: customer?.is_active ?? true
  });

  const handleInputChange = (field: AllFields, value: any) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      const fieldName = (field.includes('.') ? field.split('.')[0] : field) as keyof CustomerFormValues;
      
      if (newErrors[fieldName]) {
        delete newErrors[fieldName];
      }
      return newErrors;
    });

    if (field.includes('.')) {
      const [parent, child] = field.split('.') as [keyof CustomerFormValues, string];
      
      setFormData(prev => {
        if (parent === 'endereco') {
          return {
            ...prev,
            endereco: {
              ...prev.endereco,
              [child as keyof Endereco]: value
            }
          };
        } else if (parent === 'contatos') {
          const [_, index, contactField] = field.split('.');
          const contactIndex = parseInt(index);
          
          return {
            ...prev,
            contatos: (prev.contatos || []).map((contact, i) => 
              i === contactIndex ? { ...contact, [contactField as keyof Contato]: value } : contact
            )
          };
        }
        return prev;
      });
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [field as keyof CustomerFormValues]: value 
      }));
    }
  };

  const handleContactChange = (index: number, field: keyof Contato, value: string) => {
    setFormData(prev => ({
      ...prev,
      contatos: prev.contatos.map((contato, i) =>
        i === index ? { ...contato, [field]: value } : contato
      )
    }));
  };

  const addContact = () => {
    setFormData(prev => ({
      ...prev,
      contatos: [...prev.contatos, { nome: "", celular: "", email: "" }]
    }));
  };

  const removeContact = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contatos: prev.contatos.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validação tipo-safe
    if (!formData.cpf_cnpj.trim()) {
      newErrors.cpf_cnpj = "CPF/CNPJ é obrigatório.";
      isValid = false;
    }

    if (!formData.razao_social.trim()) {
      newErrors.razao_social = "Razão Social é obrigatória.";
      isValid = false;
    }

    // Adicione outras validações conforme necessário
    if (!formData.endereco.cep.trim()) {
      newErrors.endereco = {
        ...newErrors.endereco,
        cep: "CEP é obrigatório."
      };
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dados Básicos */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Básicos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cpf_cnpj">CPF/CNPJ *</Label>
            <Input 
              id="cpf_cnpj" 
              value={formData.cpf_cnpj} 
              onChange={(e) => handleInputChange('cpf_cnpj', e.target.value)}
              required 
              className={errors.cpf_cnpj ? "border-red-500" : ""} // Apply red border if there's an error
            />
            {errors.cpf_cnpj && <p className="text-red-500 text-sm mt-1">{errors.cpf_cnpj}</p>}
          </div>
          
          <div>
            <Label htmlFor="tipo_contribuinte">Tipo de Contribuinte *</Label>
            <Select value={formData.tipo_contribuinte} onValueChange={(value) => handleInputChange('tipo_contribuinte', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pessoa_fisica">Pessoa Física</SelectItem>
                <SelectItem value="pessoa_juridica">Pessoa Jurídica</SelectItem>
                <SelectItem value="mei">MEI</SelectItem>
                <SelectItem value="simples_nacional">Simples Nacional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="razao_social">Razão Social *</Label>
            <Input 
              id="razao_social" 
              value={formData.razao_social} 
              onChange={(e) => handleInputChange('razao_social', e.target.value)}
              required 
              className={errors.razao_social ? "border-red-500" : ""} // Apply red border if there's an error
            />
            {errors.razao_social && <p className="text-red-500 text-sm mt-1">{errors.razao_social}</p>}
          </div>
          
          <div>
            <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
            <Input 
              id="nome_fantasia" 
              value={formData.nome_fantasia} 
              onChange={(e) => handleInputChange('nome_fantasia', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="ie_rg">IE/RG</Label>
            <Input 
              id="ie_rg" 
              value={formData.ie_rg} 
              onChange={(e) => handleInputChange('ie_rg', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="cliente_desde">Cliente Desde</Label>
            <Input 
              id="cliente_desde" 
              type="date"
              value={formData.cliente_desde} 
              onChange={(e) => handleInputChange('cliente_desde', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card>
        <CardHeader>
          <CardTitle>Endereço</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cep">CEP</Label>
            <Input 
              id="cep" 
              value={formData.endereco.cep} 
              onChange={(e) => handleInputChange('endereco.cep', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="cidade_uf">Cidade/UF</Label>
            <Input 
              id="cidade_uf" 
              value={formData.endereco.cidade_uf} 
              onChange={(e) => handleInputChange('endereco.cidade_uf', e.target.value)}
              placeholder="Ex: São Paulo/SP"
            />
          </div>
          
          <div>
            <Label htmlFor="logradouro">Logradouro</Label>
            <Input 
              id="logradouro" 
              value={formData.endereco.logradouro} 
              onChange={(e) => handleInputChange('endereco.logradouro', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="numero">Número</Label>
            <Input 
              id="numero" 
              value={formData.endereco.numero} 
              onChange={(e) => handleInputChange('endereco.numero', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="bairro">Bairro</Label>
            <Input 
              id="bairro" 
              value={formData.endereco.bairro} 
              onChange={(e) => handleInputChange('endereco.bairro', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="complemento">Complemento</Label>
            <Input 
              id="complemento" 
              value={formData.endereco.complemento} 
              onChange={(e) => handleInputChange('endereco.complemento', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contatos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Contatos</CardTitle>
          <Button
            variant="outline" 
            size="sm" 
            onClick={addContact}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Contato
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.contatos.map((contato, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Contato {index + 1}</h4>
                {formData.contatos.length > 1 && (
                  <Button
                    variant="default" 
                    size="sm" 
                    onClick={() => removeContact(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`nome_${index}`}>Nome</Label>
                  <Input 
                    id={`nome_${index}`}
                    value={contato.nome} 
                    onChange={(e) => handleContactChange(index, 'nome', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`celular_${index}`}>Celular</Label>
                  <Input 
                    id={`celular_${index}`}
                    value={contato.celular} 
                    onChange={(e) => handleContactChange(index, 'celular', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`email_${index}`}>E-mail</Label>
                  <Input 
                    id={`email_${index}`}
                    type="email"
                    value={contato.email} 
                    onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Observações */}
      <Card>
        <CardHeader>
          <CardTitle>Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea 
                id="observacoes" 
                value={formData.observacoes} 
                onChange={(e: any) => handleInputChange('observacoes', e.target.value)}
                placeholder="Observações sobre o cliente..."
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked: boolean) => handleInputChange('is_active', checked)}
              />
              <Label htmlFor="is_active">Cliente Ativo</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline" 
          onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          disabled={isSaving}
          className="bg-red-600 hover:bg-red-700"
        >
          {isSaving ? "Salvando..." : "Salvar Cliente"}
        </Button>
      </div>
    </form>
  );
}
