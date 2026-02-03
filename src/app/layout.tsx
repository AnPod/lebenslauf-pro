import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Lebenslauf Pro - Professioneller Lebenslauf Generator',
  description: 'Erstellen Sie professionelle deutsche Lebensläufe und Anschreiben mit KI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>{children}</body>
    </html>
  );
}