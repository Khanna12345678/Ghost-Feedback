import type { Metadata } from "next";
import React from 'react';
import { Inter } from "next/font/google";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider"
import '@/app/globals.css';
import Navbar from "@/components/Navbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Ghost-Feedback',
  description: 'Real feedback from real people.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}
export default async function RootLayout({ children }: RootLayoutProps) {

  return (
    <html lang="en">
      <AuthProvider>
      <body className={inter.className}>
      <ThemeProvider
            attribute="class"
            defaultTheme="white"
            enableSystem
            disableTransitionOnChange
          >
          <Navbar />
          {children}
          <Toaster />
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
