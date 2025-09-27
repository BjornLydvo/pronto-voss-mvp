
# Pronto Voss – Utrulling (demo)

## Alternativ 1 — Vercel (enkelt)
1. Gå til vercel.com og logg inn (GitHub-konto er fint).
2. Last opp heile prosjektmappa (drag-and-drop) eller push den til GitHub og importér repoet.
3. Framework: **Next.js** (auto). Kommandoer settes automatisk.
4. Trykk «Deploy». Etter bygg får du ein **.vercel.app** URL.

## Alternativ 2 — Netlify
1. Logg inn på Netlify og opprett nytt prosjekt frå git eller «Deploy manually».
2. Byggek kommando: `npm run build`  •  Publish directory: `.next`
3. Legg til Next.js‑plugin (ligg i netlify.toml). Deploy.

## Alternativ 3 — Docker (på eigen server eller Render/Railway)
- Lokalt/egen VPS:
  ```bash
  docker build -t pronto-voss .
  docker run -p 3000:3000 pronto-voss
  ```
- docker-compose:
  ```bash
  docker compose up --build
  ```
- Render.com: Opprett «Web Service», vel «Docker» og peik til repoet/mappa; port **3000**.
- Railway.app: «New Project» → «Deploy from GitHub» → legg til Dockerfile; port **3000**.

## Miljøvariablar
Ingen nødvendige for demoen. Når betaling blir kobla på, kjem API‑nøklar her.

## Domene
På Vercel/Netlify kan du knyte eige domene (f.eks. *prontovoss.no*) via DNS etter at demoen er oppe.
