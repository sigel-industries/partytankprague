# Party Tank Prague — website

Statický one-page web pre Party Tank Prague. Beží na GitHub Pages, žiadny backend.

## Štruktúra

```txt
index.html
privacy.html
assets/
  style.css
  script.js
  translations.js
  hummer-exterior.jpg, hummer-interior.jpg
  gallery-3.jpg, gallery-4.jpg, gallery-5.jpg
  bohemia-field.jpg
  icon-*.png, og-image.jpg
img/               (staré nepoužité SVG z predošlej verzie bez fotiek — dá sa zmazať)
```

`index.html` načíta CSS/JS z `assets/`, nie z rootu.

## Čo je hotové

- moderný one-page vizuál, responzívny layout
- EN/CZ prepínač (assets/translations.js)
- animácie, reveal efekty, parallax, magnetic buttons
- reálne fotky v hero, routes, vehicle aj gallery sekcii
- booking form pripravený na Formspree napojenie
- GitHub Pages ready

## Čo ešte nie je produkčné — pred launchom doplniť

1. **Formspree ID** — v `index.html` nájdi `action="https://formspree.io/f/YOUR_FORM_ID"`
   a nahraď reálnym ID zo svojho Formspree účtu. Bez toho formulár beží len v demo režime.
2. **Firemné údaje v pätičke a v `privacy.html`** — chýba IČO, registrovaný názov firmy, adresa.
   Bez toho web pôsobí anonymne a nespĺňa české požiadavky na e-shop/službu.
3. **Telefón / WhatsApp / Instagram** — over, že `+420702201572` skutočne berie hovory/WA správy
   pod týmto biznisom, a nahraď placeholder odkaz na Instagram (momentálne vedie na obecný instagram.com).
4. **Testimonials** (sekcia `.proof`) — sú explicitne označené ako placeholder, nahradiť reálnymi recenziami.
5. **Ceny** (sekcia `.pricing`) — potvrdiť reálne sadzby pred spustením marketingu.

## GitHub Pages

Repo → Settings → Pages → Source: Deploy from branch → Branch: `main` → Folder: `/root`.
