# Morgenrapport – nattøkta 3.–4. november 2026

## Kort fortalt

- **Før:** 14 scener på 12:00. Fraunces, Inter og JetBrains Mono, bokeh, korn og vignett. Fire filmer (åpning 25 s, telefon 10 s, pakket 16 s, hopping 20 s).
- **Nå:** 10 scener på **9:47** planlagt.
  - Margin: 0:13 til målet (10:00) og 2:13 til den harde grensen (12:00).
  - Sensor får 2:10 i prototypen.
  - Ordfordeling: A 304, B 266, C 294 (innenfor ±12 %).
- **Tre nye Blender-filmer i samme restaurant og samme grading (Standard):**
  - åpning 17,5 s, 128 samples
  - telefon 7 s, 160 samples
  - hopping 12 s, 128 samples
- **Innholdet er sjekket mot transkripsjonene.** Flere påstander er rettet; se «Faktarettelser».
- **Alt er pushet til main.** Testene er grønne: tsc, sjekk, xp-sync 18/18, xp-gammel, xp-omlast, sensortest 7/7, verify og build. GitHub Pages er oppdatert.
- **Commits i natt** (presentasjonen): 8db1dba, 6faa5a8, 7ff112a, f03bf94, c7bcd4d, e7b2f7a, a7094b4 og den siste med telefonfilmen. Prototypen: cfac1f4, e7c487a og c662554.
- **Ingen nye lydfiler.** ElevenLabs var logget ut, og jeg skal ikke logge inn for deg. Se «Trenger deg».

## Scenene

| # | Scene | Hvem | Plan |
|---|---|---|---|
| 1 | Vakten (film og tittel) | stille → A | 44 s |
| 2 | Hvem vi snakket med | A | 52 s |
| 3 | Nøkkelfunn (frysbilde fra filmen) | A | 40 s |
| 4 | Problemstillingen | A → B | 48 s |
| 5 | Fra Strava til Vaktlogg (idé, historie, beslutning) | B | 71 s |
| 6 | Det vi prioriterte | B | 32 s |
| 7 | Prøv selv (telefonfilm, sensor 2:10) | stille → C → sensor → C | 166 s |
| 8 | Frem og tilbake (hoppefilm) | stille → C | 60 s |
| 9 | Hva vi vet, og hva nå | C | 53 s |
| 10 | Avslutning | A, B, C | 21 s |

Scenene som er tatt ut, ligger i `arkiv.ts` (15 stykker). De vises fra oversikten (O) under «Lagt til side». Ingenting er slettet.

## Fonter, og hvorfor

- **Besley** (overskrifter): en Clarendon, som på menykort og emaljeskilt. Den gir restaurantpreg uten å være pynt.
- **Schibsted Grotesk** (tekst): tegnet for norske aviser. Den er nøktern, har god æøå og er lett å lese på avstand.
- **Courier Prime**: brukes bare der bongskriveren hører hjemme, det vil si på bonger og på stemplene som merker forbehold (selvrapportert, observert, illustrasjon, fiktiv, vår tolkning).
- Alle tre er lokale (Fontsource) og har åpen lisens (SIL OFL).
- Fraunces, Inter og JetBrains Mono er tatt ut. Det samme gjelder sperrede mono-overtitler, «·», pills, bokeh, korn, vignett og gradienttekst.
- Det er seks skriftstørrelser, ingenting under 24 px, og et rutenett med 12 kolonner.

## Filmene

Alle tre filmene har gått gjennom 2–3 runder med uavhengig art director og egne testrender.

**Åpning: «Vakten ovenfra»**
- Samme restaurant som de andre filmene: mørke bord og sol gjennom sprossevinduer, med et tak kameraet ikke ser.
- Servitøren og gjestene har fått hår, så de leses som folk.
- Rettet tre feil:
  - Kameranøklene lå i feil rekkefølge, så kameraet dykket.
  - Sporet ble tegnet foran servitøren; dette var en gammel feil.
  - Hun teleporterte mellom bordene.
- Sporet er additivt, så gangene hun går ofte, lyser sterkest.
- Frysbildet til Nøkkelfunn regnes nå ut fra ruta (hun serverer midt i bildet).

**Telefon: «Prøv selv»**
- Ny historie: telefonen ligger på brettet like før vakten, med ettermiddagssol, kaffe og vaktlista på papir.
- Kameraet regnes ut bilde for bilde, så skjermen lander nøyaktig der den ekte prototypen legges over (kontrollert: 86 %, #f3f6f2).
- Rendret på nytt i natt fordi teksten på vaktlista så dobbelttrykt ut.

**Hopping: «Frem og tilbake»**
- Samme bardisk og dagslysvinduer som telefonfilmen.
- Sporet kaster ikke skygge, og buene blir lavere etter hvert. Sluttbildet er sentrert på bongene.
- Kortene og banenavnene står i HTML rett under bongene, projisert fra filmen.

**Pakket-filmen** er lagt til side sammen med scenen sin.

## Hva panelene sa, og hva som ble gjort

**Panel 1** (seks reviewere, 89 funn) førte til:
- færre scener
- faktarettelser
- nytt designsystem
- en tydelig beslutning (rettferdig konkurranse)
- robusthet på eksamensdagen

Detaljer står i `NATTLOGG.md`.

**Panel 2** (seks nye reviewere, uten tidligere vurderinger) fant blant annet:
- *Vinhistorien* bygget på tolkninger i hakeparentes. Rettet, se under.
- *Spørsmål 10* så ut til å gi sitatet, men sitatet er svar på spørsmål 28. Rettet.
- *«Etter vakten skjedde det nesten ingenting»* sto som funn uten merking. Det er nå merket «Vår tolkning».
- *Problemstillingen* påsto at folk «pekte» mot motivasjon. Nå står det de faktisk svarte om fravær, og «At mer motivasjon gir mindre fravær, har vi ikke vist».
- *Testleddet* manglet brukerfunn. C sier nå rett ut at ingen test ennå har svart på om Vaktlogg motiverer.
- *Demoen* manglet ramme. C ber nå sensor se etter hva Emma sitter igjen med.
- *Layout*:
  - Tekst lå oppå tekst i scene 6.
  - Fasene var usynlige over filmene.
  - Pilene i idé-scenen var brukket.
  - Sluttbongen var ikke i Courier.
  - «DU BLE SETT» var en påstand om effekt. Bongen sier nå «SE HVA DU FIKK TIL».
- *Eksamensdagen*:
  - Den frosne kopien var utdatert.
  - Mobilen ble ikke synket etter dvale.
  - Skjermen kunne sovne.
  - «Klar til start» kunne nullstille alt ved et uhell.
  - README hadde to rutiner.
  - Alt dette er rettet.
- *Prototypen* viste fortsatt «Flasker over 1 500 kr». Det er fjernet fra visningen (c662554).

## Faktarettelser (sjekket mot transkripsjonene)

- **Vinhistorien:** I opptaket sier hun «500, 5000, fem 105 000». Ordene «premie», «lære opp» og «verdt det» står i hakeparentes i den bearbeidede versjonen, altså tolkninger. Nå står det:
  - «En dyr vin»
  - «sjefen lovet henne noe»
  - «Hun gikk hjem i godt humør» (spørsmålet hun svarte på)
  - merket «Gjenfortalt, ikke ordrett»
- **Spørsmål 10:** svarene handlet om nok folk, en god plan og arbeidsmiljøet. Sitatet er nå merket «svar på spørsmål 28».
- **Fravær (spørsmål 35):** lønn, lange dager, tunge løft, og at folk føler seg brukt (lederen).
- **Sykdomseksempelet:** «gikk på jobb selv om hun burde vært hjemme», ikke «syk».
- **Samme person:** sitatet, sykdomseksempelet og vinhistorien kommer fra samme intervju. Manus sier nå «den samme servitøren», og det står blant svakhetene.
- **Kildelista:** utvidet med I1–I3 per spørsmål, og med teststedene fra Dok. A §6.

## Trenger deg

1. **Sir Domeo, replikk 2:** lydfilen sier «… ingen lapp i søpla i kveld!». Det står ingen steder i kildene. Logg inn i ElevenLabs (stemmen Terje) og lag den på nytt med denne teksten:
   «Dette er kassarapporten de ansatte sjekket etter vakten. Nå er den din mens du jobber, og ikke en lapp du må lete etter i morgen. Trykk på Vakt nederst for å gå tilbake.»
   Legg filen i `public/demo/domeo/sensor-2.mp3` og teksten i `sensor-replikker.json` i prototypen. Jeg kan gjøre resten når filen ligger der.
2. **Lytt på vinhistorien** (intervju 2, Voice 261006_192449, 16:07–16:55). Hører du «5 000» og «verdt det» tydelig, kan de stå igjen som sitat.
3. **Navnene** i `public/oppsett.js` står fortsatt som «Presentatør A/B/C».
4. **Øv én gang på eksamens-PC-en** med `npm run eksamen` (bruker `dist-eksamen-trygg`, frosset i natt), mobilen på hotspot og den korte adressen `http://<IP>:8080/s`.
5. **Foto og samtykke:** bilder publiseres bare med `samtykke.offentlig`. Emmas foto er tatt ut av prototypen, men opphavet bør avklares.
6. **Dok. A:** «ca. 5 000 ekstra skritt» stemmer ikke med intervjuet, og vinprisen er uklar.
7. **Sjekk kravene** til eksamen: NABC ligger nå i arkivet.

## Forslag jeg ikke har gjort (deres valg)

- Fargepalett i menykartong: prototypens farger er beholdt, slik dere ville.
- Tekst ved siden av telefonen i demoen: ingen, slik dere ville.
- Norsk undertittel til «Behind the shift»: tittelen er beholdt.
- Lyd i filmene, for eksempel restaurantlyd i åpningen. Fila kan legges inn i `oppsett.js`.
- Filmene kan bli enda bedre:
  - figurene er fortsatt leketøy
  - sluttbildet av sporet leses delvis som en plantegning
  - vinduene er utbrente
- Fra panel 2:
  - tittelen dupper når åpningsfilmen slutter
  - klokka i åpningen kan flyttes ned i den svarte stripen
  - mobilstatusen vises først i scene 6
  - lydfeil meldes ikke til presentatørvisningen
  - stempelet brukes fortsatt til mer enn forbehold
