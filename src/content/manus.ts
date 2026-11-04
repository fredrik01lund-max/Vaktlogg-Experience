import type { Scene } from './types.ts'

/* ═══ MANUS – BEHIND THE SHIFT ════════════════════════════════════════════════════
   Én kilde for alt: hovedskjermen, presentatørvisningen og det utskrivbare manuset
   leser herfra. Endre teksten her, så følger alt med.

   • Hver takt er ett klikk. «sier» er manus, «regi» er det som skjer og hva man gjør.
   • «anim» = sekunder animasjon når takten starter (presentatørvisningen sier «vent»).
   • Planen (PLAN_TOTAL) gir margin opp til 10:00 og godt under den harde grensen på 12:00.
     Kjør `npm run sjekk`.
   • Ikke legg inn tall, sitater eller funn som ikke er dokumentert (se kilder.ts).
   • Skriv slik dere snakker: korte setninger, høyst én tankestrek per replikk, ingen slagord.
     Les replikkene høyt – det dere snubler i, skrives om.
   ════════════════════════════════════════════════════════════════════════════════ */

export const manus: Scene[] = [
  {
    id: 'vakten',
    tittel: 'Vakten',
    del: 'Åpning',
    tema: 'mork',
    varighet: 44,
    takter: [
      {
        hvem: 'stille',
        anim: 18,
        regi: 'Ingen snakker. Filmen: servitøren stempler inn (16:00), kameraet løfter seg over restauranten mens kvelden går, og sporet der hun går blir igjen når lysene slukkes. Tittelen kommer. Går videre av seg selv når filmen er ferdig.',
      },
      {
        hvem: 'A',
        sier: 'Hei, vi er {A}, {B} og {C}. Det dere så, er en tenkt fredagsvakt. Når den er over, går servitøren hjem. Hva sitter hun igjen med?',
        regi: 'Navnene står under tittelen. Si «tenkt» tydelig – restauranten er fiktiv.',
      },
      {
        hvem: 'A',
        sier: 'Vi startet med sykefravær i restaurantbransjen. Bemanningen er knapp, marginene er små og dagene er fysisk tunge. Så vi gikk ut og snakket med folk.',
        regi: 'SYKEFRAVÆR kommer frem med de tre kjennetegnene.',
      },
    ],
    overgang: 'A klikker videre og fortsetter rett på hvem vi snakket med.',
    kilder: ['A1'],
  },
  {
    id: 'folk',
    tittel: 'Hvem vi snakket med',
    del: 'Problem og innsikt',
    fase: 'empathize',
    varighet: 48,
    takter: [
      {
        hvem: 'A',
        sier: 'Vi har intervjuet og snakket med servitører, hovmestere og ledere, og observert folk i jobb, blant annet på Noode Sky og Park 29. Selv har vi jobbet som servitør, hovmester og daglig leder. Det åpnet dører, men gjør også at vi lett ser det vi kjenner fra før.',
        regi: 'Kildene står som en liste: intervjuer, samtaler, observasjoner, egen erfaring. Ikke si et samlet antall intervjuer.',
      },
      {
        hvem: 'A',
        sier: 'Ett spørsmål ga mer enn de andre: Hva skal til for at en travel vakt blir en god vakt i stedet for en jævlig en?',
        regi: 'Spørsmålet står stort, ordrett fra intervjuguiden.',
      },
      {
        hvem: 'A',
        sier: 'En servitør sa det omtrent sånn: «Jeg jobber veldig mye og får veldig lite tilbake, og da mister jeg motivasjonen.» Det som holdt henne gående, var tilbakemeldinger fra gjestene.',
        regi: 'Sitatet står alene. Merket «språklig bearbeidet» – hun snakker norsk som andrespråk.',
      },
    ],
    overgang: 'A klikker videre til nøkkelfunnene.',
    kilder: ['A2', 'A2-1', 'G', 'I2'],
  },
  {
    id: 'funn',
    tittel: 'Nøkkelfunn',
    del: 'Problem og innsikt',
    fase: 'empathize',
    varighet: 42,
    takter: [
      {
        hvem: 'A',
        sier: 'Tre ting gikk igjen. Det første var bevegelse. Flere svarte i skritt da vi spurte hvor mye de var i farta. En hovmester teller hver dag, og kommer opp i 25 000 på en lang vakt. Farten var ofte positiv. Det som slet, var tunge løft.',
        regi: 'Et stillbilde fra filmen fryses, og «bevegelse» tegnes ved servitøren. Tallet er merket «selvrapportert».',
      },
      {
        hvem: 'A',
        sier: 'Det andre var salget. Vi så ansatte sjekke kassarapporten etter vakten, men dagen etter var den vanskelig å finne igjen.',
        regi: '«Salg» tegnes ved bordet. Merket «observert».',
      },
      {
        hvem: 'A',
        sier: 'Det tredje var anerkjennelse, fra gjester, kolleger og ledere. Og etter vakten skjedde det nesten ingenting. Innsatsen ble ikke synlig noe sted.',
        regi: 'Bildet blir mørkt: vakten er over. De tre funnene står igjen.',
      },
    ],
    overgang: 'A klikker. SYKEFRAVÆR kommer tilbake.',
    kilder: ['A2-1', 'A2-2', 'A2-3', 'A3', 'I1'],
  },
  {
    id: 'snu',
    tittel: 'Problemstillingen',
    del: 'Problem og innsikt',
    fase: 'define',
    varighet: 40,
    takter: [
      {
        hvem: 'A',
        sier: 'Noen koblet lav motivasjon til fravær. En servitør fortalte at hun gikk på jobb syk fordi de alltid mangler folk.',
        regi: 'Det informantene pekte på, står rundt SYKEFRAVÆR.',
      },
      {
        hvem: 'stille',
        anim: 7,
        auto: 7.5,
        regi: 'Ingen snakker. Bokstavene vender seg: SYKEFRAVÆR blir MOTIVASJON. B går frem. Går videre av seg selv.',
      },
      {
        hvem: 'B',
        sier: 'Fravær henger sammen med bemanning, lønn og mye vi ikke kan designe bort. Motivasjon kan vi gjøre noe med. Så spørsmålet ble: Hvordan kan vi øke motivasjonen i jobben som servitør? Vi har ikke vist at lav motivasjon gir fravær. Men det var dit folk pekte.',
        regi: 'Problemstillingen står under MOTIVASJON.',
      },
    ],
    overgang: 'B klikker videre til den første ideen.',
    kilder: ['A1', 'A3', 'I2'],
  },
  {
    id: 'valg',
    tittel: 'Fra Strava til Vaktlogg',
    del: 'Design Thinking og konsept',
    fase: 'ideate',
    varighet: 71,
    takter: [
      {
        hvem: 'B',
        sier: 'Den første ideen var en slags Strava for jobben: en skritteller som starter når du stempler inn og stopper når du går hjem.',
        regi: 'Skissen av ideen.',
      },
      {
        hvem: 'B',
        sier: 'Så fortalte en servitør om en kveld der sjefen hadde lovet en premie for å selge vin til 5 000 kroner. Hun lærte opp en ny servitør samtidig og gikk veldig mye. Hun solgte tre flasker og syntes det var verdt det.',
        regi: 'Historien, merket «fortalt i ett intervju».',
      },
      {
        hvem: 'stille',
        anim: 9,
        auto: 9.5,
        regi: 'Ingen snakker. Skrittene og salget møtes og blir Vaktlogg-merket. Går videre av seg selv.',
      },
      {
        hvem: 'B',
        sier: 'Der hørte skrittene og salget sammen. Det ble Vaktlogg.',
        regi: 'Merket står.',
      },
      {
        hvem: 'B',
        sier: 'Men hvordan blir en konkurranse rettferdig når folk har ulike stasjoner? Høyest omsetning gir den beste stasjonen fordel, og flest skritt belønner å slite seg ut. Vi valgte at hver måles mot sin egen vanlige kveld, og at man kan stå utenfor. Og selv om historien startet med vin, er det ingen konkurranser om alkohol.',
        regi: 'Fire alternativer. To strykes, valget og «rolig modus» blir stående, og vinen krysses ut.',
      },
    ],
    overgang: 'B klikker videre til det vi prioriterte.',
    kilder: ['A4', 'A2-4', 'I2'],
  },
  {
    id: 'prioritert',
    tittel: 'Det vi prioriterte',
    del: 'Design Thinking og konsept',
    fase: 'ideate',
    varighet: 31,
    takter: [
      {
        hvem: 'B',
        sier: 'Det vi lærte, ble funksjoner. Kassarapporten ble Salg, som du ser underveis. Skrittene ble Helse, bare for deg selv. Hjelpen til kolleger, som ikke synes i kassen, ble kudos og takkekort. Og rommet etter vakten ble sluttrapporten.',
        regi: 'Telefonen viser ekte skjermbilder, ett per funksjon, med det funksjonen kom fra.',
      },
      {
        hvem: 'B',
        sier: 'Noe kom med uten å være kjernen, som oversikten over gjester og bord som testerne ba om. Og lederen ser bare laget, aldri tall per person.',
        regi: 'Resten står nedtonet. Lederprinsippet lyser opp. B klikker og er stille – C går frem med mobilen.',
      },
    ],
    overgang: 'B klikker og er stille. Telefonfilmen starter – C går frem med mobilen til sensor.',
    kilder: ['A2-2', 'A2-3', 'A4', 'A6', 'P'],
  },
  {
    id: 'demo',
    tittel: 'Prøv selv',
    del: 'Prototype og testing',
    tema: 'mork',
    fase: 'prototype',
    varighet: 166,
    takter: [
      {
        hvem: 'stille',
        anim: 7,
        regi: 'Ingen snakker – telefonen på bordet våkner, og kameraet går rett over den. Filmen går over i den ekte prototypen av seg selv.',
      },
      {
        hvem: 'C',
        sier: 'Dette er prototypen. Emma og restauranten er fiktive, og tallene er simulert. Værsågod, Sir Domeo viser deg rundt.',
        regi: 'C gir mobilen til sensor. Storskjermen viser det samme som mobilen, og Sir Domeo snakker fra høyttalerne. Trykker sensor «Start vakt», går presentasjonen videre av seg selv.',
      },
      {
        hvem: 'sensor',
        sek: 130,
        regi: 'Sensor trykker seg gjennom seks stopp: Start vakt → Salg → tilbake til Vakt → kudos → Avslutt vakt → sluttrapporten. Ikke forklar underveis – hjelp bare hvis sensor står fast. Senest ved 2:30 tar C over, uansett hvor sensor er. Uten mobil: C styrer med musen og sensor sier hva hun vil trykke på.',
      },
      {
        hvem: 'C',
        sier: 'Det du nettopp gjorde, har testerne våre gjort uten oss, med en lenke og Sir Domeo som guide. De kan også sende oss tilbakemelding rett fra appen.',
        regi: 'C tar mobilen tilbake.',
      },
    ],
    overgang: 'C klikker (PageDown virker også mens du er i appen). Telefonen trekker seg tilbake.',
    kilder: ['A5', 'A6', 'P'],
  },
  {
    id: 'hopping',
    tittel: 'Frem og tilbake',
    del: 'Prototype og testing',
    tema: 'mork',
    fase: 'test',
    varighet: 62,
    takter: [
      {
        hvem: 'stille',
        anim: 12,
        regi: 'Ingen snakker. Kula spretter mellom innsikt og prototype, og til slutt ser vi hele sporet ovenfra. Går videre av seg selv.',
      },
      {
        hvem: 'C',
        sier: 'Vi hoppet hele tiden mellom innsikt og prototype. Vi viste en tidlig prototype til servitører, og 22. oktober kom den første digitale versjonen. Folk skulle kunne prøve uten oss, så 27. oktober la vi den ut på en lenke. Da trengte de en guide, og det ble Sir Domeo. Fra 30. oktober kan alle sende tilbakemelding rett fra appen.',
        regi: 'Parene «vi så → vi endret» kommer frem langs sporet, med dato.',
      },
      {
        hvem: 'C',
        sier: 'Ett ønske gikk motsatt vei: Flere servitører ville ha oversikt over egne gjester og bord. Det var ikke en del av ideen om motivasjon, men vi prøvde det, og lærte at vi må prioritere. Et testopplegg med hypoteser er utarbeidet, men ikke gjennomført ennå.',
        regi: 'Hvem som har prøvd står som én setning under.',
      },
    ],
    overgang: 'C klikker og fortsetter på hva vi vet.',
    kilder: ['A6', 'A7', 'A8'],
  },
  {
    id: 'vet',
    tittel: 'Hva vi vet, og hva nå',
    del: 'Refleksjon og videre',
    varighet: 49,
    takter: [
      {
        hvem: 'C',
        sier: 'Det vi har sett: ansatte som sjekker kassarapporten og snakker om skrittene sine. Det vi tror: at synlig innsats og anerkjennelse kan gi mer motivasjon. Det vi må teste: om noen faktisk åpner appen etter vakten, med sine egne tall.',
        regi: 'Tre kolonner: sett, tror, må teste.',
      },
      {
        hvem: 'C',
        sier: 'Og materialet har svakheter. Noen spørsmål var ledende, flere av de sterkeste eksemplene kommer fra samme intervju, og positive tilbakemeldinger kan være høflighet.',
        regi: 'Svakhetene står som en kort liste under kolonnene.',
      },
      {
        hvem: 'C',
        sier: 'Derfor vil vi finne svar før vi lager mer. Hvordan blir det rettferdig? Hvordan unngår vi at det blir et kontrollsystem? Hvem skal betale? Og får vi data fra kassasystemene? En liten pilot med én restaurant kan gi oss svarene.',
        regi: 'Spørsmålene og piloten.',
      },
    ],
    overgang: 'C klikker. Alle tre står fremme til avslutningen.',
    kilder: ['A9', 'A10'],
  },
  {
    id: 'slutt',
    tittel: 'Avslutning',
    del: 'Avslutning',
    varighet: 21,
    takter: [
      { hvem: 'A', sier: 'Vi startet med sykefravær.', regi: 'Bongskinnen kommer tilbake.' },
      { hvem: 'B', sier: 'Vi endte med motivasjon, og med spørsmålet om hva servitøren sitter igjen med etter vakten.' },
      {
        hvem: 'C',
        anim: 3,
        sier: 'Vaktlogg er vårt forslag: Når vakten er over, kan hun se hva hun fikk til. Om det faktisk motiverer, må vi teste. Takk.',
        regi: 'Den siste bongen skrives ut: «Vakt ferdig».',
      },
      { hvem: 'alle', regi: 'Sluttkortet med lenken står mens dere tar imot spørsmål.' },
    ],
    overgang: 'Slutt. Spørsmål.',
    kilder: ['A12'],
  },
]

/** Planlagt total (summen av scenene). Målet er rundt 10:00 med margin. */
export const PLAN_TOTAL = 600
/** Den harde grensen for fremføringen. */
export const MAKS_TOTAL = 720
