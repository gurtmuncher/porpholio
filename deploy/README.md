# Deploying to a VPS

Runs the Hono SSR server behind Caddy (auto HTTPS), managed by systemd.
Assumes Ubuntu 22.04/24.04 and a domain on Cloudflare.

## 0. Get a VPS
Hetzner (cheapest), DigitalOcean, or Vultr. Smallest plan is plenty.
Note the server's public IP.

## 1. Point DNS (Cloudflare)
Add an A record:  `me`  ->  `<VPS_IP>`  (DNS only / grey cloud while setting up).

## 2. SSH in and install Node + Caddy
```
ssh root@<VPS_IP>

curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs git

apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt-get update && apt-get install -y caddy
```

## 2b. Firewall (only allow ssh + web)
```
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable
```

## 3. Create a non-root user and clone the repo
```
adduser --disabled-password --gecos "" portfolio
su - portfolio
git clone https://github.com/gurtmuncher/portfolio.git
cd portfolio
npm ci
exit
```

## 4. Install the systemd service
```
cp /home/portfolio/portfolio/deploy/portfolio.service /etc/systemd/system/portfolio.service
systemctl daemon-reload
systemctl enable --now portfolio
systemctl status portfolio        # should say active (running)
curl -s localhost:3000 | head     # should print the site's HTML
```

## 5. Point Caddy at it
Edit the domain in deploy/Caddyfile first, then:
```
cp /home/portfolio/portfolio/deploy/Caddyfile /etc/caddy/Caddyfile
systemctl reload caddy
```
Caddy fetches an HTTPS cert automatically. Visit https://me.degloved.net

## Updating later
```
su - portfolio -c 'cd portfolio && git pull && npm ci'
systemctl restart portfolio
```

## Notes
- visits.json is written in the repo dir by the `portfolio` user — keep it writable.
- Once it works, you can flip Cloudflare DNS to proxied (orange cloud) and set
  SSL/TLS mode to Full (strict).
