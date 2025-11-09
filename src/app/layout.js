
import Header from "@/components/globalComponents/Header";
import ClientLayout from "./ClientLayout";
import "./globals.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://village-properties.com'),
  title: {
    default: 'Village Properties - Find Your Dream Home',
    template: '%s | Village Properties'
  },
  description: 'Discover your perfect home with Village Properties. Browse our extensive collection of real estate listings, from cozy apartments to luxury homes. Find properties in your desired location with our advanced search tools.',
  keywords: [
    'real estate',
    'properties',
    'buy property',
    'rent property',
    'real estate listings',
    'property search',
    'homes for sale',
    'apartments for rent',
    'real estate agent',
    'property finder'
  ],
  authors: [{ name: 'Village Properties Team' }],
  creator: 'Village Properties',
  publisher: 'Village Properties',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://village-properties.com',
    title: 'Village Properties - Find Your Dream Home',
    description: 'Discover your perfect home with Village Properties. Browse our extensive collection of real estate listings.',
    siteName: 'Village Properties',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://village-properties.com'}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Village Properties - Find Your Dream Home',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Village Properties - Find Your Dream Home',
    description: 'Discover your perfect home with Village Properties. Browse our extensive collection of real estate listings.',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://village-properties.com'}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || '',
    yandex: process.env.YANDEX_VERIFICATION || '',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children, auth }) {
  return (
    <html lang="en">
      <body className={`antialiased `}>
        <ClientLayout>
          <Header />
          <div className="pt-20">
            {children}
            {auth}
          </div>
        </ClientLayout>
      </body>
    </html>
  );
}
