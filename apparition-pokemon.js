/* Dates d'apparition des 1025 Pokémon (jeux d'origine, FR et Japon). */
(function (w) {
  "use strict";
  var GEN = [
    [1, "Kanto", 1, 151, "8 octobre 1999", "Rouge et Bleu", "27 février 1996", "Rouge et Vert"],
    [2, "Johto", 152, 251, "6 avril 2001", "Or et Argent", "21 novembre 1999", "Or et Argent"],
    [3, "Hoenn", 252, 386, "25 juillet 2003", "Rubis et Saphir", "21 novembre 2002", "Rubis et Saphir"],
    [4, "Sinnoh", 387, 493, "27 juillet 2007", "Diamant et Perle", "28 septembre 2006", "Diamant et Perle"],
    [5, "Unys", 494, 649, "4 mars 2011", "Noir et Blanc", "18 septembre 2010", "Noir et Blanc"],
    [6, "Kalos", 650, 721, "12 octobre 2013", "X et Y", "12 octobre 2013", "X et Y"],
    [7, "Alola", 722, 809, "23 novembre 2016", "Soleil et Lune", "18 novembre 2016", "Soleil et Lune"],
    [8, "Galar", 810, 905, "15 novembre 2019", "Épée et Bouclier", "15 novembre 2019", "Épée et Bouclier"],
    [9, "Paldea", 906, 1025, "18 novembre 2022", "Écarlate et Violet", "18 novembre 2022", "Écarlate et Violet"]
  ];
  var SPEC = [
    {a:808,b:809,fr:"25 septembre 2018",jp:"25 septembre 2018",jeux:"Pokémon GO (Meltan ; Melmetal révélé le 24 octobre 2018)"},
    {a:1009,b:1010,fr:"27 février 2023",jp:"27 février 2023",jeux:"mise à jour 1.2.0 d’Écarlate et Violet"},
    {a:1011,b:1017,fr:"13 septembre 2023",jp:"13 septembre 2023",jeux:"DLC Le Masque Turquoise"},
    {a:1018,b:1024,fr:"14 décembre 2023",jp:"14 décembre 2023",jeux:"DLC Le Disque Indigo"},
    {a:1025,b:1025,fr:"11 janvier 2024",jp:"11 janvier 2024",jeux:"épilogue du DLC Le trésor enfoui de la Zone Zéro"}
  ];
  var NOMS = ["Bulbizarre", "Herbizarre", "Florizarre", "Salamèche", "Reptincel", "Dracaufeu", "Carapuce", "Carabaffe", "Tortank", "Chenipan", "Chrysacier", "Papilusion", "Aspicot", "Coconfort", "Dardargnan", "Roucool", "Roucoups", "Roucarnage", "Rattata", "Rattatac", "Piafabec", "Rapasdepic", "Abo", "Arbok", "Pikachu", "Raichu", "Sabelette", "Sablaireau", "Nidoran♀", "Nidorina", "Nidoqueen", "Nidoran♂", "Nidorino", "Nidoking", "Mélofée", "Mélodelfe", "Goupix", "Feunard", "Rondoudou", "Grodoudou", "Nosferapti", "Nosferalto", "Mystherbe", "Ortide", "Rafflesia", "Paras", "Parasect", "Mimitoss", "Aéromite", "Taupiqueur", "Triopikeur", "Miaouss", "Persian", "Psykokwak", "Akwakwak", "Férosinge", "Colossinge", "Caninos", "Arcanin", "Ptitard", "Têtarte", "Tartard", "Abra", "Kadabra", "Alakazam", "Machoc", "Machopeur", "Mackogneur", "Chétiflor", "Boustiflor", "Empiflor", "Tentacool", "Tentacruel", "Racaillou", "Gravalanch", "Grolem", "Ponyta", "Galopa", "Ramoloss", "Flagadoss", "Magnéti", "Magnéton", "Canarticho", "Doduo", "Dodrio", "Otaria", "Lamantine", "Tadmorv", "Grotadmorv", "Kokiyas", "Crustabri", "Fantominus", "Spectrum", "Ectoplasma", "Onix", "Soporifik", "Hypnomade", "Krabby", "Krabboss", "Voltorbe", "Électrode", "Noeunoeuf", "Noadkoko", "Osselait", "Ossatueur", "Kicklee", "Tygnon", "Excelangue", "Smogo", "Smogogo", "Rhinocorne", "Rhinoféros", "Leveinard", "Saquedeneu", "Kangourex", "Hypotrempe", "Hypocéan", "Poissirène", "Poissoroy", "Stari", "Staross", "M. Mime", "Insécateur", "Lippoutou", "Élektek", "Magmar", "Scarabrute", "Tauros", "Magicarpe", "Léviator", "Lokhlass", "Métamorph", "Évoli", "Aquali", "Voltali", "Pyroli", "Porygon", "Amonita", "Amonistar", "Kabuto", "Kabutops", "Ptéra", "Ronflex", "Artikodin", "Électhor", "Sulfura", "Minidraco", "Draco", "Dracolosse", "Mewtwo", "Mew", "Germignon", "Macronium", "Méganium", "Héricendre", "Feurisson", "Typhlosion", "Kaiminus", "Crocrodil", "Aligatueur", "Fouinette", "Fouinar", "Hoothoot", "Noarfang", "Coxy", "Coxyclaque", "Mimigal", "Migalos", "Nostenfer", "Loupio", "Lanturn", "Pichu", "Mélo", "Toudoudou", "Togepi", "Togetic", "Natu", "Xatu", "Wattouat", "Lainergie", "Pharamp", "Joliflor", "Marill", "Azumarill", "Simularbre", "Tarpaud", "Granivol", "Floravol", "Cotovol", "Capumain", "Tournegrin", "Héliatronc", "Yanma", "Axoloto", "Maraiste", "Mentali", "Noctali", "Cornèbre", "Roigada", "Feuforêve", "Zarbi", "Qulbutoké", "Girafarig", "Pomdepik", "Foretress", "Insolourdo", "Scorplane", "Steelix", "Snubbull", "Granbull", "Qwilfish", "Cizayox", "Caratroc", "Scarhino", "Farfuret", "Teddiursa", "Ursaring", "Limagma", "Volcaropod", "Marcacrin", "Cochignon", "Corayon", "Rémoraid", "Octillery", "Cadoizo", "Démanta", "Airmure", "Malosse", "Démolosse", "Hyporoi", "Phanpy", "Donphan", "Porygon2", "Cerfrousse", "Queulorior", "Debugant", "Kapoera", "Lippouti", "Élekid", "Magby", "Écrémeuh", "Leuphorie", "Raikou", "Entei", "Suicune", "Embrylex", "Ymphect", "Tyranocif", "Lugia", "Ho-Oh", "Celebi", "Arcko", "Massko", "Jungko", "Poussifeu", "Galifeu", "Braségali", "Gobou", "Flobio", "Laggron", "Medhyèna", "Grahyèna", "Zigzaton", "Linéon", "Chenipotte", "Armulys", "Charmillon", "Blindalys", "Papinox", "Nénupiot", "Lombre", "Ludicolo", "Grainipiot", "Pifeuil", "Tengalice", "Nirondelle", "Hélédelle", "Goélise", "Bekipan", "Tarsal", "Kirlia", "Gardevoir", "Arakdo", "Maskadra", "Balignon", "Chapignon", "Parecool", "Vigoroth", "Monaflèmit", "Ningale", "Ninjask", "Munja", "Chuchmur", "Ramboum", "Brouhabam", "Makuhita", "Hariyama", "Azurill", "Tarinor", "Skitty", "Delcatty", "Ténéfix", "Mysdibule", "Galekid", "Galegon", "Galeking", "Méditikka", "Charmina", "Dynavolt", "Élecsprint", "Posipi", "Négapi", "Muciole", "Lumivole", "Rosélia", "Gloupti", "Avaltout", "Carvanha", "Sharpedo", "Wailmer", "Wailord", "Chamallot", "Camérupt", "Chartor", "Spoink", "Groret", "Spinda", "Kraknoix", "Vibraninf", "Libégon", "Cacnea", "Cacturne", "Tylton", "Altaria", "Mangriff", "Séviper", "Séléroc", "Solaroc", "Barloche", "Barbicha", "Écrapince", "Colhomard", "Balbuto", "Kaorine", "Lilia", "Vacilys", "Anorith", "Armaldo", "Barpau", "Milobellus", "Morphéo", "Kecleon", "Polichombr", "Branette", "Skelénox", "Téraclope", "Tropius", "Éoko", "Absol", "Okéoké", "Stalgamin", "Oniglali", "Obalie", "Phogleur", "Kaimorse", "Coquiperl", "Serpang", "Rosabyss", "Relicanth", "Lovdisc", "Draby", "Drackhaus", "Drattak", "Terhal", "Métang", "Métalosse", "Regirock", "Regice", "Registeel", "Latias", "Latios", "Kyogre", "Groudon", "Rayquaza", "Jirachi", "Deoxys", "Tortipouss", "Boskara", "Torterra", "Ouisticram", "Chimpenfeu", "Simiabraz", "Tiplouf", "Prinplouf", "Pingoléon", "Étourmi", "Étourvol", "Étouraptor", "Keunotor", "Castorno", "Crikzik", "Mélokrik", "Lixy", "Luxio", "Luxray", "Rozbouton", "Roserade", "Kranidos", "Charkos", "Dinoclier", "Bastiodon", "Cheniti", "Cheniselle", "Papilord", "Apitrini", "Apireine", "Pachirisu", "Mustébouée", "Mustéflott", "Ceribou", "Ceriflor", "Sancoki", "Tritosor", "Capidextre", "Baudrive", "Grodrive", "Laporeille", "Lockpin", "Magirêve", "Corboss", "Chaglam", "Chaffreux", "Korillon", "Moufouette", "Moufflair", "Archéomire", "Archéodong", "Manzaï", "Mime Jr.", "Ptiravi", "Pijako", "Spiritomb", "Griknot", "Carmache", "Carchacrok", "Goinfrex", "Riolu", "Lucario", "Hippopotas", "Hippodocus", "Rapion", "Drascore", "Cradopaud", "Coatox", "Vortente", "Écayon", "Luminéon", "Babimanta", "Blizzi", "Blizzaroi", "Dimoret", "Magnézone", "Coudlangue", "Rhinastoc", "Bouldeneu", "Élekable", "Maganon", "Togekiss", "Yanmega", "Phyllali", "Givrali", "Scorvol", "Mammochon", "Porygon-Z", "Gallame", "Tarinorme", "Noctunoir", "Momartik", "Motisma", "Créhelf", "Créfollet", "Créfadet", "Dialga", "Palkia", "Heatran", "Regigigas", "Giratina", "Cresselia", "Phione", "Manaphy", "Darkrai", "Shaymin", "Arceus", "Victini", "Vipélierre", "Lianaja", "Majaspic", "Gruikui", "Grotichon", "Roitiflam", "Moustillon", "Mateloutre", "Clamiral", "Ratentif", "Miradar", "Ponchiot", "Ponchien", "Mastouffe", "Chacripan", "Léopardus", "Feuillajou", "Feuiloutan", "Flamajou", "Flamoutan", "Flotajou", "Flotoutan", "Munna", "Mushana", "Poichigeon", "Colombeau", "Déflaisan", "Zébibron", "Zéblitz", "Nodulithe", "Géolithe", "Gigalithe", "Chovsourir", "Rhinolove", "Rototaupe", "Minotaupe", "Nanméouïe", "Charpenti", "Ouvrifier", "Bétochef", "Tritonde", "Batracné", "Crapustule", "Judokrak", "Karaclée", "Larveyette", "Couverdure", "Manternel", "Venipatte", "Scobolide", "Brutapode", "Doudouvet", "Farfaduvet", "Chlorobule", "Fragilady", "Bargantua", "Mascaïman", "Escroco", "Crocorible", "Darumarond", "Darumacho", "Maracachi", "Crabicoque", "Crabaraque", "Baggiguane", "Baggaïd", "Cryptéro", "Tutafeh", "Tutankafer", "Carapagos", "Mégapagos", "Arkéapti", "Aéroptéryx", "Miamiasme", "Miasmax", "Zorua", "Zoroark", "Chinchidou", "Pashmilla", "Scrutella", "Mesmérella", "Sidérella", "Nucléos", "Méios", "Symbios", "Couaneton", "Lakmécygne", "Sorbébé", "Sorboul", "Sorbouboul", "Vivaldaim", "Haydaim", "Emolga", "Carabing", "Lançargot", "Trompignon", "Gaulet", "Viskuse", "Moyade", "Mamanbo", "Statitik", "Mygavolt", "Grindur", "Noacier", "Tic", "Clic", "Cliticlic", "Anchwatt", "Lampéroie", "Ohmassacre", "Lewsor", "Neitram", "Funécire", "Mélancolux", "Lugulabre", "Coupenotte", "Incisache", "Tranchodon", "Polarhume", "Polagriffe", "Hexagel", "Escargaume", "Limaspeed", "Limonde", "Kungfouine", "Shaofouine", "Drakkarmin", "Gringolem", "Golemastoc", "Scalpion", "Scalproie", "Frison", "Furaiglon", "Gueriaigle", "Vostourno", "Vaututrice", "Aflamanoir", "Fermite", "Solochi", "Diamat", "Trioxhydre", "Pyronille", "Pyrax", "Cobaltium", "Terrakium", "Viridium", "Boréas", "Fulguris", "Reshiram", "Zekrom", "Démétéros", "Kyurem", "Keldeo", "Meloetta", "Genesect", "Marisson", "Boguérisse", "Blindépique", "Feunnec", "Roussil", "Goupelin", "Grenousse", "Croâporal", "Amphinobi", "Sapereau", "Excavarenne", "Passerouge", "Braisillon", "Flambusard", "Lépidonille", "Pérégrain", "Prismillon", "Hélionceau", "Némélios", "Flabébé", "Floette", "Florges", "Cabriolaine", "Chevroum", "Pandespiègle", "Pandarbare", "Couafarel", "Psystigri", "Mistigrix", "Monorpale", "Dimoclès", "Exagide", "Fluvetin", "Cocotine", "Sucroquin", "Cupcanaille", "Sepiatop", "Sepiatroce", "Opermine", "Golgopathe", "Venalgue", "Kravarech", "Flingouste", "Gamblast", "Galvaran", "Iguolta", "Ptyranidur", "Rexillius", "Amagara", "Dragmara", "Nymphali", "Brutalibré", "Dedenne", "Strassie", "Mucuscule", "Colimucus", "Muplodocus", "Trousselin", "Brocélôme", "Desséliande", "Pitrouille", "Banshitrouye", "Grelaçon", "Séracrawl", "Sonistrelle", "Bruyverne", "Xerneas", "Yveltal", "Zygarde", "Diancie", "Hoopa", "Volcanion", "Brindibou", "Efflèche", "Archéduc", "Flamiaou", "Matoufeu", "Félinferno", "Otaquin", "Otarlette", "Oratoria", "Picassaut", "Piclairon", "Bazoucan", "Manglouton", "Argouste", "Larvibule", "Chrysapile", "Lucanon", "Crabagarre", "Crabominable", "Plumeline", "Bombydou", "Rubombelle", "Rocabot", "Lougaroc", "Froussardine", "Vorastérie", "Prédastérie", "Tiboudet", "Bourrinos", "Araqua", "Tarenbulle", "Mimantis", "Floramantis", "Spododo", "Lampignon", "Tritox", "Malamandre", "Nounourson", "Chelours", "Croquine", "Candine", "Sucreine", "Guérilande", "Gouroutan", "Quartermac", "Sovkipou", "Sarmuraï", "Bacabouh", "Trépassable", "Concombaffe", "Type:0", "Silvallié", "Météno", "Dodoala", "Boumata", "Togedemaru", "Mimiqui", "Denticrisse", "Draïeul", "Sinistrail", "Bébécaille", "Écaïd", "Ékaïser", "Tokorico", "Tokopiyon", "Tokotoro", "Tokopisco", "Cosmog", "Cosmovum", "Solgaleo", "Lunala", "Zéroïd", "Mouscoto", "Cancrelove", "Câblifère", "Bamboiselle", "Katagami", "Engloutyran", "Necrozma", "Magearna", "Marshadow", "Vémini", "Mandrillon", "Ama-Ama", "Pierroteknik", "Zeraora", "Meltan", "Melmetal", "Ouistempo", "Badabouin", "Gorythmic", "Flambino", "Lapyro", "Pyrobut", "Larméléon", "Arrozard", "Lézargus", "Rongourmand", "Rongrigou", "Minisange", "Bleuseille", "Corvaillus", "Larvadar", "Coléodôme", "Astronelle", "Goupilou", "Roublenard", "Tournicoton", "Blancoton", "Moumouton", "Moumouflon", "Khélocrok", "Torgamord", "Voltoutou", "Fulgudog", "Charbi", "Wagomine", "Monthracite", "Verpom", "Pomdrapi", "Dratatin", "Dunaja", "Dunaconda", "Nigosier", "Embrochet", "Hastacuda", "Toxizap", "Salarsen", "Grillepattes", "Scolocendre", "Poulpaf", "Krakos", "Théffroi", "Polthégeist", "Bibichut", "Chapotus", "Sorcilence", "Grimalin", "Fourbelin", "Angoliath", "Ixon", "Berserkatt", "Corayôme", "Palarticho", "M. Glaquette", "Tutétékri", "Crèmy", "Charmilly", "Hexadron", "Wattapik", "Frissonille", "Beldeneige", "Dolman", "Bekaglaçon", "Wimessir", "Morpeko", "Charibari", "Pachyradjah", "Galvagon", "Galvagla", "Hydragon", "Hydragla", "Duralugon", "Fantyrm", "Dispareptil", "Lanssorien", "Zacian", "Zamazenta", "Éthernatos", "Wushours", "Shifours", "Zarude", "Regieleki", "Regidrago", "Blizzeval", "Spectreval", "Sylveroy", "Cerbyllin", "Hachécateur", "Ursaking", "Paragruel", "Farfurex", "Qwilpik", "Amovénus", "Poussacha", "Matourgeon", "Miascarade", "Chochodile", "Crocogril", "Flâmigator", "Coiffeton", "Canarbello", "Palmaval", "Gourmelet", "Fragroin", "Tissenboule", "Filentrappe", "Lilliterelle", "Gambex", "Pohm", "Pohmotte", "Pohmarmotte", "Compagnol", "Famignol", "Pâtachiot", "Briochien", "Olivini", "Olivado", "Arboliva", "Tapatoès", "Selutin", "Amassel", "Gigansel", "Charbambin", "Carmadura", "Malvalame", "Têtampoule", "Ampibidou", "Zapétrel", "Fulgulairo", "Grondogue", "Dogrino", "Gribouraigne", "Tag-Tag", "Virovent", "Virevorreur", "Terracool", "Terracruel", "Craparoi", "Pimito", "Scovilain", "Léboulérou", "Bérasca", "Flotillon", "Cléopsytra", "Forgerette", "Forgella", "Forgelina", "Taupikeau", "Triopikeau", "Lestombaile", "Dofin", "Superdofin", "Vrombi", "Vrombotor", "Motorizard", "Ferdeter", "Germéclat", "Floréclat", "Toutombe", "Tomberro", "Flamenroule", "Piétacé", "Balbalèze", "Délestin", "Oyacata", "Nigirigon", "Courrousinge", "Terraiste", "Farigiraf", "Deusolourdo", "Scalpereur", "Fort-Ivoire", "Hurle-Queue", "Fongus-Furie", "Flotte-Mèche", "Rampe-Ailes", "Pelage-Sablé", "Roue-de-Fer", "Hotte-de-Fer", "Paume-de-Fer", "Têtes-de-Fer", "Mite-de-Fer", "Épine-de-Fer", "Frigodo", "Cryodo", "Glaivodo", "Mordudor", "Gromago", "Chongjian", "Baojian", "Dinglu", "Yuyu", "Rugit-Lune", "Garde-de-Fer", "Koraidon", "Miraidon", "Serpente-Eau", "Vert-de-Fer", "Pomdramour", "Poltchageist", "Théffroyable", "Félicanis", "Fortusimia", "Favianos", "Ogerpon", "Pondralugon", "Pomdorochi", "Feu-Perçant", "Ire-Foudre", "Roc-de-Fer", "Chef-de-Fer", "Terapagos", "Pêchaminus"];

  function genDe(n) {
    var i, G;
    for (i = 0; i < GEN.length; i++) {
      G = GEN[i];
      if (n >= G[2] && n <= G[3]) return G;
    }
    return null;
  }
  function specDe(n) {
    var i, S;
    for (i = 0; i < SPEC.length; i++) {
      S = SPEC[i];
      if (n >= S.a && n <= S.b) return S;
    }
    return null;
  }
  function ligneApp(fr, jeux, jp, jeuxJp) {
    var jap = jp + (jeuxJp ? ", " + jeuxJp : "");
    return "Apparition : " + fr + ", " + jeux + " (Japon : " + jap + ")";
  }
  function info(n) {
    n = +n;
    if (!n || n < 1 || n > 1025) return null;
    var G = genDe(n), S = specDe(n);
    if (!G) return null;
    var fr = S ? S.fr : G[4], jeux = S ? S.jeux : G[5], jp = S ? S.jp : G[6], jeuxJp = S ? "" : G[7];
    return {
      n: n,
      nom: NOMS[n - 1],
      gen: G[0],
      region: G[1],
      fr: fr,
      jp: jp,
      jeux: jeux,
      jeuxJp: jeuxJp,
      special: !!S,
      ligne: ligneApp(fr, jeux, jp, jeuxJp),
      genLib: "Génération " + G[0] + " – " + G[1]
    };
  }
  function norm(s) {
    return String(s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[’']/g, "")
      .replace(/\. /g, " ")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }
  function nomNu(s) {
    return String(s || "")
      .replace(/\s*[\-–—]?\s*(ex|gx|v|vmax|vstar|v-max|tag team|☆|★).*$/i, "")
      .replace(/\s*\(.*\)$/, "")
      .trim();
  }
  function infoParNom(nom) {
    var q = norm(nomNu(nom));
    if (!q) return null;
    var i, nn, exact = null, start = null;
    for (i = 0; i < NOMS.length; i++) {
      nn = norm(NOMS[i]);
      if (nn === q) { exact = info(i + 1); break; }
      if (!start && (nn.indexOf(q) === 0 || q.indexOf(nn) === 0) && nn.length >= 3) start = info(i + 1);
    }
    return exact || start;
  }
  function chercher(q, max) {
    max = max || 8;
    q = String(q || "").trim();
    if (!q) return [];
    var nq = norm(q).replace(/^n[o0]\s*/, "").replace(/^0+/, "");
    var seen = {}, out = [], i, n, nn, inf;
    function add(inf) {
      if (!inf || seen[inf.n]) return;
      seen[inf.n] = 1;
      out.push(inf);
    }
    if (/^\d{1,4}$/.test(nq)) {
      n = +nq;
      if (n >= 1 && n <= 1025) add(info(n));
    }
    var qn = norm(q);
    if (qn) {
      for (i = 0; i < NOMS.length && out.length < max; i++) {
        nn = norm(NOMS[i]);
        if (nn === qn || nn.indexOf(qn) === 0) add(info(i + 1));
      }
      if (qn.length >= 2) {
        for (i = 0; i < NOMS.length && out.length < max; i++) {
          nn = norm(NOMS[i]);
          if (nn.indexOf(qn) !== -1) add(info(i + 1));
        }
      }
    }
    return out.slice(0, max);
  }

  var CSS = ""
    + ".mq-app-wrap{position:relative;display:block;flex:1 1 12rem;min-width:0;}"
    + "#outils .mq-app-wrap{display:block;width:100%;}"
    + ".mq-app-sugg{position:absolute;left:0;right:0;top:calc(100% + 4px);z-index:60;margin:0;padding:6px;list-style:none;background:#fff;border:1px solid #0b3d91;border-radius:12px;box-shadow:0 12px 28px rgba(11,61,145,.18);max-height:min(70vh,420px);overflow:auto;}"
    + ".mq-app-sugg[hidden]{display:none!important;}"
    + ".mq-app-sugg a{display:block;padding:8px 10px;border-radius:8px;text-decoration:none;color:#111;}"
    + ".mq-app-sugg a:hover,.mq-app-sugg a[aria-selected='true']{background:#f3f6fb;}"
    + ".mq-app-sugg b{display:block;font:700 1rem 'Source Sans 3',Arial,sans-serif;color:#0b3d91;}"
    + ".mq-app-sugg small{display:block;font-size:.78rem;color:#0b3d91;font-weight:600;line-height:1.35;margin-top:2px;}"
    + ".mq-app-sugg .mq-app-meta{font-weight:600;color:#5a5a5a;}"
    + "form.barre-recherche-site .brs-app, .nav-rech-liste .mq-app-line{display:block;font-size:.75rem;color:#0b3d91;font-weight:600;margin-top:2px;line-height:1.3;}"
    + "section.ap-accueil,.ap-accueil{overflow:visible!important;}"
    + ".ap-cherche{overflow:visible;}"
    + ".recherche-res .mq-app-line{grid-column:1;color:#0b3d91;font-size:.8rem;font-weight:600;}";

  function injectCss() {
    if (document.getElementById("mq-app-css")) return;
    var st = document.createElement("style");
    st.id = "mq-app-css";
    st.textContent = CSS;
    document.head.appendChild(st);
  }
  function fermerListe(liste) {
    if (!liste) return;
    liste.hidden = true;
    liste.innerHTML = "";
  }
  function brancher(input, opts) {
    if (!input || input.dataset.mqApp === "1") return;
    input.dataset.mqApp = "1";
    input.setAttribute("autocomplete", "off");
    input.setAttribute("aria-autocomplete", "list");
    opts = opts || {};
    injectCss();
    var wrap = input.parentElement;
    if (!wrap || !wrap.classList.contains("mq-app-wrap")) {
      wrap = document.createElement("div");
      wrap.className = "mq-app-wrap";
      input.parentNode.insertBefore(wrap, input);
      wrap.appendChild(input);
    }
    var liste = document.createElement("ul");
    liste.className = "mq-app-sugg";
    liste.id = (input.id || "q") + "-sugg";
    liste.setAttribute("role", "listbox");
    liste.hidden = true;
    wrap.appendChild(liste);
    input.setAttribute("aria-controls", liste.id);
    var actif = -1;
    function hrefDe(inf) {
      if (opts.href) return opts.href(inf);
      return "pokemon.html?n=" + inf.n;
    }
    function rendre() {
      var q = input.value;
      var res = String(q).trim().length ? chercher(q, opts.max || 8) : [];
      liste.innerHTML = "";
      actif = -1;
      if (!res.length) { fermerListe(liste); return; }
      res.forEach(function (inf, i) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = hrefDe(inf);
        a.id = liste.id + "-" + i;
        a.setAttribute("role", "option");
        a.setAttribute("aria-selected", "false");
        var b = document.createElement("b");
        b.textContent = inf.nom;
        var meta = document.createElement("span");
        meta.className = "mq-app-meta";
        meta.textContent = "n° " + String(inf.n).padStart(4, "0") + " · " + inf.genLib;
        var sm = document.createElement("small");
        sm.textContent = inf.ligne;
        a.appendChild(b);
        a.appendChild(meta);
        a.appendChild(sm);
        a.addEventListener("mousedown", function (e) {
          /* keep click before blur hides the list */
          if (opts.onPick) { e.preventDefault(); opts.onPick(inf, a.href); }
        });
        li.appendChild(a);
        liste.appendChild(li);
      });
      liste.hidden = false;
    }
    input.addEventListener("input", rendre);
    input.addEventListener("focus", function () { if (input.value) rendre(); });
    input.addEventListener("keydown", function (e) {
      var optsA = liste.querySelectorAll("a[href]");
      if (e.key === "Escape") { fermerListe(liste); return; }
      if (e.key === "ArrowDown" && optsA.length) {
        e.preventDefault();
        actif = Math.min(optsA.length - 1, actif + 1);
        optsA.forEach(function (o, i) { o.setAttribute("aria-selected", i === actif ? "true" : "false"); });
        if (optsA[actif]) optsA[actif].scrollIntoView({ block: "nearest" });
      } else if (e.key === "ArrowUp" && optsA.length) {
        e.preventDefault();
        actif = Math.max(0, actif - 1);
        optsA.forEach(function (o, i) { o.setAttribute("aria-selected", i === actif ? "true" : "false"); });
      } else if (e.key === "Enter" && actif >= 0 && optsA[actif]) {
        e.preventDefault();
        optsA[actif].click();
      }
    });
    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) fermerListe(liste);
    });
  }
  function brancherChamps() {
    var q = document.getElementById("q");
    var page = (location.pathname.split("/").pop() || "").toLowerCase();
    if (q && (page === "cartes-pokemon.html" || q.closest("#outils"))) {
      brancher(q, {
        onPick: function (inf, href) { location.href = href; }
      });
    }
    var ap = document.getElementById("ap-q");
    if (ap) brancher(ap, { onPick: function (inf, href) { location.href = href; } });
  }
  function lignePourSuggestion(h) {
    if (!h) return "";
    var inf = null;
    if (h.n && /^\d{1,4}$/.test(String(h.n)) && +h.n >= 1 && +h.n <= 1025 && !h.set) inf = info(+h.n);
    if (!inf && h.pkmn) inf = infoParNom(h.pkmn);
    if (!inf && h.nom) inf = infoParNom(h.nom);
    if (!inf) return "";
    return inf.genLib + " · " + inf.ligne;
  }

  w.mimiquiApparition = {
    GEN: GEN,
    SPEC: SPEC,
    NOMS: NOMS,
    info: info,
    infoParNom: infoParNom,
    chercher: chercher,
    brancher: brancher,
    brancherChamps: brancherChamps,
    lignePourSuggestion: lignePourSuggestion,
    ligneApp: ligneApp
  };

  function boot() { try { brancherChamps(); } catch (e) {} }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window);
