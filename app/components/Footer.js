import Link from "next/link";

const COLORS = {
  stone: "#C8BFB0", dusk: "#4A3F35",
};

const sans = { fontFamily: "system-ui,sans-serif" };

const LINK_STYLE = { ...sans, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.dusk, textDecoration: "none" };

export default function Footer() {
  return (
    <div style={{ borderTop: `1px solid ${COLORS.stone}`, padding: "1.5rem 2rem", textAlign: "center", display: "flex", justifyContent: "center", gap: "1.75rem", flexWrap: "wrap" }}>
      <Link href="/terms" style={LINK_STYLE}>Terms &amp; Conditions</Link>
      <Link href="/privacy" style={LINK_STYLE}>Privacy Policy</Link>
      <Link href="/cookies" style={LINK_STYLE}>Cookie Policy</Link>
    </div>
  );
}
