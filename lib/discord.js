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

export async function notifyNewDealCheck({ id, name, email, description, link, quoted_total_cost, adults, children_under_16, transfer_included }) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const base = process.env.NEXT_PUBLIC_BASE_URL;
  const truncated = description.length > 300 ? `${description.slice(0, 300)}…` : description;
  const party = (adults != null || children_under_16 != null)
    ? `${adults ?? "?"} adult(s), ${children_under_16 ?? "0"} child(ren) under 16`
    : null;

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [{
        title: "New Deal Check request",
        url: base ? `${base}/admin/deal-checks` : undefined,
        color: 0xB8962E,
        fields: [
          { name: "Name", value: name || "—", inline: true },
          { name: "Email", value: email || "—", inline: true },
          ...(quoted_total_cost ? [{ name: "Quoted total", value: quoted_total_cost, inline: true }] : []),
          ...(party ? [{ name: "Party", value: party, inline: true }] : []),
          { name: "Transfer included", value: transfer_included ? "Yes" : "No", inline: true },
          ...(link ? [{ name: "Link", value: link, inline: false }] : []),
          { name: "Description", value: truncated || "—", inline: false },
        ],
      }],
    }),
  });
}
