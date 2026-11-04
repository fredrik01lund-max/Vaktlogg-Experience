# Nattlogg – nattøkta 3.–4. november 2026

Mål: høyere kvalitet, færre scener (8–10), rundt 10:00, mindre KI-preg, bedre Blender-filmer.
Loggen skrives fortløpende, så arbeidet kan fortsette etter en avbrytelse.

## Fase 0 – Utgangspunkt (før endringer)

- Commit `921cc9d` (live på GitHub Pages).
- 14 scener, 12:00 totalt.
  - A har 2:58, B 2:44 og C 2:34.
  - Stille sekvenser 1:34, sensor 2:10.
- Skjermbilder av alle 43 takter og kontaktark av de fire filmene ligger i scratchpad: `for/` og `film-for/`.
- Fonter i dag:
  - Presentasjonen bruker Fraunces (serif), Inter (sans) og JetBrains Mono (overtitler og merker).
  - Prototypen bruker Fraunces og Inter.
- Filmene i dag:
  - `apning.mp4`: 25 s, 30 fps, 40 samples.
  - `telefon.mp4`: 10 s.
  - `pakket.mp4`: 16 s.
  - `hopping.mp4`: 20 s, 64 samples.

## Fase 1 – Panelets viktigste funn (seks uavhengige reviewere, 89 funn)

Alle funnene ligger i scratchpad-filen `panel1.txt`.

- **Fakta (sjekket selv mot transkripsjonene):**
  - «+ ca. 5 000 skritt» er feil: i intervju 2 er 5 000 vinprisen i kroner.
  - Vinkonkurransen (sjefen lovet en premie) er klippet bort.
  - «Gikk på jobb syk for ikke å svikte kollegene» stemmer ikke helt. Hun sa «de mangler alltid folk».
  - Metodespørsmålet er omskrevet. Det ekte spørsmålet er «Hva skal til for at en travel vakt blir en god vakt i stedet for en jævlig en?».
  - Sitatet er språklig bearbeidet.
  - Emmas profilbilde er et fotorealistisk ansikt med ukjent opphav.
  - Prototypen har en rekord for «flest flasker over 1 500 kr», som motsier prinsippet om ingen konkurranser om alkohol.
- **Manus:**
  - Talen er cirka 1000 ord (A 396, B 311, C 293). For 10:00 trengs cirka 700.
  - Det er sju «ikke X, men Y», 28 tankestreker og mange slagord.
  - Kontrollen i sjekk måler plantid, ikke ord.
- **Sensor:**
  - Beslutningsleddet (alternativ → valg) er borte, og testdelen er tynn.
  - Tre scener står tomme uten foto.
  - Pakket-scenen sier «vi fylte på», ikke «vi prioriterte».
- **Art director:**
  - Fraunces, Inter og JetBrains Mono, effektlaget (korn, bokeh, blur-inn, glød, gradienttekst), mono-overtitler, pills og «·» gir KI-preget.
  - Teksten kolliderer i demoen.
  - Det er 47 skriftstørrelser.
  - Forslaget er Besley og Schibsted Grotesk, med Courier Prime bare på bongen.
- **Film:**
  - Pastellringene er klisjé. To verdener (restaurant og studio) henger ikke sammen.
  - 71 s stille film er for mye.
  - Rangering etter forbedringspotensial: pakket, så hopping, så telefon, så åpning (den sterkeste).
- **Eksamen:**
  - Det mangler en «Klar til start»-knapp, og mobilen nullstilles ikke før første demo.
  - Stemmen er stum hvis C glemmer ett klikk.
  - Presentatørvisningen viser ikke om mobilen er tilkoblet.
  - Tjeneren mangler feilhåndtering, og det finnes ingen fryst versjon (nå laget: `dist-eksamen-trygg/`).

## Fase 2 – Plan

### Ny flyt: 10 scener, planlagt cirka 9:30 og under 10:00

| # | Scene | Hvem | Innhold |
|---|---|---|---|
| 1 | Vakten | stille → A | Åpningsfilmen (merket «Illustrasjon · fiktiv restaurant») og tittelen. A sier «en tenkt fredagsvakt». |
| 2 | Hvem vi snakket med | A | Kildene som tabell, det ekte metodespørsmålet og sitatet (bearbeidet). Ingen mosaikk og ingen stille portrettpause så lenge det ikke finnes foto. |
| 3 | Nøkkelfunn | A | Frysbilde fra åpningsfilmen (stilisert figur uten ansikt) i stedet for tom fotoplass. Skritt (hovmesteren, tall slik intervju 1 sier), kassarapporten (bare det som er observert), tre temaer og rommet etter vakten. |
| 4 | Problemstillingen | A → B | Flippbrettet beholdes. B har kortere, muntlig tekst. |
| 5 | Fra Strava til Vaktlogg | B | Ideen, vinhistorien fortalt riktig, merket bygges mens B snakker, og beslutningen (fire alternativer, valget og vinen → ingen alkoholkonkurranser). |
| 6 | Det vi prioriterte | B | Ingen film. Telefon med ekte skjermbilder og fire–fem par innsikt → funksjon med opphav, og grensene. |
| 7 | Prøv selv | C + sensor | Ny, kort telefonfilm i restauranten. Stemmen er robust, mobilen nullstilles, og takten går videre automatisk når sensor trykker. |
| 8 | Frem og tilbake | C | Ny hoppefilm (12 s), deretter lesbare par «vi så → vi endret» med dato. |
| 9 | Hva vi vet, og hva nå | C → B | Sett / tror / må teste, tre svakheter, deretter spørsmål og pilot uten dobbelt innhold. |
| 10 | Avslutning | A, B, C | Ny tekst som svarer på åpningsspørsmålet. |

De gamle scenene legges i `arkiv.ts` uendret, så de fortsatt kan vises fra oversikten.

### Visuelt språk

- **Fonter:** Besley (overskrifter) og Schibsted Grotesk (tekst). Courier Prime bare på bong og stempler.
- **Skala:** seks skriftstørrelser som tokens (24/32/44/64/96/144) og et 12-kolonners rutenett.
- **Etiketter:** forbehold blir bongstempler, ikke pills. Overtitler blir vanlig tekst uten sperring.
- **Effekter:** korn, bokeh og vignett bare i åpning og tittel. Ingen blur-inn, glød eller gradienttekst.
- **Fasesporet:** vises bare i Frem og tilbake.
- **Farger:** prototypens farger beholdes (brukerens tidligere ønske), men flatt og med fast betydning.

### Filmer

1. **Telefon:** ny film i restauranten. Første versjon var lagt etter stengetid. Art directoren påpekte at det ikke stemmer med skjermen, som sier «Start vakt». Filmen er derfor flyttet til like før vakten, med ettermiddagssol gjennom et sprossevindu, kaffe og vaktlista på papir. Telefonen ligger på brettet, skjermen våkner, og kameraet ender rett ovenfra. Siste bilde blir bakgrunnen i demoen.
2. **Hopping:** ny, 12 s, med færre og lesbare hopp, ekte font, vekt i kula og banene i øvre del av bildet.
3. **Åpning:** kortere (cirka 17 s), bedre spor, bord og stoler, varm verden rundt og bongskinnen plantet.
4. **Pakket:** legges til side, og scenen erstattes uten film.

Alle filmene bygges på `studio.py` og får samme lys og materialer.

## Beslutninger

- Fargene beholder prototypens palett, fordi brukeren ba om det tidligere. Art directorens forslag om menykartong er notert i morgenrapporten.
- Demoen får fortsatt ikke tekst ved siden av telefonen, fordi brukeren ba om det. Sensor-reviewerens forslag er notert.
- Tittelen «Behind the shift» beholdes, fordi brukeren valgte den. En norsk undertittel er notert som forslag.
- Lyd i filmene: ingen nye kilder i natt, fordi ElevenLabs bare skal brukes til Sir Domeo. Notert som forslag.

## Gjort

- `blender/studio.py`: et felles håndverksbibliotek for alle filmene.
  - Materialer: tre, lin, keramikk, børstet metall, glass, papir med fibre og lysende spor.
  - Avfasing, dreide former, studiolys med tre punkter og kamera med blenderlameller.
  - Rendring: kvalitetsinnstillinger og MP4 med høy bitrate (PERC_LOSSLESS) mot striper.
  - Prøvd ut med en materialprøve. Treverket måtte justeres to ganger: først sikksakk, så kordfløyel, til slutt naturlige årer.

### Runde 1–2 (commit 6faa5a8, pushet)

- **Manus:**
  - Ti scener, planlagt 9:41.
  - Fordeling: A 265, B 253 og C 274 ord. Sensor får 2:10.
  - sjekk måler nå også ord og har grenser (mål 10:00, hard grense 12:00).
- **Faktarettelser mot transkripsjonene** (I1–I3 og guiden er lagt til som kilder).
- **Prototypen** (cfac1f4, pushet):
  - Emmas foto er tatt ut og erstattet med initial.
  - Rekordvarselet for flasker over 1 500 kr er fjernet.
  - Nye skjermbilder er tatt.
- **Sir Domeo, replikk 2:** den rettede teksten krever ny lydfil. ElevenLabs hadde logget ut, og jeg kan ikke logge inn. Teksten står derfor tilbake på det lydfilen sier (e7c487a). Ny tekst ligger i morgenrapporten.
- **Designsystem:** `system.css` og `flyt.css`. Fonter: Besley, Schibsted Grotesk og Courier Prime.
- **Eksamensdagen:**
  - Presentatørvisningen har fått «Klar til start», «Test lyd» og mobilstatus.
  - Mobilen nullstilles, og takten går videre automatisk når sensor trykker.
  - Filmene har vakt mot heng, og tjeneren er gjort robust.
- **Tester:**
  - tsc og sjekk er grønne.
  - xp-sync 18/18.
  - xp-gammel og xp-omlast er OK.

### Runde 3 – filmene (pågår)

- **Telefon (`telefon_bord.py`):**
  - Art director runde 1 ga disse endringene:
    - historien flyttet til før vakten
    - vaktlista og bongteksten synes igjen (`transform_apply` flyttet teksten bort)
    - kameraet regnes ut bilde for bilde fra én parameter, så skjermen står midt i bildet hele veien
    - dybdeskarpheten delt på 10 (1 enhet = 10 cm)
    - stearinlyset fjernet
    - gummibrett med stålkant
  - Egne funn i testbildene:
    - skjermlyset synes som en hvit prikk i glasset, så det er nå usynlig i refleksjoner
    - «opp» for kameraet blander verdens loddlinje og telefonens topp, ellers ville starten vært rotert 77°
    - barlysene varieres i dybde og styrke
    - sola faller gjennom en vegg med sprossevindu
  - Art director runde 2 sa at bildet leste som kveld: alt var ravgult, og bakgrunnen var et svart tomrom med lyspunkter. Endringer etter det:
    - varm sol, men nøytral himmel og kjølig fyllys
    - en bakvegg i dagslys med høye vinduer
    - verden synes bare i refleksjoner, så stål, glasur og lakk får noe å speile
    - termopapiret er hvitt og satinert
    - espresso med crema, og en hank som ikke er en perfekt ring
    - skjeen er fjernet
    - roligere tre
    - runde lysflekker (blenderlameller 0)
    - start på 7,5° og skarp skjerm tidligere
    - vaktlista ligger som en bevisst diagonal
  - Egen runde etterpå: brettet har fått vanlig størrelse (38 cm) og ligger slik at kanten går i en bevisst bue over øvre venstre hjørne i sluttbildet. Kaffen står på baren utenfor sluttbildet.
  - Fullrendring: 160 samples.
- **Åpning:**
  - «Utsikten» var en plate bak veggen som ovenfra svevde over den. Den er flyttet rett bak vinduene.
  - Art director runde 1 fant blant annet:
    - nøklene til kameraet lå i feil rekkefølge etter at tidslinjen ble kortet ned, så kameraet steg, dykket og steg igjen
    - hodet i nærbildet leste som en ballong
    - servitøren var en rød strek
    - feil fargegrading (AgX, mens de andre filmene bruker Standard)
    - hvite plastbord, og ikke den samme restauranten
    - flatt overskyet lys
  - Alt dette er rettet:
    - kameranøkler med absolutte tider (`nokkel` stopper nå hvis tidene ikke står i rekkefølge)
    - hår og hårknute
    - kortere lukker
    - Standard
    - mørke bordplater, der appens bordstatus er flyttet til en liten brikke
    - sol gjennom sprossevinduer under et tak kameraet ikke ser
    - kvadratiske fliser
    - gjester med hår som vender mot bordet
    - mørke kapper på snittet
  - Jeg fant også en gammel feil: sporet ble tegnet foran servitøren. Kurven hadde nullange biter der hun stod stille, så «bevel factor» tegnet hele etapper på forhånd. Sporet har nå sin egen kurve uten stillestående punkter.
  - Sporet er additivt, så gangene hun går ofte, lyser sterkere.
  - Art director runde 2 fant fire problemer:
    - Sluttbildet var rosa over alt: taket, som kameraet ikke ser, holdt på lyset fra sporet.
    - Servitøren teleporterte fortsatt, med faste 0,32 s til kjøkkenet uansett avstand.
    - Frysbildet hadde gått tilbake: hun stod liten i et hjørne.
    - Ruta leste fortsatt som en plantegning.
  - Endringer etter runde 2:
    - Taket fjernes når lyset går.
    - Hver tur tar tid etter avstanden (16 m/s i filmtid). Det fikk ikke plass, så de tre siste bordsettingene er tatt ut (10 av 13).
    - Frysbildet regnes ut fra ruta: et øyeblikk der hun serverer ved bord 16 eller 17. `frys` leser tidspunktet fra `apning.json`.
    - Sporet er tynnere og svakere per tur, og gangene sprer seg mer.
    - Roligere fliser, ekte glass på brettet og litt himmelfarge i vinduene.
    - Kameraet løfter seg over hodet hennes før det svinger ut.
  - Fullrendring: 128 samples. Den første rendringen hoppet over alt, fordi den gamle filmens 750 bilder lå i mappen. De er flyttet til `frames_apning_gammel`.
- **Telefon:** rendret, committet og pushet (f03bf94).
  - Sluttbildet er kontrollert: skjermen står midt i bildet fra 7 til 93 % av høyden, og fargen er nøyaktig #f3f6f2.
  - I demoen gikk «Styres herfra» inn i telefonen. Merkene er nå stablet nede til venstre.
  - Navnelinjen har fått en svak skygge, så den kan leses over vaktlista.
- **Hopping:**
  - Rendret (360 bilder, 45 min sammen med de andre) og committet (7ff112a).
  - Art director (runde etter fullrendring) mente det var verdt å rendre på nytt. Det ble endret:
    - sporet og kula kaster ikke skygge (skyggen tegnet en ekstra, mørk sikksakk)
    - sluttbildet er sentrert på bongene
    - samme eik og bakvegg med dagslysvinduer som telefonfilmen
    - mintbanen er kjøligere, så den ikke blir oliven i sola
    - svakere lys i kula
    - fokus på bongene, med f-tall delt på 10 (bordskala)
    - buene blir lavere når pausene blir kortere (samme tyngdekraft)
    - kula klemmes mot banen, ikke i lufta
    - to små etterhopp til slutt
    - siste bong er ferdig skrevet før kranen starter
    - samme papir og blekk som vaktlista
  - Rytmen følger ikke datoene, og docstringen påstår ikke lenger det.
  - Banenavnene legges som tekst i sluttbildet (projisert fra filmen), fordi de ellers bare synes de første sekundene.
  - I nettleseren gikk de to siste kortene i hverandre, og «Tilbakemelding» fløt ut av kortet. Kortene er smalere og har myk orddeling, og takt 2 tar dem ut, så panelet ikke dekker dem.
- **.gitignore** fanget ikke nye rendermapper (frames_telefon, test_hopark). Nå ignoreres alle `blender/frames*` og `blender/test*`. Ingenting var committet.
- **Hopping:** fullrendring pågår (360 bilder).

### Filmene ferdige (pushet)

- Hopping: 7ff112a og e7b2f7a (rendret på nytt etter art director).
- Telefon: f03bf94. Rendres på nytt nå, fordi vaktlista så dobbelttrykt ut (bokstavene kastet skygge).
- Åpning: c7bcd4d. Planlagt tid er 9:34 etter at åpningen er kortet til 18 s.
- Bokeh, korn og vignett er slått av overalt, også i de mørke scenene.

### Fase 4 – panel 2 (seks nye reviewere, uten tidligere vurderinger)

Panelet fant innholdsfeil som jeg har sjekket mot transkripsjonene selv:

- **Vinhistorien:** «5 000 kr», «premie», «lære opp» og «verdt det» står i hakeparentes i den bearbeidede versjonen. Det er tolkninger, ikke ordrett. I opptaket sier hun «500, 5000, fem 105 000». Nå står det «En dyr vin», «sjefen lovet henne noe» og «Hun gikk hjem i godt humør» (det var spørsmålet hun svarte på), merket «Gjenfortalt, ikke ordrett».
- **Spørsmål 10:** svarene handlet om nok folk, en god plan og arbeidsmiljøet. Sitatet er svaret på spørsmål 28. Skjermen og A sier nå det.
- **«Etter vakten skjedde det nesten ingenting»:** sto som funn uten merking og motsa funn 2. Nå står det som «Vår tolkning».
- **Problemstillingen:** «Noen koblet lav motivasjon til fravær» og «det var dit folk pekte» er ikke dekket. Svarene på spørsmål 35 er lønn, lange dager, tunge løft og at folk føler seg brukt. Det står nå. I tillegg: «At mer motivasjon gir mindre fravær, har vi ikke vist.»
- **Samme informant:** sitatet, sykdomseksempelet og vinhistorien kommer fra intervju 2, og manus sier nå «den samme servitøren».
- **Testleddet:** C sier rett ut at ingen test ennå har svart på om Vaktlogg motiverer. «Flere servitører ville ha oversikt over gjester» er dekket av Dok. A §6 og står.
- **Demoen:** C ber sensor se etter hva Emma sitter igjen med, og knytter etterpå sluttrapporten og duellen til valgene.
- **Teststedene:** Frenchie, Olivia og The Thief kommer fra Dok. A §6 og er nå ført inn i kildelista (A6).
- **Manus:** 9:47, A 304, B 266 og C 294 ord, innenfor ±12 %. sjekk er grønn.

Layout:
- lederlinjen og merkingen overlappet; merkingen står nå over telefonen
- fasene leses over filmene og er borte mens filmen går
- Courier på sluttbongen; sluttbongen sier «SE HVA DU FIKK TIL» i stedet for «DU BLE SETT»
- de brukne pilene i den første ideen er fjernet
- stempelet «Observert» dekker bare det som ble observert
- de tre ideerubrikkene: «Det vi vet / tror / må teste»
- en mørk overgang dekker sømmen i Nøkkelfunn
- «Styres herfra» er fjernet fra salen
- stemplene i problemstillingen dupper ikke lenger

Eksamensdagen:
- tjeneren bruker den frosne kopien først og sier fra hvis noe mangler
- en opptatt port blir sagt tydelig
- kort adresse til sensor: /s
- mobilen synkes straks etter dvale
- skjermen holdes våken (wake lock)
- Enter blir neste i presentatørvisningen
- «Klar til start» spør hvis presentasjonen er i gang
- README har én rutine, med plan B for Dupliser

Ikke gjort (står i morgenrapporten): se under.

## Gjenstår (trenger brukeren, eller ikke rukket i natt)

- **Sir Domeo, replikk 2:** lydfilen sier fortsatt «ingen lapp i søpla i kveld». Det står ingen steder i kildene. Logg inn i ElevenLabs (Terje) og lag den på nytt med den rettede teksten. Teksten står i morgenrapporten.
- **Lydopptaket:** lytt på vinhistorien (intervju 2, Voice 261006_192449, 16:07–16:55). Dersom pris og «verdt det» er tydelige der, kan de stå igjen som sitat.
- **Navnene i oppsett.js:** står fortsatt som «Presentatør A/B/C».
- **Prototypen:** «Flasker over 1 500 kr» vises fortsatt på Salg-skjermen og i rekordlisten. B sier at det ikke er konkurranser om alkohol. Det bør fjernes i prototypen.
- **Panelforslag som ikke er gjort:**
  - tittelen dupper ved overgangen fra film til tittel
  - klokka og bildeteksten i åpningen kan flyttes ned i den svarte stripen
  - mobilstatusen vises først i scene 6
  - lydfeil bør meldes til presentatørvisningen
  - et ekstra hovedvindu kan nullstille omvisningen
  - stempelet brukes fortsatt til mer enn forbehold
- **Filmene:**
  - figurene er fortsatt leketøy
  - sporet leses fortsatt delvis som en plantegning
  - vinduene er utbrente
