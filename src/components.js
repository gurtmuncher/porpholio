import { h } from "preact";
import htm from "htm";
import { site } from "../data.js";

const html = htm.bind(h);

const vantaInit = `if (!window._vanta) {
  window._vanta = VANTA.DOTS({
    el: "#bg",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.0,
    minWidth: 200.0,
    color: 0xd97757,
    color2: 0xd97757,
    backgroundColor: 0x0c0c0b,
    size: 3.0,
    spacing: 32.0,
    showLines: false
  });
}`;

const Nav = ({ active }) => html`
  <nav class="nav">
    <a class="brand" href="/">${site.user}</a>
    <ul class="tabs">
      <li><a href="/" class=${active === "home" ? "on" : ""}>home</a></li>
      <li><a href="/projects" class=${active === "projects" ? "on" : ""}>projects</a></li>
      <li><a href="/activity" class=${active === "activity" ? "on" : ""}>activity</a></li>
      <li><a href="/contact" class=${active === "contact" ? "on" : ""}>contact</a></li>
    </ul>
  </nav>
`;

const Layout = ({ active, title, children }) => html`
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>gurtmuncher</title>
      <meta name="description" content=${site.tag} />
      <link rel="stylesheet" href="/css/style.css" />
    </head>
    <body>
      <div id="bg"></div>
      <div class="wrap">
        <${Nav} active=${active} />
        <main class="page">${children}</main>
      </div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.dots.min.js"></script>
      <script dangerouslySetInnerHTML=${{ __html: vantaInit }}></script>
      <script src="/js/app.js"></script>
      <script type="module" src="/js/activity.js"></script>
    </body>
  </html>
`;

export const Home = ({ visits }) => html`
  <${Layout} active="home" title="gurtmuncher">
    <section class="hero">
      <h1>${site.user}</h1>
      <p class="tag">${site.tag}</p>
    </section>
    <section class="block">
      ${site.about.map((p) => html`<p>${p}</p>`)}
    </section>
    <section class="block">
      <h2>skills</h2>
      <p>${site.skills.join(", ")}</p>
    </section>
    <p class="visits">${visits.toLocaleString("en-US")} total visits</p>
  <//>
`;

export const Projects = () => html`
  <${Layout} active="projects" title="gurtmuncher">
    <section class="block">
      <h2>projects</h2>
      <ul class="projects">
        ${site.projects.map(
          (p) => html`
            <li>
              <a href=${p.url} target="_blank" rel="noopener">${p.name}</a>
              <span class="note">${p.note}</span>
            </li>
          `
        )}
      </ul>
      <p class="muted">the ports are playable at <a href=${site.links.games} target="_blank" rel="noopener">degloved.net</a></p>
    </section>
  <//>
`;

export const Contact = () => html`
  <${Layout} active="contact" title="gurtmuncher">
    <section class="block">
      <h2>contact</h2>
      <ul class="links">
        <li><a href=${site.links.github} target="_blank" rel="noopener">github/${site.user}</a></li>
        <li><a href=${site.links.discord} target="_blank" rel="noopener">discord/${site.user}</a></li>
        <li><a href=${"mailto:" + site.links.email}>gmail</a></li>
      </ul>
    </section>
  <//>
`;

export const Activity = ({ cardHtml }) => html`
  <${Layout} active="activity" title="activity">
    <section class="block">
      <h2>activity</h2>
      <div id="dc" dangerouslySetInnerHTML=${{ __html: cardHtml }}></div>
    </section>
  <//>
`;

export const NotFound = () => html`
  <${Layout} active="" title="gurtmuncher">
    <section class="block">
      <h2>404</h2>
      <p>page not found</p>
      <p><a href="/">back home</a></p>
    </section>
  <//>
`;
