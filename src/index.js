import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { h } from "preact";
import render from "preact-render-to-string";
import { Home, Projects, Contact, NotFound } from "./components.js";
import { bump, total } from "./visits.js";

const app = new Hono();

const doc = (Page, props) => "<!DOCTYPE html>" + render(h(Page, props || null));

function countVisit(c) {
  if (!getCookie(c, "seen")) {
    bump();
    setCookie(c, "seen", "1", {
      httpOnly: true,
      sameSite: "Lax",
      path: "/",
      maxAge: 60 * 20,
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
//404 page son
app.notFound((c) => c.html(doc(NotFound), 404));

const port = Number(process.env.PORT) || 3000;
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`started @ http://localhost:${info.port}`);
});
