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
