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

1. **Telefon:** ny film i restauranten etter stengetid. Telefonen ligger på bordet, skjermen våkner og kameraet ender rett ovenfra. Bakgrunnen i demoen blir siste bilde.
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

## Gjenstår

(fylles inn)
