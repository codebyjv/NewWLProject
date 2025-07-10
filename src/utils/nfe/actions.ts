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
      background: #fff;
      border: 1px solid #000;
      position: relative;
    }

    .danfe-produtos table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }

    .danfe-produtos th,
    .danfe-produtos td {
      border: 1px solid #333;
      padding: 6px;
      text-align: left;
      font-size: 12px;
    }

    .marca-dagua {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 40px;
      color: rgba(255, 0, 0, 0.2);
      white-space: nowrap;
      z-index: 1;
      pointer-events: none;
    }

    .conteudo {
      position: relative;
      z-index: 2;
    }
  `;

  const html = `
    <div id="danfe-preview">
      <style>${css}</style>
      <div class="danfe-container">
        ${!isFiscal ? `<div class="marca-dagua">SEM VALOR FISCAL</div>` : ""}
        <div class="conteudo">
          <h2>DANFE - Documento Auxiliar da Nota Fiscal Eletrônica</h2>
          <p><strong>Número NF-e:</strong> ${nota.numero_nfe}</p>
          <p><strong>Cliente:</strong> ${nota.customer_name}</p>
          <p><strong>CNPJ:</strong> ${nota.customer_cpf_cnpj}</p>
          <p><strong>Data de Emissão:</strong> ${nota.data_emissao}</p>
          <p><strong>Status:</strong> ${nota.status}</p>
          <h3>Produtos/Serviços</h3>
          <div class="danfe-produtos">
            <table>
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>CFOP</th>
                  <th>NCM</th>
                  <th>Quantidade</th>
                  <th>Valor Unitário</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${nota.produtos
                  .map(
                    (p) => `
                  <tr>
                    <td>${p.descricao}</td>
                    <td>${p.cfop}</td>
                    <td>${p.ncm}</td>
                    <td>${p.quantidade}</td>
                    <td>R$ ${p.valor_unitario.toFixed(2)}</td>
                    <td>R$ ${(p.quantidade * p.valor_unitario).toFixed(2)}</td>
                  </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
          <p><strong>Total:</strong> R$ ${nota.total_amount.toFixed(2)}</p>
          ${
            isFiscal
              ? `
              <p><strong>Chave de Acesso:</strong> ${nota.chave_acesso ?? "---- ----"}</p>
              <p><strong>Protocolo:</strong> ${nota.protocolo ?? "---"}</p>
              `
              : `<p>❗ Documento não autorizado pela SEFAZ.</p>`
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
  preview.style.opacity = "1";
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
