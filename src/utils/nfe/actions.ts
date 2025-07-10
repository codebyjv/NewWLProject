import { jsPDF } from "jspdf";

import html2canvas from "html2canvas";

import { NotaFiscal, StatusNFe } from "@/types/nfe";

export const gerarDanfe = async (nota: NotaFiscal) => {
  const isFiscal = nota.status === "autorizada";

  const css = `
    .danfe-container {
      font-family: Arial, sans-serif;
      width: 800px;
      margin: 40px auto;
      padding: 20px;
      background-color: #fff;
      border: 1px solid #000;
      box-sizing: border-box;
    }

    .danfe-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #000;
      padding-bottom: 8px;
      margin-bottom: 15px;
    }

    .danfe-header h2 {
      font-size: 22px;
      margin: 0;
    }

    .chave-acesso {
      font-size: 14px;
      text-align: right;
      font-family: monospace;
      letter-spacing: 1px;
    }

    .danfe-duas-colunas {
      display: grid;
      grid-template-columns: 60% 38%;
      gap: 10px;
      margin-bottom: 20px;
    }

    .danfe-section {
      border: 1px solid #000;
      padding: 10px;
      font-size: 12px;
      margin-bottom: 10px;
    }

    .danfe-section h3 {
      font-size: 13px;
      margin-bottom: 6px;
      border-bottom: 1px solid #000;
      padding-bottom: 3px;
    }

    .danfe-section p {
      margin: 3px 0;
    }

    .danfe-produtos table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }

    .danfe-produtos th,
    .danfe-produtos td {
      border: 1px solid #000;
      padding: 4px;
      text-align: left;
      vertical-align: top;
    }

    .danfe-produtos th {
      background-color: #eee;
      font-weight: bold;
      text-transform: uppercase;
    }

    .danfe-rodape {
      margin-top: 10px;
      border-top: 1px solid #000;
      font-size: 11px;
      padding-top: 8px;
    }
  `;

  const html = `
    <div id="danfe-preview">
      <style>${css}</style>

      <div class="danfe-container">
        <div class="danfe-header">
          <h2>DANFE</h2>
          <p class="chave-acesso">Chave de Acesso: ${nota.chave_acesso ?? "---"}</p>
        </div>

        <div class="danfe-duas-colunas">
          <div class="danfe-section">
            <h3>Emitente</h3>
            <p><strong>Razão Social:</strong> ${nota.seller}</p>
            <p><strong>CNPJ:</strong> ${nota.seller_cnpj}</p>
            <p><strong>Endereço:</strong> ${nota.seller_endereco}</p>
            <p><strong>IE:</strong> ${nota.seller_ie}</p>
          </div>

          <div class="danfe-section">
            <h3>Destinatário</h3>
            <p><strong>Nome:</strong> ${nota.customer_name}</p>
            <p><strong>CNPJ:</strong> ${nota.customer_cpf_cnpj}</p>
            <p><strong>Endereço:</strong> ${nota.customer_endereco}</p>
            <p><strong>Município / UF:</strong> ${nota.customer_municipio} / ${nota.customer_uf}</p>
            <p><strong>IE:</strong> ${nota.customer_ie}</p>
          </div>
        </div>

        <div class="danfe-section emitente">
          <h3>Emitente</h3>
          <p><strong>Razão Social:</strong> WL COMERCIO E CALIBRACAO EM PESOS PADRAO LTDA</p>
          <p><strong>CNPJ:</strong> 00.000.000/0001-00</p>
          <p><strong>Endereço:</strong> Rua Exemplo, 123 - São Paulo/SP</p>
          <p><strong>Inscrição Estadual:</strong> 123.456.789.000</p>
        </div>

        <div class="danfe-section destinatario">
          <h3>Destinatário</h3>
          <p><strong>Nome:</strong> ${nota.customer_name}</p>
          <p><strong>CNPJ:</strong> ${nota.customer_cpf_cnpj}</p>
          <p><strong>Endereço:</strong> Av. Teste, 456 - Rio de Janeiro/RJ</p>
        </div>

        <div class="danfe-section produtos">
          <h3>Produtos/Serviços</h3>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Descrição</th>
                <th>CFOP</th>
                <th>Quantidade</th>
                <th>Unitário</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${nota.produtos
                ?.map(
                  (p, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${p.descricao}</td>
                  <td>${p.cfop}</td>
                  <td>${p.quantidade}</td>
                  <td>R$ ${p.valor_unitario.toFixed(2)}</td>
                  <td>R$ ${(p.quantidade * p.valor_unitario).toFixed(2)}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="danfe-section totais">
          <p><strong>Valor Total da Nota:</strong> R$ ${nota.total_amount.toFixed(2)}</p>
          <p><strong>Forma de Pagamento:</strong> ${nota.payment_method}</p>
          ${
            nota.status === "autorizada"
              ? `<p><strong>Protocolo:</strong> ${nota.protocolo ?? "------"}</p>`
              : `<p style="color: red;"><strong>Documento sem valor fiscal</strong></p>`
          }
        </div>
      </div>
    </div>
  `;

  // Cria container no DOM
  const preview = document.createElement("div");
  preview.id = "danfe-preview-container";
  preview.innerHTML = html;
  preview.style.position = "fixed";
  preview.style.top = "0";
  preview.style.left = "0";
  preview.style.zIndex = "9999";
  preview.style.background = "white";
  preview.style.opacity = "0";
  preview.style.width = "800px";
  preview.style.minHeight = "800px";

  document.body.appendChild(preview);

  // Espera renderização e captura
  setTimeout(async () => {
    const element = document.getElementById("danfe-preview");

    if (!element) {
      console.error("Elemento DANFE não encontrado.");
      return;
    }

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);

    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`DANFE_NFe_${nota.numero_nfe}.pdf`);

    document.body.removeChild(preview);
  }, 300);
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
