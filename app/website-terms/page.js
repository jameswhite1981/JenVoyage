import LegalPageLayout from "../components/LegalPageLayout";

const SECTIONS = [
  {
    title: "1. Introduction",
    blocks: [
      { type: "list", items: [
        "These terms and conditions (Terms) apply when you use this website, www.jenvoyage.com (Website).",
        "You agree to be bound by these Terms which form a binding contractual agreement between you and us, Jenny White trading as Jen Voyage (a sole trader), 398 Little Wakering Road, Barling Magna, Essex, SS3 0LN (our, we or us).",
        "If you don't agree to these Terms, you must refrain from using the Website.",
        "We may change these Terms at any time by updating this page of the Website, and your continued use of the Website following such an update will represent an agreement by you to be bound by the Terms as amended.",
      ] },
    ],
  },
  {
    title: "2. Access and use of the website",
    body: "You must only use the Website in accordance with these Terms and any applicable laws. You are responsible for ensuring that anyone who accesses the Website through your device is aware of these Terms and complies with them.",
  },
  {
    title: "3. Your obligations",
    blocks: [
      { type: "p", text: "You must not:" },
      { type: "list", items: [
        "copy, mirror, reproduce, translate, adapt, vary, modify, sell, decipher or decompile any part or aspect of the Website without our express consent;",
        "use the Website for any purpose other than to view Website Content, contact us, or engage our travel planning services;",
        "use, or attempt to use, the Website in a manner that is illegal or fraudulent or facilitates illegal or fraudulent activity;",
        "use, or attempt to use, the Website in a manner that may interfere with, disrupt or create undue burden on the Website or the servers or networks that host the Website;",
        "use the Website with the assistance of any automated scripting tool or software;",
        "act in a way that may diminish or adversely impact our reputation, including by linking to the Website on any other website; and",
        { bold: "attempt to breach the security of the Website, or otherwise interfere with the normal functions of the Website, including by:", text: "", sub: [
          "gaining unauthorised access to Website accounts or data;",
          "scanning, probing or testing the Website for security vulnerabilities;",
          "overloading, flooding, mailbombing, crashing or submitting a virus to the Website; or",
          "instigating or participating in a denial-of-service attack against the Website.",
        ] },
      ] },
    ],
  },
  {
    title: "4. Information on the website",
    blocks: [
      { type: "p", text: "While we make every effort to ensure that the information on the Website is as up-to-date and accurate as possible, you acknowledge and agree that we do not (to the maximum extent permitted by law) guarantee that:" },
      { type: "list", items: [
        "the Website will be free from errors or defects;",
        "the Website will be accessible at all times;",
        "messages sent through the Website will be delivered promptly, or delivered at all;",
        "information you receive or supply through the Website will be secure or confidential; or",
        "any information provided through the Website is accurate or true.",
      ] },
      { type: "p", text: "We reserve the right to change any information or functionality on the Website by updating the Website at any time without notice, including product descriptions, prices and other Website Content." },
    ],
  },
  {
    title: "5. Intellectual property",
    blocks: [
      { type: "list", items: [
        "We retain ownership of the Website and all materials on the Website (including text, graphics, logos, design, icons, images, sound and video recordings, pricing, downloads and software) (Website Content) and reserve all rights in any intellectual property rights owned or licensed by us that are not expressly granted to you.",
        "You may make a temporary electronic copy of all or part of the Website for the sole purpose of viewing it. You must not otherwise reproduce, transmit, adapt, distribute, sell, modify or publish the Website or any Website Content without prior written consent from us or as permitted by law.",
      ] },
    ],
  },
  {
    title: "6. Links to other websites",
    blocks: [
      { type: "list", items: [
        "The Website may contain links to other websites that are not our responsibility. We have no control over the content of the linked websites and we are not responsible for it.",
        "Inclusion of any linked website on the Website does not imply our approval or endorsement of the linked website.",
      ] },
    ],
  },
  {
    title: "7. Security",
    body: "We do not accept responsibility for loss or damage to computer systems, mobile phones or other electronic devices arising in connection with use of the Website. You should take your own precautions to ensure that the process that you employ for accessing the Website does not expose you to risk of viruses, malicious computer code or other forms of interference.",
  },
  {
    title: "8. Reporting misuse",
    body: "If you become aware of misuse of the Website by any person, any errors in the material on the Website or any difficulty in accessing or using the Website, please contact us immediately using the contact details provided on our Website.",
  },
  {
    title: "9. Privacy",
    body: "You agree to be bound by our Privacy Policy, which can be found at https://www.jenvoyage.com/privacy.",
  },
  {
    title: "10. Liability",
    blocks: [
      { type: "list", items: [
        "Jen Voyage designs personalised holiday itineraries based on your brief. We are not a travel agent or tour operator: we do not sell flights, accommodation, or activities, nor do we process payments for third-party travel or bookings made through external links. All external bookings are made directly by you with the relevant third-party provider and are governed strictly by their respective third-party provider terms and conditions. Jen Voyage is not a party to those bookings and accepts no liability or responsibility for pricing changes, availability, cancellations, refunds, or issues arising during your trip.",
        "We make every effort to ensure prices, availability, and travel requirements (such as visas or vaccinations) are accurate at the time of writing, but these can change. You are responsible for checking official sources before you travel. We make no warranties or representations about this Website or any of its content and will not be responsible to you or any third party for any direct or consequential loss suffered in connection with the use of this Website or reliance on our itinerary suggestions. To the maximum extent permitted by law, we exclude any liability that may arise due to your use of our Website and/or the information or materials contained on it. You agree to indemnify us for any loss or liability arising out of your use of this Website.",
        "Once your personalised itinerary has been delivered, fees paid to Jen Voyage are non-refundable, except where required by law.",
        "To the extent that the provisions of any applicable law shall impose restrictions on the extent to which liability can be excluded under these Terms including, for the avoidance of doubt, the provisions of sections 3, 6 and 11 of the Unfair Contract Terms Act 1977 in the UK (and its equivalent in any other jurisdiction) relating to the requirement of reasonableness, the exclusions set out in this clause shall be limited in accordance with such restrictions. However, any exclusions of liability that are not affected by such restrictions shall remain in full force and effect.",
        "Nothing in these Terms shall exclude or limit a party's liability for fraud or intentional unlawful conduct by a party, or death or personal injury resulting from a party's negligence.",
      ] },
    ],
  },
  {
    title: "11. General",
    blocks: [
      { type: "p", text: "11.1 Governing law and jurisdiction" },
      { type: "p", text: "The laws of England and Wales apply to these terms, although if you are resident elsewhere you will retain the benefit of any mandatory protections given to you by the laws of that country." },
      { type: "p", text: "Any disputes will be subject to the non-exclusive jurisdiction of the courts of England and Wales. This means that you can choose whether to bring a claim in the courts of England and Wales or in the courts of another part of the UK in which you live." },
      { type: "p", text: "11.2 Third party rights" },
      { type: "p", text: "This agreement does not give rise to any rights under the Contracts (Rights of Third Parties) Act 1999 to enforce any term of this agreement." },
      { type: "p", text: "11.3 Waiver" },
      { type: "p", text: "No party to this agreement may rely on the words or conduct of any other party as a waiver of any right unless the waiver is in writing and signed by the party granting the waiver." },
      { type: "p", text: "11.4 Severance" },
      { type: "p", text: "Any term of this agreement which is wholly or partially void or unenforceable is severed to the extent that it is void or unenforceable. The validity and enforceability of the remainder of this agreement is not limited or otherwise affected." },
      { type: "p", text: "11.5 Assignment" },
      { type: "p", text: "A party cannot assign, novate or otherwise transfer any of its rights or obligations under this agreement without the prior written consent of the other party." },
      { type: "p", text: "11.6 Entire agreement" },
      { type: "p", text: "These Website Terms govern your use and browsing of the Website. If you purchase any services from us, your purchase will also be subject to our Service Terms and Conditions and your completed booking details. Any tweaks within the stated review window are included in the price paid. Nothing in these Terms limits or excludes your statutory rights under UK consumer law." },
      { type: "p", text: "11.7 Interpretation" },
      { type: "list", items: [
        { bold: "Singular and plural", text: "– words in the singular includes the plural (and vice versa);" },
        { bold: "Gender", text: "– words indicating a gender includes the corresponding words of any other gender;" },
        { bold: "Defined terms", text: "– if a word or phrase is given a defined meaning, any other part of speech or grammatical form of that word or phrase has a corresponding meaning;" },
        { bold: "Person", text: "– a reference to “person” or “you” includes an individual, the estate of an individual, a corporation, an authority, an association, consortium or joint venture (whether incorporated or unincorporated), a partnership, a trust and any other entity;" },
        { bold: "Party", text: "– a reference to a party includes that party's executors, administrators, successors and permitted assigns, including persons taking by way of novation and, in the case of a trustee, includes any substituted or additional trustee;" },
        { bold: "This agreement", text: "– a reference to a party, clause, paragraph, schedule, exhibit, attachment or annexure is a reference to a party, clause, paragraph, schedule, exhibit, attachment or annexure to or of these Terms (this agreement), and a reference to this agreement includes all schedules, exhibits, attachments and annexures to it;" },
        { bold: "Document", text: "– a reference to a document (including these Terms) is to that document as varied, novated, ratified or replaced from time to time;" },
        { bold: "Headings", text: "– headings and words in bold type are for convenience only and do not affect interpretation;" },
        { bold: "Includes", text: "– the word “includes” and similar words in any form is not a word of limitation;" },
        { bold: "Adverse interpretation", text: "– no provision of this agreement will be interpreted adversely to a party because that party was responsible for the preparation of this agreement or that provision; and" },
        { bold: "Currency", text: "– a reference to £, or “pounds”, is to Pound Sterling currency, unless otherwise agreed in writing." },
      ] },
    ],
  },
];

export default function WebsiteTermsPage() {
  return (
    <LegalPageLayout
      title="Website Terms and Conditions"
      sections={SECTIONS}
    />
  );
}
