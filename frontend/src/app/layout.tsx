import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/blog/layout/NavBar";
import { Footer } from "@/components/blog/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TechBlog",
  description: "Mon super blog",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white flex flex-col min-h-screen">
        <AuthProvider>
          <NavBar />
          <main className="flex-grow">{children}</main>
          <Footer className="mt-auto" />
        </AuthProvider>
      </body>
    </html>
  );
}
