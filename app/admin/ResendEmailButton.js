"use client";
import { useState } from "react";
import { resendItineraryEmail } from "./actions.js";

const sans = { fontFamily:"system-ui,sans-serif" };

export default function ResendEmailButton({ email, firstName, destinationName }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleClick = async () => {
    if (!confirm(`Re-send the itinerary-ready email to ${email}?`)) return;
    setSending(true);
    try {
      await resendItineraryEmail(email, firstName, destinationName);
      setSent(true);
    } catch {
      alert("Couldn't send the email, please try again.");
    }
    setSending(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={sending}
      style={{ ...sans, background:"none", border:"none", color:"#4A3F35", fontSize:"0.68rem", fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", cursor:"pointer", padding:"0.5rem 0.25rem", opacity: sending ? 0.5 : 1 }}
    >
      {sending ? "Sending…" : sent ? "Sent ✓" : "Re-send email"}
    </button>
  );
}
