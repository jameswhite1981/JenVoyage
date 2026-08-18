// Lazy-checked so importing this module never requires DISCORD_WEBHOOK_URL
// to be present — see lib/db.js for why (Next.js build-time page-data
// collection). Silently no-ops if it isn't configured, so this stays
// optional rather than breaking enquiry submission if unset or unreachable.
export async function notifyNewEnquiry({ id, firstName, lastName, email, phone, destinationName }) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const base = process.env.NEXT_PUBLIC_BASE_URL;
  const name = `${firstName} ${lastName || ""}`.trim();

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [{
        title: "New trip request",
        url: base ? `${base}/admin/enquiry/${id}` : undefined,
        color: 0xB8962E,
        fields: [
          { name: "Name", value: name || "—", inline: true },
          { name: "Destination", value: destinationName || "—", inline: true },
          { name: "Email", value: email || "—", inline: false },
          ...(phone ? [{ name: "Phone", value: phone, inline: false }] : []),
        ],
      }],
    }),
  });
}
