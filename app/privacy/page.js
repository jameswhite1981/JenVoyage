import LegalPageLayout from "../components/LegalPageLayout";

const SECTIONS = [
  {
    title: "1. Who we are",
    body: "Jen Voyage ([legal business name], [registered/trading address], company number [if applicable]) is the data controller for the personal information described in this policy. For any privacy query, contact jen@jenvoyage.com.",
  },
  {
    title: "2. What we collect",
    body: "When you submit a trip brief we collect your name, email address, phone number, and details about your trip (destinations, dates, budget, travel party, and preferences). This can include dietary requirements and accessibility or mobility needs, which may reveal information about your religion or health — special category data under UK GDPR. We only ask for this to plan a trip that actually works for you, and only with your consent by submitting the form.",
  },
  {
    title: "3. Why we process it",
    body: "To research and produce your itinerary, to contact you about your enquiry, and to send you your login link and itinerary-ready emails. Our lawful basis is performance of a contract (or steps toward one) for trip details, and explicit consent for dietary/accessibility information.",
  },
  {
    title: "4. Who we share it with",
    body: "We use third-party processors to run the service: Supabase (database hosting), Resend (transactional email delivery), and Vercel (website hosting). We do not sell your data or share it with third parties for marketing purposes. We never share your dietary or accessibility information with airlines, hotels, or activity providers — any bookings you make directly with them are between you and that provider.",
  },
  {
    title: "5. How long we keep it",
    body: "We retain enquiry data for [retention period, e.g. 24 months] after your last enquiry, or as needed to comply with our legal obligations, after which it is deleted.",
  },
  {
    title: "6. Cookies",
    body: "We only use strictly necessary cookies needed to keep you signed in (for the customer portal and admin area). We do not use analytics, advertising, or tracking cookies, so no cookie consent banner is shown. See our Cookie Policy for details.",
  },
  {
    title: "7. Your rights",
    body: "Under UK GDPR you have the right to access, correct, or request deletion of your personal data, to object to or restrict our processing of it, and to withdraw consent at any time. Contact jen@jenvoyage.com to exercise any of these rights. You also have the right to complain to the Information Commissioner's Office (ico.org.uk) if you believe your data has been mishandled.",
  },
  {
    title: "8. Contact",
    body: "Questions about this policy or your data can be sent to jen@jenvoyage.com.",
  },
];

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      draftNotice={<><strong>Draft placeholder.</strong> This page has not been reviewed by a solicitor, and the bracketed fields (business name, address, retention period) need filling in. Given this form collects special category data (dietary and accessibility information), get this reviewed before relying on it.</>}
      sections={SECTIONS}
    />
  );
}
