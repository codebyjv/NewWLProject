import { NotaFiscal, StatusNFe } from "@/types/nfe";

import { jsPDF } from "jspdf";

export const gerarDanfe = (nota: NotaFiscal) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("DANFE - Documento Auxiliar da Nota Fiscal Eletrônica", 10, 20);

  doc.setFontSize(12);
  doc.text(`Número NF-e: ${nota.numero_nfe}`, 10, 35);
  doc.text(`Data de Emissão: ${nota.data_emissao}`, 10, 45);
  doc.text(`Cliente: ${nota.customer_name}`, 10, 55);
  doc.text(`CNPJ: ${nota.customer_cpf_cnpj}`, 10, 65);
  doc.text(`Valor Total: R$ ${nota.total_amount.toFixed(2)}`, 10, 75);
  doc.text(`Status: ${nota.status}`, 10, 85);

  doc.text("Produtos:", 10, 100);
  nota.produtos?.forEach((produto, index) => {
    const y = 110 + index * 10;
    doc.text(
      `• ${produto.descricao} - ${produto.quantidade} x R$ ${produto.valor_unitario.toFixed(2)}`,
      12,
      y
    );
  });

  doc.save(`DANFE_NFe_${nota.numero_nfe}.pdf`);
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
