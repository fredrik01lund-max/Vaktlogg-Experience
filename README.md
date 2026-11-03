# VAKTLOGG EXPERIENCE — *Behind the Shift*

En filmatisk, interaktiv eksamenspresentasjon om hvordan **Vaktlogg** vokste frem gjennom Design Thinking. Den er ikke et lysbildesett, men én sammenhengende digital fortelling på 12 minutter. Tre presentatører, ekte fotografier fra restaurantbransjen, stille filmsekvenser, et designvalg sensor tar selv og den ekte prototypen live midt i fortellingen.

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

| # | Tid | Scene | Hvem | Hva skjer – og hvorfor |
|---|---|---|---|---|
| 1 | 0:00 | Restaurantåpningen | stille | Bonger ruller inn på kjøkkenskinnen mens klokka går fra 16:00 til 23:30 og tempoet øker. Så blir det stille: «Vakten er over. Hva sitter hun igjen med?» Virker uten lyd. |
| 2 | 0:22 | Behind the shift | A | Tittel, navn, utgangspunktet *sykefravær*. |
| 3 | 0:55 | Menneskene bak innsikten | A | Fotomosaikk av menneskene, de fire innsiktskildene, og grepet med «travel vakt som føltes bra / dårlig». |
| 4 | 1:47 | Portrett og sitat | A | *Cinematic portrait reveal* og det dokumenterte sitatet, holdt adskilt fra personen på bildet. |
| 5 | 2:17 | Fra foto til data | A | Et bilde fryses, og innsiktene tegnes rundt servitøren. Skritt (selvrapportert) og kassarapporten (observert) blir til tre temaer. |
| 6 | 3:12 | Problemet snur | A → B | Flippbokstaver: SYKEFRAVÆR blir MOTIVASJON (begge har ti bokstaver). Regissert overlevering fra A til B. |
| 7 | 3:51 | Theodora | B | Fiktiv persona, brukerreisen i fire faser og «etter vakten» som mulighetsrom. |
| 8 | 4:41 | Strava for jobben | B | Første idé, og historien om 5 000 ekstra skritt og tre flasker vin. |
| 9 | 5:13 | To innsikter, én idé | stille → B | Skrittene blir ringen og salget blir V-en i Vaktlogg-merket. Gnisten til slutt er anerkjennelsen. |
| 10 | 5:35 | Innsikt blir prinsipper | B | Seks designprinsipper. Hvert viser hva det kom fra og hvor det ligger i prototypen. |
| 11 | 6:17 | Du tar designvalget | B + sensor | Sensor velger hvordan en konkurranse blir rettferdig. Så vises innsikt → beslutning → funksjon. |
| 12 | 6:47 | Prototypen | stille → C | Blender-filmen: telefonen kommer frem, og kameraet kjører inn til den **ekte** prototypen tar over. Forklaringen ved siden av følger med på hvor C er i appen. |
| 13 | 8:33 | Testing og iterasjon | C | Hvem som har testet, gjennomført mot planlagt, tidslinjen og gjesteinfo som avgrensningsdilemma. |
| 14 | 9:35 | NABC | C | Need, Approach, Benefits (merket som hypoteser), Competition. |
| 15 | 10:16 | Hva vi vet – og ikke vet | A | Hørt og sett / tror / må teste, pluss begrensningene. |
| 16 | 10:58 | Videre | B | Spørsmålene som gjenstår, og en mulig pilot. |
| 17 | 11:30 | Avslutning | A, B, C | Bongskinnen kommer tilbake. Siste bong: «Vakt ferdig – du ble sett». |

Tid per presentatør (fra `npm run sjekk`): **A ≈ 3:41 · B ≈ 3:46 · C ≈ 3:27**, stille sekvenser ≈ 0:56, sensor ≈ 0:10. Fordelingen følger forslaget (A problem og innsikt, B Design Thinking og konsept, C prototype og testing). A kommer tilbake på slutten med refleksjonen over innsiktsarbeidet, og B med veien videre, så alle tre er med i hele buen.

Hver animasjon skal forklare noe. Flippbokstavene viser omdefineringen, frysbildet viser at innsiktene kommer fra arbeidsdagen, sammensmeltingen viser hvordan to innsikter ble én idé, og iterasjonssløyfen viser at prosessen ikke var lineær. Design Thinking-fasen vises diskret øverst til venstre, med en pil tilbake når vi tester.

---

## Slik fremfører dere

1. Åpne presentasjonen på projektoren, trykk **F** (fullskjerm) og **P** (presentatørvisning). Dra presentatørvinduet til den bærbare skjermen.
2. Presentatørvisningen skal vise **«Hovedskjerm tilkoblet»** og **«Film lastet»**.
3. Trykk **Nullstill demo**. Prototypen står da på «Hei Emma», uten Sir Domeos omvisningsspørsmål.
4. Start med klikkeren (→ / PageDown). Stille sekvenser går videre av seg selv. Overalt ellers er det ett klikk per takt.

| Tast | Hva |
|---|---|
| → mellomrom PageDown | Neste. Virker også mens fokus er inne i prototypen. |
| ← PageUp | Forrige |
| 1–4 | Sensors valg i «Du tar designvalget» (knapper i presentatørvisningen også) |
| B eller . | Svart skjerm |
| O | Oversikt: hopp til en scene |
| R | Last prototypen på nytt med rene data |
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

> Fra fil (`file://`) virker presentatørvinduet via `postMessage` når det åpnes med **P**. Forklaringspanelet i demoen viser da første tekst og følger ikke med i appen, fordi nettleseren skiller filene. Vil dere ha alt, start en lokal server i mappen, f.eks. `npx serve dist-eksamen`.

---

## Fotografier

Fotografiene legges inn uten å endre kode. Alt styres av [`public/foto/foto.js`](public/foto/foto.js), som har plass til

- 3 glimt i åpningen
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

## Teknikkvalg

| Behov | Valg | Hvorfor |
|---|---|---|
| Telefonen som avsløres (sekvens 3) | **Blender** (Cycles, CPU) → MP4 | Ekte metall, glass, kantlys og dybdeskarphet, som er vanskelig å få troverdig i nettleseren. Filmen endrer seg ikke, så den kan rendres én gang. |
| Fotografier i dybde (konsept D) | **Nettleseren** (CSS-lag og bevegelse) | Bildene kommer senere og skal kunne byttes uten ny rendering. En Blender-scene måtte rendres på nytt for hvert nytt bilde, og en ny kamerabevegelse ville gitt en ny fil. Med 2,5D-lag i CSS blir effekten den samme uten at noe må lages på nytt. |
| Data og innsikt | **SVG + Motion** | Tallene og tekstene skal være riktige og redigerbare, og skarpe på alle skjermer. |
| Overgangen til prototypen | **Film + ekte iframe** | Filmen ender med skjermen på et kjent sted (`src/lib/telefon.json`). Den ekte prototypen ligger klar nøyaktig der og tones inn over siste bilde. |

### Blender-filmen

[`blender/telefon_reveal.py`](blender/telefon_reveal.py) bygger hele scenen med kode: telefonen, materialene, lyset, kamerabanen og tidslinjen. Den er reproduserbar.

```bash
blender --background --factory-startup --python blender/telefon_reveal.py -- bygg    # lager telefon.blend
blender --background --factory-startup --python blender/telefon_reveal.py -- test    # prøvebilder
blender --background --factory-startup --python blender/telefon_reveal.py -- render  # 300 bilder
blender --background --factory-startup --python blender/telefon_reveal.py -- film    # -> public/film/telefon.mp4
```

Skjermbildet på telefonen er `blender/skjerm.png`, prototypens startskjerm i 1170 × 2532. Endres startskjermen, tas et nytt bilde og filmen rendres på nytt.

**Lastetid:** filmen hentes helt ned når presentasjonen åpnes, og presentatørvisningen sier fra når den er klar. Ingen video venter på nett midt i fremføringen.

---

## Innhold og kilder

- **Ett manus for alt:** [`src/content/manus.ts`](src/content/manus.ts) styrer hovedskjermen, presentatørvisningen og det utskrevne manuset. Kildene står i [`src/content/kilder.ts`](src/content/kilder.ts).
- **Tidsplanen:** `npm run sjekk` sjekker at summen er 12:00, at A, B og C har omtrent like mye tid, og at sensordelen holder seg under 30 sekunder. Den kjøres også før hver publisering.
- **Navn og tall:** [`public/oppsett.js`](public/oppsett.js) har navnene, antall transkriberte intervjuer (tom til det er sjekket), testmiljøene, dokumenterte testfunn, valgfri lyd og lenken til prototypen. Filen kan endres også i den ferdige eksamensmappen.

### Hva som er dokumentert

- Alle funn, sitater og tall kommer fra prosjektbeskrivelsen (Dok. A) og prototypen.
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
```

Vite + React + TypeScript, [Motion](https://motion.dev) for animasjon, Fraunces/Inter/JetBrains Mono som lokale fonter. Lerretet er 1920 × 1080 og skaleres til skjermen, så komposisjonen er lik på alle projektorer. Andre formater får svarte kanter.

Publiseres automatisk til GitHub Pages ved push til `main` (`.github/workflows/deploy.yml`).
