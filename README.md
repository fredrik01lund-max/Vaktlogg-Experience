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
| 1 | 0:00 | Vakten ovenfra | stille | Blender-film uten ord: servitøren stempler inn på telefonen (16:00), tar brettet, og kameraet løfter seg over restauranten mens kvelden går. Gjester kommer, bongene flyr fra bordet til bongskinnen på kjøkkenet, kokkene jobber, bordene skifter farge som i appens bordkart, stearinlysene tennes – og hun legger igjen et lysende spor: skrittene. Ved stengetid slukkes lysene, hun stempler ut ved døra (23:30), sporet blir igjen, tittelen kommer. |
| 2 | 0:25 | Behind the shift | A | Tittel, navn, utgangspunktet *sykefravær*. |
| 3 | 0:58 | Menneskene bak innsikten | A | Fotomosaikk av menneskene, de fire innsiktskildene, og grepet med «travel vakt som føltes bra / dårlig». |
| 4 | 1:46 | Portrett og sitat | A | *Cinematic portrait reveal* og det dokumenterte sitatet, holdt adskilt fra personen på bildet. |
| 5 | 2:16 | Nøkkelfunn | A | Et bilde fryses, og innsiktene tegnes rundt servitøren. Skritt (selvrapportert) og kassarapporten (observert) blir til tre temaer – og rommet etter vakten, der innsatsen forsvinner. |
| 6 | 3:12 | Problemstillingen | A → B | Flippbokstaver: SYKEFRAVÆR blir MOTIVASJON (begge har ti bokstaver), og den nedkalte problemstillingen skrives frem. Regissert overlevering fra A til B. |
| 7 | 3:54 | Strava for jobben | B | Første idé, og historien om 5 000 ekstra skritt og tre flasker vin. |
| 8 | 4:27 | To innsikter, én idé | stille → B | Skrittene blir ringen og salget blir V-en i Vaktlogg-merket. Gnisten til slutt er anerkjennelsen. |
| 9 | 4:49 | Alt vi pakket inn | stille → B | Blender-film: ekte skjermbilder av funksjonene svever rundt telefonen og flyr inn i den. Så legger funksjonene seg rundt telefonen, hver med innsikten den kom fra – og grensene (prinsippene) lyser opp der de hører hjemme. |
| 10 | 5:51 | Prøv selv | stille → C → sensor → C | Blender-filmen: telefonen kommer frem, og den **ekte** prototypen tar over midt på skjermen – uten tekst ved siden av. C gir sensor en mobil, og sensor trykker seg gjennom Sir Domeos omvisning (seks stopp, med stemme). Storskjermen viser det samme som mobilen. |
| 11 | 8:51 | Frem og tilbake | C → stille → C | Blender-film: en lysende kule spretter mellom innsikt og prototype, og hvert hopp er noe som skjedde (tekstene kommer i takt). Til slutt hele mønsteret ovenfra, og hvem som har prøvd prototypen. |
| 12 | 10:08 | Hva vi vet – og ikke vet | C | Hørt og sett / tror / må teste, pluss begrensningene. |
| 13 | 10:57 | Videre | B | Spørsmålene som gjenstår, og en mulig pilot. |
| 14 | 11:33 | Avslutning | A, B, C | Bongskinnen kommer tilbake. Siste bong: «Vakt ferdig – du ble sett». |

Tid per presentatør (fra `npm run sjekk`): **A ≈ 2:58 · B ≈ 2:44 · C ≈ 2:34**, stille sekvenser (filmene) ≈ 1:34, sensor ≈ 2:10. A har problem og innsikt, B Design Thinking og konsept, C prototype, testing og refleksjon. Sensor får tid til å kjenne på tjenesten selv – det er demoens hovedgrep.

Færre scener, bedre scener: Theodora, designprinsippene, sensors designvalg, testing og NABC er **lagt til side** (ikke slettet) – se under.

Hver animasjon skal forklare noe. Flippbokstavene viser omdefineringen, frysbildet viser at innsiktene kommer fra arbeidsdagen, sammensmeltingen viser hvordan to innsikter ble én idé, og iterasjonssløyfen viser at prosessen ikke var lineær. Design Thinking-fasen vises diskret øverst til venstre, med en pil tilbake når vi tester.

---

## Slik fremfører dere

1. Koble PC-en og mobilen dere gir sensor til samme nett – en mobil-hotspot holder, internett trengs ikke. Kjør `npm run build:eksamen` og så `npm run eksamen`. Tjeneren skriver ut to adresser.
2. Åpne storskjerm-adressen på projektoren, trykk **F** (fullskjerm) og **P** (presentatørvisning). Dra presentatørvinduet til den bærbare skjermen.
3. Åpne mobiladressen på sensors mobil og sett mobilen til å ikke låse seg. Presentatørvisningen skal vise **«Hovedskjerm tilkoblet»** og **«Film lastet»**.
4. Koble til høyttaler – Sir Domeos stemme kommer fra PC-en. Trykk **Nullstill demo** rett før dere begynner.
5. Start med klikkeren (→ / PageDown). Filmene går videre av seg selv når de er ferdige. Overalt ellers er det ett klikk per takt.

| Tast | Hva |
|---|---|
| → mellomrom PageDown | Neste. Virker også mens fokus er inne i prototypen. |
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

### Sensors mobil: eksamenstjeneren

```bash
npm run eksamen
```

[`server/eksamen.mjs`](server/eksamen.mjs) serverer `dist-eksamen/` (eller `dist/`) på port 8080 og videresender sensors mobil til storskjermen over WebSocket (`/speil`). Mobilen åpner `demo/vaktlogg.html?sensor&speil=send`, og prototypen i presentasjonen (`?sensor&speil=vis`) viser det samme: side, tilstand, klokke, rulling og Sir Domeos bobler. Stemmen spilles av storskjermen. Mister mobilen forbindelsen, kobler den seg på igjen av seg selv. Uten tjener (GitHub Pages, fil) går omvisningen på storskjermen i stedet.

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
| `apning.mp4` | [`blender/apning_vakt.py`](blender/apning_vakt.py) | 25 s | «Vakten ovenfra» |
| `pakket.mp4` | [`blender/pakket_ideer.py`](blender/pakket_ideer.py) | 16 s | «Alt vi pakket inn»: ekte skjermbilder (`blender/kort/`) flyr inn i telefonen. Tidene skrives til `src/lib/pakket.json`. |
| `telefon.mp4` | [`blender/telefon_reveal.py`](blender/telefon_reveal.py) | 10 s | Telefonen som avsløres |
| `hopping.mp4` | [`blender/hopping.py`](blender/hopping.py) | 20 s | «Frem og tilbake»: kula spretter mellom innsikt og prototype. Hendelsene står i skriptet og skrives til `src/lib/hopping.json`. |

[`blender/apning_vakt.py`](blender/apning_vakt.py) (åpningen) og [`blender/telefon_reveal.py`](blender/telefon_reveal.py) (telefonen) bygger hele scenene med kode: modellene, materialene, lyset, kamerabanen og tidslinjen. De er reproduserbare, og har de samme stegene (`bygg`, `test`, `render`, `film`). Åpningens bordsettinger, servitørens rute og klokkeslettene står øverst i skriptet; tidspunktene presentasjonen trenger skrives til `src/lib/apning.json`.

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
- **Tidsplanen:** `npm run sjekk` sjekker at summen er 12:00, at A, B og C har omtrent like mye taletid (±12 %), og at sensors omvisning holder seg under 2:30. Den kjøres også før hver publisering.
- **Lagt til side:** [`src/content/arkiv.ts`](src/content/arkiv.ts) har scenene som er tatt ut av flyten (Theodora, designprinsippene, sensors designvalg, testing, NABC og den gamle demoen der C viste prototypen selv). Ingenting er slettet – de vises fra oversikten (**O**) og står bakerst i manuset. Flytt en scene tilbake til `manus.ts` for å bruke den igjen.
- **Sir Domeos stemme:** Terje via ElevenLabs (stemmebiblioteket, Eleven v4). Replikkene står i prototypen (`src/sensor-replikker.json`), lydfilene i `public/demo/domeo/`.
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
npm run eksamen        # eksamenstjeneren med sensors mobil (etter build:eksamen)
```

Vite + React + TypeScript, [Motion](https://motion.dev) for animasjon, Fraunces/Inter/JetBrains Mono som lokale fonter. Lerretet er 1920 × 1080 og skaleres til skjermen, så komposisjonen er lik på alle projektorer. Andre formater får svarte kanter.

Publiseres automatisk til GitHub Pages ved push til `main` (`.github/workflows/deploy.yml`).
