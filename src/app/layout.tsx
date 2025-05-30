import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { QueryProvider } from '@/components/query-provider';
import './globals.css';
import React from 'react';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Workflow X',
  description: 'A workflow management tool',
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={'en'}>
      <body className={cn(inter.className, 'min-h-screen antialiased')}>
        <QueryProvider>
          <Toaster />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
