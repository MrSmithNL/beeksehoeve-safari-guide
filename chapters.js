// Chapter data for all languages
const CHAPTERS = [
  {
    id: "A",
    title: {
      nl: "Welkom aan boord",
      en: "Welcome aboard",
      de: "Willkommen an Bord"
    },
    subtitle: {
      nl: "De Zandhazen van de Heideweg",
      en: "The Sand Hares of the Heideweg",
      de: "Die Sandhasen vom Heideweg"
    },
    audio: { nl: "audio/nl/A.mp3", en: "audio/en/A.mp3", de: "audio/de/A.mp3" }
  },
  {
    id: "B",
    title: {
      nl: "De Koeweg",
      en: "The Koeweg",
      de: "Der Koeweg"
    },
    subtitle: {
      nl: "Van Driftweg naar E-bike",
      en: "From Cattle Trail to E-bike",
      de: "Vom Viehtriebweg zum E-Bike"
    },
    audio: { nl: "audio/nl/B.mp3", en: "audio/en/B.mp3", de: "audio/de/B.mp3" }
  },
  {
    id: "C",
    title: {
      nl: "De Grens",
      en: "The Border",
      de: "Die Grenze"
    },
    subtitle: {
      nl: "Veilige Springers & Slimme Snuiten",
      en: "Safe Jumpers & Clever Snouts",
      de: "Sichere Springer & Schlaue Schnauzen"
    },
    audio: { nl: "audio/nl/C.mp3", en: "audio/en/C.mp3", de: "audio/de/C.mp3" }
  },
  {
    id: "D",
    title: {
      nl: "De Hartenberg",
      en: "The Hartenberg",
      de: "Der Hartenberg"
    },
    subtitle: {
      nl: "Een plek met een groot Hart",
      en: "A Place with a Big Heart",
      de: "Ein Ort mit gro\u00dfem Herzen"
    },
    audio: { nl: "audio/nl/D.mp3", en: "audio/en/D.mp3", de: "audio/de/D.mp3" }
  },
  {
    id: "E",
    title: {
      nl: "Planken Wambuis",
      en: "Planken Wambuis",
      de: "Planken Wambuis"
    },
    subtitle: {
      nl: "Doodskisten & Moshuisjes",
      en: "Coffins & Moss Huts",
      de: "S\u00e4rge & Moosh\u00fctten"
    },
    audio: { nl: "audio/nl/E.mp3", en: "audio/en/E.mp3", de: "audio/de/E.mp3" }
  },
  {
    id: "F",
    title: {
      nl: "De Zwijnen-special",
      en: "The Wild Boar Special",
      de: "Das Wildschwein-Spezial"
    },
    subtitle: {
      nl: "Wroeten & Wellness",
      en: "Rooting & Wellness",
      de: "W\u00fchlen & Wellness"
    },
    audio: { nl: "audio/nl/F.mp3", en: "audio/en/F.mp3", de: "audio/de/F.mp3" }
  },
  {
    id: "G",
    title: {
      nl: "De Grafheuvels",
      en: "The Burial Mounds",
      de: "Die Grabh\u00fcgel"
    },
    subtitle: {
      nl: "De Vorsten van de Veluwe",
      en: "The Princes of the Veluwe",
      de: "Die F\u00fcrsten der Veluwe"
    },
    audio: { nl: "audio/nl/G.mp3", en: "audio/en/G.mp3", de: "audio/de/G.mp3" }
  },
  {
    id: "H",
    title: {
      nl: "De Lanen van Doorwerth",
      en: "The Lanes of Doorwerth",
      de: "Die Alleen von Doorwerth"
    },
    subtitle: {
      nl: "Jacht en Adel",
      en: "Hunting and Nobility",
      de: "Jagd und Adel"
    },
    audio: { nl: "audio/nl/H.mp3", en: "audio/en/H.mp3", de: "audio/de/H.mp3" }
  },
  {
    id: "I",
    title: {
      nl: "De Valenberg",
      en: "The Valenberg",
      de: "Der Valenberg"
    },
    subtitle: {
      nl: "Het Oog van de Veluwe",
      en: "The Eye of the Veluwe",
      de: "Das Auge der Veluwe"
    },
    audio: { nl: "audio/nl/I.mp3", en: "audio/en/I.mp3", de: "audio/de/I.mp3" }
  },
  {
    id: "J",
    title: {
      nl: "De Mossel",
      en: "De Mossel",
      de: "De Mossel"
    },
    subtitle: {
      nl: "Een Oase in de Wildernis",
      en: "An Oasis in the Wilderness",
      de: "Eine Oase in der Wildnis"
    },
    audio: { nl: "audio/nl/J.mp3", en: "audio/en/J.mp3", de: "audio/de/J.mp3" }
  },
  {
    id: "K",
    title: {
      nl: "Het Terras van De Mossel",
      en: "The Terrace of De Mossel",
      de: "Die Terrasse von De Mossel"
    },
    subtitle: {
      nl: "",
      en: "",
      de: ""
    },
    audio: { nl: "audio/nl/K.mp3", en: "audio/en/K.mp3", de: "audio/de/K.mp3" }
  },
  {
    id: "L",
    title: {
      nl: "De Steenbeelden",
      en: "The Stone Sculptures",
      de: "Die Steinskulpturen"
    },
    subtitle: {
      nl: "Adri Verhoeven",
      en: "Adri Verhoeven",
      de: "Adri Verhoeven"
    },
    audio: { nl: "audio/nl/L.mp3", en: "audio/en/L.mp3", de: "audio/de/L.mp3" }
  },
  {
    id: "M",
    title: {
      nl: "De Grote Wildernis-Gids",
      en: "The Great Wilderness Guide",
      de: "Der gro\u00dfe Wildnis-F\u00fchrer"
    },
    subtitle: {
      nl: "Ontmoet de Bewoners",
      en: "Meet the Residents",
      de: "Treffen Sie die Bewohner"
    },
    audio: { nl: "audio/nl/M.mp3", en: "audio/en/M.mp3", de: "audio/de/M.mp3" }
  },
  {
    id: "N",
    title: {
      nl: "Brand, Beheer en Wildpaden",
      en: "Fire, Management and Wildlife Trails",
      de: "Feuer, Pflege und Wildpfade"
    },
    subtitle: {
      nl: "",
      en: "",
      de: ""
    },
    audio: { nl: "audio/nl/N.mp3", en: "audio/en/N.mp3", de: "audio/de/N.mp3" }
  },
  {
    id: "O",
    title: {
      nl: "De Bewakers van het Bos",
      en: "The Guardians of the Forest",
      de: "Die W\u00e4chter des Waldes"
    },
    subtitle: {
      nl: "",
      en: "",
      de: ""
    },
    audio: { nl: "audio/nl/O.mp3", en: "audio/en/O.mp3", de: "audio/de/O.mp3" }
  },
  {
    id: "P",
    title: {
      nl: "Terug naar Otterlo",
      en: "Return to Otterlo",
      de: "Zur\u00fcck nach Otterlo"
    },
    subtitle: {
      nl: "Terug naar de Zandhazen",
      en: "Back to the Sand Hares",
      de: "Zur\u00fcck zu den Sandhasen"
    },
    audio: { nl: "audio/nl/P.mp3", en: "audio/en/P.mp3", de: "audio/de/P.mp3" }
  }
];
