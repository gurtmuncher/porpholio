export async function onRequest(context) {
    const url = new URL(context.request.url);

    let steamId =
        url.searchParams.get("id") ||
        url.searchParams.get("steamId") ||
        url.searchParams.get("steam_id");

    if (!steamId) {
        const parts = url.pathname.split("/");
        steamId = parts[parts.length - 1];
    }

    if (!steamId || !/^\d+$/.test(steamId)) {
        return new Response("invalid steam id", { status: 400 });
    }

    const recentUrl =
        "https://steamcommunity.com/profiles/" +
        steamId +
        "/games/?tab=recent&xml=1";

    let res = await fetch(recentUrl, {
        headers: { "User-Agent": "cf-pages-steam-proxy" }
    });

    if (!res.ok) {
        const allUrl =
            "https://steamcommunity.com/profiles/" +
            steamId +
            "/games/?tab=all&xml=1";

        res = await fetch(allUrl, {
            headers: { "User-Agent": "cf-pages-steam-proxy" }
        });
    }

    const text = await res.text();

    return new Response(text, {
        headers: {
            "Content-Type": "text/xml",
            "Cache-Control": "public, max-age=120"
        }
    });
}