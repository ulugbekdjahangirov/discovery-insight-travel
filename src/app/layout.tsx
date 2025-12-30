import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Discovery Insight Travel',
  description: 'Discover unique travel experiences in Central Asia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
