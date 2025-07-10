import { NotaFiscal, StatusNFe } from "@/types/nfe";

import { jsPDF } from "jspdf";

import html2pdf from "html2pdf.js";

export const gerarDanfe = (nota: NotaFiscal) => {
  const isFiscal = nota.status === "autorizada";

  // CSS da DANFE
  const css = `
    .danfe-container {
      font-family: Arial, sans-serif;
      width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #fff;
      border: 1px solid #000;
    }

    .danfe-header h2 {
      text-align: center;
      margin-bottom: 10px;
    }

    .danfe-info,
    .danfe-emissor,
    .danfe-destinatario,
    .danfe-produtos,
    .danfe-totais,
    .danfe-footer {
      margin-top: 20px;
    }

    .danfe-produtos table {
      width: 100%;
      border-collapse: collapse;
    }

    .danfe-produtos th,
    .danfe-produtos td {
      border: 1px solid #333;
      padding: 6px;
      text-align: left;
    }

    .danfe-footer {
      margin-top: 30px;
      text-align: center;
      font-size: 12px;
    }

    .nao-fiscal {
      color: red;
      font-weight: bold;
      font-size: 14px;
      margin-top: 10px;
      text-align: center;
    }
    `;

  // HTML da DANFE
  const html = `
    <style>${css}</style>
    <div class="danfe-container">
      <div class="danfe-header">
        <h2>DANFE - Documento Auxiliar da Nota Fiscal Eletrônica</h2>
      </div>

      <div class="danfe-info">
        <p><strong>Número NF-e:</strong> ${nota.numero_nfe}</p>
        <p><strong>Data de Emissão:</strong> ${nota.data_emissao}</p>
        <p><strong>Status:</strong> ${nota.status}</p>
      </div>

      <div class="danfe-emissor">
        <h3>Emitente</h3>
        <p><strong>Nome:</strong> WL COMERCIO E CALIBRACAO EM PESOS PADRAO LTDA</p>
        <p><strong>CNPJ:</strong> 00.000.000/0001-00</p>
        <p><strong>Endereço:</strong> Rua Exemplo, 123 - São Paulo/SP</p>
      </div>

      <div class="danfe-destinatario">
        <h3>Destinatário</h3>
        <p><strong>Nome:</strong> ${nota.customer_name}</p>
        <p><strong>CNPJ:</strong> ${nota.customer_cpf_cnpj}</p>
      </div>

      <div class="danfe-produtos">
        <h3>Produtos/Serviços</h3>
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
              ?.map(
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

      <div class="danfe-totais">
        <h3>Totais</h3>
        <p><strong>Valor dos Produtos:</strong> R$ ${nota.total_amount.toFixed(2)}</p>
        <p><strong>Total da Nota:</strong> R$ ${nota.total_amount.toFixed(2)}</p>
      </div>

      ${isFiscal
        ? `
          <div class="danfe-footer">
            <p>Chave de Acesso: ${nota.chave_acesso ?? "---- ---- ---- ---- ----"}</p>
            <p>Protocolo: ${nota.protocolo ?? "------"}</p>
          </div>
        `
        : `
          <div class="nao-fiscal">❗ Documento sem valor fiscal. NF-e não autorizada pela SEFAZ.</div>
        `}
    </div>
  `;

  // Cria um container invisível no DOM
  const container = document.createElement("div");
  container.innerHTML = html;
  container.style.position = "absolute";
  container.style.left = "-9999px";
  document.body.appendChild(container);

  // Gera o PDF usando html2pdf
  html2pdf()
    .set({
      margin: 10,
      filename: `DANFE_NFe_${nota.numero_nfe}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(container)
    .save()
    .then(() => {
      document.body.removeChild(container); // remove o HTML após gerar
    });
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
