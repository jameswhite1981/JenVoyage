"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const COLORS = {
  sand: "#F2EDE4", stone: "#C8BFB0", ink: "#1C1A17", dusk: "#4A3F35",
  gold: "#B8962E", white: "#FDFBF8",
};

export default function Nav() {
  const pathname = usePathname();
  const sans = { fontFamily: "system-ui,sans-serif" };

  const link = (href) => ({
    ...sans,
    fontSize: "0.78rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: pathname === href ? COLORS.gold : COLORS.dusk,
    fontWeight: pathname === href ? 500 : 400,
    textDecoration: "none",
    transition: "color 0.15s",
  });

  return (
    <nav style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "1.25rem 2rem", background: COLORS.sand,
      borderBottom: `1px solid ${COLORS.stone}`,
    }}>
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
        <div style={{ width:150, height:150, borderRadius:"50%", background:COLORS.sand, overflow:"hidden", border:`1.5px solid ${COLORS.stone}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Image src="/logo.jpg" alt="Jen Voyage" width={134} height={134} style={{ objectFit:"contain", mixBlendMode:"multiply" }} priority />
        </div>
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <Link href="/inspiration" style={link("/inspiration")}>Inspiration</Link>
        <Link href="/about" style={link("/about")}>About</Link>
        <Link href="/" style={{ ...sans, background: COLORS.ink, color: COLORS.white, fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.65rem 1.4rem", textDecoration: "none" }}>
          Begin Planning
        </Link>
      </div>
    </nav>
  );
}
