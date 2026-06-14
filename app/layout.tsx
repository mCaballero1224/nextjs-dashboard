import '@/app/ui/global.css'; /* Add CSS rules to *all* routes in app */
import { inter } from '@/app/ui/fonts'; /* Import Google font */
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        template: '%s | Acme Dashboard',
        default: 'Acme Dashboard',
    },
    description: 'The official Next.js Course Dashboard, built with App Router.',
    metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
			{/* The font will be applied throughout the app. */}
			{/* The `antialiased` property smooths out the font. */}
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
