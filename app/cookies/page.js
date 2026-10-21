import LegalPageLayout from "../components/LegalPageLayout";

const SECTIONS = [
  {
    title: "1. Cookies",
    blocks: [
      { type: "p", text: "A cookie is a small text file which is placed onto your device (e.g. your smartphone or other electronic device) when you use our Services. Because we only use strictly necessary cookies, UK law does not require us to show a cookie consent banner. If our use of cookies changes in the future (e.g., if we add analytics or marketing tools), we will update this policy and display a cookie consent banner within the Services." },
      { type: "p", text: "Cookies help us recognise you and your device to keep you signed in to view your itinerary. We do not use analytics, advertising, or tracking cookies of any kind, and no data about your visit is shared with third parties for marketing purposes." },
      { type: "p", text: "For further information on our use of cookies, including a detailed list of your information which we and others may collect through cookies, please see below." },
      { type: "p", text: "For further information on cookies generally, including how to control and manage them, visit the guidance on cookies published by the UK Information Commissioner's Office, www.aboutcookies.org or www.allaboutcookies.org." },
    ],
  },
  {
    title: "2. Strictly necessary cookies",
    body: "We use only strictly necessary cookies and similar technologies on this website. Under applicable data protection regulations (including PECR and the UK GDPR), strictly necessary cookies do not require user consent and are set automatically when you access our website.",
  },
  {
    title: "3. Our use of cookies",
    blocks: [
      { type: "p", text: "The table below provides more information about the cookies we use and why:" },
      { type: "list", items: [
        { bold: "jv_session, jv_admin_session", text: "(strictly necessary) – ensure users remain logged in to both the customer portal and the admin area. Both are deleted when you sign out or expire automatically after 30 days. Essential — we will therefore not request your consent before placing this cookie." },
      ] },
    ],
  },
  {
    title: "4. How to turn off all cookies and consequences of doing so",
    body: "If you do not want to accept any cookies, you may be able to change your device settings so that cookies (including those which are essential to the services requested) are not accepted. If you do this, please be aware that you may lose some of the functionality of our Services and of other Services you use on your device. For further information about cookies and how to disable them please go to the guidance on cookies published by the UK Information Commissioner's Office, www.aboutcookies.org or www.allaboutcookies.org.",
  },
  {
    title: "5. Changes to this policy",
    body: "This policy was published on 16 October 2026 and last updated on 16 October 2026. We may change this cookies policy from time to time. When we do, we will inform you via the Services or by sending an email to the email address you provided when you signed up to the Services.",
  },
];

export default function CookiesPage() {
  return (
    <LegalPageLayout
      title="Cookies Policy"
      subtitle="Published and last updated on 16 October 2026"
      sections={SECTIONS}
    />
  );
}
