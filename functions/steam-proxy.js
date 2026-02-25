export async function onRequest(context) {
    const request = context.request

    const url = new URL(request.url)

    let steamId =
        url.searchParams.get("id") ||
        url.searchParams.get("steamId") ||
        url.searchParams.get("steam_id")

    if (!steamId) {
        const parts = url.pathname.split("/")

        steamId = parts[parts.length - 1]
    }

    if (!steamId || !/^\d+$/.test(steamId)) {
        return new Response("missing or invalid steam id", {
            status: 400,
        })
    }

    const steamUrl =
        "https://steamcommunity.com/profiles/" +
        steamId +
        "/?xml=1"

    const res = await fetch(steamUrl, {
        headers: {
            "User-Agent": "cf-pages-steam-proxy",
        },
    })

    const text = await res.text()

    return new Response(text, {
        headers: {
            "Content-Type": "text/xml",
            "Cache-Control": "public, max-age=60",
        },
    })
}