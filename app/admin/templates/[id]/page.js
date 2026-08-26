"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { normalizeItinerary, parseItineraryJSON } from "../../../../lib/itinerary.js";
import TemplateEditorPage from "../TemplateEditorPage.js";

const C = { sand:"#F2EDE4", stone:"#C8BFB0" };

export default function EditTemplatePage() {
  const { id } = useParams();
  const [initial, setInitial] = useState(undefined); // undefined = loading, null = not found

  useEffect(() => {
    fetch(`/api/admin/templates/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(t => {
        if (!t) { setInitial(null); return; }
        let draft;
        try { draft = normalizeItinerary(parseItineraryJSON(t.content)); } catch { draft = null; }
        setInitial({ id: t.id, name: t.name, destinationName: t.destination_name || "", draft: draft || undefined });
      });
  }, [id]);

  if (initial === undefined) {
    return <div style={{ fontFamily:"Georgia,serif", background:C.sand, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", color:C.stone }}>Loading…</div>;
  }
  if (initial === null) {
    return <div style={{ fontFamily:"Georgia,serif", background:C.sand, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", color:C.stone }}>Template not found.</div>;
  }

  return <TemplateEditorPage initial={initial} />;
}
