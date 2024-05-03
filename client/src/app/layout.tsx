import type { Metadata } from 'next';
import { Atkinson_Hyperlegible } from 'next/font/google';

import { ColorSchemeScript } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import Providers from './_components/Providers';

import './globals.css';
import Link from 'next/link';

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
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body className={`${font.variable} bg-zinc-900 font-sans text-zinc-300`}>
        <Providers>
          <div className="flex min-h-dvh flex-col">
            {children}
            <div className="flex justify-between bg-zinc-950 px-8 py-2 text-sm text-zinc-300">
              <div className="flex gap-4">
                <Link href="/points" className="opacity-80 hover:opacity-100">
                  Table view
                </Link>
                <Link href="/graph" className="opacity-80 hover:opacity-100">
                  Graph view
                </Link>
              </div>
              <div className="t">
                <Link href="/" className="opacity-80 hover:opacity-100">
                  soundmeter.live
                </Link>
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
