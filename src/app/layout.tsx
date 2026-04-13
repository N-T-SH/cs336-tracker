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
    <html lang="en">
      <body className="antialiased" style={{ backgroundColor: '#f7f6f2', color: '#2c2f30' }}>
        {children}
      </body>
    </html>
  );
}
