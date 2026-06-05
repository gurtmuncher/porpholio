import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { h } from "preact";
import render from "preact-render-to-string";
import { Home, Projects, Contact, Activity, NotFound } from "./components.js";
import { bump, total } from "./visits.js";
import { summarize, cardHTML, USER_ID } from "../public/js/lanyard.js";

const app = new Hono();

const doc = (Page, props) => "<!DOCTYPE html>" + render(h(Page, props || null));

function countVisit(c) {
  if (!getCookie(c, "seen")) {
    bump();
    setCookie(c, "seen", "1", {
      httpOnly: true,
      sameSite: "Lax",
      path: "/",
    });
  }
  return total();
}

app.use("/css/*", serveStatic({ root: "./public" }));
app.use("/js/*", serveStatic({ root: "./public" }));

app.get("/", (c) => {
  const visits = countVisit(c);
  return c.html(doc(Home, { visits }));
});
app.get("/projects", (c) => {
  countVisit(c);
  return c.html(doc(Projects));
});
app.get("/contact", (c) => {
  countVisit(c);
  return c.html(doc(Contact));
});
let presence = null;
async function refreshPresence() {
  try {
    const r = await fetch("https://api.lanyard.rest/v1/users/" + USER_ID, {
      signal: AbortSignal.timeout(4000),
    });
    const j = await r.json();
    if (j.success) presence = j.data;
  } catch {}
}
refreshPresence();
setInterval(refreshPresence, 20000);

app.get("/activity", (c) => {
  countVisit(c);
  return c.html(doc(Activity, { cardHtml: cardHTML(summarize(presence)) }));
});
//404 page son
app.notFound((c) => c.html(doc(NotFound), 404));

const port = Number(process.env.PORT) || 3000;
const hostname = process.env.HOST || "127.0.0.1";
serve({ fetch: app.fetch, port, hostname }, (info) => {
  console.log(`started @ http://${hostname}:${info.port}`);
});
