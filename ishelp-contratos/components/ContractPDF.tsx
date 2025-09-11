// components/ContractPDF.tsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

type ContractData = {
  contratanteRazao: string;
  contratanteDocumento: string;
  contratanteEndereco: string;
  contratanteEmail: string;
  contratanteTelefone: string;
  dataPrimeiroPagamento: string;
  diaVencimento: string;
  dataInicio: string;
  servico: string;
  valorMensal: string;
  escopoAdicional?: string;
};

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 11, lineHeight: 1.35, fontFamily: "Times-Roman" },
  h1: { fontSize: 16, marginBottom: 6 },
  h2: { fontSize: 12, marginTop: 10, marginBottom: 4 },
  p: { marginBottom: 4 },
});

export default function ContractPDF({ data }: { data: ContractData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Contrato de prestação de serviço</Text>
        <Text style={styles.p}>
          Definição: Este contrato documenta a proposta apresentada pela CONTRATADA e aceita pela CONTRATANTE…
        </Text>

        <Text style={styles.h2}>DADOS DA CONTRATANTE</Text>
        <Text style={styles.p}>Razão Social/Nome: {data.contratanteRazao}</Text>
        <Text style={styles.p}>CNPJ/CPF: {data.contratanteDocumento}</Text>
        <Text style={styles.p}>Endereço: {data.contratanteEndereco}</Text>
        <Text style={styles.p}>E-mail: {data.contratanteEmail}</Text>
        <Text style={styles.p}>Telefone: {data.contratanteTelefone}</Text>

        <Text style={styles.h2}>ASSINATURA E VALOR</Text>
        <Text style={styles.p}>Serviço(s) contratado(s): {data.servico}</Text>
        <Text style={styles.p}>Valor total – mensal: {data.valorMensal}</Text>
        <Text style={styles.p}>
          1º pagamento: {data.dataPrimeiroPagamento} | Vencimento: {data.diaVencimento} | Início: {data.dataInicio}
        </Text>

        {data.escopoAdicional ? (
          <>
            <Text style={styles.h2}>Personalizações do escopo</Text>
            <Text style={styles.p}>{data.escopoAdicional}</Text>
          </>
        ) : null}
      </Page>
    </Document>
  );
}
