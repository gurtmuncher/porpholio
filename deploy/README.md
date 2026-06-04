# Deploying to a VPS (Arch Linux)

Runs the Hono SSR server behind Caddy (auto HTTPS), managed by systemd.

## 0. Get the VPS + OS
Install Arch on the ExtraVM box. Note the server's public IP.

## 1. Point DNS (Cloudflare)
Add an A record:  `me`  ->  `<VPS_IP>`  (DNS only / grey cloud while setting up).

## 2. SSH in and install everything
```
ssh root@<VPS_IP>

pacman -Syu --noconfirm
pacman -S --noconfirm nodejs npm git caddy ufw
```

## 2b. Firewall (only ssh + web)
```
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable
systemctl enable --now ufw
```

## 3. Create a non-root user and clone the repo
```
useradd -m portfolio
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
Edit the domain in /home/portfolio/portfolio/deploy/Caddyfile first, then:
```
cp /home/portfolio/portfolio/deploy/Caddyfile /etc/caddy/Caddyfile
systemctl enable --now caddy
systemctl reload caddy
```
Caddy fetches an HTTPS cert automatically. Visit https://me.degloved.net

## Updating later
```
su - portfolio -c 'cd portfolio && git pull && npm ci'
systemctl restart portfolio
```

## Notes
- node lives at /usr/bin/node on Arch (matches the systemd unit).
- visits.json is written in the repo dir by the `portfolio` user — keep it writable.
- Once it works, you can flip Cloudflare DNS to proxied (orange cloud) and set
  SSL/TLS mode to Full (strict).
