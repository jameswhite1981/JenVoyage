import LegalPageLayout from "../components/LegalPageLayout";

const SECTIONS = [
  {
    title: "1. What are cookies",
    body: "Cookies are small text files stored on your device when you visit a website, used to remember information between requests.",
  },
  {
    title: "2. Cookies we use",
    body: "We only use strictly necessary cookies that keep you signed in: one for the customer portal (jv_session) and a separate one for the admin area (jv_admin_session). Both are deleted when you sign out or expire automatically after 30 days. Without these, you wouldn't be able to stay logged in to view your itinerary.",
  },
  {
    title: "3. What we don't use",
    body: "We do not use analytics, advertising, or tracking cookies of any kind, and no data about your visit is shared with third parties for marketing purposes.",
  },
  {
    title: "4. Consent",
    body: "Because we only use strictly necessary cookies, UK law doesn't require us to show a cookie consent banner — these cookies are essential to the service you've asked for (staying logged in). If that ever changes (for example, if we add analytics in future), we'll update this policy and add a consent banner.",
  },
  {
    title: "5. Contact",
    body: "Questions about this policy can be sent to jen@jenvoyage.com.",
  },
];

export default function CookiesPage() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      draftNotice={<><strong>Draft placeholder.</strong> This reflects what the site's code actually does today (only essential login cookies, no tracking). If analytics or marketing tools are added later, this page and the consent requirements will need revisiting — have a solicitor confirm before relying on it.</>}
      sections={SECTIONS}
    />
  );
}
