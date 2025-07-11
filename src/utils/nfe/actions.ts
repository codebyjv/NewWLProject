import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { NotaFiscal, StatusNFe } from "@/types/nfe";
import { formatDate, formatCpfCnpj, formatMoney } from '@/utils/formatters';

const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const calcularTributosAproximados = (nota: NotaFiscal): string => {
  const tributos = (nota.valor_icms || 0) + (nota.valor_icms_st || 0) + (nota.valor_ipi || 0);
  return formatMoney(tributos);
};

const gerarCodigoBarras = (chaveAcesso: string): string => {
  return `
    <svg class="barcode" jsbarcode-format="CODE128" jsbarcode-value="${chaveAcesso}" jsbarcode-displayValue="true"></svg>
  `;
};

// Template HTML
const DANFE_TEMPLATE_HTML = `
  <!-- Container principal -->
  <div class="danfe-container">
    <!-- Cabeçalho -->
    <header class="danfe-header">
      <div class="recebimento-box">
        <table class="recebimento-table">
          <tr>
            <td colspan="2" class="recebimento-texto">
              Recebemos de [ds_company_issuer_name] os produtos e serviços constantes na nota fiscal
            </td>
            <td rowspan="2" class="nfe-info">
              <div class="nfe-serie">NF-e Nº [nl_invoice] Série [ds_invoice_serie]</div>
            </td>
          </tr>
          <tr>
            <td class="data-recebimento">
              <span class="label">Data de recebimento</span>
            </td>
            <td class="assinatura">
              <span class="label">Identificação de assinatura</span>
            </td>
          </tr>
        </table>
      </div>

      <div class="dados-emitente">
        <div class="logo-box">
          <img class="logo" src="[url_logo]" alt="Logo" onerror="this.style.display='none'">
        </div>
        
        <div class="emitente-info">
          <div class="emitente-nome">[ds_company_issuer_name]</div>
          <div class="emitente-endereco">[ds_company_address]</div>
          <div class="emitente-bairro">[ds_company_neighborhood] - [nu_company_cep]</div>
          <div class="emitente-cidade">[ds_company_city_name] - [ds_company_uf]</div>
          <div class="emitente-telefone">Fone: [nl_company_phone_number]</div>
        </div>

        <div class="danfe-info">
          <h3 class="danfe-title">DANFE</h3>
          <p class="danfe-subtitle">Documento auxiliar da Nota Fiscal Eletrônica</p>
          
          <div class="entrada-saida">
            <span class="tipo-operacao">[ds_code_operation_type]</span>
            <div class="legenda">
              <span>0 - Entrada</span>
              <span>1 - Saída</span>
            </div>
          </div>

          <div class="documento-info">
            <div class="documento-numero">Nº [nl_invoice]</div>
            <div class="documento-serie">SÉRIE: [ds_invoice_serie]</div>
            <div class="documento-pagina">Página [actual_page] de [total_pages]</div>
          </div>
        </div>

        <div class="chave-acesso-box">
          <div class="fisco">
            <span class="label">Controle do Fisco</span>
            <div class="barcode">{BarCode}</div>
          </div>
          
          <div class="chave-acesso">
            <span class="label">CHAVE DE ACESSO</span>
            <div class="codigo">[ds_danfe]</div>
          </div>
          
          <div class="consulta">
            Consulta de autenticidade no portal nacional da NF-e<br>
            www.nfe.fazenda.gov.br/portal ou no site da Sefaz Autorizada
          </div>
        </div>
      </div>
    </header>

    <!-- Dados da NF-e -->
    <section class="dados-nfe">
      <table class="natureza-operacao">
        <tr>
          <td>
            <span class="label">NATUREZA DA OPERAÇÃO</span>
            <span class="value">[_ds_transaction_nature]</span>
          </td>
          <td>
            <span class="label">[protocol_label]</span>
            <span class="value">[ds_protocol]</span>
          </td>
        </tr>
      </table>

      <table class="inscricoes">
        <tr>
          <td>
            <span class="label">INSCRIÇÃO ESTADUAL</span>
            <span class="value">[nl_company_ie]</span>
          </td>
          <td>
            <span class="label">INSCRIÇÃO ESTADUAL DO SUBST. TRIB.</span>
            <span class="value">[nl_company_ie_st]</span>
          </td>
          <td>
            <span class="label">CNPJ</span>
            <span class="value">[nl_company_cnpj_cpf]</span>
          </td>
        </tr>
      </table>
    </section>

    <!-- Destinatário -->
    <section class="destinatario">
      <h3 class="section-title">Destinatário/Emitente</h3>
      
      <table class="dados-destinatario">
        <!-- Linha 1 -->
        <tr>
          <td colspan="2">
            <span class="label">NOME/RAZÃO SOCIAL</span>
            <span class="value">[ds_client_receiver_name]</span>
          </td>
          <td>
            <span class="label">CNPJ/CPF</span>
            <span class="value">[nl_client_cnpj_cpf]</span>
          </td>
          <td>
            <span class="label">DATA DE EMISSÃO</span>
            <span class="value">[dt_invoice_issue]</span>
          </td>
        </tr>
        
        <!-- Linha 2 -->
        <tr>
          <td colspan="2">
            <span class="label">ENDEREÇO</span>
            <span class="value">[ds_client_address]</span>
          </td>
          <td>
            <span class="label">BAIRRO/DISTRITO</span>
            <span class="value">[ds_client_neighborhood]</span>
          </td>
          <td>
            <span class="label">CEP</span>
            <span class="value">[nu_client_cep]</span>
          </td>
          <td>
            <span class="label">DATA DE ENTR./SAÍDA</span>
            <span class="value">[dt_input_output]</span>
          </td>
        </tr>
        
        <!-- Linha 3 -->
        <tr>
          <td>
            <span class="label">MUNICÍPIO</span>
            <span class="value">[ds_client_city_name]</span>
          </td>
          <td>
            <span class="label">FONE/FAX</span>
            <span class="value">[nl_client_phone_number]</span>
          </td>
          <td>
            <span class="label">UF</span>
            <span class="value">[ds_client_uf]</span>
          </td>
          <td>
            <span class="label">INSCRIÇÃO ESTADUAL</span>
            <span class="value">[ds_client_ie]</span>
          </td>
          <td>
            <span class="label">HORA ENTR./SAÍDA</span>
            <span class="value">[hr_input_output]</span>
          </td>
        </tr>
      </table>
    </section>

    <!-- Produtos -->
    <section class="produtos">
      <h3 class="section-title">Dados do produto/serviço</h3>
              
      <table class="tabela-produtos">
        <thead>
          <tr>
            <th class="codigo">CÓDIGO</th>
            <th class="descricao">DESCRIÇÃO</th>
            <th class="ncm">NCM</th>
            <th class="cst">CST</th>
            <th class="cfop">CFOP</th>
            <th class="unidade">UN</th>
            <th class="quantidade">QTD.</th>
            <th class="valor-unitario">VLR.UNIT</th>
            <th class="valor-total">VLR.TOTAL</th>
          </tr>
        </thead>
        <tbody>
          [items]
        </tbody>
      </table>
    </section>

    <!-- Calculo de ISSQN -->
    <p class="area-name">Calculo do issqn</p>
      <table cellpadding="0" cellspacing="0" border="1" class="boxIssqn">
        <tbody>
          <tr>
            <td class="field inscrMunicipal">
              <span class="nf-label">INSCRIÇÃO MUNICIPAL</span>
              <span class="info txt-center">[ds_company_im]</span>
            </td>
            <td class="field valorTotal">
              <span class="nf-label">VALOR TOTAL DOS SERVIÇOS</span>
              <span class="info txt-right">[vl_total_serv]</span>
            </td>
            <td class="field baseCalculo">
              <span class="nf-label">BASE DE CÁLCULO DO ISSQN</span>
              <span class="info txt-right">[tot_bc_issqn]</span>
            </td>
            <td class="field valorIssqn">
              <span class="nf-label">VALOR DO ISSQN</span>
              <span class="info txt-right">[tot_issqn]</span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Dados adicionais -->
      <p class="area-name">Dados adicionais</p>
        <table cellpadding="0" cellspacing="0" border="1" class="boxDadosAdicionais">
          <tbody>
            <tr>
              <td class="field infoComplementar">
                <span class="nf-label">INFORMAÇÕES COMPLEMENTARES</span>
                <span>[ds_additional_information]</span>
              </td>
              <td class="field reservaFisco" style="width: 85mm; height: 24mm">
                <span class="nf-label">RESERVA AO FISCO</span>
                <span></span>
              </td>
            </tr>
          </tbody>
        </table>

      <!-- Rodapé -->
        <footer class="danfe-footer">
          <div class="footer-info">
            Empresa de Software www.empresa.com
          </div>
        </footer>
    [page-break]
  </div>
  `;

// CSS para a impressão do DANFE
const DANFE_CSS = `
.danfe-container {
  font-family: Arial, sans-serif;
  font-size: 8pt;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  page-break-after: always;
  margin: 0 auto;
  padding: 1cm;
  color: #000;
}

/* Cabeçalho */
.danfe-header {
  margin-bottom: 5mm;
  border-bottom: 1px solid #000;
  padding-bottom: 3mm;
}

.recebimento-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 3mm;
}

.dados-emitente {
  display: flex;
  gap: 5mm;
  margin-top: 3mm;
  page-break-inside: avoid;
  display: flex;
  gap: 5mm;
  margin-top: 3mm;
}

.dados-emitente > div {
  float: left;
  margin-right: 5mm;
  margin-bottom: 3mm;
}

.dados-nfe {
  page-break-inside: avoid;
}

.destinatario {
  page=break-inside: avoid;
}

.produtos {
  page-break-inside: avoid;
}

/* Seções */
.section-title {
  font-size: 9pt;
  font-weight: bold;
  margin: 3mm 0 1mm;
  text-transform: uppercase;
}

/* Tabelas */
table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  margin: 1mm 0;
}

th, td {
  border: 1px solid #000;
  padding: 1mm;
  vertical-align: top;
}

.label {
  font-weight: bold;
  font-size: 7pt;
  display: block;
}

.value {
  font-size: 8pt;
  display: block;
  min-height: 4mm;
}

/* ===== BASE ===== */
.nfeArea {
  font-family: "Arial Narrow", Arial, sans-serif;
  font-size: 8pt;
  line-height: 1.3;
  color: #000;
  width: 18cm;
  margin: 0 auto;
}

/* ===== TIPOGRAFIA ===== */
.nfeArea .font-12 { font-size: 12pt; }
.nfeArea .font-10 { font-size: 10pt; }
.nfeArea .font-8  { font-size: 8pt; }
.nfeArea .font-6  { font-size: 6pt; }
.nfeArea .bold    { font-weight: bold; }
.nfeArea .txt-upper { text-transform: uppercase; }
.nfeArea .txt-center { text-align: center; }
.nfeArea .txt-right  { text-align: right; }

/* ===== ESTRUTURA PRINCIPAL ===== */
.nfeArea .page {
  position: relative;
  margin-bottom: 5mm;
  overflow: hidden;
}

.nfeArea .area-name {
  font-weight: bold;
  margin: 8px 0 4px;
  font-size: 7pt;
  text-transform: uppercase;
  border-bottom: 1px solid #000;
}

/* ===== TABELAS ===== */
.nfeArea table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin: 2px 0;
}

.nfeArea td, .nfeArea th {
  border: 1px solid #000;
  padding: 3px 4px;
  vertical-align: top;
  overflow: hidden;
}

/* Cabeçalhos de tabela */
.nfeArea th {
  font-weight: bold;
  background-color: #f0f0f0;
  padding: 4px;
}

/* ===== SEÇÕES ESPECÍFICAS ===== */

/* Cabeçalho */
.nfeArea .header-box {
  margin-bottom: 4mm;
}

/* Dados do Emitente */
.nfeArea .emitente-box {
  display: flex;
  gap: 4mm;
  margin-bottom: 3mm;
}

.nfeArea .client_logo {
  height: 28mm;
  width: auto;
  max-width: 30mm;
  object-fit: contain;
}

/* Chave de Acesso */
.nfeArea .chave-acesso {
  font-family: "Courier New", monospace;
  font-size: 9pt;
  letter-spacing: 0.5px;
}

/* Produtos */
.nfeArea .boxProdutoServico td {
  padding: 2px 3px;
  font-size: 7pt;
}

.nfeArea .cod { width: 12mm; text-align: center; }
.nfeArea .descrit { width: 55mm; }
.nfeArea .un { width: 8mm; text-align: center; }
.nfeArea .amount { width: 10mm; text-align: center; }
.nfeArea .valUnit, 
.nfeArea .valTotal,
.nfeArea .valIcms,
.nfeArea .valIpi {
  width: 15mm;
  text-align: right;
}

/* Totais */
.nfeArea .boxImposto td {
  padding: 3px 2px;
  text-align: right;
}

/* Transportador */
.nfeArea .transport-box {
  margin-top: 3mm;
}

/* ===== ELEMENTOS DE FORMULÁRIO ===== */
.nfeArea .nf-label {
  display: block;
  font-weight: bold;
  font-size: 6pt;
  margin-bottom: 1px;
  text-transform: uppercase;
}

.nfeArea .info {
  display: block;
  font-size: 8pt;
  min-height: 10px;
}

/* ===== ELEMENTOS ESPECIAIS ===== */
.nfeArea .barcode {
  width: 100%;
  height: 30px;
  margin: 5px 0;
}

.nfeArea .monetary {
  text-align: right;
  white-space: nowrap;
}

.nfeArea .hr-dashed {
  border: none;
  border-top: 1px dashed #666;
  margin: 5px 0;
}

/* ===== IMPRESSÃO ===== */
@media print {
  .dados-emitente {
    display: block !important;
  }

  .logo-box, .emitente-info, .danfe-info, .chave-acesso-box {
    display: inline-block;
    vertical-align: top;
  }

  @page {
    size: A4;
    margin: 15mm 10mm;
}
      
.nfeArea {
  width: 100%;
  font-size: 7.5pt;
}
      
.noprint {
  display: none !important;
}
      
.page-break {
  page-break-after: always;
}

`;

export const gerarDanfe = async (nota: NotaFiscal) => {
  // 1. Criar container
  const container = document.createElement("div");
  container.id = "danfe-container";
  Object.assign(container.style, {
    position: "absolute",
    left: "-9999px",
    width: "210mm",
    height: "297mm",
    padding: "10mm",
    boxSizing: "border-box",
    background: "white",
  });

  // 2. Adicionar CSS
  const style = document.createElement('style');
  style.innerHTML = DANFE_CSS;
  container.appendChild(style);

  // 3. Gerar HTML com dados
  const htmlFinal = gerarHtmlDanfe(nota, DANFE_TEMPLATE_HTML);
  container.innerHTML = htmlFinal;

  // 4. Adicionar ao DOM para renderização
  document.body.appendChild(container);

  try {
    // 5. Aguardar renderização
    await new Promise(resolve => setTimeout(resolve, 100));

    // 6. Gerar PDF
    const canvas = await html2canvas(container, {
      scale: 2,
      logging: true,
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight,
      backgroundColor: '#FFFFFF'
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(canvas);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(canvas, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`DANFE_NFe_${nota.numero_nfe}.pdf`);

  } catch (error) {
    console.error("Erro ao gerar DANFE:", error);
  } finally {
    document.body.removeChild(container);
  }
};

export const gerarHtmlDanfe = (nota: NotaFiscal, htmlTemplate: string) => {
  // 1. Substituições básicas
  let htmlModel = htmlTemplate
    .replace(/\[dt_invoice_issue\]/g, formatDate(nota.data_emissao))
    .replace(/\[nl_client_cnpj_cpf\]/g, formatCpfCnpj(nota.customer_cpf_cnpj))
    .replace(/\[vl_total\]/g, formatMoney(nota.total_amount));

  // 2. Mapeamento de tags
  const replacements = {
    // Documentação
    '[nl_invoice]': nota.numero_nfe,
    '[ds_invoice_serie]': nota.serie,
    '[ds_code_operation_type]': nota.tipo_operacao,
    '[ds_danfe]': nota.chave_acesso,
    '[_ds_transaction_nature]': nota.natureza_operacao,
    '[protocol_label]': 'Protocolo de autorização',
    '[ds_protocol]': nota.protocolo,
    '[{BarCode}]': gerarCodigoBarras(nota.chave_acesso || ""),

    // Emitente
    '[ds_company_issuer_name]': nota.seller,
    '[nl_company_cnpj_cpf]': formatCpfCnpj(nota.seller_cnpj),
    '[ds_company_address]': nota.seller_endereco,
    '[ds_company_neighborhood]': nota.seller_bairro,
    '[nu_company_cep]': nota.seller_cep,
    '[ds_company_city_name]': nota.seller_cidade,
    '[ds_company_uf]': nota.seller_uf,
    '[nl_company_phone_number]': nota.seller_fone,
    '[nl_company_ie]': nota.seller_ie,
    '[nl_company_ie_st]': nota.seller_ie_st,
    '[ds_company_im]': nota.seller_im,

    // Destinatário
    '[ds_client_receiver_name]': nota.customer_name,
    '[ds_client_address]': nota.customer_endereco,
    '[ds_client_neighborhood]': nota.customer_bairro,
    '[nu_client_cep]': nota.customer_cep,
    '[ds_client_city_name]': nota.customer_cidade,
    '[nl_client_phone_number]': nota.customer_fone,
    '[ds_client_uf]': nota.customer_uf,
    '[ds_client_ie]': nota.customer_ie,

    // Data e Hora
    '[dt_input_output]': nota.data_emissao,
    '[hr_input_output]': nota.hora_saida, 

    // Valores e Cálculos
    '[vl_total_serv]': nota.valor_servicos,
    '[tot_bc_issqn]': nota.base_issqn,
    '[tot_issqn]': nota.valor_issqn,

    // Informações complementares
    '[ds_additional_information]': nota.informacoes_adicionais,

    // Páginas
    '[actual_page]': nota.pagina_atual,
    '[total_pages]': nota.paginas_totais,
    // Produtos
    '[items]': nota.produtos?.map(p => `
      <tr>
        <td>${p.codigo || ''}</td>
        <td>${p.descricao || ''}</td>
        <td class="monetary">${formatMoney(p.valor_unitario)}</td>
        <!-- outras colunas -->
      </tr>
    `).join('') || '<tr><td colspan="14">Nenhum produto registrado</td></tr>'
  };

  // 3. Aplicar todas as substituições
  Object.entries(replacements).forEach(([key, value]) => {
    htmlModel = htmlModel.replace(new RegExp(escapeRegExp(key), 'g'), String(value ?? ''));
  });

  return htmlModel;
};

export const gerarXml = (nota: NotaFiscal) => {
  const xml = `
    <nfe>
      <numero>${nota.numero_nfe}</numero>
      <data>${nota.data_emissao}</data>
      <cliente>
        <nome>${nota.customer_name}</nome>
        <cnpj>${nota.customer_cpf_cnpj}</cnpj>
      </cliente>
      <total>${nota.total_amount.toFixed(2)}</total>
    </nfe>
  `.trim();

  const blob = new Blob([xml], { type: "application/xml" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `NFe_${nota.numero_nfe}.xml`;
  link.click();
};

export const enviarEmailComDanfe = async (nota: NotaFiscal) => {
  // 1. Gerar DANFE em PDF
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("DANFE - Documento Auxiliar da Nota Fiscal Eletrônica", 10, 20);
  doc.setFontSize(12);
  doc.text(`Número NF-e: ${nota.numero_nfe}`, 10, 35);
  doc.text(`Cliente: ${nota.customer_name}`, 10, 45);
  doc.text(`Valor Total: R$ ${nota.total_amount.toFixed(2)}`, 10, 55);

  const danfeBlob = doc.output("blob");

  // 2. Gerar XML
  const xml = `
    <nfe>
      <numero>${nota.numero_nfe}</numero>
      <cliente>${nota.customer_name}</cliente>
      <cnpj>${nota.customer_cpf_cnpj}</cnpj>
      <total>${nota.total_amount.toFixed(2)}</total>
    </nfe>
  `.trim();
  const xmlBlob = new Blob([xml], { type: "application/xml" });

  // 3. Simulação de envio por e-mail
  const formData = new FormData();
  formData.append("to", "cliente@exemplo.com");
  formData.append("subject", `DANFE da NF-e ${nota.numero_nfe}`);
  formData.append("body", "Segue em anexo a DANFE e o XML da sua nota fiscal.");
  formData.append("danfe", danfeBlob, `DANFE_${nota.numero_nfe}.pdf`);
  formData.append("xml", xmlBlob, `NFe_${nota.numero_nfe}.xml`);

  // Aqui você pode integrar com uma API real futuramente, basta trocar o log
  console.log("Simulando envio de e-mail com os arquivos...");
  alert(`E-mail enviado para ${nota.customer_name} com DANFE e XML.`);
};

export const verificarStatusNaSefaz = (notas: NotaFiscal[], setNotas: (n: NotaFiscal[]) => void) => {
  const atualizadas = notas.map((nota) =>
    nota.status === "aguardando"
      ? { ...nota, status: "autorizada" as StatusNFe }
      : nota
  );

  setNotas(atualizadas);
};
