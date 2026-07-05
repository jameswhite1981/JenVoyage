"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const sans = { fontFamily:"system-ui,sans-serif" };

export default function DeleteTemplateButton({ id, name }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete the "${name}" template? This can't be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/templates/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.refresh();
    } catch {
      alert("Couldn't delete this template — please try again.");
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      style={{ ...sans, background:"none", border:"none", color:"#9B3A2A", fontSize:"0.68rem", fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", cursor:"pointer", padding:"0.5rem 0.25rem", opacity: deleting ? 0.5 : 1 }}
    >
      {deleting ? "Deleting…" : "Delete"}
    </button>
  );
}
