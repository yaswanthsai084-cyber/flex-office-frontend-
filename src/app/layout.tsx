import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Office Design, Fit Out, & Build Specialists | Office Insight',
  description:
    'Office Insight offers collaborative, data-driven office design services. We reinvigorate offices with inspiring, creative design that drives performance. Office design, fit out, refurbishment & interior design specialists across the UK.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🏢</text></svg>',
  },
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
