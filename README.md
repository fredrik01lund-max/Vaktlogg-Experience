# VAKTLOGG EXPERIENCE — *Behind the Shift*

En filmatisk, interaktiv eksamenspresentasjon om hvordan **Vaktlogg** vokste frem gjennom Design Thinking. Den er ikke et lysbildesett, men én sammenhengende fortelling på rundt ti minutter i ti scener. Tre presentatører, tre korte Blender-filmer fra den samme restauranten, og den ekte prototypen midt i – der sensor selv trykker seg gjennom den på en mobil, mens storskjermen viser det samme.

**Live:** https://fredrik01lund-max.github.io/Vaktlogg-Experience/
**Prototypen:** https://fredrik01lund-max.github.io/Vaktlogg/ · [kode](https://github.com/fredrik01lund-max/Vaktlogg)

| Visning | Adresse | Til hva |
|---|---|---|
| Hovedskjermen | `/` | Projektoren. Trykk **F** for fullskjerm og **P** for presentatørvisningen. |
| Presentatørvisningen | `?vis=presentator` | Egen skjerm/eget vindu: hvem snakker, manus, regi, nedtelling, tid mot plan, neste overgang og kilder. |
| Manus | `?vis=manus` (`&hvem=A`) | Utskrivbart manus med tidsplan. Er også reserven hvis presentatørvinduet ikke kan brukes. |
| Fotografier | `?vis=foto` | Alle fotoplassene: status, samtykke og fokuspunkt (trykk på bildet). |

---

## Fortellingen

Publikum følger reisen fra et bredt problem (sykefravær) til et innsiktsbasert tjenestekonsept (motivasjon og anerkjennelse). Servitøren er hovedpersonen hele veien. Fortellingen åpner med en vakt, persona og brukerreise følger én servitør, og avslutningen svarer på spørsmålet åpningen stilte: *Hva sitter hun igjen med?*

| # | Scene | Hvem | Hva skjer – og hvorfor |
|---|---|---|---|
| 1 | Vakten | stille → A | Blender-film uten ord (17,5 s, merket «en tenkt fredag på en fiktiv restaurant»): servitøren stempler inn, kameraet løfter seg over restauranten mens kvelden går, og sporet der hun går blir igjen når lysene slukkes. Så tittelen, navnene og utgangspunktet: sykefravær. |
| 2 | Hvem vi snakket med | A | Kildene som en enkel tabell, et ekte utdrag fra intervjuguiden, spørsmålet som ga mest (ordrett, spørsmål 10) og sitatet (merket «språklig bearbeidet»). |
| 3 | Nøkkelfunn | A | Et stillbilde fra åpningsfilmen fryses (en stilisert figur, merket «illustrasjon»), og de tre funnene tegnes inn: bevegelse (selvrapportert), salg (observert) og anerkjennelse – og rommet etter vakten, der nesten ingenting skjedde. |
| 4 | Problemstillingen | A → B | Flippbrettet: SYKEFRAVÆR blir MOTIVASJON (ti bokstaver begge), og problemstillingen. |
| 5 | Fra Strava til Vaktlogg | B | Den første ideen, vinhistorien fortalt slik den står i intervjuet, merket som bygges av skritt og salg – og beslutningen: fire måter å gjøre en konkurranse rettferdig på, to valgt bort, og ingen konkurranser om alkohol. |
| 6 | Det vi prioriterte | B | Innsikt → funksjon, med opphav (observert, selvrapportert, fortalt, vår tolkning) og ekte skjermbilder fra prototypen. |
| 7 | Prøv selv | stille → C → sensor → C | Blender-film (7 s): telefonen ligger på servitørens brett like før vakten, ved siden av kaffen og vaktlista. Skjermen våkner, og kameraet legger seg rett over den. Den **ekte** prototypen tar over nøyaktig der. Sensor trykker seg gjennom Sir Domeos omvisning på en mobil, og storskjermen viser det samme. |
| 8 | Frem og tilbake | stille → C | Blender-film (12 s): kula spretter mellom innsikt og prototype og skriver ut en bong med dato for hver versjon. Under sporet kommer parene «vi så → vi endret», og hvem som har prøvd prototypen. |
| 9 | Hva vi vet, og hva nå | C | Sett / tror / må teste, svakhetene i materialet, og spørsmålene en pilot skal svare på. |
| 10 | Avslutning | A, B, C | Bongskinnen kommer tilbake. Siste bong: «Vakt ferdig». |

Tid (fra `npm run sjekk`): **planlagt 9:47**, med margin til 10:00 og 2:13 til den harde grensen på 12:00. A, B og C har omtrent like mye å si (304, 266 og 294 ord), filmene og animasjonene tar cirka 0:54, og sensor får 2:10 i prototypen.

Scenene som er tatt ut eller slått sammen, er **lagt til side** (ikke slettet) – se under.

Hver animasjon skal forklare noe. Flippbrettet viser omdefineringen, frysbildet viser at funnene kommer fra arbeidsdagen, merket viser hvordan skritt og salg ble én idé, og hoppefilmen viser at prosessen gikk frem og tilbake mellom innsikt og prototype. Design Thinking-fasen står diskret øverst til venstre.

---

## Slik fremfører dere

0. **Kvelden før (én gang):** `npm run build:eksamen`, slett `dist-eksamen-trygg` og kopier `dist-eksamen` dit. Kjør hele presentasjonen gjennom én gang mot den kopien. Ikke bygg på eksamensdagen.
1. **På eksamensdagen:** velg én av to måter (se «Sensors mobil» under).
   - **Med internett:** åpne https://fredrik01lund-max.github.io/Vaktlogg-Experience/ på PC-en. Sensors mobil åpner `fredrik01lund-max.github.io/Vaktlogg-Experience/s` og skriver koden som står i presentatørvisningen. Mobilen husker koden.
   - **Uten internett (reserve):** koble PC-en og mobilen til samme nett (en mobil-hotspot holder). Kjør `npm run eksamen`. Tjeneren bruker den frosne kopien `dist-eksamen-trygg`, skriver når den ble bygget, og sier fra hvis en film eller lydfil mangler. Sensors adresse er kort: `http://<IP>:8080/s`.
2. Win+P → «Utvid». Åpne storskjerm-adressen, trykk **P** (presentatørvisning) og dra presentatørvinduet til den bærbare skjermen. Klikk så på hovedvinduet på projektoren og trykk **F** (fullskjerm), og klikk til slutt på presentatørvinduet så klikkeren styrer derfra. Virker ikke «Utvid» (bare «Dupliser»): kjør bare hovedvinduet i fullskjerm og ha manuset på papir (`?vis=manus`).
3. Åpne adressen på sensors mobil. På mobilen: automatisk lås av, Ikke forstyrr på, fullt batteri. PC-en: lader i. Presentatørvisningen skal vise **«Hovedskjerm tilkoblet»**, **«Film lastet»** og **«Sensors mobil tilkoblet»** (vises fra start).
4. Koble til høyttaler og velg den som lydenhet i Windows etter at projektoren er koblet til – Sir Domeos stemme kommer fra PC-en. Trykk **Test lyd** i presentatørvisningen, og igjen etter enhver omlasting. Til slutt **Klar til start** (venteskjermen, klokka på 0:00). Er presentasjonen allerede i gang, spør knappen før den nullstiller.
5. Start med klikkeren (→ / PageDown). Filmene går videre av seg selv når de er ferdige. Overalt ellers er det ett klikk per takt.

| Tast | Hva |
|---|---|
| → mellomrom PageDown Enter | Neste. Virker også mens fokus er inne i prototypen. |
| ← PageUp | Forrige |
| B eller . | Svart skjerm |
| O | Oversikt: hopp til en scene. Under «Lagt til side» ligger scenene som er tatt ut – Esc lukker |
| R | Last prototypen på nytt med rene data, og start omvisningen på sensors mobil på nytt |
| L | Skjul/vis tekst på fotoplassholdere |
| H | Hjelp |

Klikkerens «spill av»-knapp sender F5 eller Esc. Begge er fanget, så siden lastes aldri på nytt midt i fremføringen. Tilstanden lagres også, så en omlasting fortsetter der dere var.

**Presentatørvisningen** viser:

- hvem som snakker, med farge per person
- manus for alle takter i scenen, med den nåværende fremhevet
- regi og når en animasjon går («Vent – 5 s»)
- når dere skal være stille, og når en annen tar over
- neste takt og neste person
- overgangen og kildene som støtter påstandene
- tid mot plan («0:12 bak planen»)
- en tidslinje der du kan trykke for å hoppe

Vinduene snakker sammen via `BroadcastChannel` og `postMessage`. Det virker uten nett og uten server.

### Uten nett: eksamensmappen

```bash
npm run build:eksamen
```

Lager `dist-eksamen/`. Det er én `index.html` med all kode og alle fonter, pluss `film/`, `foto/`, `demo/` og `lyd/`. Kopier mappen til en minnepinne og åpne `index.html` med dobbeltklikk. Prototypen ligger med i mappen, så demoen virker uten nett. Bilder som bare er klarert for eksamen (se under) kommer bare med her.

> Fra fil (`file://`) virker presentatørvinduet via `postMessage` når det åpnes med **P**, og omvisningen med Sir Domeo går på storskjermen (sensor eller C trykker på den). Sensors mobil krever eksamenstjeneren under.

### Sensors mobil

Sensor trykker på en mobil, og prototypen i presentasjonen (`?sensor&speil=vis`) viser det samme: side, tilstand, klokke, rulling og Sir Domeos bobler. Stemmen spilles av storskjermen. Mister mobilen forbindelsen, kobler den seg på igjen av seg selv. Er ingen mobil koblet til, går omvisningen på storskjermen, og sensor eller C trykker der.

**Med internett (GitHub Pages, eller fil og `npm run dev`):** mobilen og storskjermen møtes via et relé over internett, i et «rom» med en kort kode.

- Koden lages første gang presentasjonen åpnes på en PC, og huskes der. Den står i presentatørvisningen og under H. `?rom=<kode>` på hovedskjermen setter en bestemt kode.
- Mobilen åpner `fredrik01lund-max.github.io/Vaktlogg-Experience/s` og skriver inn koden én gang. Deretter husker den koden, så `/s` holder. `/s/?ny` viser skjemaet igjen, og `/s/#<kode>` hopper over det.
- Reléet er offentlige MQTT-meglere (HiveMQ og EMQX) over WebSocket med TLS. Det trengs ingen konto. Begge brukes samtidig, så det holder at én svarer. Meldingene er demotilstanden til den fiktive restauranten, og emnet er en hash av koden. Koden ligger i [`src/lib/rele.ts`](src/lib/rele.ts) og [`src/lib/mobil.ts`](src/lib/mobil.ts).
- Krever internett på både PC-en og mobilen. De trenger ikke være på samme nett.

**Uten internett: eksamenstjeneren**

```bash
npm run eksamen
```

[`server/eksamen.mjs`](server/eksamen.mjs) serverer `dist-eksamen-trygg/` (ellers `dist-eksamen/` eller `dist/`) på port 8080 og videresender sensors mobil til storskjermen over WebSocket (`/speil`). PC-en og mobilen må være på samme nett. Mobilen åpner `http://<IP>:8080/s`, som sender den til `demo/vaktlogg.html?sensor&speil=send`.

---

## Fotografier

Fotografiene legges inn uten å endre kode. Alt styres av [`public/foto/foto.js`](public/foto/foto.js), som har plass til

- 8 bilder i mosaikken
- 1 portrett
- 1 servitør i arbeid (foto → data)
- 1 sluttbilde

| Funksjon | Hvordan |
|---|---|
| Bytte bilde | Legg filen i mappen, skriv filnavnet i `fil`, og last siden på nytt. |
| Stående og liggende | Rammene er ikke låst til format. Bildet beskjæres automatisk (`object-fit: cover`). |
| Fokuspunkt | `fokus: [x, y]` (0–1). Beskjæringen og kamerabevegelsen holder dette punktet med. Sett det ved å trykke på bildet i `?vis=foto`. |
| Bildetekst og kreditering | `tekst` og `kreditering` |
| Subtil bevegelse | Sakte inn, sakte ut eller drift per scene. Valgfrie dybdelag (`lag`) gir 2,5D-parallakse. |
| Felles uttrykk | `behandling` (metning, kontrast, lysstyrke, varme) gjelder alle bildene. `justering` gjelder ett bilde. |
| Mangler bildet | En rolig, varm plassholder (aldri et KI-ansikt) som sier hva som skal inn. **L** skjuler teksten. |
| Fotoet til «foto → data» | `punkter` sier hvor merkelappene (bevegelse, skritt, oppgaver, salg, anerkjennelse) peker. |

### Etikk og samtykke

- **To mapper.** `public/foto/` ligger i git og publiseres. Bruk den **bare** når alle på bildet har sagt ja til offentlig publisering. `foto-eksamen/` er *ikke* i git. Den kommer bare med i eksamensmappen og ved lokal øving.
- **To samtykker.** `samtykke.eksamen` og `samtykke.offentlig` sjekkes hver for seg. Den offentlige siden viser bare `offentlig: true`. Eksamensversjonen viser `eksamen: true`.
- **Sitater.** `kanKnyttesTilSitat` er `false` som standard. Portrett og sitat holdes da visuelt adskilt, og teksten sier at personen på bildet ikke er den som siteres. Sett `true` bare når personen har sagt sitatet *og* har gitt tillatelse til koblingen.
- **Ingen manipulering.** Fargebehandlingen er lik for alle bilder. Ingen retusjering, utklipp fra sammenhengen eller generert innhold om virkelige personer.
- **Ingen sensitive koblinger.** Sitater og funn står med rolle («Servitør, intervju»), aldri med navn eller arbeidssted.

---

## Typografi og uttrykk

Besley (overskrifter – en Clarendon, som på menykort og emaljeskilt) og Schibsted Grotesk (tekst – tegnet for norske aviser). Courier Prime bare der bongskriveren hører hjemme: på bongene og på stemplene som merker forbehold (SELVRAPPORTERT, OBSERVERT, ILLUSTRASJON …). Seks skriftstørrelser, ingenting under 24 px, et 12-kolonners rutenett, og ingen effektlag på lyse scener (ingen korn, bokeh, glød eller gradienttekst). Alt ligger i [`src/styles/system.css`](src/styles/system.css) og [`src/styles/flyt.css`](src/styles/flyt.css).

## Farger

Hovedtemaet er prototypens: lys bakgrunn (#f3f6f2), hvite kort, mørk grønnsvart tekst og pastellfargene med samme betydning som i appen – aktivitet/Helse rosa, salg oransje, anerkjennelse gul, laget grønt, plommefarget blekk. Mørkt brukes bevisst bare i åpningen og tittelen (natten og vakten) og i portrettet (som kommer frem fra mørket). Hver scene velger tema i `manus.ts` (`tema: 'mork'`); tokens ligger i `src/styles/base.css`.

## Teknikkvalg

| Behov | Valg | Hvorfor |
|---|---|---|
| Åpningen «Vakten ovenfra» | **Blender** (Cycles, GPU) → MP4 | En hel restaurant med lys fra ettermiddag til natt, et kamera som løfter seg og et spor som tegnes – fortellingen er fast, så den rendres én gang. Klokka og tittelen legges på i nettleseren, i takt med filmen. |
| Telefonen som avsløres, «Alt vi pakket inn» og «Frem og tilbake» | **Blender** (Cycles, GPU) → MP4 | Ekte metall, glass, kantlys og dybdeskarphet i prototypens pastell, som er vanskelig å få troverdig i nettleseren. Filmen endrer seg ikke, så den kan rendres én gang. |
| Fotografier i dybde (konsept D) | **Nettleseren** (CSS-lag og bevegelse) | Bildene kommer senere og skal kunne byttes uten ny rendering. En Blender-scene måtte rendres på nytt for hvert nytt bilde, og en ny kamerabevegelse ville gitt en ny fil. Med 2,5D-lag i CSS blir effekten den samme uten at noe må lages på nytt. |
| Data og innsikt | **SVG + Motion** | Tallene og tekstene skal være riktige og redigerbare, og skarpe på alle skjermer. |
| Overgangen til prototypen | **Film + ekte iframe** | Filmen ender med skjermen på et kjent sted (`src/lib/telefon.json`). Den ekte prototypen ligger klar nøyaktig der og tones inn over siste bilde. |

### Blender-filmene

Fire filmer, alle bygd med kode og rendret på grafikkortet (Cycles, OptiX – legg til `gpu` etter steget):

| Film | Skript | Varighet | Hva |
|---|---|---|---|
| `apning.mp4` | [`blender/apning_vakt.py`](blender/apning_vakt.py) | 17,5 s | «Vakten ovenfra». Steget `frys` lager stillbildet til Nøkkelfunn og skriver hvor servitøren, baren og gjestene står (`src/lib/frys.json`). |
| `telefon.mp4` | [`blender/telefon_bord.py`](blender/telefon_bord.py) | 7 s | Telefonen på servitørens brett like før vakten, i ettermiddagslys gjennom vinduet. Sluttbildet treffer skjermens plass nøyaktig (`src/lib/telefon.json`) og blir bakgrunnen i demoen. Skjermbildet er `blender/skjerm-sensor.png` (prototypen med Sir Domeos første boble). |
| `hopping.mp4` | [`blender/hopping_spor.py`](blender/hopping_spor.py) | 12 s | «Frem og tilbake»: kula spretter mellom innsikt og prototype og skriver ut en bong med dato for hver versjon. `blender/projiser.py` skriver hvor bongene havner i sluttbildet (`src/lib/hopping.json`), så tekstene står rett under. |

Felles håndverk (materialer, lys, avfasing, rendering og MP4 uten striper) ligger i [`blender/studio.py`](blender/studio.py). Lagt til side: `telefon_reveal.py` (den svevende telefonen), `pakket_ideer.py` (pakket-filmen) og `hopping.py` (første hoppefilm). Pakket-filmen vises fortsatt fra arkivscenen «Alt vi pakket inn».

Alle skriptene bygger hele scenene med kode: modellene, materialene, lyset, kamerabanen og tidslinjen. De er reproduserbare, og har de samme stegene (`bygg`, `test`, `render`, `film`). Åpningens bordsettinger, servitørens rute og klokkeslettene står øverst i skriptet; tidspunktene presentasjonen trenger skrives til `src/lib/apning.json`.

```bash
blender --background --factory-startup --python blender/telefon_bord.py -- bygg        # lager telefon_bord.blend
blender --background --factory-startup --python blender/telefon_bord.py -- test gpu    # prøvebilder
blender --background --factory-startup --python blender/telefon_bord.py -- render gpu  # 210 bilder
blender --background --factory-startup --python blender/telefon_bord.py -- film        # -> public/film/telefon.mp4
```

Endres prototypens startskjerm, tas et nytt skjermbilde (1170 × 2532) og telefonfilmen rendres på nytt.

**Lastetid:** filmen hentes helt ned når presentasjonen åpnes, og presentatørvisningen sier fra når den er klar. Ingen video venter på nett midt i fremføringen.

---

## Innhold og kilder

- **Ett manus for alt:** [`src/content/manus.ts`](src/content/manus.ts) styrer hovedskjermen, presentatørvisningen og det utskrevne manuset. Kildene står i [`src/content/kilder.ts`](src/content/kilder.ts).
- **Tidsplanen:** `npm run sjekk` sjekker at planen holder seg under målet (10:00) og den harde grensen (12:00), at A, B og C har omtrent like mye å si – både i planlagt tid og i antall ord (±12 %) – og at sensor får 2:00–2:30 i prototypen. Den kjøres også før hver publisering.
- **Lagt til side:** [`src/content/arkiv.ts`](src/content/arkiv.ts) har scenene som er tatt ut av flyten (Theodora, designprinsippene, sensors designvalg, testing, NABC og den gamle demoen der C viste prototypen selv). Ingenting er slettet – de vises fra oversikten (**O**) og står bakerst i manuset. Flytt en scene tilbake til `manus.ts` for å bruke den igjen.
- **Sir Domeos stemme:** Terje via ElevenLabs (stemmebiblioteket, Eleven v4). Replikkene står i prototypen (`src/sensor-replikker.json`), lydfilene i `public/demo/domeo/`.
- **Navn og tall:** [`public/oppsett.js`](public/oppsett.js) har navnene, antall transkriberte intervjuer (tom til det er sjekket), testmiljøene, dokumenterte testfunn, valgfri lyd og lenken til prototypen. Filen kan endres også i den ferdige eksamensmappen.

### Hva som er dokumentert

- Alle funn, sitater og tall kommer fra prosjektbeskrivelsen (Dok. A), de transkriberte intervjuene og intervjuguiden (kildene I1–I3 og G) og prototypen. Tall og sitater er sjekket mot transkripsjonene: «5 000» i vinhistorien er vinprisen i kroner (ikke ekstra skritt, slik Dok. A sier), og sitatet er merket «språklig bearbeidet».
- Tall som ikke er målt, er merket på skjermen («selvrapportert», «observert», «illustrasjon», «tenkt situasjon», «hypoteser»).
- Theodora er merket som fiktiv persona. Emma og Brasserie Fjordgata er fiktive.
- Innsiktsarbeidet omtales som intervjuer, samtaler, observasjoner og tester, uten et samlet antall.

---

## Utvikling

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # offentlig versjon -> dist/
npm run build:eksamen  # eksamensmappen -> dist-eksamen/
npm run sjekk          # tidsplanen
npm run eksamen        # eksamenstjeneren med sensors mobil (etter build:eksamen)
```

Vite + React + TypeScript, [Motion](https://motion.dev) for animasjon, Besley, Schibsted Grotesk og Courier Prime som lokale fonter (Fontsource, SIL Open Font License, med æ, ø og å). Lerretet er 1920 × 1080 og skaleres til skjermen, så komposisjonen er lik på alle projektorer. Andre formater får svarte kanter.

Publiseres automatisk til GitHub Pages ved push til `main` (`.github/workflows/deploy.yml`).
