# Gamehelden

De nieuwste video's en ranglijsten van Nederlandse gaming-YouTubers. Next.js op Vercel, data in Supabase, video's en kanaalgegevens via de YouTube Data API.

Zonder instellingen draait de site met duidelijk gemarkeerde voorbeelddata en houdt hij Google buiten de deur (robots.txt), zodat je hem al kunt bekijken.

## Echte data aanzetten

1. **Supabase:** maak een (gratis) project, open de SQL Editor en voer `supabase/schema.sql` uit.
2. **YouTube API-sleutel:** Google Cloud Console > nieuw project > "YouTube Data API v3" inschakelen > Credentials > API key. Beperk de sleutel tot de YouTube Data API.
3. **Vercel:** importeer deze repo en zet bij Settings > Environment Variables de waarden uit `.env.example`.
4. Vercel roept elke ochtend `/api/cron/sync` aan. Eerste keer handmatig: `curl -H "Authorization: Bearer <CRON_SECRET>" https://<jouw-site>/api/cron/sync`

## Een creator toevoegen

Voeg in Supabase (Table Editor > creators) een rij toe met `slug`, `handle` (bijv. `@EHVgaming1`) en `games` (bijv. `{fortnite}`). De volgende sync vult de rest. Eigen tekst gaat in `bio`, de setup in `setup` als JSON:

```json
[{ "label": "Headset", "name": "Merk Model", "url": "https://jouw-affiliate-link" }]
```

## YouTube-regels waar de site zich aan houdt

- Geen eigen afgeleide cijfers (groei, scores); de ranglijst sorteert alleen op het abonneeaantal van YouTube.
- Opgeslagen YouTube-data wordt dagelijks ververst en na 30 dagen zonder verversing verwijderd.
- Advertenties en affiliate-links alleen op pagina's met genoeg eigen inhoud (bio, setup).
