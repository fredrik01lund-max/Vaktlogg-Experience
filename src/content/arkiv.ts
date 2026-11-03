import type { Scene } from './types.ts'

/* ═══ LAGT TIL SIDE ══════════════════════════════════════════════════════════════
   Scener som er tatt ut av 12-minuttersflyten for å gi plass til færre og bedre deler.
   Ingenting er slettet: de ligger her med manus og alt, og kan vises fra oversikten (O)
   under «Lagt til side». Flytt en scene tilbake til manus.ts for å bruke den igjen.

   • Theodora (persona og brukerreisen) – etter-vakten-poenget er flyttet til nøkkelfunnene.
   • Designprinsippene – samlet i «Alt vi pakket inn», der hver funksjon viser hvor den kom fra.
   • Sensors designvalg – sensor prøver nå prototypen selv i demoen, med Sir Domeo som guide.
   • Testing og iterasjon – fortalt i «Frem og tilbake» (innsikt ↔ prototype).
   • NABC – lagt til side.
   • Den gamle demoen der C viser prototypen selv – byttet mot sensors omvisning med Sir Domeo (bare manuset;
     telefonen og prototypen er de samme).
   ════════════════════════════════════════════════════════════════════════════════ */

export const lagtTilSide: Scene[] = [
  // ── Erstattet i nattøkta 3.–4.11: de ti nye scenene slår sammen disse (teksten er uendret her) ──
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
  },  {
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
  },  {
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
  },  {
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
  },  {
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
  },  {
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
  },  {
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
  },  {
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
  },  {
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
  // ── Lagt til side tidligere ──
  {
    id: 'persona',
    tittel: 'Theodora og vakten hennes',
    del: 'Design Thinking og konsept',
    fase: 'define',
    varighet: 50,
    takter: [
      {
        hvem: 'B',
        sier: 'For å holde brukeren i sentrum laget vi Theodora. Hun er 26, servitør på Aker Brygge, jobber mye og stiller opp når andre er syke – men opplever at innsatsen ikke alltid blir sett. Theodora er fiktiv. Hun er satt sammen av det vi hørte i intervjuer og samtaler.',
        regi: 'Personakortet. Merket «fiktiv persona».',
      },
      {
        hvem: 'B',
        anim: 3,
        sier: 'Vi fulgte henne gjennom vakten: før, under, etter og dagene etter. Under vakten trekker stor arbeidsbelastning, manglende pauser og lite tilbakemelding ned. Gode kolleger og fornøyde gjester løfter.',
        regi: 'Brukerreisen tegnes i fire faser.',
      },
      {
        hvem: 'B',
        sier: 'Men det mest interessante rommet var etter vakten. Der skjedde nesten ingenting. Hva om vakten kunne gi noe tilbake – egne resultater, utvikling og anerkjennelse?',
        regi: '«Etter vakten» lyser opp som mulighetsrom.',
      },
    ],
    overgang: 'B klikker videre til den første ideen.',
    kilder: ['A3'],
  },
  {
    id: 'prinsipper',
    tittel: 'Innsikt blir prinsipper',
    del: 'Design Thinking og konsept',
    fase: 'ideate',
    varighet: 42,
    takter: [
      {
        hvem: 'B',
        sier: 'Men konkurranser og måling har en bakside. Så vi gjorde innsiktene og risikoene om til designprinsipper.',
        regi: 'Seks prinsipper kommer frem.',
      },
      {
        hvem: 'B',
        anim: 2,
        sier: 'Rettferdighet: folk har ulike stasjoner, gjester og erfaring. Usynlig innsats: opplæring og hjelp til kolleger synes ikke i kassen – derfor kollegaros og takkekort. Frivillighet: ingen må konkurrere. Personvern: den ansatte har kontroll over egne tall, lederen ser lagnivå. Fysisk belastning: ingen premie for flest skritt. Og ansvarlig salg: ingen konkurranser om alkohol – selv om historien som startet ideen, handlet om vin.',
        regi: 'Hvert prinsipp viser hva det kom fra og hvor det ligger i prototypen.',
      },
    ],
    overgang: 'B klikker og vender seg mot sensor.',
    kilder: ['A4'],
  },
  {
    id: 'sensor',
    tittel: 'Du tar designvalget',
    del: 'Design Thinking og konsept',
    fase: 'ideate',
    varighet: 30,
    takter: [
      {
        hvem: 'B',
        sier: 'Vi vil gjerne at du tar ett av valgene. Jonas har terrassen med mange bord, Emma en mindre seksjon. Hvordan bør kveldens konkurranse avgjøres? Si et tall, eller pek.',
        regi: 'Situasjonen og fire alternativer. Tallene er illustrasjoner.',
      },
      {
        hvem: 'sensor',
        regi: 'Vent på svaret, høyst ti sekunder. Trykk tallet sensor velger (1–4). Vil sensor ikke velge: trykk 3 og si «da viser vi hva vi valgte».',
      },
      {
        hvem: 'B',
        anim: 2,
        sier: '[Én setning om valget – skjermen hjelper.] Vi landet på å måle hver mot sin egen vanlige kveld – frivillig, med rolig modus for dem som ikke vil konkurrere.',
        regi: 'Kjeden vises: innsikt → beslutning → funksjon i prototypen.',
      },
    ],
    overgang: 'B klikker og er stille. Telefonfilmen starter – C går frem.',
    kilder: ['A4', 'P'],
  },
  {
    id: 'testing',
    tittel: 'Testing og iterasjon',
    del: 'Prototype og testing',
    fase: 'test',
    varighet: 62,
    takter: [
      {
        hvem: 'C',
        sier: 'Personer med tilknytning til blant annet Noode Sky, Park 29, Frenchie, Olivia og The Thief har prøvd prototypen. Vi har vist den fram, latt folk utforske selv via en lenke og samlet muntlige og skriftlige tilbakemeldinger. Vi har også et strukturert testopplegg med hypoteser – og vi skiller mellom det vi har planlagt og det vi har gjennomført.',
        regi: 'Testmiljøene og testformene. «Planlagt» og «gjennomført» står hver for seg.',
      },
      {
        hvem: 'C',
        anim: 2,
        sier: 'Hver versjon kom av noe vi lærte. Først en tidlig prototype vi viste fram. Så en digital versjon på en lenke, så folk kunne teste uten oss. Så Sir Domeo, så den forklarte seg selv. Og så et tilbakemeldingsskjema – da ble prototypen også et verktøy for ny innsikt.',
        regi: 'Tidslinjen 22.–30. oktober med pilene tilbake.',
      },
      {
        hvem: 'C',
        sier: 'Et eksempel: Flere servitører ønsket oversikt over egne gjester og bord på mobilen. Det var ikke en del av ideen om motivasjon, men vi utforsket det. Det viser også utfordringen: Ikke alle ønsker passer formålet – vi må prioritere og avgrense.',
        regi: 'Gjesteinformasjonen som eksempel på brukerdrevet endring.',
      },
    ],
    overgang: 'C klikker videre til NABC.',
    kilder: ['A6', 'A7', 'A8'],
  },
  {
    id: 'nabc',
    tittel: 'NABC',
    del: 'Prototype og testing',
    varighet: 41,
    takter: [
      {
        hvem: 'C',
        sier: 'Behovet: interesse for egen aktivitet, egne salgstall og anerkjennelse – og et rom etter vakten der innsatsen forsvinner.',
        regi: 'N – Need.',
      },
      {
        hvem: 'C',
        sier: 'Løsningen: Vaktlogg samler aktivitet, salg, personlig progresjon, frivillige konkurranser og anerkjennelse i én mobil tjeneste.',
        regi: 'A – Approach.',
      },
      {
        hvem: 'C',
        sier: 'Mulige fordeler: bedre oversikt, mer synlig anerkjennelse og mestring – og for restauranten et nytt verktøy for engasjement. Men dette er hypoteser, ikke resultater.',
        regi: 'B – Benefits, merket «hypoteser».',
      },
      {
        hvem: 'C',
        sier: 'Alternativene finnes i biter: aktivitetsapper, kassasystemer og manuelle konkurranser. Det mulige fortrinnet er helheten for restaurantansatte. Vi har ikke dokumentert at Vaktlogg er bedre.',
        regi: 'C – Competition.',
      },
    ],
    overgang: 'C klikker og gir ordet til A.',
    kilder: ['A11', 'B'],
  },
  {
    id: 'demo-c',
    tittel: 'Prototypen (C viser selv)',
    del: 'Prototype og testing',
    fase: 'prototype',
    varighet: 106,
    takter: [
      {
        hvem: 'stille',
        anim: 10,
        regi: 'Ingen snakker – demoen starter av seg selv når filmen er ferdig. Telefonen kommer frem, snur seg og kameraet kjører inn. Filmen går over i den ekte prototypen. C tar over når appen er live.',
      },
      {
        hvem: 'C',
        sier: 'Dette er Vaktlogg – en klikkbar konseptprototype. Vi følger Emma, en fiktiv servitør på en fiktiv restaurant, og alle tall er simulerte. Før vakten velger hun selv om hun vil være med: duell, makker, laget – eller rolig.',
        regi: 'Trykk «Start vakt» i appen når du har sagt dette.',
      },
      {
        hvem: 'C',
        sier: 'Nå spilles fredagskvelden av på to minutter. Under Salg ligger det vi så i observasjonene: rapporten fra kassen – bare at den er hennes, både underveis og etterpå.',
        regi: 'Trykk på Salg-boksen.',
      },
      {
        hvem: 'C',
        sier: 'I Konkurranse ser dere valget fra i stad: Duellen måles i prosent av hennes egen vanlige kveld. Og skritt og puls under Helse er bare for henne – ingen premie for flest skritt.',
        regi: 'Vakt-fanen → Konkurranse. Så Vakt-fanen → Helse.',
      },
      {
        hvem: 'C',
        sier: 'Så lederen. Kari ser lagmålet og kan sende takkekort for noe konkret – men aldri tall per person.',
        regi: 'Trykk K i demolinjen (Karis telefon).',
      },
      {
        hvem: 'C',
        sier: 'Og etter vakten – mulighetsrommet fra brukerreisen. Sluttrapporten samler kvelden: salg, rekorder, kudos fra kollegene og takkekortet fra Kari.',
        regi: 'Trykk E (Emma), så «Avslutt vakt» i demolinjen.',
      },
      {
        hvem: 'C',
        sier: 'Prototypen ligger på nett. Guiden vår, Sir Domeo, viser testere rundt når vi ikke er der – og alle kan sende oss tilbakemelding rett fra appen.',
        regi: 'Pek på Sir Domeo i demolinjen.',
      },
    ],
    overgang: 'C klikker (PageDown virker også mens du er i appen). Telefonen trekker seg tilbake.',
    kilder: ['A5', 'P'],
  },
]
