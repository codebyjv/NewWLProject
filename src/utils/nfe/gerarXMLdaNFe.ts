import { create } from "xmlbuilder2";
import { Order, OrderItem } from "@/types/order";
import { FiscalSettings } from "@/types/fiscal";

export function gerarXMLdaNFe(pedido: Order, configuracoes: FiscalSettings): string {
  const doc = create({ version: "1.0", encoding: "UTF-8" })
    .ele("nfeProc", { xmlns: "http://www.portalfiscal.inf.br/nfe", versao: "4.00" })
    .ele("NFe")
    .ele("infNFe", { Id: "", versao: "4.00" });

  // Aqui vai os blocos: ide, emit, dest, det, total, etc.

  doc.ele("ide")
    .ele("cUF").txt("35").up() // SP
    .ele("natOp").txt("VENDA DE MERCADORIA").up()
    .ele("mod").txt(configuracoes.modelo_nfe).up()
    .ele("serie").txt(configuracoes.serie_nfe).up()
    .ele("nNF").txt(pedido.id.toString()).up()
    .ele("dhEmi").txt(new Date().toISOString()).up()
    .ele("tpNF").txt("1").up() // 1 = Saída
    .ele("idDest").txt("1").up() // 1 = operação interna
    .up();

  doc.ele("emit")
    .ele("CNPJ").txt(configuracoes.cnpj_emitente).up()
    .ele("xNome").txt(configuracoes.razao_social).up()
    .ele("xFant").txt(configuracoes.nome_fantasia || configuracoes.razao_social).up()
    .ele("IE").txt(configuracoes.inscricao_estadual).up()
    .ele("CRT").txt(
        configuracoes.regime_tributario === "simples_nacional" ? "1" :
        configuracoes.regime_tributario === "lucro_presumido" ? "3" : "3"
    ).up()
    .ele("enderEmit")
        .ele("xLgr").txt("Rua Exemplo").up()
        .ele("nro").txt("123").up()
        .ele("xBairro").txt("Centro").up()
        .ele("cMun").txt("3550308").up() // Código IBGE de São Paulo (exemplo)
        .ele("xMun").txt(configuracoes.municipio).up()
        .ele("UF").txt(configuracoes.uf).up()
        .ele("CEP").txt("01001000").up()
        .ele("cPais").txt("1058").up()
        .ele("xPais").txt("BRASIL").up()
    .up()
    .up();
  
  doc.ele("dest")
    .ele("CPF").txt(pedido.customer_cpf_cnpj).up()
    .ele("xNome").txt(pedido.customer_name).up()
    .ele("indIEDest").txt("9").up() // 9 = não contribuinte
    .ele("enderDest")
        .ele("xLgr").txt("Rua Cliente").up()
        .ele("nro").txt("456").up()
        .ele("xBairro").txt("Bairro Cliente").up()
        .ele("cMun").txt("3550308").up()
        .ele("xMun").txt("São Paulo").up()
        .ele("UF").txt("SP").up()
        .ele("CEP").txt("01002000").up()
        .ele("cPais").txt("1058").up()
        .ele("xPais").txt("BRASIL").up()
    .up()
  .up();

  pedido.items?.forEach((item, index) => {
    const fiscalItem = item as OrderItem;

    doc.ele("det", { nItem: (index + 1).toString() })
      .ele("prod")
        .ele("cProd").txt(fiscalItem.product_id).up()
        .ele("xProd").txt(fiscalItem.product_name).up()
        .ele("NCM").txt(fiscalItem.ncm).up()
        .ele("CFOP").txt(configuracoes.cfop_padrao).up()
        .ele("uCom").txt(fiscalItem.unidade_comercial).up()
        .ele("qCom").txt(fiscalItem.quantity.toFixed(2)).up()
        .ele("vUnCom").txt(fiscalItem.unit_price.toFixed(2)).up()
        .ele("vProd").txt(fiscalItem.total_price.toFixed(2)).up()
        .ele("uTrib").txt(fiscalItem.unidade_comercial).up()
        .ele("qTrib").txt(fiscalItem.quantity.toFixed(2)).up()
        .ele("vUnTrib").txt(fiscalItem.unit_price.toFixed(2)).up()
        .ele("indTot").txt("1").up()
      .up()
      .ele("imposto")
        .ele("ICMS")
          .ele("ICMSSN102")
            .ele("orig").txt(fiscalItem.origem).up()
            .ele("CSOSN").txt(configuracoes.csosn_padrao).up()
          .up()
        .up()
      .up()
    .up();
  });

  doc.ele("total")
    .ele("ICMSTot")
      .ele("vBC").txt("0.00").up()
      .ele("vICMS").txt("0.00").up()
      .ele("vProd").txt((pedido.subtotal ?? 0).toFixed(2)).up()
      .ele("vFrete").txt((pedido.shipping_cost ?? 0).toFixed(2)).up()
      .ele("vDesc").txt((pedido.discount_total ?? 0).toFixed(2)).up()
      .ele("vOutro").txt((pedido.additional_cost ?? 0).toFixed(2)).up()
      .ele("vNF").txt((pedido.total_amount ?? 0).toFixed(2)).up()
    .up()
  .up();



  const xml = doc.end({ prettyPrint: true });
  return xml;
}
