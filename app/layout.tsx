import type { Metadata } from 'next';
import { Noto_Sans, Noto_Sans_Mono } from 'next/font/google';
import './globals.css';
import Layout from '@/components/Layout';

const fonts = Noto_Sans({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const fontsMono = Noto_Sans_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const TITLE = 'Autofarmers';
const DESCRIPTION =
  'DeFi assistant platform with AI agents for cryptocurrency swaps, yield farming, and liquidity pool management through an interactive chat interface.';
const OG_IMAGE_URL = '/thumbnail.png';
const OG_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://autofarmers.habili.ai';

export const metadata: Metadata = {
  metadataBase: new URL(OG_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    siteName: 'Autofarmers',
    title: TITLE,
    description: DESCRIPTION,
    url: OG_URL,
    type: 'website',
    images: [
      {
        url: OG_IMAGE_URL,
      },
    ],
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
    card: 'summary_large_image',
    images: [
      {
        url: OG_IMAGE_URL,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fonts.variable} ${fontsMono.variable} h-dvh min-h-dvh antialiased`}
      >
        <Layout>
          <div className="h-full">{children}</div>
        </Layout>
      </body>
    </html>
  );
}
