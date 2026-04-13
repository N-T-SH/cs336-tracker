import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CS336 × 33.6',
  description: 'Progress tracker for Stanford CS336 Language Modeling from Scratch',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-slate-950 text-white">
        {children}
      </body>
    </html>
  );
}
