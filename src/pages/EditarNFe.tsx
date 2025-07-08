import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useParams, useNavigate } from "react-router-dom";
import { useNotasFiscais } from "@/store/useNotasFiscais";
import { NotaFiscal, Parcela } from "@/types/nfe";

export default function EditarNFe() {
  const navigate = useNavigate();

  const { id } = useParams();
  const { notas } = useNotasFiscais();

  const isNova = id === "nova";

  const notaSelecionada = notas.find((n) => n.id === Number(id));
  const { adicionarNota, atualizarNota } = useNotasFiscais();

  const [form, setForm] = useState({
    natureza_operacao: "",
    numero_nfe: "",
    serie: "1",
    data_emissao: new Date().toISOString().split("T")[0],
    data_saida: new Date().toISOString().split("T")[0],
    tipo_operacao: "saida",
    finalidade: "normal",
    modelo: "55",
    cliente_nome: "",
    cliente_cnpj: "",
    cliente_ie: "",
    endereco: "",
    municipio: "",
    uf: "",
    cep: "",
    pagamento: "pix",
    condicao_pagamento: "avista",
    parcelas: [] as {
        number: number;
        value: number;
        due_date: string;
    }[],
    produtos: [] as {
        descricao: string;
        ncm: string;
        cfop: string;
        quantidade: number;
        valor_unitario: number;
    }[],
    icms: 0,
    ipi: 0,
    pis: 0,
    cofins: 0,
    desconto: 0,
    outras_despesas: 0,
    valor_total: 0,
    transportador: "",
    placa: "",
    tipo_frete: "0",
    volumes: 1,
    peso_bruto: 0,
    peso_liquido: 0,
    observacoes: "",
    info_fisco: "",
    info_contribuinte: "",
  });

  useEffect(() => {
    if (notaSelecionada) {
        setForm({
        natureza_operacao: "",
        numero_nfe: notaSelecionada.numero_nfe,
        serie: "1",
        data_emissao: notaSelecionada.data_emissao || new Date().toISOString().split("T")[0],
        data_saida: notaSelecionada.data_saida || new Date().toISOString().split("T")[0],
        tipo_operacao: "saida",
        finalidade: "normal",
        modelo: "55",
        cliente_nome: notaSelecionada.customer_name,
        cliente_cnpj: notaSelecionada.customer_cpf_cnpj,
        cliente_ie: "",
        endereco: "",
        municipio: "",
        uf: "",
        cep: "",
        pagamento: "pix",
        condicao_pagamento: "avista",
        parcelas: [],
        icms: 0,
        ipi: 0,
        pis: 0,
        cofins: 0,
        desconto: 0,
        outras_despesas: 0,
        valor_total: notaSelecionada.total_amount || 0,
        transportador: "",
        placa: "",
        tipo_frete: "0",
        volumes: 1,
        peso_bruto: 0,
        peso_liquido: 0,
        observacoes: notaSelecionada.observations || "",
        info_fisco: "",
        info_contribuinte: "",
        produtos: [],
        });
    }
    }, [notaSelecionada]);

  useEffect(() => {
    if (isNova) {
        setForm({
        natureza_operacao: "",
        numero_nfe: "",
        serie: "1",
        data_emissao: new Date().toISOString().split("T")[0],
        data_saida: new Date().toISOString().split("T")[0],
        tipo_operacao: "saida",
        finalidade: "normal",
        modelo: "55",
        cliente_nome: "",
        cliente_cnpj: "",
        cliente_ie: "",
        endereco: "",
        municipio: "",
        uf: "",
        cep: "",
        pagamento: "pix",
        condicao_pagamento: "avista",
        parcelas: [],
        icms: 0,
        ipi: 0,
        pis: 0,
        cofins: 0,
        desconto: 0,
        outras_despesas: 0,
        valor_total: 0,
        transportador: "",
        placa: "",
        tipo_frete: "0",
        volumes: 1,
        peso_bruto: 0,
        peso_liquido: 0,
        observacoes: "",
        info_fisco: "",
        info_contribuinte: "",
        produtos: [],
        });
    }
    }, [isNova]);

  useEffect(() => {
    const totalProdutos = form.produtos.reduce(
        (acc, p) => acc + p.quantidade * p.valor_unitario,
        0
    );

    const aliquotaICMS = 0.18; // Exemplo: 18%
    const aliquotaPIS = 0.0065;
    const aliquotaCOFINS = 0.03;

    const icms = totalProdutos * aliquotaICMS;
    const pis = totalProdutos * aliquotaPIS;
    const cofins = totalProdutos * aliquotaCOFINS;

    handleChange("icms", icms);
    handleChange("pis", pis);
    handleChange("cofins", cofins);
    handleChange("valor_total", totalProdutos + form.outras_despesas - form.desconto);
    }, [form.produtos, form.outras_despesas, form.desconto]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Editar NF-e</h1>

      {/* 1. Dados Fiscais */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">🧾 Dados Fiscais</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="Natureza da operação" value={form.natureza_operacao} onChange={(e) => handleChange("natureza_operacao", e.target.value)} />
          <Input placeholder="Número da NF-e" value={form.numero_nfe} onChange={(e) => handleChange("numero_nfe", e.target.value)} />
          <Input placeholder="Série" value={form.serie} onChange={(e) => handleChange("serie", e.target.value)} />
          <Input type="date" value={form.data_emissao} onChange={(e) => handleChange("data_emissao", e.target.value)} placeholder="Data de emissão" />
          <Input type="date" value={form.data_saida} onChange={(e) => handleChange("data_saida", e.target.value)} placeholder="Data de saída" />
        </div>
      </section>

      {/* 2. Remetente / Destinatário */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">👤 Remetente / Destinatário</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="Nome / Razão Social" value={form.cliente_nome} onChange={(e) => handleChange("cliente_nome", e.target.value)} />
          <Input placeholder="CNPJ / CPF" value={form.cliente_cnpj} onChange={(e) => handleChange("cliente_cnpj", e.target.value)} />
          <Input placeholder="Inscrição Estadual" value={form.cliente_ie} onChange={(e) => handleChange("cliente_ie", e.target.value)} />
          <Input placeholder="Endereço" value={form.endereco} onChange={(e) => handleChange("endereco", e.target.value)} />
          <Input placeholder="Município" value={form.municipio} onChange={(e) => handleChange("municipio", e.target.value)} />
          <Input placeholder="UF" value={form.uf} onChange={(e) => handleChange("uf", e.target.value)} />
          <Input placeholder="CEP" value={form.cep} onChange={(e) => handleChange("cep", e.target.value)} />
        </div>
      </section>

      {/* 3. Meio de Pagamento */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">💳 Meio de Pagamento</h2>
        <div className="grid grid-cols-2 gap-4">
          <Select value={form.pagamento} onValueChange={(value) => handleChange("pagamento", value)}>
            <SelectTrigger><SelectValue placeholder="Forma de pagamento" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pix">PIX</SelectItem>
              <SelectItem value="boleto">Boleto</SelectItem>
              <SelectItem value="cartao">Cartão</SelectItem>
            </SelectContent>
          </Select>
          <Select value={form.condicao_pagamento} onValueChange={(value) => handleChange("condicao_pagamento", value)}>
            <SelectTrigger><SelectValue placeholder="Condição" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="avista">À vista</SelectItem>
              <SelectItem value="prazo">A prazo</SelectItem>
            </SelectContent>
          </Select>
          {form.pagamento === "boleto" || form.pagamento === "cartao" ? (
            <div className="space-y-2">
                <h3 className="text-sm font-medium">Parcelas</h3>
                {form.parcelas.map((parcela, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 items-center">
                    <Input
                    type="number"
                    placeholder="Valor"
                    value={parcela.value}
                    onChange={(e) => {
                        const novas = [...form.parcelas];
                        novas[index].value = Number(e.target.value);
                        handleChange("parcelas", novas);
                    }}
                    />
                    <Input
                    type="date"
                    placeholder="Vencimento"
                    value={parcela.due_date}
                    onChange={(e) => {
                        const novas = [...form.parcelas];
                        novas[index].due_date = e.target.value;
                        handleChange("parcelas", novas);
                    }}
                    />
                    <Button
                    variant="outline"
                    onClick={() => {
                        const novas = form.parcelas.filter((_, i) => i !== index);
                        handleChange("parcelas", novas);
                    }}
                    >
                    Remover
                    </Button>
                </div>
                ))}
                <Button
                variant="outline"
                onClick={() =>
                    handleChange("parcelas", [
                    ...form.parcelas,
                    { number: form.parcelas.length + 1, value: 0, due_date: "" },
                    ])
                }
                >
                + Adicionar Parcela
                </Button>
            </div>
            ) : null}
        </div>
      </section>

      {/* 4. Produtos / Serviços */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">📦 Produtos / Serviços</h2>
        <div className="border rounded p-4 space-y-2 bg-gray-50">
            {/* Lista de produtos */}
            {form.produtos?.map((produto, index) => (
            <div key={index} className="grid grid-cols-6 gap-2 items-center">
                <Input
                placeholder="Descrição"
                value={produto.descricao}
                onChange={(e) => {
                    const novos = [...form.produtos];
                    novos[index].descricao = e.target.value;
                    handleChange("produtos", novos);
                }}
                />
                <Input
                placeholder="NCM"
                value={produto.ncm}
                onChange={(e) => {
                    const novos = [...form.produtos];
                    novos[index].ncm = e.target.value;
                    handleChange("produtos", novos);
                }}
                />
                <Input
                placeholder="CFOP"
                value={produto.cfop}
                onChange={(e) => {
                    const novos = [...form.produtos];
                    novos[index].cfop = e.target.value;
                    handleChange("produtos", novos);
                }}
                />
                <Input
                placeholder="Qtd"
                type="number"
                value={produto.quantidade}
                onChange={(e) => {
                    const novos = [...form.produtos];
                    novos[index].quantidade = Number(e.target.value);
                    handleChange("produtos", novos);
                }}
                />
                <Input
                placeholder="V. Unitário"
                type="number"
                value={produto.valor_unitario}
                onChange={(e) => {
                    const novos = [...form.produtos];
                    novos[index].valor_unitario = Number(e.target.value);
                    handleChange("produtos", novos);
                }}
                />
                <Button
                variant="outline"
                onClick={() => {
                    const novos = form.produtos.filter((_, i) => i !== index);
                    handleChange("produtos", novos);
                }}
                >
                Remover
                </Button>
            </div>
            ))}

            <Button
            variant="outline"
            onClick={() =>
                handleChange("produtos", [
                ...(form.produtos || []),
                {
                    descricao: "",
                    ncm: "",
                    cfop: "",
                    quantidade: 1,
                    valor_unitario: 0,
                },
                ])
            }
            >
            + Adicionar Produto
            </Button>
        </div>
        </section>

      {/* 5. Calculo de impostos */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">🧮 Cálculo de Impostos</h2>
        <div className="grid grid-cols-3 gap-4">
            <Input
            placeholder="ICMS"
            type="number"
            value={form.icms}
            onChange={(e) => handleChange("icms", Number(e.target.value))}
            />
            <Input
            placeholder="IPI"
            type="number"
            value={form.ipi}
            onChange={(e) => handleChange("ipi", Number(e.target.value))}
            />
            <Input
            placeholder="PIS"
            type="number"
            value={form.pis}
            onChange={(e) => handleChange("pis", Number(e.target.value))}
            />
            <Input
            placeholder="COFINS"
            type="number"
            value={form.cofins}
            onChange={(e) => handleChange("cofins", Number(e.target.value))}
            />
            <Input
            placeholder="Desconto"
            type="number"
            value={form.desconto}
            onChange={(e) => handleChange("desconto", Number(e.target.value))}
            />
            <Input
            placeholder="Outras Despesas"
            type="number"
            value={form.outras_despesas}
            onChange={(e) => handleChange("outras_despesas", Number(e.target.value))}
            />
            <Input
            placeholder="Valor Total"
            type="number"
            value={form.valor_total}
            onChange={(e) => handleChange("valor_total", Number(e.target.value))}
            />
        </div>
        </section>

      {/* 6. Transportador / Volume */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">🚚 Transportador / Volumes</h2>
        <div className="grid grid-cols-3 gap-4">
            <Input
            placeholder="Nome do Transportador"
            value={form.transportador}
            onChange={(e) => handleChange("transportador", e.target.value)}
            />
            <Input
            placeholder="Placa do Veículo"
            value={form.placa}
            onChange={(e) => handleChange("placa", e.target.value)}
            />
            <Select value={form.tipo_frete} onValueChange={(value) => handleChange("tipo_frete", value)}>
            <SelectTrigger><SelectValue placeholder="Tipo de Frete" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="0">Emitente</SelectItem>
                <SelectItem value="1">Destinatário</SelectItem>
                <SelectItem value="2">Terceiros</SelectItem>
                <SelectItem value="9">Sem frete</SelectItem>
            </SelectContent>
            </Select>
            <Input
            placeholder="Volumes"
            type="number"
            value={form.volumes}
            onChange={(e) => handleChange("volumes", Number(e.target.value))}
            />
            <Input
            placeholder="Peso Bruto"
            type="number"
            value={form.peso_bruto}
            onChange={(e) => handleChange("peso_bruto", Number(e.target.value))}
            />
            <Input
            placeholder="Peso Líquido"
            type="number"
            value={form.peso_liquido}
            onChange={(e) => handleChange("peso_liquido", Number(e.target.value))}
            />
        </div>
        </section>

      {/* 7. Observações */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">📝 Observações</h2>
        <Textarea placeholder="Informações ao fisco" value={form.info_fisco} onChange={(e) => handleChange("info_fisco", e.target.value)} />
        <Textarea placeholder="Informações ao contribuinte" value={form.info_contribuinte} onChange={(e) => handleChange("info_contribuinte", e.target.value)} />
      </section>

      {/* 8. Botões */}
      <div className="flex justify-end mt-8 gap-4">
        <Button
            variant="outline"
            onClick={() => navigate("/Fiscal")}
        >
            Voltar
        </Button>

        <Button
            variant="outline"
            onClick={() => {
            const novaNota: NotaFiscal = {
                ...notaSelecionada,
                ...form,
                id: notaSelecionada?.id || Date.now(), // ou use uuid
                status: "aguardando",
                customer_name: form.cliente_nome,
                customer_cpf_cnpj: form.cliente_cnpj,
                total_amount: form.valor_total,
                observations: form.observacoes,
                created_date: notaSelecionada?.created_date || new Date().toISOString(), // obrigatório
                sale_date: notaSelecionada?.sale_date || new Date().toISOString(), // obrigatório
                seller: notaSelecionada?.seller || "João", // obrigatório
                payment_method: notaSelecionada?.payment_method || "boleto_bancario", // obrigatório
                delete: notaSelecionada?.delete || false, // obrigatório
            };

            if (isNova) {
                adicionarNota(novaNota); // função do Zustand
            } else {
                atualizarNota(novaNota);
            }

            navigate("/Fiscal");
            }}
        >
            Salvar Rascunho
        </Button>
        
        <Button
            variant="red"
            onClick={() => {
                if (!notaSelecionada) return;

                const notaAtualizada: NotaFiscal = {
                ...notaSelecionada,
                numero_nfe: form.numero_nfe,
                data_emissao: form.data_emissao,
                status: notaSelecionada.status, // ou "pronta" se quiser mudar o status
                produtos: form.produtos,
                total_amount: form.valor_total,
                observations: form.observacoes,
                // outros campos que quiser atualizar
                };

                atualizarNota(notaAtualizada);
                navigate("/Fiscal");
            }}
            >
            Salvar NF-e
            </Button>
      </div>
    </div>
  );
}
