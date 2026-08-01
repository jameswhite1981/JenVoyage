import Link from "next/link";

const COLORS = {
  stone: "#C8BFB0", dusk: "#4A3F35",
};

const sans = { fontFamily: "system-ui,sans-serif" };

export default function Footer() {
  return (
    <div style={{ borderTop: `1px solid ${COLORS.stone}`, padding: "1.5rem 2rem", textAlign: "center" }}>
      <Link href="/terms" style={{ ...sans, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.dusk, textDecoration: "none" }}>
        Terms &amp; Conditions
      </Link>
    </div>
  );
}
