# Party Tank Prague — current frontend

Kompletný statický frontend pripravený na nahratie do koreňa GitHub repozitára.

## Aktívne súbory

- `index.html`
- `privacy.html`
- `assets/style.css`
- `assets/script.js`
- `assets/translations.js`
- `assets/booking.css`
- `assets/booking.js`
- `assets/booking-config.js`
- `assets/booking-translations.js`
- obrázky, ikony a cinemagraph v `assets/`

## Booking stav

Booking wizard obsahuje vlastný kalendár, voľbu dĺžky, dostupné mock sloty,
rekapituláciu, responzívny fullscreen režim na mobile a úspešnú testovaciu obrazovku.

`assets/booking-config.js` je zatiaľ nastavený na `mode: "mock"`.
To znamená, že formulár ešte nič neposiela ani neukladá. Pred ostrým spustením
musí byť napojený Apps Script endpoint a režim zmenený na `apps-script`.
