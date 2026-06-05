export const USER_ID = "1321090812947468288";

const STATUS = {
  idle: ["idle", "#faa61a"],
  offline: ["offline", "#747f8d"],
};

const VERB = { 0: "playing", 1: "streaming", 2: "listening to", 3: "watching", 5: "competing in" };

function assetUrl(a) {
  const img = a.assets && a.assets.large_image;
  if (!img) return "";
  if (img.indexOf("mp:external/") === 0) return "https://media.discordapp.net/" + img.slice(3);
  if (img.indexOf("spotify:") === 0) return "https://i.scdn.co/image/" + img.slice(8);
  if (a.application_id) return "https://cdn.discordapp.com/app-assets/" + a.application_id + "/" + img + ".png";
  return "";
}

export function summarize(data) {
  if (!data) return null;
  const u = data.discord_user || {};
  const status = data.discord_status || "offline";
  const meta = STATUS[status] || STATUS.offline;
  const acts = data.activities || [];

  const activities = [];
  if (data.listening_to_spotify && data.spotify) {
    const sp = data.spotify;
    activities.push({
      verb: "listening to spotify",
      name: sp.song,
      details: sp.artist,
      state: sp.album || "",
      image: sp.album_art_url || "",
    });
  }
  const seen = new Set();
  for (const a of acts) {
    if (a.type === 4) continue;
    if (a.type === 2 && data.listening_to_spotify) continue;
    const key = a.type + "|" + (a.application_id || a.name) + "|" + (a.details || "") + "|" + (a.state || "");
    if (seen.has(key)) continue;
    seen.add(key);
    activities.push({
      verb: VERB[a.type] || "doing",
      name: a.name || "",
      details: a.details || "",
      state: a.state || "",
      image: assetUrl(a),
    });
  }

  const custom = acts.find((a) => a.type === 4);
  let customText = "";
  if (custom) {
    const emoji = custom.emoji && custom.emoji.name ? custom.emoji.name + " " : "";
    customText = (emoji + (custom.state || "")).trim();
  }

  return {
    status,
    statusLabel: meta[0],
    color: meta[1],
    name: u.global_name || u.username || "unknown",
    avatar: u.avatar
      ? "https://cdn.discordapp.com/avatars/" + u.id + "/" + u.avatar + ".png?size=128"
      : "https://cdn.discordapp.com/embed/avatars/0.png",
    custom: customText,
    activities,
  };
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

export function cardHTML(s) {
  if (!s) return '<p class="muted">couldnt reach discord right now</p>';

  let h = '<div class="dcard">';
  h += '<img class="dcavatar" src="' + esc(s.avatar) + '" alt="" width="64" height="64">';
  h += '<div class="dcmain"><div class="dcname">' + esc(s.name);
  h += '<span class="dcdot" style="background:' + s.color + '"></span>';
  h += '<span class="dcstatus">' + esc(s.statusLabel) + "</span></div>";
  if (s.custom) h += '<div class="dccustom">' + esc(s.custom) + "</div>";
  h += "</div></div>";

  if (s.activities.length) {
    for (const a of s.activities) {
      h += '<div class="dcact">';
      if (a.image) h += '<img class="dcart" src="' + esc(a.image) + '" alt="" loading="lazy">';
      h += '<div class="dcact-body">';
      h += '<div class="dcact-verb">' + esc(a.verb) + "</div>";
      h += '<div class="dcact-name">' + esc(a.name) + "</div>";
      if (a.details) h += '<div class="dcact-sub">' + esc(a.details) + "</div>";
      if (a.state) h += '<div class="dcact-sub">' + esc(a.state) + "</div>";
      h += "</div></div>";
    }
  } else {
    h += '<p class="muted">not doing anything rn</p>';
  }
  return h;
}
