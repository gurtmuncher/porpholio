export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);

    const appid = url.searchParams.get("appid");

    if (!appid) {
        return new Response("Missing appid", { status: 400 });
    }

    const steamUrl = `https://store.steampowered.com/api/appdetails?appids=${appid}`;

    const steamRes = await fetch(steamUrl, {
        headers: {
            "User-Agent": "Mozilla/5.0"
        }
    });

    const data = await steamRes.text();

    return new Response(data, {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    });
}
