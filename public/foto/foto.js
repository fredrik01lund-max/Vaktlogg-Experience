/* ═══ VAKTLOGG EXPERIENCE – FOTOGRAFIER ═══════════════════════════════════════════
   Bytt bilder uten å endre kode: legg bildefilen i riktig mappe, skriv filnavnet i
   «fil» under riktig plass, og last siden på nytt. Se alle plassene, status og
   fokuspunkt på ?vis=foto (trykk på bildet for å sette fokuspunkt).

   HVOR BILDET SKAL LIGGE
   • foto/          – bare bilder alle på bildet har sagt ja til at publiseres på nettet
                      (GitHub Pages er offentlig). Denne mappen ligger i git.
   • foto-eksamen/  – bilder som bare er klarert for fremføringen. Mappen er IKKE i git
                      og kommer bare med i eksamensversjonen (npm run build:eksamen) og
                      når dere øver lokalt (npm run dev).

   SAMTYKKE – vises bare når det stemmer
   • samtykke.eksamen   = true når tillatelsen dekker visning under eksamen
   • samtykke.offentlig = true når tillatelsen også dekker offentlig publisering
   Den offentlige nettsiden viser bare bilder med offentlig: true. Eksamensversjonen viser
   bilder med eksamen: true. Uten samtykke vises en nøytral plassholder (aldri et KI-ansikt).

   SITATER
   • kanKnyttesTilSitat = false (standard): bildet og sitatet holdes visuelt adskilt, og
     bildeteksten sier at personen på bildet ikke er den som siteres.
     Sett true bare når personen har sagt sitatet OG har gitt tillatelse til koblingen.

   FELTENE
   • fil         filnavn, f.eks. 'servitor-park29.jpg' (jpg/png/webp, gjerne 2400 px på lengste side)
   • fokus       [x, y] fra 0 til 1 – punktet som alltid skal være med når bildet beskjæres
                 (ansiktet). [0.5, 0.5] = midten.
   • tekst       kort bildetekst (vises diskret nederst)
   • kreditering f.eks. 'Foto: Navn Navnesen'
   • lag         valgfrie dybdelag for 2,5D-effekt: [{ fil: 'bakgrunn.jpg', dybde: 0.3 },
                 { fil: 'person-utklippet.png', dybde: 1 }]. Tomt = vanlig bilde med svak parallakse.
   • justering   valgfri fargejustering for akkurat dette bildet, f.eks. { lysstyrke: 1.1, metning: 0.9 }
   ═══════════════════════════════════════════════════════════════════════════════════ */
window.VAKTLOGG_FOTO = {
  // Felles fargebehandling, så bilder fra ulike kameraer får samme uttrykk
  behandling: { metning: 0.78, kontrast: 1.08, lysstyrke: 0.96, varme: 0.12, korn: 0.06 },

  plasser: {
    // ── Menneskene bak innsikten: mosaikk (blandet stående og liggende går fint) ──
    'mennesker-1': { fil: '', fokus: [0.5, 0.35], tekst: '', kreditering: '', samtykke: { eksamen: false, offentlig: false }, identifiserbar: true, beskrivelse: 'Servitør (portrett)' },
    'mennesker-2': { fil: '', fokus: [0.5, 0.35], tekst: '', kreditering: '', samtykke: { eksamen: false, offentlig: false }, identifiserbar: true, beskrivelse: 'Hovmester eller servitør i arbeid' },
    'mennesker-3': { fil: '', fokus: [0.5, 0.35], tekst: '', kreditering: '', samtykke: { eksamen: false, offentlig: false }, identifiserbar: true, beskrivelse: 'Kollegaer sammen på jobb' },
    'mennesker-4': { fil: '', fokus: [0.5, 0.35], tekst: '', kreditering: '', samtykke: { eksamen: false, offentlig: false }, identifiserbar: true, beskrivelse: 'Servitør ved bord eller bar' },
    'mennesker-5': { fil: '', fokus: [0.5, 0.35], tekst: '', kreditering: '', samtykke: { eksamen: false, offentlig: false }, identifiserbar: true, beskrivelse: 'Restaurantleder eller hovmester' },
    'mennesker-6': { fil: '', fokus: [0.5, 0.35], tekst: '', kreditering: '', samtykke: { eksamen: false, offentlig: false }, identifiserbar: true, beskrivelse: 'Observasjon: servitør i arbeid' },
    'mennesker-7': { fil: '', fokus: [0.5, 0.35], tekst: '', kreditering: '', samtykke: { eksamen: false, offentlig: false }, identifiserbar: true, beskrivelse: 'Test av prototypen med en servitør' },
    'mennesker-8': { fil: '', fokus: [0.5, 0.35], tekst: '', kreditering: '', samtykke: { eksamen: false, offentlig: false }, identifiserbar: true, beskrivelse: 'Detalj: hender, bricka, bong eller kassalapp' },

    // ── Cinematic portrait reveal (før sitatet) ──
    portrett: { fil: '', fokus: [0.5, 0.3], tekst: '', kreditering: '', samtykke: { eksamen: false, offentlig: false }, identifiserbar: true, kanKnyttesTilSitat: false, lag: [], beskrivelse: 'Nært portrett av en servitør i dempet, varmt lys (stående eller liggende)' },

    // ── Photo-to-data: servitør i arbeid som fryses, og innsiktene tegnes rundt personen ──
    // punkter: hvor merkelappene peker, [x, y] fra 0 til 1 i bildet
    'i-arbeid': {
      fil: '', fokus: [0.45, 0.4], tekst: '', kreditering: '', samtykke: { eksamen: false, offentlig: false }, identifiserbar: true, lag: [],
      punkter: { bevegelse: [0.42, 0.78], skritt: [0.46, 0.94], oppgaver: [0.62, 0.42], salg: [0.3, 0.5], anerkjennelse: [0.5, 0.2] },
      beskrivelse: 'Servitør i arbeid, helst hele kroppen, liggende bilde',
    },

    // ── Avslutningen (valgfritt): restauranten etter stengetid, eller dere tre ──
    slutt: { fil: '', fokus: [0.5, 0.45], tekst: '', kreditering: '', samtykke: { eksamen: false, offentlig: false }, identifiserbar: false, beskrivelse: 'Tom restaurant etter stengetid, stoler på bordene (liggende)' },
  },
}
