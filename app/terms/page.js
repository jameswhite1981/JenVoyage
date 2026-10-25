import LegalPageLayout from "../components/LegalPageLayout";

const SECTIONS = [
  {
    title: "Your key information",
    blocks: [
      { type: "p", text: "The Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 say that you have a 14-day statutory right to cancel your contract for services. If you agree that our bespoke planning services will start during this 14-day cancellation window, you may be charged for the work performed up to the point of cancellation, or lose your right to cancel if the service is completed." },
      { type: "p", text: "The Consumer Rights Act 2015 says:" },
      { type: "list", items: [
        "you can ask us to repeat or fix a service if it's not carried out with reasonable care and skill, or get some money back if we can't fix it;",
        "if a price hasn't been agreed upfront, what you're asked to pay must be reasonable;",
        "if a time hasn't been agreed upfront, it must be carried out within a reasonable time.",
      ] },
      { type: "p", text: "This is a summary of some of your key rights. For detailed information from Citizens Advice please visit www.citizensadvice.org.uk or call 0808 223 1133." },
      { type: "p", text: "The information in this summary box summarises some of your key rights. It is not intended to replace the contract below, which you should read carefully." },
    ],
  },
  {
    title: "How these terms work",
    blocks: [
      { type: "p", text: "These T&Cs set out:" },
      { type: "list", items: [
        "your legal rights and responsibilities;",
        "our legal rights and responsibilities; and",
        "certain key information required by law.",
      ] },
      { type: "p", text: "In this contract: 'we', 'us' or 'our' means Jenny White trading as Jen Voyage; and 'you' or 'your' means the person using our site to buy bespoke travel planning services from us." },
      { type: "p", text: "If you have any questions about this contract or any orders you have placed, please contact us by sending an email to jen@jenvoyage.com." },
      { type: "p", text: "Who are we? We are Jenny White (trading as Jen Voyage), operating as a sole trader in England and Wales with our principal place of business at 398 Little Wakering Road, Barling Magna, Essex, SS3 0LN." },
      { type: "p", text: "The details of this contract will not be filed by us. Please print out or save a copy of this contract for your records as we will not save a copy for you." },
    ],
  },
  {
    title: "1. Introduction",
    blocks: [
      { type: "list", items: [
        "If you buy bespoke itinerary planning services on our website, you agree to be legally bound by this contract.",
        "These T&Cs apply strictly to consumers (i.e., individuals buying services for personal travel rather than commercial business purposes).",
        "This contract is only available in English. No other languages will apply to this contract.",
        { bold: "When buying any services on our site you also agree to be legally bound by:", text: "", sub: [
          "our website terms and conditions and any documents referred to in them;",
          "extra terms which may add to, or replace some of, this contract. This may happen for security, legal or regulatory reasons. We will contact you to let you know if we intend to do this by giving you reasonable notice. You can end this contract at any time by providing notice if we tell you extra terms apply; and",
          "any specific terms which apply to certain services, which will be communicated to you during the online checkout process.",
        ] },
      ] },
      { type: "p", text: "All of the above documents form part of these T&Cs as though set out in full here." },
    ],
  },
  {
    title: "2. Information we give you",
    blocks: [
      { type: "list", items: [
        "By law, the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 say that we must give you certain key information before a legally binding contract between you and us is made. This information is set out at the start of these T&Cs and elsewhere throughout our website. If you cannot access this information for any reason, you are welcome to contact us by email at jen@jenvoyage.com and we will provide you with a copy of this information.",
        "The key information we give you by law forms part of this contract (as though it is set out in full here).",
        "If we have to change any key information once a legally binding contract between you and us is made, we can only do this if you agree to it.",
      ] },
    ],
  },
  {
    title: "3. Nature of our services & travel disclaimer",
    blocks: [
      { type: "list", items: [
        "Jen Voyage provides bespoke, human-curated travel itinerary planning services. We deliver customised travel recommendations, links, and itineraries based on information supplied in your travel brief.",
        "We are an independent travel planning service. We do not operate as a licensed travel agency or tour operator, nor do we process payments for third-party travel, flights, or accommodations.",
        "All bookings, flight purchases, accommodation arrangements, transfers, activities, and insurance are made directly by you through external third-party links and providers. All such external bookings are governed strictly by the separate terms, conditions, and cancellation policies of those third-party providers. We have no liability or control over third-party pricing, availability, cancellations, or service delivery.",
        "We do not provide financial, tax, insurance, visa, health, regulatory, or legal advice. It is your sole responsibility to ensure compliance with entry, visa, passport, health, and insurance requirements for your destinations.",
        "We operate strictly on a transparent fixed-fee basis. We do not receive or accept any commission, referral fees, payments, or incentives from third-party travel providers or affiliate networks for any recommendations or links included in your itinerary.",
        "Itineraries and recommendations are delivered in electronic format (such as PDF or interactive web links). Web links provided as part of the service will remain accessible for 30 days from delivery, after which access may expire. You are responsible for saving or downloading copies for your records.",
        "In accordance with our data retention policy, customer account details, travel briefs, and associated personal information will be securely deleted 30 days following the delivery of your travel itinerary.",
      ] },
    ],
  },
  {
    title: "4. Your privacy and personal information",
    blocks: [
      { type: "list", items: [
        "Our Privacy Policy is available at https://www.jenvoyage.com/privacy.",
        "Your privacy and personal information are important to us. Any personal information that you provide to us will be dealt with in line with our Privacy Policy, which explains what personal information we collect from you, how and why we collect, store, use and share such information, your rights in relation to your personal information and how to contact us and supervisory authorities if you have a query or complaint about the use of your personal information.",
      ] },
    ],
  },
  {
    title: "5. Ordering services from us",
    blocks: [
      { type: "p", text: "Below, we set out how a legally binding contract between you and us is made:" },
      { type: "p", text: "You place an order by selecting one of our transparent, flat-fee travel planning packages on the website:" },
      { type: "list", items: [
        { bold: "The Weekend Getaway (£25)", text: "– covers single-destination trips up to 4 nights, including a personalised itinerary and 1 revision." },
        { bold: "The Main Holiday (£70)", text: "– covers single main-destination trips from 5 to 14 nights, including a fully personalised itinerary, a dedicated travel consultant, and revisions requested within 72 hours of delivery." },
        { bold: "The Epic Adventure (£120)", text: "– covers multi-destination, long-haul, or complex trips, including a fully bespoke itinerary, a dedicated travel consultant, and unlimited revisions within the 72 hour period." },
      ] },
      { type: "list", items: [
        "You submit your order and travel brief using the functionality on our website. Please read and check your order details and travel brief carefully before submitting. You will be able to correct any errors before submitting your order to us.",
        "When you place your order at the end of the online checkout process, we will acknowledge it by email. This acknowledgement does not, however, mean that your order has been accepted by us.",
        { bold: "We may contact you to say that we do not accept your order.", text: "This is typically for the following reasons:", sub: [
          "we cannot carry out the services (this may be because, for example, we have a shortage of staff);",
          "we cannot authorise your payment;",
          "you are not allowed to buy the services from us;",
          "we are not allowed to sell the services to you; or",
          "there has been a mistake on the pricing or description of the services.",
        ] },
        { bold: "We will only accept your order when we email you to confirm this (Confirmation Email).", text: "At this point:", sub: [
          "a legally binding contract will be in place between you and us; and",
          "we will commence work to provide your bespoke itinerary within our standard 48-hour delivery window.",
        ] },
        "You must be at least 18 years old to purchase travel planning services from us.",
      ] },
    ],
  },
  {
    title: "6. Right to cancel",
    blocks: [
      { type: "list", items: [
        "You have the right to cancel this contract within 14 days without giving any reason. However, you do not have the right to cancel if you requested for us to start providing the services during the cancellation period and the services are fully performed (ie the work is completed) during this period. This is further explained below.",
        "The cancellation period will expire after 14 days from the day of the conclusion of the contract.",
        "If we fully complete your bespoke itinerary within the 14-day period, you will lose your statutory right to cancel and will not be entitled to a refund.",
        "If you cancel while work is in progress, you must pay us a fair proportion of the total fee for the services provided up to the time you notified us of cancellation.",
        "To exercise the right to cancel, you must inform us of your decision to cancel this contract by a clear statement to us by emailing us at jen@jenvoyage.com.",
        "To meet the cancellation deadline, it is sufficient for you to send your communication concerning your exercise of the right to cancel before the cancellation period has expired.",
        "We will not start providing the services during the 14-day cancellation period unless you ask us to. When you place an order for services, you will be given the option to tick a box to request for us to start providing the services during the cancellation period. By ticking the box, you acknowledge that you will lose your right to cancel this contract once the services are fully performed (ie the work is completed). If you do not tick the box, we will not be able to start providing the services to you until the cancellation period has expired. We are not obliged to accept your request.",
        "This means that if you requested for us to start providing the services during the cancellation period and the services are fully performed (i.e. the work is completed) during this period, you lose your right to cancel and will be required to pay the full price under this contract even if the cancellation period has not expired.",
        "This does not affect the rights you have if your services are faulty. A summary of these rights is provided at the top of this page. See also the Faulty services section below.",
      ] },
    ],
  },
  {
    title: "7. Effects of cancellation",
    blocks: [
      { type: "list", items: [
        { bold: "If you cancel this contract, we will reimburse to you all payments received from you, unless you requested for us to start providing the services during the cancellation period, in which case you must pay us:", text: "", sub: [
          "for the services we provided up to the time you told us that you want to cancel this contract, which will be an amount in proportion to the services performed up to that point in comparison with the full price under this contract; or",
          "the full price under this contract, if you lost your right to cancel this contract because the services were fully performed (i.e. the work was completed) during the cancellation period.",
          "We will make the reimbursement without undue delay, and not later than 14 days after the day on which we are informed about your decision to cancel this contract.",
        ] },
        "We will make the reimbursement using the same means of payment as you used for the initial transaction, unless you have expressly agreed otherwise; in any event, you will not incur any fees as a result of the reimbursement.",
      ] },
    ],
  },
  {
    title: "8. Carrying out the services",
    blocks: [
      { type: "list", items: [
        "We will carry out the services by the time or within the period agreed during the online checkout process and as set out in the Confirmation Email. If you and we have agreed no time or period, we will carry out the services within a reasonable time.",
        "Our carrying out of the services might be affected by events beyond our reasonable control. If so, there might be a delay before we can start or restart the services, having made reasonable efforts to limit the effect of any of those events and having kept you informed of the circumstances, but we will try to start or restart the services as soon as those events have been fixed.",
      ] },
    ],
  },
  {
    title: "9. Payment",
    blocks: [
      { type: "list", items: [
        "We accept payment via major credit and debit cards through our secure third-party payment processor (e.g., Stripe). We do not accept cash or cheques.",
        "We will do all that we reasonably can to ensure that all of the information you give us when paying for the services is secure by using an encrypted secure payment mechanism. However, in the absence of negligence on our part, any failure by us to comply with this contract or our Privacy Policy or breach by us of our duties under applicable laws, we will not be legally responsible to you for any loss that you may suffer if a third party gains unauthorised access to any information that you give us.",
        "Your credit card or debit card will only be charged when you submit your order and complete the checkout process on our website.",
        "All prices are in pounds sterling (£)(GBP). We are not currently registered for VAT, so VAT is not charged on our services.",
      ] },
    ],
  },
  {
    title: "10. Nature of the services",
    blocks: [
      { type: "p", text: "The Consumer Rights Act 2015 gives you certain legal rights (also known as 'statutory rights'). The services that we provide to you must be carried out with reasonable care and skill. In addition:" },
      { type: "list", items: [
        "where the price has not been agreed upfront, the cost of the services must be reasonable; and",
        "where no time period has been agreed upfront for the provision of the services, we must carry out the services within a reasonable time.",
      ] },
      { type: "p", text: "We are under a legal duty to supply you with services that are in conformity with this contract." },
    ],
  },
  {
    title: "11. Faulty services",
    blocks: [
      { type: "list", items: [
        "We must provide our travel planning services to you with reasonable care and skill.",
        "We are under a legal duty to supply services that are in conformity with our contract with you.",
        "If a service is not carried out with reasonable care and skill, you can ask us to repeat or fix the service, or get a full or partial refund if we cannot fix it.",
        "This is a summary of some of your key statutory rights. They are in addition to your cancellation rights set out above. For more detailed information on your rights, please visit the Citizens Advice website at www.citizensadvice.org.uk or call 0808 223 1133.",
      ] },
    ],
  },
  {
    title: "12. End of the contract",
    body: "If this contract is ended it will not affect our right to receive any money which you owe to us under this contract.",
  },
  {
    title: "13. Limitation on our liability",
    blocks: [
      { type: "p", text: "Except for any legal responsibility that we cannot exclude in law (such as for death or personal injury) or arising under applicable laws relating to the protection of your personal information, we are not legally responsible for any:" },
      { type: "list", items: [
        "losses that were not foreseeable to you and us when the contract was formed;",
        "losses that were not caused by any breach on our part;",
        "business losses;",
        "losses to non-consumers; or",
        "third-party travel issues, including flight delays, cancellations, price changes, accommodation standards, or service failures caused by external travel providers booked via links in your itinerary.",
      ] },
    ],
  },
  {
    title: "14. Third party rights",
    body: "No one other than a party to this contract has any right to enforce any term of this contract.",
  },
  {
    title: "15. Disputes",
    blocks: [
      { type: "list", items: [
        "We will try to resolve any disputes with you quickly and efficiently. If you are unhappy with the services we have provided, or any other matter, please contact us as soon as possible using the contact details set out at the top of this page.",
        "If you wish to make a complaint, please email us at jen@jenvoyage.com with full details of your issue. We will acknowledge your complaint within 2 business days and aim to provide a full resolution within 14 calendar days.",
        "If your complaint cannot be resolved or you are unhappy with the outcome, you may want to submit your complaint to an accredited provider of alternative dispute resolution (ADR) services, details of which can be found on the Chartered Trading Standards Institute website available here: https://www.tradingstandards.uk/. ADR is a process for resolving disputes that does not involve going to court.",
        "If you do not wish to use ADR or are unhappy with the outcome of ADR, you can still bring court proceedings.",
      ] },
    ],
  },
  {
    title: "16. Governing law and jurisdiction",
    blocks: [
      { type: "list", items: [
        "The laws of England and Wales apply to these terms, although if you are resident elsewhere you will retain the benefit of any mandatory protections given to you by the laws of that country.",
        "Any disputes will be subject to the non-exclusive jurisdiction of the courts of England and Wales. This means that you can choose whether to bring a claim in the courts of England and Wales or in the courts of another part of the UK in which you live.",
      ] },
    ],
  },
];

export const metadata = {
  title: "Terms & Conditions",
  description: "The service terms and conditions for booking a bespoke itinerary-planning service from Jen Voyage.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Service Terms and Conditions"
      subtitle="Last updated on 16 October 2026"
      sections={SECTIONS}
    />
  );
}
