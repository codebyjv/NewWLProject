import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { Filters } from "@/types/filters";
import { CustomerFiltersProps } from "@/types/filtersProps";

export default function CustomerFilters({ filters, onFilterChange }: CustomerFiltersProps) {
  const handleInputChange = (field: keyof Filters, value: string) => {
    onFilterChange({ [field]: value });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="search"
                placeholder="Nome, CPF/CNPJ..."
                value={filters.search}
                onChange={(e) => handleInputChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="tipoContribuinte">Tipo de Contribuinte</Label>
            <Select value={filters.tipoContribuinte} onValueChange={(value) => handleInputChange('tipoContribuinte', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pessoa_fisica">Pessoa Física</SelectItem>
                <SelectItem value="pessoa_juridica">Pessoa Jurídica</SelectItem>
                <SelectItem value="mei">MEI</SelectItem>
                <SelectItem value="simples_nacional">Simples Nacional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="isActive">Status</Label>
            <Select value={filters.isActive} onValueChange={(value) => handleInputChange('isActive', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">Ativos</SelectItem>
                <SelectItem value="false">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}