/* Registre hebdomadaire : calcule la photo d'une semaine (cote Cardmarket + ventes eBay du registre Adjugé).
   Utilisé par registre.html et par la tâche hebdomadaire (node). */
(function (g) {
  "use strict";
  var EN = [["smp-SM29", "Mimikyu", "SM Black Star Promos", "SM29"], ["smp-SM99", "Mimikyu", "SM Black Star Promos", "SM99"], ["smp-SM163", "Mimikyu", "SM Black Star Promos", "SM163"], ["sm2-58", "Mimikyu", "Guardians Rising", "58/145"], ["sm8-149", "Mimikyu GX", "Lost Thunder", "149/214"], ["sm8-206", "Mimikyu GX", "Lost Thunder", "206/214"], ["sm8-226", "Mimikyu GX", "Lost Thunder", "226/214"], ["sm9-53", "Gengar & Mimikyu GX", "Team Up", "53/181"], ["sm9-112", "Mimikyu", "Team Up", "112/181"], ["sm9-164", "Gengar & Mimikyu GX", "Team Up", "164/181"], ["sm9-165", "Gengar & Mimikyu GX", "Team Up", "165/181"], ["sm9-186", "Gengar & Mimikyu GX", "Team Up", "186/181"], ["sm12-96", "Mimikyu", "Cosmic Eclipse", "96/236"], ["sm12-97", "Mimikyu", "Cosmic Eclipse", "97/236"], ["sm12-245", "Mimikyu", "Cosmic Eclipse", "245/236"], ["swshp-SWSH136", "Mimikyu", "SWSH Black Star Promos", "SWSH136"], ["swsh3-81", "Mimikyu", "Darkness Ablaze", "81/189"], ["swsh5-62", "Mimikyu V", "Battle Styles", "62/163"], ["swsh5-148", "Mimikyu V", "Battle Styles", "148/163"], ["swsh9-068", "Mimikyu V", "Brilliant Stars", "068/172"], ["swsh9-069", "Mimikyu VMAX", "Brilliant Stars", "069/172"], ["swsh9tg-TG16", "Mimikyu V", "Brilliant Stars Trainer Gallery", "TG16"], ["swsh9tg-TG17", "Mimikyu VMAX", "Brilliant Stars Trainer Gallery", "TG17"], ["swsh11-080", "Mimikyu", "Lost Origin", "080/196"], ["svp-004", "Mimikyu ex", "SVP Black Star Promos", "004/225"], ["svp-075", "Mimikyu", "SVP Black Star Promos", "075/225"], ["sv02-097", "Mimikyu", "Paldea Evolved", "097/193"], ["sv04.5-037", "Mimikyu", "Paldean Fates", "037/91"], ["sv04.5-160", "Mimikyu", "Paldean Fates", "160/91"], ["sv09-069", "Mimikyu ex", "Journey Together", "069/159"], ["sv10-087", "Team Rocket's Mimikyu", "Destined Rivals", "087/182"], ["me02-042", "Mimikyu", "Phantasmal Flames", "042/94"], ["me02.5-097", "Team Rocket's Mimikyu", "Ascended Heroes", "097/217"], ["me02.5-238", "Team Rocket's Mimikyu", "Ascended Heroes", "238/217"]];
  function cleNum(n) { return String(n || "").replace(/\s/g, "").split("/").map(function (x) { return x.replace(/^0+(?=\d)/, ""); }).join("/").toLowerCase(); }
  function langue(l) { l = String(l || ""); return /^ja/i.test(l) ? "ja" : /^fr/i.test(l) ? "fr" : /^(en|ang)/i.test(l) ? "en" : ""; }
  function mediane(a) { var b = a.slice().sort(function (x, y) { return x - y; }), m = b.length >> 1; return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2; }
  function arr2(n) { return Math.round(n * 100) / 100; }
  function moinsJours(d, n) { var t = new Date(d + "T12:00:00Z"); t.setUTCDate(t.getUTCDate() - n); return t.toISOString().slice(0, 10); }
  // prix de vente conseillé : même calcul que les pages Cartes et « Vendre sur eBay » (cote Cardmarket, sinon annonce eBay la moins chère)
  function conseil(c) {
    var t = typeof c.tendance === "number" ? c.tendance : null, m = typeof c.moy30 === "number" ? c.moy30 : null, eb = c.ebay_bas && typeof c.ebay_bas.prix === "number" ? c.ebay_bas.prix : null, base;
    if (t && eb && t > eb * 5) base = eb; else if (t && m) base = (t + m) / 2; else base = t || m || eb || null;
    if (base == null) return null;
    return base < 5 ? Math.round(base * 2) / 2 : base < 50 ? Math.round(base) : Math.round(base / 5) * 5;
  }
  function semaine(cotation, ventes, fin) { return periode(cotation, ventes, moinsJours(fin, 6), fin); }
  function periode(cotation, ventes, debut, fin) {
    var cartes = [], C0 = (cotation && cotation.cartes) || {}, C = {};
    Object.keys(C0).forEach(function (k) { C[k] = C0[k]; });
    // cartes anglaises : pas encore de cote Cardmarket, seulement les ventes eBay
    EN.forEach(function (e) { if (!C["en-" + e[0]]) C["en-" + e[0]] = { nom: e[1], extension: e[2], numero: e[3], langue: "en" }; });
    var dansSemaine = (ventes || []).filter(function (v) { return v && v.prix > 0 && v.date >= debut && v.date <= fin; });
    Object.keys(C).forEach(function (id) {
      var c = C[id], l = c.langue === "ja" ? "ja" : c.langue === "en" ? "en" : "fr";
      var vs = dansSemaine.filter(function (v) { return cleNum(v.numero) === cleNum(c.numero) && langue(v.langue) === l; });
      var prix = vs.map(function (v) { return v.prix; });
      var etats = {}; vs.forEach(function (v) { if (v.etat) etats[v.etat] = (etats[v.etat] || 0) + 1; });
      var etat = Object.keys(etats).sort(function (a, b) { return etats[b] - etats[a]; })[0] || "";
      cartes.push({ id: id, nom: String(c.nom || ""), ext: String(c.extension || ""), num: String(c.numero || ""), l: l,
        cote: typeof c.tendance === "number" ? c.tendance : null, moy30: typeof c.moy30 === "number" ? c.moy30 : null,
        n: vs.length, med: prix.length ? arr2(mediane(prix)) : null, min: prix.length ? Math.min.apply(null, prix) : null,
        max: prix.length ? Math.max.apply(null, prix) : null, etat: etat, conseil: conseil(c) });
    });
    // la liste complète des ventes de la période, gardée avec la photo de la semaine
    var liste = dansSemaine.map(function (v) {
      return { carte: String(v.carte || ""), numero: String(v.numero || ""), langue: String(v.langue || ""), etat: String(v.etat || ""), grade: String(v.grade || ""),
        prix: v.prix, port: typeof v.port === "number" ? v.port : null, date: String(v.date || ""), type: String(v.type || ""), itm: String(v.itm || ""), photo: String(v.photo || "") };
    }).sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : b.prix - a.prix; });
    return { debut: debut, fin: fin, releve: String((cotation && cotation.releve) || ""), ventes: dansSemaine.length, cartes: cartes, liste: liste };
  }
  g.RegistreCalcul = { conseil: conseil, semaine: semaine, periode: periode, cleNum: cleNum, langue: langue, moinsJours: moinsJours };
})(typeof window !== "undefined" ? window : globalThis);
