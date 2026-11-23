
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import SiteControls from "./SiteControls";

export const metadata: Metadata = {
  title: "ChemistryPro | افهم الكيمياء بذكاء",
  description: "كورسات كيمياء للثانوية العامة، تدريبات وامتحانات تفاعلية.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        <Providers>
          <SiteControls />
          {children}
        </Providers>
      </body>
    </html>
  );
}
