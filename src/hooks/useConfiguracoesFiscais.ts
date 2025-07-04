import { useEffect, useState } from "react";
import { FiscalSettings } from "@/types/fiscal";

// Versão mock por enquanto
const mockConfig: FiscalSettings = {
  regime_tributario: "simples_nacional",
  cnpj_emitente: "12345678000199",
  razao_social: "Empresa Exemplo LTDA",
  nome_fantasia: "Empresa Exemplo",
  inscricao_estadual: "123456789",
  uf: "SP",
  municipio: "São Paulo",
  cnae_principal: "1234-5/67",
  serie_nfe: "1",
  modelo_nfe: "55",
  csosn_padrao: "102",
  cfop_padrao: "5102",
  aliquota_icms_padrao: 18,
  cest_padrao: "1234567",
};

export function useConfiguracoesFiscais() {
  const [config, setConfig] = useState<FiscalSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento
    setTimeout(() => {
      setConfig(mockConfig);
      setLoading(false);
    }, 300);
  }, []);

  return { config, loading };
}
