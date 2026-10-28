# The Vindicators — Official website

Bilingual (Italian / English) website for **The Vindicators**, the rock'n'roll and garage band from Bassano del Grappa formed in 1986. It tells the band's story, lets visitors listen to two full albums in the page, and brings together a large photo archive, 100+ videos, press clippings and live dates in a bold, poster-style layout.

Live site: **https://thevindicators.it** (Italian) · **https://thevindicators.it/en/** (English)

> *Sitio web bilingüe (italiano/inglés) de The Vindicators, banda de rock'n'roll y garage de Bassano del Grappa. Diseñado, desarrollado y puesto en producción por Mildrey Ruiz. Abajo hay un resumen en español.*

---

## At a glance

| | |
|---|---|
| Pages | 18 pages plus a 404: 9 in Italian and 9 in English, translated one to one |
| Content | 434 archive photos, 101 YouTube videos plus 2 self-hosted films, 24 audio tracks (2 albums), press and news |
| Stack | HTML5, CSS3 and vanilla JavaScript, no framework and no build step |
| Hosting | Cloudflare Pages, deployed automatically from GitHub on every push |
| Languages | Italian (root) and English (`/en/`), linked with `hreflang` |
| Weight | One 31 KB stylesheet and one 19 KB script for the whole site |

## Features

### Content and navigation
- **Home:** hero with a crossfading photo slideshow, the next live date and the band's headline facts.
- **Story:** a timeline of the band's chronology from 1986 and an FAQ section.
- **The band:** members and line-up changes.
- **Records:** three records with covers, credits and tracklists. Two of them can be played in full inside the page, using a custom audio player.
- **Gallery:** 434 photos organised by year, with a sticky year navigator that follows the scroll, a stop-motion hero, polaroid-style rails and a lightbox with keyboard support.
- **Videos:** a rehearsal-room section, a live archive from 1986 to 2022 and more tracks. 101 YouTube clips load only when clicked, and the rehearsal session is self-hosted.
- **Press:** magazine clippings and online reviews, each linked to its source.
- **News:** upcoming and past dates.
- **Contact** page.

### Video, built for mobile first
- The intro and the rehearsal film are each exported twice, **horizontal and vertical** (9:16), and the page serves the right one for the device.
- Each film has its own poster frame, so the page shows an image instantly and loads the video only when needed.

### Performance and privacy
- **Click-to-play YouTube:** the player is not loaded until the visitor clicks, which saves bandwidth and avoids setting third-party cookies on page load. Videos use the privacy-enhanced `youtube-nocookie.com` domain.
- Lazy-loaded images and small, dependency-free code.
- Cache rules in `_headers`: images and media cached for days, code always revalidated, plus `nosniff` and strict referrer policy.

### SEO and visibility
- `hreflang` links between the Italian and English versions of every page and a `sitemap.xml` that lists them.
- Structured data (JSON-LD): `MusicGroup`, `MusicAlbum`, `MusicEvent` with `Offer`, `Person`, `Place` and `WebSite`, and an `FAQPage` block on the story page.
- `llms.txt` with a bilingual summary of the band, records, line-up and next date, for AI assistants and search engines (generative engine optimisation, GEO).
- Descriptive `alt` text, one `h1` per page, canonical URLs and proper-name protection so browser translation does not mangle band and song names.
- Cross-links with the sister site **frigidairetango.com**, since the band was born from the Frigidaire Tango split.

### Design and accessibility
- Poster-style identity with Anton, Barlow Condensed and Bitter typography.
- Responsive from phone to desktop, with a mobile menu.
- Keyboard-friendly dialogs and lightbox, ARIA labels, skip link and visible focus states.

## Project structure

```
the-vindicators-web/
├── index.html, story.html, band.html, records.html, photos.html,
│   videos.html, press.html, news.html, contact.html, 404.html
├── en/               English version of every page
├── assets/           style.css, site.js, videos.js, photos, press clippings,
│                     record covers, audio (2 albums), self-hosted video
├── _headers          cache and security headers
├── sitemap.xml       with hreflang alternates
├── llms.txt          summary for AI crawlers
├── robots.txt
└── README.md
```

## Marketing and growth approach

- **One story, told well:** a band active in the 1980s that is playing again needs context. The timeline, the photo archive and the press clippings turn forgotten history into content that fans, collectors and journalists can find and share.
- **Gigs front and centre:** the next date sits on the home page and is marked up as a `MusicEvent`, so search engines can show it as a live-event result.
- **Listen before you click away:** two albums play in the page, which lets a new visitor hear the band within seconds.
- **Short vertical video** ready for social media and mobile visitors.
- **Search and AI visibility:** bilingual pages, structured data and `llms.txt` help the band appear, and be cited correctly, in Italian and in English.
- **Network effect:** shared lineage with Frigidaire Tango, linked in both directions.

## Content and credits

- Design, front-end development, content structure and deployment: **Mildrey Ruiz**, as part of her work with Art Music.
- Photos, recordings, press clippings and video belong to the band and their respective authors; press and video links point to the original sources.

## Development notes

Built with an AI-assisted workflow (Claude) for drafting, review and testing. Design decisions, structure, content selection, copy approval and publishing are mine.

## License

© Mildrey Ruiz. All rights reserved. The code is published for reference as a portfolio piece. Band names, music, photographs and press content belong to their respective owners.

---

## Resumen en español

Sitio web oficial y bilingüe (italiano e inglés) de The Vindicators, publicado en thevindicators.it. Lo diseñé, desarrollé y puse en producción yo.

**Qué incluye:** historia con cronología y preguntas frecuentes, la banda y su formación, tres discos (dos se escuchan completos en la propia página), una galería de 434 fotos por años con visor a pantalla completa, más de 100 vídeos de YouTube y películas propias, prensa y noticias con las próximas fechas.

**Detalles técnicos:** HTML, CSS y JavaScript sin framework (31 KB de CSS y 19 KB de JS en todo el sitio); Cloudflare Pages con despliegue automático desde GitHub; vídeo propio exportado en horizontal y vertical con imagen de portada; YouTube que solo carga al hacer clic y usa el dominio sin cookies.

**SEO y marketing:** hreflang, sitemap, datos estructurados (grupo, discos, concierto con entradas, FAQ), `llms.txt` para buscadores con IA, y una estrategia que combina la historia de la banda, las fechas de directo y la conexión con el sitio de Frigidaire Tango.
