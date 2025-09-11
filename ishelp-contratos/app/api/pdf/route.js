// ishelp-contratos/app/api/pdf/route.js
import { NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import ContractPDF from "../../../components/ContractPDF"; // caminho relativo
import { z } from "zod";

export const runtime = "nodejs";

const contractSchema = z.object({
  contratanteRazao: z.string().min(2),
  contratanteDocumento: z.string().min(5),
  contratanteEndereco: z.string().min(5),
  contratanteEmail: z.string().email(),
  contratanteTelefone: z.string().min(8),
  dataPrimeiroPagamento: z.string().min(8),
  diaVencimento: z.string().min(1),
  dataInicio: z.string().min(8),
  servico: z.string().min(2),
  valorMensal: z.string().min(2),
  escopoAdicional: z.string().optional(),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const parsed = contractSchema.parse(body);
    const pdf = await renderToBuffer(React.createElement(ContractPDF, { data: parsed }));
    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="contrato.pdf"',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: e?.message ?? "Erro" }, { status: 400 });
  }
}
