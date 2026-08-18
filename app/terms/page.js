import LegalPageLayout from "../components/LegalPageLayout";

const SECTIONS = [
  {
    title: "1. About Jen Voyage",
    body: "Jen Voyage designs personalised holiday itineraries. We are not a travel agent or tour operator: we do not sell flights, accommodation or activities, and we do not take payment for bookings made through the links we provide.",
  },
  {
    title: "2. Our Service",
    body: "You provide us with a brief describing your trip. We research and produce a bespoke itinerary with suggested flights, accommodation and activities, along with direct booking links. Any tweaks within the stated review window are included in the price you paid.",
  },
  {
    title: "3. Bookings & Payments",
    body: "All bookings are made directly by you with the relevant airline, hotel or activity provider, under their own terms and conditions. Jen Voyage is not a party to those bookings and is not responsible for pricing changes, availability, cancellations or refunds made by third-party providers.",
  },
  {
    title: "4. Accuracy of Information",
    body: "We make every effort to ensure prices, availability and travel requirements (such as visas or vaccinations) are accurate at the time of writing, but these can change. You are responsible for checking official sources before you travel.",
  },
  {
    title: "5. Liability",
    body: "Jen Voyage accepts no liability for losses arising from bookings made, or not made, based on our itinerary suggestions, or for issues arising during your trip.",
  },
  {
    title: "6. Cancellations & Refunds",
    body: "Once your itinerary has been delivered, fees paid to Jen Voyage are non-refundable, except where required by law.",
  },
  {
    title: "7. Governing Law",
    body: "These terms are governed by the laws of England and Wales.",
  },
  {
    title: "8. Contact",
    body: "Questions about these terms can be sent to jen@jenvoyage.com.",
  },
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      draftNotice={<><strong>Draft placeholder.</strong> This page has not been reviewed by a solicitor and should not be relied on as your binding terms. Replace this text with reviewed terms before treating it as legally in effect.</>}
      sections={SECTIONS}
    />
  );
}
