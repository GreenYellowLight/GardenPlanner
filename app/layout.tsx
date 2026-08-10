import type { Metadata } from "next";
import "./globals.css";
import LeafBackground from "@/app/ui/LeafBackground";
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
     <html lang="en" className="h-full antialiased" suppressHydrationWarning>
       <body className={`${lusitana.className} min-h-full flex flex-col bg-stone-50`}>
         <LeafBackground />
         <div className="relative z-10 flex flex-col flex-1">{children}</div>
       </body>
    </html>
  );
}
