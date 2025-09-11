// ishelp-contratos/app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Is Help – Contratos",
  description: "Gerador de contrato em PDF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
