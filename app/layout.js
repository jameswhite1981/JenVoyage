import "./globals.css";

export const metadata = {
  title: "Jen Voyage",
  description: "Bespoke travel itineraries, precisely planned.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
