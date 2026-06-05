import { USER_ID, summarize, cardHTML } from "/js/lanyard.js";

async function refresh() {
  const el = document.getElementById("dc");
  if (!el) return;
  try {
    const r = await fetch("https://api.lanyard.rest/v1/users/" + USER_ID, { cache: "no-store" });
    const j = await r.json();
    if (j.success) el.innerHTML = cardHTML(summarize(j.data));
  } catch {}
}

refresh();
setInterval(refresh, 15000);
