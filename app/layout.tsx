import type { Metadata } from "next";
import "./globals.css";
import { lusitana } from "@/app/ui/fonts"; 

export const metadata: Metadata = {
  title: "Garden Planner",
  description: "Plan your next garden"
}



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <html lang="en" className="h-full antialiased">

       <body className={`${lusitana.className} min-h-full flex flex-col bg-stone-50`}>{children}</body>

    </html>
  );
}
