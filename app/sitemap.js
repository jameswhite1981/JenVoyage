// Just the public marketing pages — /admin and /portal require login and
// have nothing for a search engine to index, and /?step=... form states
// aren't distinct pages worth listing separately.
const PAGES = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/inspiration", changeFrequency: "monthly", priority: 0.8 },
  { path: "/reviews", changeFrequency: "weekly", priority: 0.7 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_BASE_URL;
  const lastModified = new Date();
  return PAGES.map(({ path, changeFrequency, priority }) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
