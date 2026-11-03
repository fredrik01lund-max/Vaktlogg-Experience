import type { Scene } from './types.ts'

/* ═══ MANUS – BEHIND THE SHIFT ════════════════════════════════════════════════════
   Én kilde for alt: hovedskjermen, presentatørvisningen og det utskrivbare manuset
   leser herfra. Endre teksten her, så følger alt med.

   • Hver takt er ett klikk. «sier» er manus, «regi» er det som skjer og hva man gjør.
   • «anim» = sekunder animasjon når takten starter (presentatørvisningen sier «vent»).
   • Varighetene skal til sammen bli 12:00 – kjør `npm run sjekk` for tid per presentatør.
   • Ikke legg inn tall, sitater eller funn som ikke er dokumentert (se kilder.ts).
   ════════════════════════════════════════════════════════════════════════════════ */

export const manus: Scene[] = [
  {
    id: 'apning',
    tittel: 'Vakten ovenfra',
    del: 'Åpning',
    tema: 'mork',
    varighet: 25,
    takter: [
      {
        hvem: 'stille',
        anim: 25,
        regi: 'Ingen snakker. «Vakten ovenfra»: servitøren stempler inn på telefonen (16:00), tar brettet, og kameraet løfter seg over restauranten mens kvelden går fra 16:00 til 23:30 – gjester, bonger, bord som skifter farge, og sporet der hun går. Lysene slukkes, sporet lyser igjen. Tittelen kommer. A går frem.',
      },
    ],
    overgang: 'Går av seg selv til tittelen når filmen er ferdig. A begynner å snakke når tittelen står.',
    kilder: [],
  },
  {
    id: 'tittel',
    tittel: 'Behind the shift',
    del: 'Problem og innsikt',
    tema: 'mork',
    varighet: 33,
    takter: [
      {
        hvem: 'A',
        sier: 'Hei. Vi er {A}, {B} og {C}. Det dere nettopp så, er en helt vanlig fredagsvakt: bonger, bord og tempo. Og når vakten er over, går servitøren hjem – ofte uten å vite hva hun faktisk fikk til.',
        regi: 'Navnene kommer frem under tittelen.',
      },
      {
        hvem: 'A',
        sier: 'Vi startet et helt annet sted enn der vi endte. Utgangspunktet var sykefravær i restaurantbransjen – en bransje med knapp bemanning, små marginer og fysisk krevende arbeidsdager. Så vi gikk ut for å forstå hverdagen bak vakten.',
        regi: 'Ordet SYKEFRAVÆR kommer frem, med bransjens kjennetegn rundt.',
      },
    ],
    overgang: 'A klikker videre selv og fortsetter rett på metoden.',
    kilder: ['A1'],
  },
  {
    id: 'metode',
    tittel: 'Menneskene bak innsikten',
    del: 'Problem og innsikt',
    fase: 'empathize',
    varighet: 48,
    takter: [
      {
        hvem: 'A',
        anim: 3,
        sier: 'Vi har snakket med servitører, hovmestere, restaurantledere og andre ansatte – i intervjuer og i mer uformelle samtaler. Noen av intervjuene er transkribert. Mange av samtalene er det ikke.',
        regi: 'Fotografiene samler seg til en mosaikk.',
      },
      {
        hvem: 'A',
        sier: 'I tillegg observerte vi servitører i arbeid, blant annet på Noode Sky og Park 29. Selv har vi erfaring fra bransjen som servitør, hovmester og daglig leder. Det ga oss tilgang til folk – men også en risiko for at vi tolket funnene gjennom egne briller. Det har vi prøvd å være bevisste på.',
        regi: 'Mosaikken trekker seg tilbake, og de fire innsiktskildene kommer frem hver for seg.',
      },
      {
        hvem: 'A',
        sier: 'Det viktigste grepet i intervjuene var ett spørsmål: Fortell om en travel vakt som føltes bra – og en travel vakt som føltes dårlig. Like travelt. Helt ulik opplevelse. Hva er forskjellen?',
        regi: 'Skjermen deles i to: «bra» og «dårlig» travel vakt.',
      },
    ],
    overgang: 'A klikker. Skjermen går i svart, og portrettet kommer frem – vent tre sekunder før du snakker.',
    kilder: ['A2'],
  },
  {
    id: 'portrett',
    tittel: 'Portrett og sitat',
    del: 'Problem og innsikt',
    tema: 'mork',
    fase: 'empathize',
    varighet: 30,
    takter: [
      {
        hvem: 'stille',
        anim: 3,
        regi: 'Portrettet kommer sakte frem fra mørket. A er stille i tre sekunder.',
      },
      {
        hvem: 'A',
        sier: 'En servitør sa det slik: «Jeg jobber veldig mye og får veldig lite tilbake, og da mister jeg motivasjonen.» Det handlet ikke bare om hvor mye de jobbet – men om hva de fikk igjen.',
        regi: 'Sitatet skrives frem. Personen på bildet er ikke den som siteres, med mindre foto.js sier noe annet.',
      },
      {
        hvem: 'A',
        sier: 'Flere beskrev at tilbakemeldinger, gode kolleger og det å bli sett påvirket motivasjonen. I samme intervju ble tilbakemeldinger fra gjester trukket fram som noe av det viktigste.',
        regi: 'Tre stikkord kommer frem under sitatet.',
      },
    ],
    overgang: 'A klikker videre til bildet av en servitør i arbeid.',
    kilder: ['A2-1'],
  },
  {
    id: 'innsikter',
    tittel: 'Nøkkelfunn',
    del: 'Problem og innsikt',
    fase: 'empathize',
    varighet: 56,
    takter: [
      {
        hvem: 'A',
        anim: 3,
        sier: 'La oss fryse et øyeblikk fra en vakt. Rundt én servitør skjer det mye vi ikke ser: bevegelse, skritt, oppgaver, salg – og anerkjennelse, eller mangelen på den.',
        regi: 'Bildet fryses, og merkelappene tegnes rundt personen. Tallene er ikke målt – de vises ikke her.',
      },
      {
        hvem: 'A',
        sier: 'Det første som overrasket oss: Servitørene var opptatt av hvor mye de gikk. En hovmester registrerte skrittene sine systematisk – mellom tolv og tjuefem tusen på en vakt. Flere opplevde bevegelsen og tempoet som noe positivt. Det som slet, var tunge løft og bæring.',
        regi: 'Innsikt 2 – skritt. Tallet er merket «selvrapportert, én hovmester».',
      },
      {
        hvem: 'A',
        sier: 'Det andre var salgstallene. Vi så ansatte sjekke rapporten fra kassasystemet etter vakten – omsetning, tips, rekorder. Det var ikke bare noe de sa. Vi så det. Men rapporten var ofte borte dagen etter.',
        regi: 'Innsikt 3 – salg. Merket «observert».',
      },
      {
        hvem: 'A',
        anim: 3,
        sier: 'Tre temaer ble stående: anerkjennelse, aktivitet og salg. Og ett rom der nesten ingenting skjedde: tiden etter vakten. Der forsvant innsatsen.',
        regi: 'Fotoet forsvinner. Merkelappene trekkes sammen til tre punkter.',
      },
    ],
    overgang: 'A klikker. SYKEFRAVÆR kommer tilbake – A sier én setning til, så tar animasjonen over.',
    kilder: ['A2-1', 'A2-2', 'A2-3', 'A3'],
  },
  {
    id: 'snu',
    tittel: 'Problemstillingen',
    del: 'Problem og innsikt',
    fase: 'define',
    varighet: 42,
    takter: [
      {
        hvem: 'A',
        sier: 'Noen informanter koblet lav motivasjon til sykefravær. Andre fortalte at de gikk på jobb syke – for ikke å svikte kollegene.',
        regi: 'Det informantene pekte på, svever rundt SYKEFRAVÆR.',
      },
      {
        hvem: 'stille',
        anim: 7,
        regi: 'Ingen snakker. Bokstavene vender seg: SYKEFRAVÆR blir MOTIVASJON, og den nye problemstillingen skrives frem. B går frem og tar over når spørsmålet står.',
      },
      {
        hvem: 'B',
        sier: 'Problemet var mer sammensatt enn vi trodde: Motivasjon, lojalitet, bemanning og fravær henger sammen på flere måter. Så vi snevret inn til noe vi kunne påvirke med tjenestedesign: Hvordan kan vi øke motivasjonen i jobben som servitør? Vi har ikke dokumentert at lav motivasjon gir fravær – men sammenhengen informantene pekte på, ga oss retningen.',
        regi: 'Navnelinjen for B vises.',
      },
    ],
    overgang: 'B klikker videre til den første ideen.',
    kilder: ['A1', 'A3'],
  },
  {
    id: 'ide',
    tittel: 'Strava for jobben',
    del: 'Design Thinking og konsept',
    fase: 'ideate',
    varighet: 33,
    takter: [
      {
        hvem: 'B',
        sier: 'Den første ideen var enkel: en slags Strava for jobben. En skritteller som starter når du stempler inn – for eksempel i Planday – og stopper når du går hjem.',
        regi: 'Skissen av den første ideen.',
      },
      {
        hvem: 'B',
        sier: 'Så fortalte en servitør om en vakt der hun gikk rundt fem tusen flere skritt enn vanlig, blant annet fordi hun lærte opp en ny kollega. Samtidig solgte hun tre flasker vin. Hun beskrev den ekstra innsatsen som verdt det. Der møttes to innsikter.',
        regi: 'Historien, merket «gjenfortalt fra ett intervju». B klikker på «to innsikter» – og er stille.',
      },
    ],
    overgang: 'B klikker og er stille: den stille sekvensen starter.',
    kilder: ['A4', 'A2-4'],
  },
  {
    id: 'to-innsikter',
    tittel: 'To innsikter, én idé',
    del: 'Design Thinking og konsept',
    fase: 'ideate',
    varighet: 22,
    takter: [
      {
        hvem: 'stille',
        anim: 13,
        regi: 'Ingen snakker. Skrittene går inn fra venstre, salget vokser fra høyre. De møtes i midten og blir Vaktlogg-merket: ringen og V-en. Gnisten til slutt er anerkjennelsen.',
      },
      {
        hvem: 'B',
        sier: 'Vaktlogg: aktivitet, salg og anerkjennelse i én personlig tjeneste – med motivasjon som mål. Spillet er et virkemiddel, ikke målet.',
        regi: 'B tar ordet når merket står.',
      },
    ],
    overgang: 'B klikker og er stille: filmen «Alt vi pakket inn» starter.',
    kilder: ['A2-4', 'A4'],
  },
  {
    id: 'pakket',
    tittel: 'Alt vi pakket inn',
    del: 'Design Thinking og konsept',
    fase: 'ideate',
    varighet: 62,
    takter: [
      {
        hvem: 'stille',
        anim: 16,
        regi: 'Ingen snakker. Skjermbildene fra prototypen svever rundt telefonen og flyr inn i den, én for én – stadig raskere. Når alt er pakket inn, kommer pastellringene. Går videre av seg selv når filmen er ferdig.',
      },
      {
        hvem: 'B',
        sier: 'Alt vi lærte, fikk en plass i prototypen. Rapporten fra kassen ble Salg – underveis, ikke bare etterpå. Interessen for skritt ble Helse – bare for deg selv, uten premie for flest skritt. At folk har ulike stasjoner, ble en duell mot din egen vanlige kveld. Og den usynlige innsatsen – opplæring og hjelp til kolleger – ble kudos og takkekort.',
        regi: 'Funksjonene legger seg rundt telefonen, hver med innsikten den kom fra.',
      },
      {
        hvem: 'B',
        sier: 'Og vi bygde inn grensene: Spillene er frivillige, lederen ser laget – ikke tall per person – og det finnes ingen konkurranser om alkohol. Men det er lettere å kjenne enn å høre om.',
        regi: 'Prinsippene lyser opp på funksjonene der de hører hjemme. B klikker og er stille – C går frem med mobilen.',
      },
    ],
    overgang: 'B klikker og er stille. Telefonfilmen starter – C går frem med mobilen til sensor.',
    kilder: ['A2-2', 'A2-3', 'A4', 'P'],
  },
  {
    id: 'demo',
    tittel: 'Prøv selv',
    del: 'Prototype og testing',
    fase: 'prototype',
    varighet: 180,
    takter: [
      {
        hvem: 'stille',
        anim: 10,
        regi: 'Ingen snakker – telefonen kommer frem, snur seg og kameraet kjører inn. Filmen går over i den ekte prototypen av seg selv.',
      },
      {
        hvem: 'C',
        sier: 'Dette er Vaktlogg – en klikkbar konseptprototype. Emma er fiktiv, restauranten er fiktiv og alle tallene er simulerte. Før vakten velger hun selv om hun vil være med: duell, makker, laget – eller rolig. Og nå er det din tur. Sir Domeo viser deg rundt.',
        regi: 'C gir mobilen til sensor. Storskjermen viser det samme som mobilen, og Sir Domeo snakker fra høyttalerne. Uten mobil: sensor (eller C) trykker rett på storskjermen.',
      },
      {
        hvem: 'sensor',
        sek: 130,
        regi: 'Sensor trykker seg gjennom seks stopp: Start vakt → Salg → tilbake til Vakt → kudos til en kollega → Avslutt vakt → sluttrapporten. Ikke forklar underveis – hjelp bare hvis sensor står fast. Klikk videre når sluttrapporten står og Sir Domeo har sagt «Voilà».',
      },
      {
        hvem: 'C',
        sier: 'Det du nettopp gjorde, gjør testerne våre uten oss: Prototypen ligger på nett, Sir Domeo viser dem rundt, og alle kan sende oss tilbakemelding rett fra appen. Lederen har sin egen visning – Kari ser lagmålet og kan sende takkekort, men aldri tall per person.',
        regi: 'C tar mobilen tilbake. Telefonen blir stående på skjermen.',
      },
    ],
    overgang: 'C klikker (PageDown virker også mens du er i appen). Telefonen trekker seg tilbake.',
    kilder: ['A5', 'A6', 'P'],
  },
  {
    id: 'hopping',
    tittel: 'Frem og tilbake',
    del: 'Prototype og testing',
    fase: 'test',
    varighet: 77,
    takter: [
      {
        hvem: 'C',
        sier: 'Og det var aldri en rett linje. Vi hoppet frem og tilbake mellom innsikt og prototype – hele veien.',
        regi: 'De to banene står klare: innsikt og prototype.',
      },
      {
        hvem: 'stille',
        anim: 20,
        regi: 'Ingen snakker. Kula spretter mellom innsikt og prototype, og hvert hopp er noe som skjedde – teksten kommer frem på skjermen. Til slutt ser vi hele mønsteret ovenfra. Går videre av seg selv.',
      },
      {
        hvem: 'C',
        sier: 'Personer med tilknytning til blant annet Noode Sky, Park 29, Frenchie, Olivia og The Thief har prøvd prototypen – noen sammen med oss, andre alene via en lenke. Hver versjon kom av noe vi lærte, og hver versjon ga oss ny innsikt. Ett eksempel: Flere servitører ønsket oversikt over egne gjester og bord. Det var ikke en del av ideen om motivasjon, men vi utforsket det – og lærte at vi må prioritere og avgrense. Vi har også et testopplegg med hypoteser, og vi skiller mellom det vi har planlagt og det vi har gjennomført.',
        regi: 'Mønsteret ovenfra blir stående, med testmiljøene under.',
      },
    ],
    overgang: 'C klikker og fortsetter på refleksjonen.',
    kilder: ['A6', 'A7', 'A8'],
  },
  {
    id: 'refleksjon',
    tittel: 'Hva vi vet – og ikke vet',
    del: 'Refleksjon og videre',
    varighet: 49,
    takter: [
      {
        hvem: 'C',
        sier: 'Vi vil være ærlige om hva vi vet. Det vi har sett: ansatte som sjekker kassarapporten og snakker om skrittene sine. Det vi tror: at synlig innsats og anerkjennelse kan øke motivasjonen. Det vi må teste: om noen faktisk åpner appen etter vakten – med sine egne data.',
        regi: 'Tre kolonner: sett – tror – må teste.',
      },
      {
        hvem: 'C',
        sier: 'Og svakhetene: Noen spørsmål var ledende. Vår egen bransjeerfaring kan ha farget tolkningen. Vi har mest snakket med folk som fortsatt er i bransjen. Konkurranse-eksemplet kom fra én informant, skrittallene er selvrapportert, og positive tilbakemeldinger kan være høflighet.',
        regi: 'Begrensningene legger seg under kolonnene.',
      },
    ],
    overgang: 'C klikker og gir ordet til B.',
    kilder: ['A9'],
  },
  {
    id: 'videre',
    tittel: 'Videre',
    del: 'Refleksjon og videre',
    varighet: 36,
    takter: [
      {
        hvem: 'B',
        sier: 'Neste steg er derfor ikke flere funksjoner, men bedre svar. Opplever ansatte faktisk mer motivasjon? Hvordan blir konkurranser rettferdige? Hvordan unngår vi et kontrollsystem? Hvem betaler – og hvordan holder vi de ansattes behov først hvis arbeidsgiveren er kunden? Og får vi salgsdata fra kassasystemene?',
        regi: 'Spørsmålene kommer frem ett og ett.',
      },
      {
        hvem: 'B',
        sier: 'Et naturlig neste steg kan være en liten pilot med én restaurant eller restaurantgruppe.',
        regi: 'Piloten samler spørsmålene.',
      },
    ],
    overgang: 'B klikker. Alle tre står fremme til avslutningen.',
    kilder: ['A10'],
  },
  {
    id: 'slutt',
    tittel: 'Avslutning',
    del: 'Avslutning',
    varighet: 27,
    takter: [
      { hvem: 'A', sier: 'Vi startet med å undersøke fravær.', regi: 'Bongskinnen kommer tilbake.' },
      {
        hvem: 'B',
        sier: 'Gjennom innsikt og brukermedvirkning endte vi med å utforske hvordan servitører kan oppleve mer motivasjon og anerkjennelse i arbeidshverdagen.',
      },
      {
        hvem: 'C',
        anim: 4,
        sier: 'Vaktlogg er konseptet som vokste frem gjennom den prosessen. Takk.',
        regi: 'Den siste bongen skrives ut: «Vakt ferdig».',
      },
      { hvem: 'alle', regi: 'Sluttkortet med lenken står mens dere tar imot spørsmål.' },
    ],
    overgang: 'Slutt. Spørsmål.',
    kilder: ['A12'],
  },
]

export const PLAN_TOTAL = 720
