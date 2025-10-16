import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const sarabun = Sarabun({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
  variable: "--font-sarabun",
});

export const metadata: Metadata = {
  title: "AI Medical Assistant - ที่ปรึกษาสุขภาพอัจฉริยะ",
  description:
    "ผู้ช่วยทางการแพทย์ที่ขับเคลื่อนด้วย AI พร้อมให้คำปรึกษาด้านสุขภาพและข้อมูลทางการแพทย์อย่างแม่นยำ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${sarabun.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
