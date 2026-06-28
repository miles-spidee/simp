import type { Metadata } from "next";
import { Outfit, Work_Sans } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/src/providers/AppProviders";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pinesphere ERP",
  description: "To track your training and internships",
  icons:{
    icon:"/pinesphere_ai_app_icon.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${workSans.variable} font-sans h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
