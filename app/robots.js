export default function robots() {
  const base = process.env.NEXT_PUBLIC_BASE_URL;
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Admin and the customer portal require login and have nothing for a
      // search engine to usefully index; API routes aren't pages at all.
      disallow: ["/admin", "/portal", "/api"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
