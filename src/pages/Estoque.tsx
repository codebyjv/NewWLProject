import React, { useState, useEffect } from "react";

import { Product, ProductFormData } from "@/types/product";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "../components/estoque/ProductCard";

import ProductForm from "../components/estoque/ProductForm";
import StockAlert from "../components/estoque/StockAlert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Search, Plus, Package, AlertTriangle } from "lucide-react";

import { productsMock } from "@/entities/product";
import { useToast } from "@/components/ui/use-toast";

export default function Estoque() {
  const { addToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [materialFilter, setMaterialFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductFormData | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, materialFilter, stockFilter]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      // simula dados reais usando o mock
      setProducts(productsMock);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
    setIsLoading(false);
  };

  const filterProducts = () => {
    let filtered = products;

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.weight.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por material
    if (materialFilter !== "all") {
      filtered = filtered.filter(product => product.material === materialFilter);
    }

    // Filtro por estoque
    if (stockFilter === "low") {
      filtered = filtered.filter(product => product.stock_quantity <= product.min_stock);
    } else if (stockFilter === "out") {
      filtered = filtered.filter(product => product.stock_quantity === 0);
    }

    setFilteredProducts(filtered);
  };

  const convertFormDataToProduct = (formData: ProductFormData): Product => {
    return {
      id: formData.id || '', // Forneça um valor padrão ou gere um novo ID se for criação
      name: formData.name,
      material: formData.material,
      weight: formData.weight,
      weight_in_grams: formData.weight_in_grams,
      stock_quantity: formData.stock_quantity,
      min_stock: formData.min_stock,
      unit_price: formData.unit_price,
      is_active: formData.is_active,
    };
  };

  // No momento, estamos simulando o salvamento do produto com mocks
  const handleSaveProduct = async (formData: ProductFormData) => {
    setIsSaving(true);
    try {
      const productData = convertFormDataToProduct(formData);

      // Aqui simulamos o salvamento, apenas com console e logs
      if (formData.id) {
        console.log("📝 Simulando UPDATE de produto:", productData);
        // Simule lógica de update no array local se quiser
      } else {
        console.log("🆕 Simulando CREATE de novo produto:", productData);
        // Simule lógica de append ao array se quiser
      }

      addToast({
        title:  "Produto salvo com sucesso!",
        description: "O produto foi salvo com sucesso.",
      });

      setShowForm(false);
      setEditingProduct(undefined);
      // Mantém o mock atual
      setProducts(productsMock);
    } catch (error) {
      console.error("Erro ao simular salvamento do produto:", error);
      addToast({
        title: "Erro ao salvar produto",
        description: "Ocorreu um erro ao salvar o produto. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false);
    }
  };


  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const lowStockCount = products.filter(p => p.stock_quantity <= p.min_stock).length;
  const outOfStockCount = products.filter(p => p.stock_quantity === 0).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Controle de Estoque</h1>
            <p className="text-gray-600 mt-1">Gerencie os pesos padrão em estoque</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Produto
          </Button>
        </div>

        {/* Stock Alerts */}
        {(lowStockCount > 0 || outOfStockCount > 0) && (
          <StockAlert lowStockCount={lowStockCount} outOfStockCount={outOfStockCount} />
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total de Produtos</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
                <div>
                  <p className="text-sm text-gray-600">Estoque Baixo</p>
                  <p className="text-2xl font-bold text-amber-600">{lowStockCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Sem Estoque</p>
                  <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Valor Total</p>
                  <p className="text-lg font-bold text-green-600">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(products.reduce((sum, p) => sum + (p.stock_quantity * (p.unit_price || 0)), 0))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={materialFilter} onValueChange={setMaterialFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Materiais</SelectItem>
                  <SelectItem value="aco_inox_f1">Aço Inox F1</SelectItem>
                  <SelectItem value="aco_inox_m1">Aço Inox M1</SelectItem>
                  <SelectItem value="ferro_fundido_m1">Ferro Fundido M1</SelectItem>
                </SelectContent>
              </Select>

              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Estoque" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="low">Estoque Baixo</SelectItem>
                  <SelectItem value="out">Sem Estoque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEditProduct}
              />
            ))
          )}
        </div>

        {filteredProducts.length === 0 && !isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum produto encontrado</p>
            </CardContent>
          </Card>
        )}

        {/* Product Form Modal */}
        {showForm && (
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setShowForm(false);
              setEditingProduct(undefined);
            }}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
}