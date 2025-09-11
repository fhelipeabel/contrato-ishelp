// app/api/pdf/route.ts
import { NextRequest } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import ContractPDF from "../../../components/ContractPDF";
import { contractSchema } from "../../../lib/schem";

export const runtime = "nodejs"; // <— mudei de "edge" para "nodejs"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contractSchema.parse(body);
    const stream = await renderToStream(<ContractPDF data={parsed} />);

    return new Response(stream as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="contrato.pdf"`,
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message ?? "Erro" }), { status: 400 });
  }
}



