import type { Scene } from './types.ts'

/* ═══ MANUS V1 – BEHIND THE SHIFT (10 scener, 4.11) – ERSTATTET AV MANUS V2 8.11, LIGGER HER URØRT ═════
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

export const manusV1: Scene[] = [
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
        sier: 'Vi startet med sykefravær i restaurantbransjen. Det er ofte for få på jobb, og dagene er lange og fysisk tunge. Så vi gikk ut og snakket med folk.',
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
    varighet: 52,
    takter: [
      {
        hvem: 'A',
        sier: 'Vi har intervjuet servitører, hovmestere og ledere, og observert folk i jobb, blant annet på Noode Sky og Park 29. Selv har vi jobbet som servitør, hovmester og daglig leder. Det gjorde det lettere å komme inn, men vi ser også lett det vi kjenner fra før.',
        regi: 'Kildene står som en liste: intervjuer, samtaler, observasjoner, egen erfaring. Ikke si et samlet antall intervjuer.',
      },
      {
        hvem: 'A',
        sier: 'Vi spurte blant annet: Hva skal til for at en travel vakt blir en god vakt i stedet for en jævlig en? Svarene handlet mest om nok folk på jobb.',
        regi: 'Spørsmålet står stort, ordrett fra intervjuguiden, med svarene kort under.',
      },
      {
        hvem: 'A',
        sier: 'Da vi spurte hva som tar motivasjonen, sa en servitør det omtrent sånn: «Jeg jobber veldig mye og får veldig lite tilbake, og da mister jeg motivasjonen.» I den siste jobben var det bare gjestene som motiverte henne.',
        regi: 'Sitatet står alene, med spørsmålet det svarte på (28). Merket «språklig bearbeidet» – hun snakker norsk som andrespråk.',
      },
    ],
    overgang: 'A klikker videre til nøkkelfunnene.',
    kilder: ['A2', 'A2-1', 'G', 'I1', 'I2', 'I3'],
  },
  {
    id: 'funn',
    tittel: 'Nøkkelfunn',
    del: 'Problem og innsikt',
    fase: 'empathize',
    varighet: 40,
    takter: [
      {
        hvem: 'A',
        sier: 'Tre ting gikk igjen. Det første var bevegelse. Flere svarte i skritt da vi spurte hvor mye de var i farta. En hovmester teller skrittene sine hver dag, og kommer opp i 25 000 på en lang vakt. Farten var ofte positiv. Det som slet, var tunge løft.',
        regi: 'Et stillbilde fra filmen fryses, og «bevegelse» tegnes ved servitøren. Tallet er merket «selvrapportert».',
      },
      {
        hvem: 'A',
        sier: 'Det andre var salget. Vi så ansatte sjekke kassarapporten når vakten var over.',
        regi: '«Salg» tegnes ved bordet. Merket «observert».',
      },
      {
        hvem: 'A',
        sier: 'Det tredje var anerkjennelse, fra gjester, kolleger og ledere. Vår tolkning er at lite av innsatsen blir synlig etter vakten. Kassarapporten er nesten det eneste.',
        regi: 'Bildet blir mørkt: vakten er over. Tolkningen står merket «vår tolkning», og de tre funnene står igjen.',
      },
    ],
    overgang: 'A klikker. SYKEFRAVÆR kommer tilbake.',
    kilder: ['A2-1', 'A2-2', 'A2-3', 'A3', 'I1', 'I2', 'I3'],
  },
  {
    id: 'snu',
    tittel: 'Problemstillingen',
    del: 'Problem og innsikt',
    fase: 'define',
    varighet: 48,
    takter: [
      {
        hvem: 'A',
        sier: 'Da vi spurte hvorfor folk blir borte fra jobb, svarte de slitsom jobb, lange dager, tunge løft og lønn. En leder sa at folk føler seg brukt. Og servitøren vi siterte, gikk på jobb selv om hun burde vært hjemme, fordi de alltid mangler folk.',
        regi: 'Det de svarte om fravær, står rundt SYKEFRAVÆR.',
      },
      {
        hvem: 'stille',
        anim: 7,
        auto: 7.5,
        regi: 'Ingen snakker. Bokstavene vender seg: SYKEFRAVÆR blir MOTIVASJON. B går frem. Går videre av seg selv.',
      },
      {
        hvem: 'B',
        sier: 'Lønn og bemanning kan ikke vi designe bort. Men det å bli sett for innsatsen sin, kan vi gjøre noe med. Så spørsmålet ble: Hvordan kan vi øke motivasjonen i jobben som servitør? At mer motivasjon gir mindre fravær, har vi ikke vist.',
        regi: 'Problemstillingen står under MOTIVASJON.',
      },
    ],
    overgang: 'B klikker videre til den første ideen.',
    kilder: ['A1', 'A3', 'I1', 'I2', 'I3'],
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
        sier: 'Den første ideen var en slags Strava for jobben, fordi flere allerede talte skrittene sine. En skritteller som starter når du stempler inn, og stopper når du går hjem.',
        regi: 'Skissen av ideen.',
      },
      {
        hvem: 'B',
        sier: 'Den samme servitøren fortalte om en travel kveld hun gikk hjem fra i godt humør. Sjefen hadde lovet henne noe hvis hun solgte en dyr vin. Hun gikk veldig mye, og hun solgte tre flasker.',
        regi: 'Historien, merket «gjenfortalt, ikke ordrett». Pris og premie er uklare i opptaket – ikke nevn tall.',
      },
      {
        hvem: 'stille',
        anim: 9,
        auto: 9.5,
        regi: 'Ingen snakker. Skrittene og salget møtes og blir Vaktlogg-merket. Går videre av seg selv.',
      },
      {
        hvem: 'B',
        sier: 'Der hang skrittene og salget sammen. Vi samlet dem i én app, med anerkjennelse fra kollegene. Den appen er Vaktlogg.',
        regi: 'Merket står.',
      },
      {
        hvem: 'B',
        sier: 'Men hvordan blir en konkurranse rettferdig når folk har ulike stasjoner? Måler vi salg, vinner den med best stasjon. Måler vi skritt, belønner vi å slite seg ut. Så hver måles mot sin egen vanlige kveld, og rolig modus lar deg stå utenfor. Og det er ingen konkurranser om alkohol.',
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
    varighet: 48,
    takter: [
      {
        hvem: 'stille',
        anim: 16,
        regi: 'Ingen snakker. Blender-filmen: skjermbildene fra prototypen svever rundt telefonen og flyr inn i den, én for én og stadig raskere. Når alt er pakket inn, kommer pastellringene. Går videre av seg selv når filmen er ferdig.',
      },
      {
        hvem: 'B',
        sier: 'Hvert funn ga oss en funksjon. Kassarapporten ga oss Salg, der du ser salget mens du jobber. Skrittene havnet i Helse, som bare du ser. Hjelp til kolleger synes ikke i kassen, så den kan de takke for med kudos. Og for tiden etter vakten laget vi sluttrapporten.',
        regi: 'Telefonen viser ekte skjermbilder, ett per funksjon, med det funksjonen kom fra.',
      },
      {
        hvem: 'B',
        sier: 'Mål, premier og personalmenyen er med som tillegg. Lederen ser bare tall for hele laget, fordi tall per person fort blir kontroll.',
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
    varighet: 163,
    takter: [
      {
        hvem: 'stille',
        anim: 7,
        regi: 'Ingen snakker – telefonen på bordet våkner, og kameraet går rett over den. Filmen går over i den ekte prototypen av seg selv.',
      },
      {
        hvem: 'C',
        sier: 'Dette er prototypen. Emma og restauranten er fiktive, og tallene er simulert. Se etter hva Emma sitter igjen med når vakten er over. Værsågod, Sir Domeo viser deg rundt.',
        regi: 'C gir mobilen til sensor. Storskjermen viser det samme som mobilen, og Sir Domeo snakker fra høyttalerne. Trykker sensor «Start vakt», går presentasjonen videre av seg selv.',
      },
      {
        hvem: 'sensor',
        sek: 130,
        regi: 'Sensor trykker seg gjennom seks stopp: Start vakt → Salg → tilbake til Vakt → kudos → Avslutt vakt → sluttrapporten. Ikke forklar underveis – hjelp bare hvis sensor står fast. Ved 2:00: står sensor ikke på sluttrapporten, sier C «Trykk Avslutt vakt nederst». Senest ved 2:30 tar C over, uansett hvor sensor er. Har dere to sensorer: bestem på forhånd hvem som får mobilen. Uten mobil: C styrer med musen og sensor sier hva hun vil trykke på.',
      },
      {
        hvem: 'C',
        sier: 'Takk. Det du så til slutt, er det hun sitter igjen med. Og duellen på startskjermen er valget B viste: Emma mot sin egen vanlige kveld.',
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
    varighet: 57,
    takter: [
      {
        hvem: 'stille',
        anim: 12,
        regi: 'Ingen snakker. Kula spretter mellom innsikt og prototype, og til slutt ser vi hele sporet ovenfra. Går videre av seg selv.',
      },
      {
        hvem: 'C',
        sier: 'Vi viste en tidlig prototype til servitører og laget så den første digitale versjonen. Folk skulle kunne prøve uten oss, så vi la den ut på en lenke. Uten oss trengte de en guide, og det ble Sir Domeo. Til slutt la vi inn tilbakemelding rett i appen, så vi kunne høre fra flere.',
        regi: 'Parene «vi så → vi endret» kommer frem langs sporet, med dato.',
      },
      {
        hvem: 'C',
        sier: 'Flere servitører ville også ha oversikt over egne gjester og bord. Det hørte ikke til motivasjonsideen, så det er med i appen, men utenfor kjernen. Om Vaktlogg motiverer, har ingen test svart på ennå. Vi har skrevet et testopplegg med hypoteser, men ikke gjennomført det.',
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
    varighet: 53,
    takter: [
      {
        hvem: 'C',
        sier: 'Vi har sett ansatte sjekke kassarapporten, og hørt dem fortelle om skrittene sine. Vi tror at det å se sin egen innsats, og bli sett for den, kan gi mer motivasjon. Om noen faktisk åpner appen etter vakten, vet vi ikke. Det må testes.',
        regi: 'Tre kolonner: sett, tror, må teste.',
      },
      {
        hvem: 'C',
        sier: 'Og materialet har svakheter. Bevegelse var et kjernetema i guiden, så skrittene er delvis noe vi spurte etter. Sitatet, vinhistorien og sykdomseksempelet kommer fra samme intervju. Og positive tilbakemeldinger kan være høflighet.',
        regi: 'Svakhetene står som en kort liste under kolonnene.',
      },
      {
        hvem: 'C',
        sier: 'Før vi bygger mer, vil vi prøve Vaktlogg i én restaurant over tid. Oppleves det rettferdig å måles mot sin egen vanlige kveld? Oppleves det som kontroll? Og får vi data fra kassasystemet? Hvem som skal betale, vet vi ikke ennå.',
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
      { hvem: 'B', sier: 'Vi endte med motivasjon, og med det samme spørsmålet som i starten. Hva sitter servitøren igjen med etter vakten?' },
      {
        hvem: 'C',
        anim: 3,
        sier: 'Vaktlogg er vårt forslag. Når vakten er over, kan hun se hva hun fikk til. Om det faktisk motiverer, må vi teste. Takk.',
        regi: 'Den siste bongen skrives ut: «Vakt ferdig».',
      },
      { hvem: 'alle', regi: 'Sluttkortet med lenken står mens dere tar imot spørsmål.' },
    ],
    overgang: 'Slutt. Spørsmål.',
    kilder: ['A12'],
  },
]

/** Planlagt total (summen av scenene). Målet er rundt 10:00 med margin. */
export const PLAN_TOTAL_V1 = 600
/** Den harde grensen for fremføringen. */
export const MAKS_TOTAL_V1 = 720
