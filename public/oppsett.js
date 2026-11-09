/* ═══ VAKTLOGG EXPERIENCE – OPPSETT ════════════════════════════════════════════
   Denne filen kan endres uten å bygge på nytt (også i den ferdige eksamensmappen).
   Lagre, og last presentasjonen på nytt i nettleseren.

   Tomme felt (null eller '') vises ikke på hovedskjermen. Presentatørvisningen og
   manuset markerer dem som «fyll inn», så dere ser hva som mangler.
   ═══════════════════════════════════════════════════════════════════════════════ */
window.VAKTLOGG_OPPSETT = {
  // De tre presentatørene. Navnene vises i presentatørvisningen, manuset og som en diskret
  // navnelinje nederst på hovedskjermen når en ny person tar over.
  presentatorer: {
    A: { navn: 'Presentatør A', rolle: 'Problem og innsikt' },
    B: { navn: 'Presentatør B', rolle: 'Design Thinking og konseptutvikling' },
    C: { navn: 'Presentatør C', rolle: 'Prototype, testing og refleksjon' },
  },

  // Tall fra innsiktsarbeidet. La stå null til dere har sjekket tallet i dokumentasjonen.
  // Ikke før opp et samlet antall intervjuer dere ikke kan dokumentere.
  innsikt: {
    transkriberteIntervjuer: null, // antall intervjuer som foreligger som transkripsjon
    observasjonssteder: ['Noode Sky', 'Park 29'],
    testmiljoer: ['Noode Sky', 'Park 29', 'Frenchie', 'Olivia', 'The Thief'],
    // Dokumenterte funn fra brukertestene (kort, med kilde i parentes). Vises i testdelen når de er fylt inn.
    testfunn: [
      // 'Eksempel: «…» (skriftlig tilbakemelding via skjemaet, 31.10)',
    ],
  },

  // Restaurantlyd i åpningen (valgfritt). Legg en lydfil i lyd/ og skriv navnet her, f.eks. 'lyd/restaurant.mp3'.
  // Presentasjonen virker like godt uten lyd. Bruk bare lyd dere har rett til å spille.
  lyd: { apning: '', volum: 0.35 },

  // Lenken som vises på sluttkortet
  prototypeUrl: 'https://fredrik01lund-max.github.io/Vaktlogg/',
}
