// lib/schema.ts
import { z } from "zod";

export const contractSchema = z.object({
  contratanteRazao: z.string().min(2),
  contratanteDocumento: z.string().min(5),
  contratanteEndereco: z.string().min(5),
  contratanteEmail: z.string().email(),
  contratanteTelefone: z.string().min(8),
  dataPrimeiroPagamento: z.string().min(8), // ex: "08/09/2025"
  diaVencimento: z.string().min(1),         // ex: "08"
  dataInicio: z.string().min(8),            // ex: "08/09/2025"
  servico: z.string().min(2),
  valorMensal: z.string().min(2),
  escopoAdicional: z.string().optional(),
});

// Tipagem útil para usar no projeto:
export type ContractData = z.infer<typeof contractSchema>;
