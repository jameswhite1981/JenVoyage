import LegalPageLayout from "../components/LegalPageLayout";

const SECTIONS = [
  {
    title: "1. Introduction",
    blocks: [
      { type: "p", text: "This Privacy Policy is provided by Jenny White trading as Jen Voyage, 398 Little Wakering Road, Barling Magna, Essex, SS3 0LN ('we', 'our' or 'us') for use of our bespoke holiday itinerary design service, travel consultation, and website (Services)." },
      { type: "p", text: "We take your privacy very seriously. Please read this privacy policy carefully as it contains important information on how and why we collect, store, use and share any information relating to you (your personal data)." },
      { type: "p", text: "It also explains your rights in relation to your personal data and how to contact us or the relevant regulator in the event you have a complaint. Our collection, storage, use and sharing of your personal data is regulated by law, including under the UK General Data Protection Regulation (UK GDPR)." },
      { type: "p", text: "We are the controller of personal data obtained via the Services, meaning we are the organisation legally responsible for deciding how and for what purposes it is used." },
    ],
  },
  {
    title: "2. What this policy applies to",
    blocks: [
      { type: "p", text: "This privacy policy relates to your use of the Services only." },
      { type: "p", text: "Please note that Jen Voyage acts solely as an itinerary designer and consultant. We do not book or administer travel, accommodation, or third-party services on your behalf, nor do we act as an agent for any travel provider. Any contracts for bookings are entered into directly between you and the respective third-party service providers." },
      { type: "p", text: "The Services may link to or rely on other apps, websites, APIs or services owned and operated by us or by certain trusted third parties to enable us to provide you with Services. These other apps, websites, APIs or services may also gather information about you in accordance with their own separate privacy policies. For privacy information relating to these other apps, websites or services, please consult their privacy policies as appropriate. For more information see the section 'Who we share your personal data with' below." },
    ],
  },
  {
    title: "3. Personal data we collect about you",
    blocks: [
      { type: "p", text: "The personal data we collect about you depends on the particular activities carried out through the Services. We will collect and use the following personal data about you:" },
      { type: "list", items: [
        { bold: "Data collected when you use specific functions in the Services", text: "– information provided when submitting a brief for a custom itinerary, destination preferences, travel dates, passenger details (including passenger ages required to generate accurate quotes), budget requirements, dietary or accessibility requests, and payment information required to process our itinerary planning fee (handled securely via third-party payment processors such as Stripe)." },
        { bold: "Other data the Services collects automatically when you use it", text: "– basic technical data generated when you access the site (such as IP address, browser type, access time, and security session tokens) required solely to display the website, prevent fraud, and run our secure checkout portal." },
        { bold: "Data collected when you make an enquiry with us", text: "– your name and contact information (such as email address and phone number)." },
      ] },
      { type: "p", text: "If you do not provide personal data we ask for where it is required, it may prevent us from providing services and/or the Services to you." },
      { type: "p", text: "We collect and use this personal data for the purposes described in the section 'How and why we use your personal data' below." },
    ],
  },
  {
    title: "4. Sensitive data",
    blocks: [
      { type: "p", text: "Sensitive personal data (also known as special category data) means information related to personal data revealing racial or ethnic origin; political opinions; religious or philosophical beliefs; trade union membership; genetic data; biometric data (where used for identification purposes); data concerning health; data concerning a person's sex life; and data concerning a person's sexual orientation." },
      { type: "p", text: "Please note that we do not knowingly or intentionally collect sensitive personal data or information about criminal convictions from individuals and that you should not submit sensitive data to us." },
      { type: "p", text: "If, however you do submit sensitive data to us, such as if you make this sensitive data available to other users of the Services (such as by publishing it through any forum feature we may make available from time to time) we will assume that you have purposefully made any such sensitive data manifestly public." },
    ],
  },
  {
    title: "5. How your personal data is collected",
    blocks: [
      { type: "p", text: "We collect personal data from you directly when you sign up to the Services, contact us directly or reach out to us via social media, make submissions via the Services when a forum element is available, or indirectly, such as your activity while using the Services." },
      { type: "p", text: "At this point in time, we do not collect any personal information about you using tracking cookies or similar technologies, nor do we send direct marketing communications. In the event that this changes, you would be notified of this change, with detailed information regarding our use of cookies and similar technologies to be made available in a relevant Cookies Policy." },
    ],
  },
  {
    title: "6. How and why we use your personal data",
    blocks: [
      { type: "p", text: "Under data protection law, we can only use your personal data if we have a proper reason, e.g.:" },
      { type: "list", items: [
        "where you have given consent",
        "to comply with our legal and regulatory obligations",
        "for the performance of a contract with you or to take steps at your request before entering into a contract, or",
        "for our legitimate interests or those of a third party",
      ] },
      { type: "p", text: "A legitimate interest is when we have a business or commercial reason to use your information, so long as this is not overridden by your own rights and interests. We will carry out an assessment when relying on legitimate interests, to balance our interests against your own. You can obtain details of this assessment by contacting us (see 'How to contact us' below)." },
      { type: "p", text: "What we use your personal data for, and why:" },
      { type: "list", items: [
        { bold: "Create and manage your account with us", text: "– to perform our contract with you or to take steps at your request before entering into a contract." },
        { bold: "Providing services and/or the functionalities of the Services to you", text: "– depending on the circumstances, to perform our contract with you or to take steps at your request before entering into a contract (in this case, the contract means the Terms and Conditions of Use which apply to the Services)." },
        { bold: "To enforce legal rights or defend or undertake legal proceedings", text: "– depending on the circumstances: to comply with our legal and regulatory obligations; or, in other cases, for our legitimate interests or those of a third party, i.e. to protect our business, interests and rights or those of others." },
        { bold: "Communications with you not related to marketing", text: "(including about changes to our terms or policies or changes to the Services or other important notices) – depending on the circumstances: to comply with our legal and regulatory obligations; or, in other cases, for our legitimate interests or those of a third party, i.e. to provide the best service to you." },
        { bold: "Protect the security of systems and data", text: "– to comply with our legal and regulatory obligations we may also use your personal data to ensure the security of systems and data to a standard that goes beyond our legal obligations, and in those cases our reasons are for our legitimate interests or those of a third party, i.e. to protect systems and data and to prevent and detect criminal activity that could be damaging for you and/or us." },
        { bold: "Operational reasons", text: "such as improving efficiency, training, and quality control or to provide support to you – for our legitimate interests or those of a third party, i.e. to be as efficient as we can so we can deliver the best service to you." },
        { bold: "Statistical analysis", text: "to help us manage our business, e.g. in relation to our performance, customer base, app and functionalities and offerings or other efficiency measures – for our legitimate interests or those of a third party, i.e. to be as efficient as we can so we can deliver the best service to you and improve and develop our app." },
        { bold: "Updating and enhancing user records", text: "– depending on the circumstances: to perform our contract with you or to take steps at your request before entering into a contract; to comply with our legal and regulatory obligations; or, where neither of the above apply, for our legitimate interests or those of a third party, e.g. making sure that we can keep in touch with our customers about their accounts and new products or functionalities related to the Services and our services." },
        { bold: "To comply with our legal and regulatory obligations", text: "– depending on the circumstances: to perform our contract with you or to take steps at your request before entering into a contract; or to comply with our legal and regulatory obligations; where neither of the above apply, for our legitimate interests or those of a third party, e.g. making sure that we can keep in touch with our customers about their accounts and new products or functionalities related to the Services and our services." },
        { bold: "To share your personal data with members of our group and third parties in connection with a significant corporate transaction or restructuring", text: "including a merger, acquisition, asset sale, initial public offering or in the event of our insolvency. In such cases information will be anonymised where possible and only shared where necessary – depending on the circumstances: to comply with our legal and regulatory obligations; or, in other cases, for our legitimate interests or those of a third party, i.e. to protect, realise or grow the value in our business and assets." },
      ] },
      { type: "p", text: "See 'Who we share your personal data with' for further information on the steps we will take to protect your personal data where we need to share it with others." },
    ],
  },
  {
    title: "7. Who we share your personal data with",
    blocks: [
      { type: "p", text: "We routinely share personal data with service providers we use to help us run our business or provide the services or functionalities in the Services." },
      { type: "p", text: "We only allow service providers to handle your personal data if we are satisfied they take appropriate measures to protect your personal data. We also impose contractual obligations on service providers to ensure they can only use your personal data to provide services to us and to you." },
      { type: "p", text: "We or the third parties mentioned above may occasionally also need to share your personal data with:" },
      { type: "list", items: [
        "external auditors, e.g. in relation to the audit of our accounts and our company — the recipient of the information will be bound by confidentiality obligations",
        "professional advisors (such as lawyers and other advisors) — the recipient of the information will be bound by confidentiality obligations",
        "law enforcement agencies, courts or tribunals and regulatory bodies to comply with legal and regulatory obligations",
        "other parties in connection with a significant corporate transaction or restructuring, including a merger, acquisition, asset sale, initial public offering or in the event of our insolvency — usually, information will be anonymised but this may not always be possible, however, the recipient of the information will be bound by confidentiality obligations",
      ] },
      { type: "p", text: "If you would like more information about who we share our data with and why, please contact us (see 'How to contact us' below)." },
      { type: "p", text: "We will not share your personal data with any other third party, including travel or accommodation providers, as you contract with them directly. Furthermore, we do not receive any commissions, affiliate payments, or referral fees from third-party service providers." },
    ],
  },
  {
    title: "8. How long your personal data will be kept",
    blocks: [
      { type: "p", text: "We retain your customer brief and personal data for 30 days following the delivery of your itinerary, after which all personal data and identifying brief details are permanently deleted. However, basic financial and transactional records (such as Stripe payment records) are retained for 6 years to comply with UK tax and accounting obligations. We also retain de-identified, non-personal holiday templates for future service design and analytical purposes." },
    ],
  },
  {
    title: "9. De-identified information",
    body: "The personal data we collect may have analytical, educational, or commercial value to us. Where we have de-identified the information we have collected, we reserve the right to process and distribute such information.",
  },
  {
    title: "10. Automated decision-making",
    body: "We may use automated systems to make decisions that significantly affect you. These processes may involve the use of personal data to evaluate you. You may request human review of any automated decision by contacting us using the details below.",
  },
  {
    title: "11. Transferring your personal data out of the UK",
    blocks: [
      { type: "p", text: "At this point in time, we do not transfer your personal data outside of the UK. If this changes, we would comply with applicable UK laws designed to ensure the continued protection and privacy of your personal data. Any updated destinations to which we send your personal data would be indicated in this section and notified to you in accordance with the section on 'Changes to this privacy policy' below." },
      { type: "p", text: "Furthermore, under UK data protection laws, we can only transfer your personal data to a country outside the UK where: the UK government has decided the particular country ensures an adequate level of protection of personal data (known as an 'adequacy regulation') further to Article 45 of the UK GDPR; there are appropriate safeguards in place, together with enforceable rights and effective legal remedies for you; or a specific exception applies under relevant data protection law." },
      { type: "p", text: "Accordingly, if we were to start transferring your personal data from the UK to:" },
      { type: "list", items: [
        "The EEA: we would rely on the adequacy finding granted by the UK to the EU under the Withdrawal Agreement; for any transfers from the EU to the UK, we would rely on the adequacy regulation granted to the UK under the Adequacy Decision.",
        "Any country located outside the UK/EEA: we would rely on appropriate safeguards under the UK GDPR, such as by including the relevant Standard Contractual Clauses in our data processing agreements.",
      ] },
      { type: "p", text: "In the event we could not or choose not to continue to rely on either of those mechanisms at any time we would not transfer your personal data outside the UK unless we could do so on the basis of an alternative mechanism or exception provided by UK data protection law." },
    ],
  },
  {
    title: "12. Your rights",
    blocks: [
      { type: "p", text: "You generally have the following rights, which you can usually exercise free of charge. For more information regarding these rights, please visit the ICO website." },
      { type: "list", items: [
        { bold: "Access to a copy of your personal data", text: "– the right to be provided with a copy of your personal data." },
        { bold: "Correction (also known as rectification)", text: "– the right to require us to correct any mistakes in your personal data." },
        { bold: "Erasure (also known as the right to be forgotten)", text: "– the right to require us to delete your personal data, in certain situations." },
        { bold: "Restriction of use", text: "– the right to require us to restrict use of your personal data in certain circumstances, e.g. if you contest the accuracy of the data." },
        { bold: "Data portability", text: "– the right to receive the personal data you provided to us, in a structured, commonly used and machine-readable format and/or transmit that data to a third party, in certain situations." },
        { bold: "To object to use", text: "– the right to object: at any time to your personal data being used for direct marketing (including profiling); or, in certain other situations, to our continued use of your personal data, e.g. where we use your personal data for our legitimate interests." },
        { bold: "Not to be subject to decisions without human involvement", text: "– the right not to be subject to a decision based solely on automated processing (including profiling) that produces legal effects concerning you or similarly significantly affects you. We do not make any such decisions based on data collected by the Services." },
      ] },
      { type: "p", text: "For further information on each of those rights, including the circumstances in which they do and do not apply, please contact us (see 'How to contact us' below). You may also find it helpful to refer to the guidance from the UK's Information Commissioner on your rights under the UK GDPR." },
      { type: "p", text: "If you would like to exercise any of those rights, please email us using the contact details below. When contacting us please: provide enough information to identify yourself (e.g., your full name and username) and any additional identity information we may reasonably request from you, and let us know which right(s) you want to exercise and the information to which your request relates." },
    ],
  },
  {
    title: "13. Keeping your personal data secure",
    blocks: [
      { type: "p", text: "We have appropriate security measures to prevent personal data from being accidentally lost, or used or accessed unlawfully. We limit access to your personal data to those who have a genuine business need to access it." },
      { type: "p", text: "We also have procedures in place to deal with any suspected data security breach. We will notify you and any applicable regulator of a suspected data security breach where we are legally required to do so." },
      { type: "p", text: "If you want detailed information from Get Safe Online on how to protect your information and your computers and devices against fraud, identity theft, viruses and many other online problems, please visit www.getsafeonline.org. Get Safe Online is supported by HM Government and leading businesses." },
    ],
  },
  {
    title: "14. How to complain",
    blocks: [
      { type: "p", text: "Please contact us if you have any queries or concerns about our use of your information (see below 'How to contact us'). We hope we will be able to resolve any issues you may have." },
      { type: "p", text: "You also have the right to lodge a complaint with the Information Commissioner." },
      { type: "p", text: "The Information Commissioner can be contacted at https://ico.org.uk/make-a-complaint or telephone: 0303 123 1113." },
    ],
  },
  {
    title: "15. Changes to this privacy policy",
    body: "We may change this privacy policy from time to time. When we make significant changes we will take steps to inform you, for example via the Services or by other means, such as email.",
  },
  {
    title: "16. How to contact us",
    blocks: [
      { type: "p", text: "For further information about our privacy policy or practices, or to access or correct your personal data, or make a complaint, please contact us using the details set out below:" },
      { type: "p", text: "Name: Jenny White" },
      { type: "p", text: "Email: jen@jenvoyage.com" },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="Policy version: 16 October 2026"
      sections={SECTIONS}
    />
  );
}
