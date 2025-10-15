import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Chatbot Backend",
  description: "Backend API for Medical Chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
