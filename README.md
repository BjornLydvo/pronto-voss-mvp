
# Pronto Voss – MVP (Next.js)

Dette er ein klikkbar MVP for Pronto Voss: kundeweb med multikorg, km‑soner for levering, enkel checkout‑demo, samt portal for bedrift, sjåfør og admin – med enkle mock‑API.

## Køyre lokalt
1. Installer Node 18+ (eller 20+).
2. Pakk ut zip → åpne mappe i terminal.
3. Kør `npm install`
4. Kør `npm run dev`
5. Opne https://localhost:3000 i nettlesaren.

## Sider
- `/` – Handle (legg varer frå fleire bedrifter, juster km‑soner og prisar)
- `/cart` – Handlekurv og «betal (demo)» → oppretter ordre
- `/merchant` – Bedrift kan **godta/avvise** + **pause** levering
- `/driver` – Sjåfør ser kø og trykker **Den tar eg**
- `/admin` – Oversikt over ordrer og kø
- `/policy` – Lenker til PDF for personvern og vilkår

## Viktig
- Dette er ein DEMO (ikkje ekte betaling). Data lever i minnet og nullstillast ved omstart.
- Språk: Bokmål/Engelsk (brytar i toppmeny).
- Leveringssoner: 3 prissoner i UI (kan seinare gjerast per bedrift i Admin).
- Neste steg: Kople på Vipps/Nets/PayPal, database, innlogging og utskriftsstøtte.
