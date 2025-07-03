import { useState, useEffect } from "react";
import { FiscalSettings } from "@/types/fiscal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export default function ConfiguracoesFiscais() {
  const { addToast } = useToast();

  const [settings, setSettings] = useState<FiscalSettings>({
    regime_tributario: "simples_nacional",
    cnpj_emitente: "",
    razao_social: "",
    nome_fantasia: "",
    inscricao_estadual: "",
    uf: "",
    municipio: "",
    cnae_principal: "",
    serie_nfe: "1",
    modelo_nfe: "55",
    csosn_padrao: "102",
    cfop_padrao: "5102",
    aliquota_icms_padrao: 18,
    cest_padrao: "",
  });

  const handleSave = () => {
    // Aqui podemos salvar em Supabase, arquivo local ou banco
    console.log("Salvando configurações fiscais:", settings);
    addToast({ title: "Configurações salvas com sucesso!" });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Configurações Fiscais</h1>

            {/* Seção: Emitente */}
            <section className="bg-white shadow rounded-lg space-y-2">
                <h2 className="p-4 border-b text-lg font-semibold text-gray-800">🧾 Informações do Emitente</h2>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Regime, CNPJ, Razão, Fantasia, IE, UF, Município */}
                    <div>
                        <Label>Regime Tributário</Label>
                        <Select
                            value={settings.regime_tributario}
                            onValueChange={(value) =>
                            setSettings((prev) => ({ ...prev, regime_tributario: value as FiscalSettings["regime_tributario"] }))
                            }
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                            <SelectItem value="simples_nacional">Simples Nacional</SelectItem>
                            <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
                            <SelectItem value="lucro_real">Lucro Real</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>CNPJ Emitente</Label>
                        <Input
                            value={settings.cnpj_emitente}
                            onChange={(e) =>
                            setSettings((prev) => ({ ...prev, cnpj_emitente: e.target.value }))
                            }
                        />
                    </div>

                    <div>
                        <Label>Razão Social</Label>
                        <Input
                            value={settings.razao_social}
                            onChange={(e) =>
                            setSettings((prev) => ({ ...prev, razao_social: e.target.value }))
                            }
                        />
                    </div>

                    <div>
                        <Label>Inscrição Estadual</Label>
                        <Input
                            value={settings.inscricao_estadual}
                            onChange={(e) =>
                            setSettings((prev) => ({ ...prev, inscricao_estadual: e.target.value }))
                            }
                        />
                    </div>

                    <div>
                        <Label>UF</Label>
                        <Input
                            value={settings.uf}
                            onChange={(e) =>
                            setSettings((prev) => ({ ...prev, uf: e.target.value.toUpperCase() }))
                            }
                            maxLength={2}
                        />
                    </div>

                    <div>
                        <Label>Município</Label>
                        <Input
                            value={settings.municipio}
                            onChange={(e) =>
                            setSettings((prev) => ({ ...prev, municipio: e.target.value }))
                            }
                        />
                    </div>
                </div>
            </section>

            {/* Seção: Parâmetros NF-e */}
            <section className="bg-white shadow rounded-lg undefined space-y-2">
                <h2 className="p-4 border-b text-lg font-semibold text-gray-800">📄 Parâmetros da NF-e</h2>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Série, modelo, CSOSN, CFOP, ICMS, CEST */}
                    <div>
                        <Label>CNAE Principal</Label>
                        <Input
                            value={settings.cnae_principal}
                            onChange={(e) =>
                            setSettings((prev) => ({ ...prev, cnae_principal: e.target.value }))
                            }
                        />
                    </div>

                    <div>
                        <Label>CSOSN Padrão</Label>
                        <Input
                            value={settings.csosn_padrao}
                            onChange={(e) =>
                            setSettings((prev) => ({ ...prev, csosn_padrao: e.target.value }))
                            }
                            placeholder="Ex: 102"
                        />
                    </div>

                    <div>
                        <Label>CFOP Padrão</Label>
                        <Input
                            value={settings.cfop_padrao}
                            onChange={(e) =>
                            setSettings((prev) => ({ ...prev, cfop_padrao: e.target.value }))
                            }
                            placeholder="Ex: 5102"
                        />
                    </div>

                    <div>
                        <Label>Alíquota ICMS (%)</Label>
                        <Input
                            type="number"
                            value={settings.aliquota_icms_padrao}
                            onChange={(e) =>
                            setSettings((prev) => ({ ...prev, aliquota_icms_padrao: Number(e.target.value) }))
                            }
                        />
                    </div>

                    <div>
                        <Label>CEST Padrão</Label>
                        <Input
                            value={settings.cest_padrao}
                            onChange={(e) =>
                            setSettings((prev) => ({ ...prev, cest_padrao: e.target.value }))
                            }
                        />
                    </div>
                </div>
            </section>

            <div className="flex justify-end pt-4">
                <Button className="bg-red-600 hover:bg-red-700 text-white"
                    variant="default"
                    onClick={handleSave}
                    >Salvar Configurações
                </Button>
            </div>
        </div>
    </div>
  );
}
