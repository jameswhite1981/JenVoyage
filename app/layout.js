import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SITE_NAME = "Jen Voyage";
const SITE_DESCRIPTION = "Bespoke, human-planned holiday itineraries. Tell us about your dream trip and get a free first-look preview in minutes, then a fully personalised itinerary — real flights, real accommodation, hand-picked activities — within 48 hours.";

export const metadata = {
  metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,
  title: { default: `${SITE_NAME} — Bespoke Holiday Itineraries`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} — Bespoke Holiday Itineraries`,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Bespoke Holiday Itineraries`,
    description: SITE_DESCRIPTION,
  },
  // Set GOOGLE_SITE_VERIFICATION / BING_SITE_VERIFICATION in Vercel once
  // you've registered the site with Search Console / Bing Webmaster
  // Tools — no code change needed, these just render the <meta> tags.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
};

// LocalBusiness structured data so search engines can show Jen Voyage's
// name/address directly in results, not "TravelAgency" — the Service
// Terms are explicit that Jen Voyage isn't a licensed travel agent or
// tour operator, and the schema type shouldn't contradict that.
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Jen Voyage",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: SITE_URL ? `${SITE_URL}/logo.jpg` : undefined,
  priceRange: "££",
  address: {
    "@type": "PostalAddress",
    streetAddress: "398 Little Wakering Road, Barling Magna",
    addressLocality: "Essex",
    postalCode: "SS3 0LN",
    addressCountry: "GB",
  },
  areaServed: "GB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
