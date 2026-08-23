import LegalPageLayout from "../components/LegalPageLayout";

const SECTIONS = [
  {
    title: "1. Contact details",
    blocks: [
      { type: "p", text: "Email" },
      { type: "p", text: "jenvoyageyourway@gmail.com" },
    ],
  },
  {
    title: "2. What information we collect, use, and why",
    blocks: [
      { type: "p", text: "We collect or use the following information to provide and improve products and services for clients:" },
      { type: "list", items: [
        "Names and contact details",
        "Payment details (including card or bank information for transfers and direct debits)",
      ] },
      { type: "p", text: "We also collect or use the following special category information to provide and improve products and services for clients. This information is subject to additional protection due to its sensitive nature:" },
      { type: "list", items: ["Religious or philosophical beliefs"] },
      { type: "p", text: "We collect or use the following personal information for dealing with queries, complaints or claims:" },
      { type: "list", items: [
        "Names and contact details",
        "Payment details",
        "Dietary requirements that might lead to religion (i.e. Halal)",
      ] },
      { type: "p", text: "We also collect or use the following special category information for dealing with queries, complaints or claims. This information is subject to additional protection due to its sensitive nature:" },
      { type: "list", items: ["Religious or philosophical beliefs"] },
    ],
  },
  {
    title: "3. Lawful bases and data protection rights",
    blocks: [
      { type: "p", text: "Under UK data protection law, we must have a \"lawful basis\" for collecting and using your personal information. There is a list of possible lawful bases in the UK GDPR. You can find out more about lawful bases on the ICO's website." },
      { type: "p", text: "Which lawful basis we rely on may affect your data protection rights, which are set out in brief below. You can find out more about your data protection rights and the exemptions which may apply on the ICO's website:" },
      { type: "list", items: [
        { bold: "Your right of access", text: "– you have the right to ask us for copies of your personal information. You can request other information such as details about where we get personal information from and who we share personal information with. There are some exemptions which mean you may not receive all the information you ask for." },
        { bold: "Your right to rectification", text: "– you have the right to ask us to correct or delete personal information you think is inaccurate or incomplete." },
        { bold: "Your right to erasure", text: "– you have the right to ask us to delete your personal information." },
        { bold: "Your right to restriction of processing", text: "– you have the right to ask us to limit how we can use your personal information." },
        { bold: "Your right to object to processing", text: "– you have the right to object to the processing of your personal data." },
        { bold: "Your right to data portability", text: "– you have the right to ask that we transfer the personal information you gave us to another organisation, or to you." },
        { bold: "Your right to withdraw consent", text: "– when we use consent as our lawful basis, you have the right to withdraw your consent at any time." },
      ] },
      { type: "p", text: "If you make a request, we must respond to you without undue delay and in any event within one month. To make a data protection rights request, please contact us using the details above." },
    ],
  },
  {
    title: "4. Our lawful bases for the collection and use of your data",
    blocks: [
      { type: "p", text: "Our lawful bases for collecting or using personal information to provide and improve products and services for clients are:" },
      { type: "list", items: [
        { bold: "Legitimate interests", text: "– we're collecting or using your information because it benefits you, our organisation or someone else, without causing an undue risk of harm to anyone. All of your data protection rights may apply, except the right to portability. Our legitimate interests are:", sub: [
          "Dietary requirements are collected so we can find accommodation with restaurants nearby that meet your needs.",
        ] },
      ] },
      { type: "p", text: "For more information on our use of legitimate interests as a lawful basis, you can contact us using the details above." },
      { type: "p", text: "Our lawful bases for collecting or using personal information for dealing with queries, complaints or claims are:" },
      { type: "list", items: [
        { bold: "Contract", text: "– we have to collect or use the information so we can enter into or carry out a contract with you. All of your data protection rights may apply except the right to object." },
      ] },
    ],
  },
  {
    title: "5. Where we get personal information from",
    blocks: [
      { type: "list", items: ["Directly from you"] },
    ],
  },
  {
    title: "6. How long we keep information",
    blocks: [
      { type: "p", text: "Personal information is deleted 30 days after your itinerary is published. Although your holiday template will remain for Jen Voyage, your contact details and access to the online itinerary will be deleted. It is important to download the PDF to keep your Jen Voyage data." },
    ],
  },
  {
    title: "7. How to complain",
    blocks: [
      { type: "p", text: "If you have any concerns about our use of your personal information, you can make a data protection complaint to us:" },
      { type: "p", text: "Email: jenvoyageyourway@gmail.com" },
      { type: "p", text: "If you remain unhappy with how we've used your data after raising a complaint with us, you can also complain to the ICO." },
      { type: "p", text: "The ICO's address: Information Commissioner's Office, Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF." },
      { type: "p", text: "Helpline number: 0303 123 1113" },
      { type: "p", text: "Website: https://www.ico.org.uk/make-a-complaint" },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="Last updated 18 August 2026"
      sections={SECTIONS}
    />
  );
}
