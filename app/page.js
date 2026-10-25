import HomeClient from "./HomeClient";

export const metadata = {
  title: "Jen Voyage — Bespoke Holiday Itineraries, Planned For You",
  description: "Tell us about your dream trip and get a free AI-crafted preview in minutes, then a fully personalised, bespoke itinerary from Jen within 48 hours — real flights, real accommodation, hand-picked activities, all with direct booking links.",
  alternates: { canonical: "/" },
};

export default function Page() {
  return <HomeClient />;
}
