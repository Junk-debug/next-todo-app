import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import QueryClientProvider from '@/components/query-client-provider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider>
      <SessionProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} font-geist antialiased`}
          >
            <ThemeProvider
              defaultTheme="system"
              attribute="class"
              disableTransitionOnChange
              enableSystem
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </body>
        </html>
      </SessionProvider>
    </QueryClientProvider>
  );
}
