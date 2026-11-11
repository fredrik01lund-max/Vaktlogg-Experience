import type { Scene } from './types.ts'

/* ═══ MANUS V2 – VAKTLOGG (8.11.2026) ═════════════════════════════════════════════
   Fasit: docs/manus-v2.md. Replikkene («sier») er ordrett fra manuset. Det som står på skjermen,
   følger Skjerm-linjene i manuset, kortet ned etter tekstreglene (docs/plan-manus-v2.md):
   høyst 8 synlige ord per scene, ingen hele setninger fra talen, ingen punktlister. Kjør `npm run sjekk-tekst`.

   • Hver takt er ett klikk. «sier» er det som sies, «regi» er det som skjer og hva man gjør.
   • Diamant-ikonet øverst til høyre viser fasen (scene.diamant); når fasen skifter, glir kula dit (ui/Diamant.tsx).
   • «anim» = sekunder animasjon når takten starter (presentatørvisningen sier «vent»).
   • Manuset er planlagt til 10:00. Litt lengre tid til prototypen enn manuset regner med gir 10:10, og
     klikket med de to første brukerreisene og spillet om forretningsmodellen (11.11) gir 10:33.
     Kjør `npm run sjekk`.
   • Manus v1 (ti scener, 4.11) ligger urørt i manus-v1.ts og vises under «Lagt til side» (O).
   ════════════════════════════════════════════════════════════════════════════════ */

export const manus: Scene[] = [
  {
    id: 'problem',
    tittel: 'Hvorfor dette problemområdet',
    del: 'Problem og innsikt',
    tema: 'mork',
    diamant: 'start',
    varighet: 50,
    takter: [
      {
        hvem: 'A',
        sier: 'Hei, vi er {A}, {B} og {C}. Vi startet med et problemområde vi har opplevd på nært hold: sykefravær i restaurantbransjen. Ved roller på gulvet og som ledere har vi vært borti ringvirkningene av sykefravær i en utsatt bransje. Vi ville se om vi kunne gjøre noe med det. Men først måtte vi forstå hva som ligger bak. Så vi gikk ut og spurte hvorfor.',
        regi: 'Ringvirkninger (Blender): kula lander der flipptavla skal stå, ringer av lys brer seg utover, tavla slår seg opp til SYKEFRAVÆR, og kula legger seg i diamant-ikonet («Design Thinking»). Så kommer linjen «Opplevd på nært hold». Ingen tall. «Høyt» er tatt ut av replikken: SSB viser at bransjen ligger litt under snittet (se sjekklisten i manuset).',
      },
    ],
    overgang: 'A klikker. Kula i diamant-ikonet glir inn i Empathize.',
    kilder: ['V2', 'A1'],
  },
  {
    id: 'innsikt',
    tittel: 'Innsiktsarbeidet',
    del: 'Problem og innsikt',
    tema: 'mork',
    fase: 'empathize',
    diamant: 'empathize',
    varighet: 25,
    takter: [
      {
        hvem: 'A',
        sier: 'Vi gjorde ti dybdeintervjuer med servitører, hovmestere og ledere. Vi observerte også arbeidsdagen til noen servitører på to restauranter, Noode Sky og Frenchie.',
        regi: 'Ikonet: kula glir inn i Empathize. Ti bonger merket INTERVJU henges på innsiktsknaggen én etter én, tettere og tettere som bestillinger på et kjøkken, med rollen på: 6 servitører (rosa), 2 hovmestere (mint), 2 daglige ledere (fersken), gruppert per restaurant (seks steder, uten navn), så to gule bonger for observasjonene og til slutt en mørk bong for egen erfaring. En liten kokk går bortover skinna og henger dem opp, hopper ned og henger opp de fem bildene fra stedene vi besøkte på vei tilbake, og går ut til venstre. Alt henger etter ca. fem sekunder. Stedene sies, de står ikke på skjermen.',
      },
    ],
    overgang: 'A klikker videre til nøkkelfunnene: bongene faller av knaggen, og nøkkelfunnene kommer.',
    kilder: ['V2', 'A2'],
  },
  {
    id: 'funn',
    tittel: 'Nøkkelfunn',
    del: 'Problem og innsikt',
    tema: 'mork',
    fase: 'empathize',
    diamant: 'empathize',
    varighet: 70,
    takter: [
      {
        hvem: 'A',
        sier: 'Tre ting gikk igjen. Det første var bevegelse. Servitørene beskriver jobben som veldig fysisk, og flere følger med på skrittene sine på de slitsomme vaktene. En hovmester teller skritt hver vakt og har hatt en rekord på 25 000 skritt.',
        regi: 'Tre merker øverst til venstre (fotspor, kassalapp, snakkeboble) viser hvilket av de tre funnene dere er på. Fotsporet og kassalappen kommer igjen på ringene i Ideate. Funn 1: åpningsfilmen – Emma går gjennom kvelden og sporet vokser bak henne – med skritteller som går til 15 000, og to målere for puls og stress som svinger gjennom vakten (uten tall).',
      },
      {
        hvem: 'A',
        sier: 'Det andre var salg. Servitørene er opptatt av eget salg og egne tips. Når vakten er over, skriver de ut kassarapporten og sammenligner med kollegene. Etterpå kaster de lappen, og tallene er borte.',
        regi: 'Funn 2: tre servitører ved disken sammenligner kassarapportene (salg, tips, vinflasker solgt), krøller dem, kaster dem i bøtta og går ut mens lysene slukkes. Tallene er tenkte.',
      },
      {
        hvem: 'A',
        sier: 'Det tredje lå under de to andre. En servitør sa det slik: «Jeg jobber veldig mye og får veldig lite tilbake, og da mister jeg motivasjonen.» Lignende ting kom fra flere. Noen trodde at manglende motivasjon kan gi sykefravær, fordi jobben er tung og ikke så godt betalt.',
        regi: 'Funn 3: Emma blir intervjuet ved et vindusbord, og sitatet kommer i en snakkeboble ved henne, ord for ord mens A leser det.',
      },
    ],
    overgang: 'A klikker. Kula i ikonet glir inn til det smaleste punktet (Define). B går frem.',
    kilder: ['V2', 'A2-1', 'A2-2', 'A2-3', 'I1', 'I2'],
  },
  {
    id: 'problemstilling',
    tittel: 'Ny problemstilling',
    del: 'Design Thinking og konsept',
    tema: 'mork',
    fase: 'define',
    diamant: 'define',
    varighet: 30,
    takter: [
      {
        hvem: 'B',
        sier: 'Lønn og bemanning kan ikke vi designe bort. Men at innsatsen blir synlig og får noe tilbake, det kan vi gjøre noe med.',
        regi: 'Ikonet: kula glir fra Empathize til Define. SYKEFRAVÆR står på flipptavla.',
      },
      {
        hvem: 'B',
        sier: 'Derfor justerte vi problemstillingen til: Hvordan kan vi motivere servitører? At mer motivasjon gir mindre fravær, har vi ikke vist. Det er en sammenheng informantene pekte på. Så hvordan ser en vakt ut i dag?',
        regi: 'SYKEFRAVÆR snur seg bokstav for bokstav og blir MOTIVASJON. Problemstillingen skrives ut på en bong under.',
      },
    ],
    overgang: 'B klikker. De to første brukerreisene legges frem. Neste klikk starter filmen.',
    kilder: ['V2', 'A1', 'A3'],
  },
  {
    id: 'reise',
    tittel: 'Brukerreisen',
    del: 'Design Thinking og konsept',
    tema: 'mork',
    fase: 'define',
    diamant: 'define',
    varighet: 58,
    takter: [
      {
        hvem: 'B',
        sier: 'Brukerreisen tegnet vi først på papir og deretter digitalt. Til slutt animerte vi den.',
        regi: 'FORSLAG TIL REPLIKK – bytt gjerne ut med egne ord. To bilder fra arbeidet legges frem: brukerreisen på gråpapir med lapper, og den digitale brukerreisen fra arbeidskravet (personaen het Theodora den gangen; personabildet er tatt ut). Ikke forklar dem – de viser bare arbeidet før animasjonen.',
      },
      {
        hvem: 'stille',
        anim: 50,
        regi: 'Ingen snakker. Brukerreisen for Emma (tenkt vakt): fire faser nederst, klokkeslett, og følelseskurven som tegnes mens filmen går – grønn med pluss der det løfter, rød med minus der det tynger. Hver årsak kommer først stort øverst til venstre og legger seg så på kurven, der den blir stående: dobbel stasjon, ingen pause, gjesten takker, godt team på jobb, salg sammenlignes, kassalappen kastes og prestasjonene havner i glemmeboken, og dagene etter: sliten etter kvelden før. Lysringen under Emma viser det samme. Før: hun stempler inn, og lederen kommer bort og ber henne ta stasjonen til en kollega som er syk (snakkeboble). Under: ingen pause, en gjest takker (snakkeboble fra gjesten), en kollega tar et bord. Etter: kassarapportene sammenlignes, krølles og kastes, lysene slukkes. Dagene etter: sporet og hele kurven med årsakene står igjen – «Hva sitter Emma igjen med?». B lar spørsmålet stå i to sekunder før neste del.',
      },
    ],
    overgang: 'B klikker. Kula i ikonet glir ut i Ideate.',
    kilder: ['V2', 'A3'],
  },
  {
    id: 'ideate',
    tittel: 'Ideate: Strava for arbeidsplassen',
    del: 'Design Thinking og konsept',
    tema: 'mork',
    fase: 'ideate',
    diamant: 'ideate',
    varighet: 77,
    takter: [
      {
        hvem: 'B',
        sier: 'Det vi så ved kassa, ble utgangspunktet. Servitørene følger med på skrittene sine, og de sammenligner salget. Men skrittene ligger på mobilen, og salget står på en lapp som havner i søpla. Ingenting kobler innsatsen til resultatet. Så den første ideen var en slags Strava for arbeidsplassen som lagrer data fra vakten.',
        regi: 'Ikonet: kula glir til Ideate. Stillbildet fra kassascenen: kassarapportene (salget) og skrittsporet på gulvet ringes inn, og streken mellom dem brytes – ingenting kobler dem.',
      },
      {
        hvem: 'B',
        sier: 'Vaktlogg henter salg og tips fra kassasystemet, for eksempel Munu eller Favrit. Fra klokka eller mobilen henter den skritt, puls og stress. Sammen blir det et digitalt bilde av vakten. Hvorfor ikke bare bruke Strava? Strava ser bare kroppen. Og salget ligger i kassasystemet, som servitørene ikke har tilgang til utenfor jobben. Vil de se sin egen statistikk, må de som regel spørre en leder. Vaktlogg er laget for servitører og viser begge deler sammen: hvor hardt du jobbet, og hva det ga. Og loggen blir liggende. Du ser utviklingen din over tid, i stedet for en lapp i søpla.',
        regi: 'Blender-filmen: kassarapporten skrives ut og flyr inn i telefonen i stedet for i søpla. Salg fra kassasystemet og skritt og puls fra klokka strømmer inn, og telefonen viser sluttrapporten. Merket «Kassasystem», «Klokke» og «Vaktlogg».',
      },
      {
        hvem: 'B',
        sier: 'Salgstallene ser arbeidsgiveren uansett i kassasystemet. Men helsedataen er din. Skritt, puls og stress ser bare du, aldri lederen.',
        regi: 'Telefonen med Helse-skjermen og en lås. Én linje: «Helsedataen er din.» Emma ser dataene – lederen ser dem ikke.',
      },
    ],
    overgang: 'B klikker. Kula i ikonet glir til Prototype. C går frem med mobilen.',
    kilder: ['V2', 'A4', 'P'],
  },
  {
    id: 'demo',
    tittel: 'Prototypen',
    del: 'Prototype og testing',
    tema: 'mork',
    fase: 'prototype',
    diamant: 'prototype',
    varighet: 158,
    takter: [
      {
        hvem: 'C',
        sier: 'Først tegnet vi appen på et ark. Men vi skjønte at det ville være lettere å teste ideen hvis servitørene kunne trykke på den selv. Så vi bygde en digital prototype.',
        regi: 'Ikonet: kula glir til Prototype. Bildet av den ekte papirskissen (seks skjermer med tusj; plassen papirskisse i foto.js) glir til side, og det ekte skjermbildet av appen kommer frem.',
      },
      {
        hvem: 'stille',
        anim: 7,
        regi: 'Ingen snakker – telefonen på bordet våkner, og kameraet går rett over den. Filmen går over i den ekte prototypen av seg selv.',
      },
      {
        hvem: 'C',
        sier: 'Emma og restauranten er fiktive, og tallene er simulert. Værsågod, prøv selv. Sir Domeo viser deg rundt.',
        regi: 'C gir mobilen til sensor. Storskjermen viser det samme som mobilen, og Sir Domeo snakker fra høyttalerne.',
      },
      {
        hvem: 'sensor',
        sek: 120,
        regi: 'Sensor prøver selv. Sir Domeo forklarer starten og viser én funksjon. Etter det trykker sensor selv. Ikke forklar underveis. Hjelp bare hvis sensor står fast. Ved 1:30: står sensor ikke på sluttrapporten, sier C «Trykk Avslutt vakt nederst». Ved 2:00 tar C over, uansett hvor sensor er. To sensorer: bestem på forhånd hvem som får mobilen. Virker ikke mobilen: C styrer med musen, og sensor sier hva hun vil trykke på.',
      },
      {
        hvem: 'C',
        sier: 'Takk. Det du så til slutt, er det Emma sitter igjen med etter vakten, i stedet for en lapp i søpla.',
        regi: 'C tar mobilen tilbake og klikker videre (PageDown virker også mens du er i appen).',
      },
    ],
    overgang: 'C klikker. Kula i ikonet glir til Test, og pilen tilbake lyser.',
    kilder: ['V2', 'A5', 'P'],
  },
  {
    id: 'test',
    tittel: 'Test og iterasjon',
    del: 'Prototype og testing',
    tema: 'mork',
    fase: 'test',
    diamant: 'test',
    varighet: 70,
    takter: [
      {
        hvem: 'C',
        sier: 'Prototypen ligger på nett, så vi kunne dele den med en lenke. Da var det lett å få mange testere, også når vi ikke var til stede. Servitører og ledere fra blant annet Noode Sky, Park 29, Frenchie, Olivia og The Thief har prøvd den.',
        regi: 'Ikonet: kula glir til Test, og buen tilbake til Empathize tegnes – testene ga ny innsikt. Lenken til prototypen sendes ut (forkortet på skjermen til github.io/vaktlogg, uten brukernavn), og telefon etter telefon lyser opp med appen.',
      },
      {
        hvem: 'C',
        sier: 'I appen kan testerne skrive forslag og tilbakemeldinger, og de kommer til oss på e-post. Her er noen av dem. En av de første vi fikk, var denne: «Hadde det vært mulig med en slags guide når man åpner appen for å få en forklaring på de ulike funksjonene?» Det ble Sir Domeo, guiden du nettopp møtte. På den måten tok vi vare på innsikten fra brukerne, og vi kunne teste nye ideer raskt.',
        regi: 'Skjemaet «Gi tilbakemelding» i prototypen (ekte skjermbilde) står til høyre, og seks ekte tilbakemeldinger kommer inn fra det som e-poster, én etter én (ordrett, uten navn). Guiden står øverst til venstre. Sir Domeo-klikket er tatt bort (9.11) – setningen om ham er flyttet hit, stryk den gjerne.',
      },
      {
        hvem: 'C',
        sier: 'En annen tester ønsket en månedlig rapport med statistikk. Sammen med inspirasjon fra Spotify Wrapped ble det månedsoppsummeringen.',
        regi: 'FORSLAG TIL REPLIKK – bytt gjerne ut med egne ord. Klikk: de andre e-postene og skjemaet tones bort, forslaget om en månedlig rapport glir til venstre, og telefonen med månedsoppsummeringen (Blender-loop av de ekte sidene i prototypen) kommer frem og spiller animasjonene: gjestene, månedens rett, kilometerne og delekortet.',
      },
      {
        hvem: 'C',
        sier: 'Slik har vi videreutviklet prototypen, én runde om gangen.',
        regi: 'Hoppefilmen: kula spretter mellom innsikt og prototype, med datoene fra prosjektet. Til slutt: tilbakemelding → endring → ny test.',
      },
    ],
    overgang: 'C klikker. Ikonet viser hele diamanten.',
    kilder: ['V2', 'A6', 'A7'],
  },
  {
    id: 'videre',
    tittel: 'Veien videre og avslutning',
    del: 'Refleksjon og videre',
    tema: 'mork',
    diamant: 'helhet',
    varighet: 95,
    takter: [
      {
        hvem: 'C',
        sier: 'Her er vi nå: en prototype som servitører har prøvd. Veien videre starter med en gratis pilot hos et par restauranter. Vi kobler oss til dataene deres og lar ekte servitører bruke appen, mens vi bygger videre. Da ser vi om de faktisk bruker den, eller bare sier at de vil. Alt dette kan vi gjøre uten mye penger. Med det beviset er det lettere å få kunder og investorer. Servitøren bruker appen, men arbeidsgiveren betaler, så vi selger abonnement til restaurantgrupper. Senere kan Vaktlogg bygges inn i systemene restaurantene allerede har.',
        regi: 'FORSLAG TIL REPLIKK – bytt gjerne ut med egne ord. Forretningsmodellen som et lite spill: tre figurer (dere) går veien videre. Piltaster eller A/D = gå, mellomrom = hopp. PageDown (klikkeren) = gå til neste stopp av seg selv: et par restauranter, koblet til dataene, ekte servitører bruker den, vi bygger videre, beviset, restaurantgruppene, plattformen og til slutt portalen. Ett kort nederst viser bare det som gjelder der figurene står. Når figurene går inn i portalen, kommer «Takk for oss». Firmalogoene er merket «mulig kunde» og «mulig partner» – det finnes ingen avtaler. Ikonet er skjult mens spillet står.',
      },
      {
        hvem: 'alle',
        sier: 'A: Vi startet med sykefravær. B: Vi endte med motivasjon, og med spørsmålet fra filmen: Hva sitter servitøren igjen med etter vakten? C: Med Vaktlogg kan hun se hva hun fikk til. Om det faktisk motiverer, er det neste vi må teste. Takk for oss.',
        regi: 'Figurene går inn i portalen, og «Takk for oss» kommer frem med innholdsfortegnelsen: ni kort, ett for hver del. Trykk på et kort med musen for å gå til den delen når sensor spør om noe. Avslutningsreplikkene sies her, mens siden står (flipptavla er tatt bort).',
      },
    ],
    overgang: 'Slutt. Spørsmål.',
    kilder: ['V2', 'A10', 'A12'],
  },
]

/** Planlagt total: manuset (10:00) og prototypen slik talen faktisk tar. */
export const PLAN_TOTAL = 633
/** Den harde grensen for fremføringen. */
export const MAKS_TOTAL = 720
