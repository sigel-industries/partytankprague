const TRANSLATIONS = {
  en: {
    nav_routes: "Routes", nav_car: "The Car", nav_gallery: "Gallery", nav_pricing: "Pricing", nav_faq: "FAQ", nav_reserve: "Reserve",

    hero_eyebrow: "Prague & Central Bohemia · Private chauffeur",
    hero_title: "The street stopped.<br>Then it saw the <em>Hummer.</em>",
    hero_sub: "Sixteen guests inside, mini-bar cold, sound system loud — one stag night that started the second the doors opened. That's the ride we build for every crossing of Prague, every route into Bohemia: not a rental, an entrance.",
    hero_cta1: "Reserve your route", hero_cta2: "See the routes",

    trust1: "guests on board", trust2: "stretched Hummer H2", trust3: "routes, Prague & Bohemia", trust4: "night, fully planned with you",

    man_eyebrow: "— What you're actually booking —",
    man_quote: "Not a taxi. Not a tour bus.<br><em>A route, designed around your occasion.</em>",
    man_body: "Pickup, road, music, the stops worth stopping for, and an arrival people remember. Tell us the occasion — stag do, wedding, birthday, a night out, or simply a tour of Prague and the hills beyond it — and we build the route around it.",

    routes_eyebrow: "Four ways to use the car", routes_h2: "Choose your route.",
    r1num: "01", r1title: "Prague After Dark",
    r1text: "Old Town, the riverbank, the castle skyline lit up across the water. A slow, deliberate pass through the city's best backdrop, windows down, the cabin already alive.",
    r1m1: "1–3 hours", r1m2: "City of Prague", r1m3: "Up to 16 guests",

    r2num: "02", r2title: "Bohemian Day",
    r2text: "Out past the city limits — Karlštejn, vineyard roads, river valleys. A daytime route for groups who want the countryside and the car in the same memory.",
    r2m1: "Half / full day", r2m2: "Central Bohemia", r2m3: "Up to 16 guests",

    r3num: "03", r3title: "Airport & VIP Transfer",
    r3text: "Landing in Prague or heading out — start or end the trip the way it should feel. Airport pickup, hotel run, or a straight VIP transfer, with the entrance built in.",
    r3m1: "By the hour", r3m2: "Airport · Hotel · Venue", r3m3: "Up to 16 guests",

    r4num: "04", r4title: "Your Occasion",
    r4text: "Stag and hen parties, weddings, birthdays, a proper night out — built entirely around your timeline, your stops, your people. Car decoration for weddings on request. If it fits in the car, we'll route it.",
    r4m1: "Custom duration", r4m2: "Prague or Bohemia", r4m3: "Up to 16 guests",
    rlink: "Reserve this route →",

    map_eyebrow: "The territory", map_h2: "Prague to the hills of Bohemia.",
    map_sub: "One car, two directions. The city route stays inside Prague; the Bohemian route runs out past Karlštejn into vineyard country. Either way, we plan the stops with you before the date.",

    veh_eyebrow: "The vehicle", veh_h2: "Hummer H2 Long.<br>White. Nine metres.",
    veh_lead: "One car, built to be seen from across the bridge, and to disappear into a private lounge the moment the door closes. Full-length retractable windows, strobe lighting and fog on request — the cabin sets the mood before the route even starts.",
    veh_dt1: "Capacity", veh_dd1: "Up to 16 guests, wraparound leather lounge",
    veh_dt2: "On board", veh_dd2: "Mini-bar, full sound system, mood & strobe lighting",
    veh_dt3: "Windows", veh_dd3: "Full-length retractable, tinted privacy glass",
    veh_dt4: "Extras", veh_dd4: "Fog effect, wedding decoration on request",
    veh_dt5: "Length", veh_dd5: "9 metres of stretched Hummer H2",
    veh_cta: "Check availability",

    proc_eyebrow: "How it works", proc_h2: "Four steps, no surprises.",
    proc1h: "Tell us the date", proc1p: "Occasion, group size, rough idea of the route — Prague, Bohemia, or both.",
    proc2h: "We route it", proc2p: "Pickup point, stops, timing and music sorted around your event, confirmed by message.",
    proc3h: "You ride", proc3p: "We arrive on time, drinks cold, and drive the route exactly as planned.",
    proc4h: "You arrive", proc4p: "On schedule, in a 9-metre white Hummer, with a story for the rest of the night.",

    gal_eyebrow: "The mood", gal_h2: "Night luxury, beast mode.",
    gal_sub: "Real shots from the car — more added as fresh photography comes in.",

    proof1: "\u201cPicked us up right on time, the whole street stopped to look. Best entrance any of us has ever had.\u201d",
    proof1c: "— Stag party, Prague",
    proof2: "\u201cWe did the Bohemian route for the wedding photos at Karlštejn. Worth every crown.\u201d",
    proof2c: "— Wedding party, Central Bohemia",
    proof3: "\u201cMini-bar was stocked, music was ours, driver knew exactly where to stop for photos.\u201d",
    proof3c: "— Birthday group, Prague",
    proof_note: "Placeholder quotes — swap for real reviews once you have them.",

    price_eyebrow: "Pricing", price_h2: "Starting points, not the final word.",
    price_sub: "Example pricing below — placeholder figures to be confirmed. Final price depends on date, duration and route. Nothing is charged until everything is confirmed.",
    price1tag: "Prague After Dark", price1from: "From <strong>4 900 Kč</strong>", price1desc: "1 hour city route, up to 16 guests.",
    price2tag: "Your Occasion", price2from: "From <strong>8 900 Kč</strong>", price2desc: "2–3 hour custom route, timed around your event.",
    price3tag: "Bohemian Day", price3from: "From <strong>16 900 Kč</strong>", price3desc: "Half or full day, Prague into Central Bohemia.",
    price_link: "Request price →",
    price_note: "Figures above are illustrative placeholders — confirm and replace with real rates before launch.",

    faq_eyebrow: "FAQ", faq_h2: "Before you ask.",
    faq1q: "How many people fit inside?", faq1a: "Up to 16 guests in the wraparound lounge. Tell us your group size and we'll confirm comfort for the route.",
    faq2q: "Can the route leave Prague?", faq2a: "Yes — the Bohemian Day route runs out toward Karlštejn and the vineyard roads beyond it. Tell us what you'd like to see.",
    faq3q: "Can we bring our own drinks?", faq3a: "The on-board mini-bar is yours for the ride. Bring what you like, we'll keep it cold.",
    faq4q: "How far ahead should we book?", faq4a: "Weekends and stag/hen season fill fast — 2–3 weeks out is safest, but ask about last-minute availability.",
    faq5q: "Is the price per person or per ride?", faq5a: "Per ride, not per person — split across 16 guests it's usually less than a fleet of taxis.",

    final_cta: "Reserve your route",
    final_h2: "The car is free most nights.<br><em>Yours doesn't have to wait.</em>",

    book_eyebrow: "Booking request", book_h2: "Tell us the date.<br>We'll route the night.",
    book_sub: "This is a request, not a charge — we confirm availability and price before anything is locked in.",
    book_name: "Name", book_email: "Email", book_phone: "Phone / WhatsApp", book_date: "Date",
    book_route: "Route", book_route_choose: "Choose a route",
    book_route_1: "Prague After Dark", book_route_2: "Bohemian Day", book_route_3: "Airport & VIP Transfer", book_route_4: "Your Occasion (custom)",
    book_guests: "Guests", book_notes: "Tell us about the night",
    book_submit: "Send booking request",
    book_note: "Demo mode — connect this form to Formspree (see code comment above) to receive real requests.",

    footer_privacy: "Privacy & Cookies",
    footer_bottom: "© Party Tank Prague — a Hummer H2 routed through Prague and Central Bohemia.",

    cookie_text: "We don't use tracking or advertising cookies. This site loads Google Fonts and (if connected) Formspree to handle bookings — both may process basic technical data under their own privacy policies.",
    cookie_more: "Learn more", cookie_ok: "Got it"
  },

  cs: {
    nav_routes: "Trasy", nav_car: "Vůz", nav_gallery: "Galerie", nav_pricing: "Ceník", nav_faq: "FAQ", nav_reserve: "Rezervovat",

    hero_eyebrow: "Praha a Střední Čechy · Soukromý šofér",
    hero_title: "Ulice ztichla.<br>Pak uviděla <em>Hummer.</em>",
    hero_sub: "Šestnáct lidí uvnitř, mini-bar vychlazený, hudba nahlas — rozlučková noc, která začala ve chvíli, kdy se otevřely dveře. Takhle stavíme každou jízdu Prahou i výlet do Čech: ne pronájem, ale příjezd.",
    hero_cta1: "Zarezervovat trasu", hero_cta2: "Zobrazit trasy",

    trust1: "hostů na palubě", trust2: "dlouhý Hummer H2", trust3: "trasy, Praha a Čechy", trust4: "noc, naplánovaná s vámi",

    man_eyebrow: "— Co si vlastně objednáváte —",
    man_quote: "Není to taxi. Není to zájezdový autobus.<br><em>Je to trasa, navržená podle vaší příležitosti.</em>",
    man_body: "Vyzvednutí, trasa, hudba, zastávky, na kterých stojí za to zastavit, a příjezd, na který se nezapomíná. Řekněte nám příležitost — rozlučku, svatbu, narozeniny, pánskou/dámskou jízdu nebo prostě okruh po Praze a okolí — a trasu sestavíme na míru.",

    routes_eyebrow: "Čtyři způsoby, jak auto využít", routes_h2: "Vyberte si trasu.",
    r1num: "01", r1title: "Praha po setmění",
    r1text: "Staré Město, nábřeží, hradní siluetu nasvícenou nad vodou. Pomalý, promyšlený průjezd nejlepšími kulisami města, stažená okna, atmosféra naplno už v autě.",
    r1m1: "1–3 hodiny", r1m2: "Centrum Prahy", r1m3: "Až 16 hostů",

    r2num: "02", r2title: "Den ve Středočeském kraji",
    r2text: "Za hranicemi města — Karlštejn, vinařské cesty, údolí řek. Denní trasa pro skupiny, které chtějí krajinu i vůz v jedné vzpomínce.",
    r2m1: "Půl / celý den", r2m2: "Střední Čechy", r2m3: "Až 16 hostů",

    r3num: "03", r3title: "Letiště a VIP transfer",
    r3text: "Přílet do Prahy nebo odjezd — začněte nebo ukončete cestu tak, jak má. Vyzvednutí na letišti, jízda do hotelu, nebo přímý VIP transfer s parádním příjezdem.",
    r3m1: "Po hodinách", r3m2: "Letiště · Hotel · Místo akce", r3m3: "Až 16 hostů",

    r4num: "04", r4title: "Vaše příležitost",
    r4text: "Rozlučky se svobodou, svatby, narozeniny, pořádná noc venku — postavené přesně podle vašeho harmonogramu, zastávek a lidí. Na přání i výzdoba vozu pro svatbu. Pokud se to vejde do auta, naplánujeme to.",
    r4m1: "Doba na míru", r4m2: "Praha nebo Čechy", r4m3: "Až 16 hostů",
    rlink: "Zarezervovat tuto trasu →",

    map_eyebrow: "Území", map_h2: "Z Prahy do středočeských kopců.",
    map_sub: "Jedno auto, dva směry. Městská trasa zůstává v Praze; středočeská trasa pokračuje za Karlštejn do vinařského kraje. V obou případech zastávky naplánujeme společně předem.",

    veh_eyebrow: "Vozidlo", veh_h2: "Hummer H2 Long.<br>Bílý. Devět metrů.",
    veh_lead: "Jedno auto, které je vidět už z druhého konce mostu, a které se v okamžiku zavření dveří promění v soukromý salonek. Stahovací okna po celé délce vozu, stroboskopy a mlha na přání — atmosféra v kabině začíná dřív, než se trasa vůbec rozjede.",
    veh_dt1: "Kapacita", veh_dd1: "Až 16 hostů, kožený salonek po obvodu",
    veh_dt2: "Výbava", veh_dd2: "Minibar, plný zvukový systém, světelné a stroboskopické efekty",
    veh_dt3: "Okna", veh_dd3: "Stahovací po celé délce, tónované sklo",
    veh_dt4: "Doplňky", veh_dd4: "Mlhový efekt, výzdoba na svatbu na přání",
    veh_dt5: "Délka", veh_dd5: "9 metrů prodlouženého Hummeru H2",
    veh_cta: "Ověřit dostupnost",

    proc_eyebrow: "Jak to funguje", proc_h2: "Čtyři kroky, žádná překvapení.",
    proc1h: "Řekněte nám termín", proc1p: "Příležitost, počet lidí, hrubá představa trasy — Praha, Čechy, nebo obojí.",
    proc2h: "Naplánujeme trasu", proc2p: "Místo vyzvednutí, zastávky, časování i hudbu doladíme podle vaší akce, potvrdíme zprávou.",
    proc3h: "Jedete", proc3p: "Přijedeme včas, pití bude vychlazené, trasu odjedeme přesně podle plánu.",
    proc4h: "Dorazíte", proc4p: "Přesně podle plánu, v devítimetrovém bílém Hummeru, s historkou na zbytek večera.",

    gal_eyebrow: "Atmosféra", gal_h2: "Noční luxus v plné palbě.",
    gal_sub: "Reálné záběry z vozu — další přibudou, jakmile bude k dispozici čerstvá fotodokumentace.",

    proof1: "\u201eVyzvedli nás přesně na čas, celá ulice se otáčela. Nejlepší příjezd, jaký jsme kdy zažili.\u201c",
    proof1c: "— Rozlučka se svobodou, Praha",
    proof2: "\u201eAbsolvovali jsme středočeskou trasu kvůli svatebním fotkám u Karlštejna. Stálo to za každou korunu.\u201c",
    proof2c: "— Svatební hosté, Střední Čechy",
    proof3: "\u201eMinibar byl plný, hudba naše, řidič přesně věděl, kde zastavit na fotky.\u201c",
    proof3c: "— Narozeninová oslava, Praha",
    proof_note: "Zatím ukázkové reference — nahraďte skutečnými recenzemi, jakmile je budete mít.",

    price_eyebrow: "Ceník", price_h2: "Orientační ceny, ne poslední slovo.",
    price_sub: "Níže jsou orientační částky k potvrzení. Konečná cena závisí na termínu, délce a trase. Nic se neúčtuje, dokud vše nepotvrdíme.",
    price1tag: "Praha po setmění", price1from: "Od <strong>4 900 Kč</strong>", price1desc: "1hodinová městská trasa, až 16 hostů.",
    price2tag: "Vaše příležitost", price2from: "Od <strong>8 900 Kč</strong>", price2desc: "2–3hodinová trasa na míru podle vaší akce.",
    price3tag: "Den ve Středočeském kraji", price3from: "Od <strong>16 900 Kč</strong>", price3desc: "Půl nebo celý den, z Prahy do Středočeského kraje.",
    price_link: "Vyžádat cenu →",
    price_note: "Uvedené částky jsou orientační placeholdery — před spuštěním nahraďte reálnými sazbami.",

    faq_eyebrow: "FAQ", faq_h2: "Než se zeptáte.",
    faq1q: "Kolik lidí se vejde dovnitř?", faq1a: "Až 16 hostů v salonku po obvodu vozu. Řekněte nám velikost skupiny a potvrdíme komfort pro danou trasu.",
    faq2q: "Může trasa vést mimo Prahu?", faq2a: "Ano — středočeská trasa pokračuje za Karlštejn do vinařského kraje. Řekněte nám, co byste rádi viděli.",
    faq3q: "Můžeme si vzít vlastní pití?", faq3a: "Minibar na palubě je váš na celou jízdu. Vezměte si, co chcete, my to udržíme vychlazené.",
    faq4q: "Jak dopředu máme rezervovat?", faq4a: "Víkendy a sezóna rozluček se plní rychle — 2–3 týdny předem je nejjistější, ale zeptejte se i na poslední chvíli.",
    faq5q: "Je cena za osobu, nebo za jízdu?", faq5a: "Za jízdu, ne za osobu — rozpočítáno na 16 hostů to obvykle vyjde levněji než flotila taxíků.",

    final_cta: "Zarezervovat trasu",
    final_h2: "Auto je volné většinu večerů.<br><em>To vaše čekat nemusí.</em>",

    book_eyebrow: "Poptávka rezervace", book_h2: "Řekněte nám termín.<br>My naplánujeme noc.",
    book_sub: "Toto je poptávka, ne platba — dostupnost a cenu potvrdíme dřív, než se cokoliv zafixuje.",
    book_name: "Jméno", book_email: "Email", book_phone: "Telefon / WhatsApp", book_date: "Datum",
    book_route: "Trasa", book_route_choose: "Vyberte trasu",
    book_route_1: "Praha po setmění", book_route_2: "Den ve Středočeském kraji", book_route_3: "Letiště a VIP transfer", book_route_4: "Vaše příležitost (na míru)",
    book_guests: "Počet hostů", book_notes: "Řekněte nám o té noci",
    book_submit: "Odeslat poptávku",
    book_note: "Demo režim — propojte formulář se službou Formspree (viz komentář v kódu výše), abyste dostávali skutečné poptávky.",

    footer_privacy: "Soukromí a cookies",
    footer_bottom: "© Party Tank Prague — Hummer H2 po trase Prahou a Středočeským krajem.",

    cookie_text: "Nepoužíváme sledovací ani reklamní cookies. Tento web načítá Google Fonts a (pokud je propojený) Formspree pro zpracování rezervací — oba mohou zpracovávat základní technická data podle vlastních zásad ochrany soukromí.",
    cookie_more: "Více informací", cookie_ok: "Rozumím"
  }
};
