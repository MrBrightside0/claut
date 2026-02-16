import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import SessionProvider from '@/components/SessionProvider';
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: 'CLAUT Link - Vinculación Automotriz',
  description: 'Plataforma de vinculación y catálogo de proveedores del Cluster Automotriz.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="es">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    claut: {
                      50: '#f0f4f8',
                      100: '#d9e2ec',
                      500: '#334e68',
                      700: '#243b53',
                      900: '#102a43',
                    },
                    action: {
                      500: '#e11d48',
                    }
                  }
                }
              }
            }
          `
        }} />
      </head>
      <body className="bg-gray-50 text-slate-900 font-sans antialiased">
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}