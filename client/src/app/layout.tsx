import type { Metadata } from 'next';
import { Atkinson_Hyperlegible } from 'next/font/google';

import Providers from './_components/Providers';

import './globals.css';

const font = Atkinson_Hyperlegible({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
  variable: '--font-default',
});

export const metadata: Metadata = {
  title: 'soundmeter',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.variable} bg-zinc-900 font-sans text-zinc-300`}>
        <Providers>
          <div className="flex min-h-dvh flex-col">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
