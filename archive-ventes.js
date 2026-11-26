/* Archive des ventes : filtre client, fenêtre de 365 jours, résumé par Pokémon.
   Les chiffres viennent de window.ARCHIVE_VENTES, fusionné avec
   window.SET_DE_BASE_VENTES (USD, sans filtre de 365 jours) et avec
   window.ARCHIVE_SITE_VENTES (toutes les ventes du site, format compact,
   chargé après le premier affichage pour garder la page rapide). */
(function () {
  "use strict";
  var JOURS = 365;
  var CAMP = "5339225196";
  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  var LANGUES = { fr: "Français", ja: "Japonais", en: "Anglais", de: "Allemand", it: "Italien", es: "Espagnol", pt: "Portugais", ko: "Coréen", zh: "Chinois" };
  var PAGE = 60;
  function $(id) { return document.getElementById(id); }
  function norm(s) {
    return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iso(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function dateOk(d) { return /^\d{4}-\d{2}-\d{2}$/.test(d || ""); }
  function fenetre() {
    var now = new Date();
    var fin = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var debut = new Date(fin.getTime());
    debut.setDate(debut.getDate() - JOURS);
    return { debut: iso(debut), fin: iso(fin) };
  }
  function euros(n) {
    return Number(n).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
  }
  function formatPrix(n, devise) {
    var dev = String(devise || "EUR").toUpperCase();
    if (dev === "USD") {
      return Number(n).toFixed(2).replace(".", ",") + " USD";
    }
    if (dev && dev !== "EUR") {
      return Number(n).toLocaleString("fr-FR", { style: "currency", currency: dev });
    }
    return euros(n);
  }
  function deviseDe(v) {
    return String((v && (v.devise || v.dev)) || "EUR").toUpperCase();
  }
  function estSetDeBase(v) {
    return !!(v && (v.set === "Set de Base" || v.serie === "Set de Base"));
  }
  function isoDate(d) {
    if (dateOk(d)) return d;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(d || "")) {
      var p = d.split("/");
      return p[2] + "-" + p[1] + "-" + p[0];
    }
    return d || "";
  }
  function normaliseSdb(list) {
    var out = [];
    (list || []).forEach(function (v) {
      if (!v || typeof v !== "object") return;
      var id = String(v.id || "").trim();
      var lien = String(v.lien || v.u || "").trim();
      if (!id) {
        var m = lien.match(/\/itm\/(\d+)/i);
        if (m) id = m[1];
      }
      if (!id) return;
      var etat = String(v.etat || "");
      if (!etat && v.grade) etat = "gradee " + v.grade;
      out.push({
        id: id,
        carte: v.carte || v.nom || "",
        numero: v.numero || "",
        set: v.set || "Set de Base",
        langue: v.langue || "fr",
        prix: Number(v.prix),
        devise: String(v.devise || v.dev || "USD").toUpperCase(),
        date: isoDate(v.date),
        etat: etat,
        photo: v.photo || v.vignette || "",
        lien: lien,
        edition: v.edition || v.ed || ""
      });
    });
    return out;
  }
  function jour(d) {
    if (!dateOk(d)) return "";
    var p = d.split("-");
    var mi = parseInt(p[1], 10) - 1;
    return parseInt(p[2], 10) + " " + (MOIS[mi] || p[1]) + " " + p[0];
  }
  function jourCourt(d) {
    if (!dateOk(d)) return "";
    var p = d.split("-");
    return p[2] + "/" + p[1];
  }
  function moisLabel(ym) {
    var p = ym.split("-");
    var mi = parseInt(p[1], 10) - 1;
    return (MOIS[mi] || p[1]) + " " + p[0];
  }
  function canonLien(u) {
    if (!u) return "";
    var s = String(u).trim();
    var m = s.match(/\/itm\/(\d+)/i);
    if (m) return "https://www.ebay.fr/itm/" + m[1];
    return s.split("?")[0].replace(/\/$/, "");
  }
  function identifiants(v) {
    var id = String((v && (v.id || v.itm)) || "").trim();
    var lien = canonLien(v && v.lien);
    if (!id && lien) {
      var m = lien.match(/\/itm\/(\d+)/);
      if (m) id = m[1];
    }
    return { id: id, lien: lien || (id ? "https://www.ebay.fr/itm/" + id : "") };
  }
  function dedupe(list) {
    var seen = {};
    var out = [];
    (list || []).forEach(function (v) {
      if (!v || typeof v !== "object") return;
      var idt = identifiants(v);
      var k1 = idt.id ? "id:" + idt.id : "";
      var k2 = idt.lien ? "lien:" + idt.lien : "";
      if (!k1 && !k2) return;
      if ((k1 && seen[k1]) || (k2 && seen[k2])) return;
      if (k1) seen[k1] = 1;
      if (k2) seen[k2] = 1;
      out.push(v);
      return;
    });
    return out;
  }
  function valide(v) {
    return !!(v && typeof v.carte === "string" && v.carte && typeof v.prix === "number" && isFinite(v.prix) && v.prix > 0 && dateOk(v.date));
  }
  function dansFenetre(v, f) {
    return valide(v) && v.date >= f.debut && v.date <= f.fin;
  }
  function etatLabel(e) {
    var s = String(e || "").trim();
    if (!s || s === "—" || s === "-" || s === "–") return "";
    var g = s.match(/^gradee\s+([A-Za-z]+)\s+([0-9]+(?:[.,][0-9]+)?)$/i);
    if (g) return g[1].toUpperCase() + " " + g[2].replace(".", ",");
    var mots = { nm: "Near Mint", ex: "Excellent", bon: "Bon", neuve: "Neuve", occasion: "Occasion", gradee: "Gradée" };
    return mots[s.toLowerCase()] || s;
  }
  function langueLabel(code) {
    return LANGUES[code] || code || "";
  }


  var ETATS_BRUTS = { nm: 1, ex: 1, bon: 1, neuve: 1, occasion: 1 };
  var GROUPES = [
    { id: "brute-fr", titre: "Cartes brutes — Français", court: "Brutes FR" },
    { id: "brute-ja", titre: "Cartes brutes — Japonais", court: "Brutes JP" },
    { id: "brute-en", titre: "Cartes brutes — Anglais", court: "Brutes EN" },
    { id: "gradee", titre: "Cartes gradées", court: "Gradées" },
    { id: "autre", titre: "Autre / non précisé", court: "Autre / non précisé" }
  ];
  var GRADEURS_TITRE = /\b(?:psa|pca|cgc|bgs)\b/i;

  function texteDetection(v) {
    return [v && v.carte, v && v.numero, v && v.set, v && v.etat, v && v.edition, v && v.pokemon, v && v.source]
      .filter(Boolean).join(" ");
  }
  function etatClasse(v) {
    var e = String((v && v.etat) || "").trim();
    if (e === "—" || e === "-" || e === "–") e = "";
    var n = norm(e);
    if (n.indexOf("gradee") === 0) return "gradee";
    if (ETATS_BRUTS[n]) return "brute";
    if (GRADEURS_TITRE.test(texteDetection(v))) return "gradee";
    return "autre";
  }
  function langueDepuisTitre(v) {
    var t = " " + norm(texteDetection(v)) + " ";
    if (/\bfrancais(?:e|es)?\b|\bfrench\b|\bfr\b/.test(t)) return "fr";
    if (/\bjaponais(?:e|es)?\b|\bjapanese\b|\bjp\b|\bjpn\b/.test(t)) return "ja";
    if (/\banglais(?:e|es)?\b|\benglish\b/.test(t)) return "en";
    if (/\(\s*en\s*\)|\[\s*en\s*\]|\/\s*en(?:\s|\/|$)|(?:^|\s)en\s*\/|\blangue\s*en\b|\ben-us\b|\bus-en\b/.test(t)) return "en";
    return "";
  }
  function langueClasse(v) {
    var code = String((v && v.langue) || "").toLowerCase().trim();
    if (code === "jp") code = "ja";
    if (code === "fr" || code === "ja" || code === "en") return code;
    if (!code) return langueDepuisTitre(v);
    return "";
  }
  function groupeDe(v) {
    var et = etatClasse(v);
    if (et === "gradee") return "gradee";
    if (et === "brute") {
      var l = langueClasse(v);
      if (l) return "brute-" + l;
    }
    return "autre";
  }
  var LANGUE_RECH = { fr: "FR", ja: "JP", jp: "JP", en: "EN", de: "DE", it: "IT", es: "ES", pt: "PT", ko: "KO", zh: "ZH" };
  var BRUIT_RECH = /\b(?:vendu[es]?|ventes?|ench[eè]res?|lots?|port\s+inclus|frais\s+de\s+port|livraison|ebay|item|annonces?|voir\s+sur|meilleure\s+offre|best\s+offer|sold|shipping|free\s+shipping|near\s+mint|lightly\s+played|moderately\s+played|heavily\s+played|damaged)\b/gi;
  var PRIX_RECH = /(?:€|\$|usd|eur)\s*\d+(?:[.,]\d+)?|\d+[.,]\d+\s*(?:€|eur|usd|\$)/gi;
  var GRADE_RECH = /\b(?:psa|cgc|bgs|pca|sgc)\s*[:-]?\s*[0-9]+(?:[.,][0-9]+)?\b|\bgradee\b|\bgrad[eé]e?s?\b/gi;

  function nettoieRech(s, oterGrade) {
    BRUIT_RECH.lastIndex = 0;
    PRIX_RECH.lastIndex = 0;
    GRADE_RECH.lastIndex = 0;
    var t = String(s || "").replace(/[_]+/g, " ").replace(BRUIT_RECH, " ").replace(PRIX_RECH, " ");
    if (oterGrade) t = t.replace(GRADE_RECH, " ");
    return t.replace(/[|•·]+/g, " ").replace(/\s+/g, " ").trim();
  }
  function contientNorm(hay, needle) {
    var h = " " + norm(hay) + " ";
    var n = norm(needle);
    return !!n && h.indexOf(" " + n + " ") !== -1;
  }
  function gradeRecherche(v) {
    if (etatClasse(v) !== "gradee") return "";
    var s = String((v && v.etat) || "").trim();
    var g = s.match(/^gradee\s+([A-Za-z]+)\s+([0-9]+(?:[.,][0-9]+)?)$/i);
    if (g) return g[1].toUpperCase() + " " + g[2].replace(",", ".");
    var t = texteDetection(v);
    var m = t.match(/\b(psa|cgc|bgs|pca|sgc)\s*[:-]?\s*([0-9]+(?:[.,][0-9]+)?)\b/i);
    if (m) return m[1].toUpperCase() + " " + m[2].replace(",", ".");
    return "";
  }
  function requeteRechercheEbay(v) {
    var grade = gradeRecherche(v);
    var oterGrade = !grade;
    var parts = [];
    var nom = nettoieRech(v && v.carte, oterGrade);
    var poke = nettoieRech(v && v.pokemon, oterGrade);
    if (nom) parts.push(nom);
    if (poke && !contientNorm(parts.join(" "), poke)) parts.push(poke);
    var num = String((v && v.numero) || "").trim();
    if (num && !contientNorm(parts.join(" "), num)) parts.push(num);
    var set = nettoieRech(v && (v.set || v.serie), false);
    if (set && !contientNorm(parts.join(" "), set)) parts.push(set);
    var lang = String((v && v.langue) || "").toLowerCase().trim();
    if (lang === "jp") lang = "ja";
    if (!LANGUE_RECH[lang]) lang = langueClasse(v);
    var tok = LANGUE_RECH[lang];
    if (tok && !contientNorm(parts.join(" "), tok) && !contientNorm(parts.join(" "), langueLabel(lang))) parts.push(tok);
    if (grade) parts.push(grade);
    var q = parts.join(" ").replace(/\s+/g, " ").trim();
    if (q && !/\bpok[eé]mon\b/i.test(q) && q.indexOf("ポケモン") === -1) q = "Pokémon " + q;
    return q;
  }
  function lienEbay(v) {
    var q = requeteRechercheEbay(v);
    if (!q) return "";
    var custom = estSetDeBase(v) ? "set-de-base" : "archive";
    var nkw = encodeURIComponent(q).replace(/%2F/gi, "/");
    return "https://www.ebay.fr/sch/i.html?_nkw=" + nkw +
      "&mkcid=1&mkrid=709-53476-19255-0&siteid=71&campid=" + CAMP +
      "&customid=" + custom + "&toolid=10001&mkevt=1";
  }
  function repartit(ventes) {
    var map = {};
    GROUPES.forEach(function (g) { map[g.id] = []; });
    (ventes || []).forEach(function (v) {
      var id = groupeDe(v);
      if (!map[id]) map.autre.push(v);
      else map[id].push(v);
    });
    return map;
  }
  function statsDevise(ventes) {
    var out = [];
    devisesListe(ventes).forEach(function (dev) {
      var sous = ventes.filter(function (v) { return deviseDe(v) === dev; });
      if (!sous.length) return;
      var somme = 0, min = sous[0].prix, max = sous[0].prix;
      sous.forEach(function (v) {
        somme += v.prix;
        if (v.prix < min) min = v.prix;
        if (v.prix > max) max = v.prix;
      });
      out.push({
        devise: dev,
        n: sous.length,
        moyen: somme / sous.length,
        min: min,
        max: max,
        median: median(sous)
      });
    });
    return out;
  }


  function deplieSite(d) {
    var out = [];
    if (!d || !Array.isArray(d.ventes) || !Array.isArray(d.cartes)) return out;
    var sources = Array.isArray(d.sources) ? d.sources : [];
    d.ventes.forEach(function (r) {
      if (!Array.isArray(r)) return;
      var c = d.cartes[r[1]];
      if (!Array.isArray(c)) return;
      var id = String(r[0] || "");
      var com = r[7] === "com";
      var src = sources[r[2]] || [];
      out.push({
        id: id,
        carte: c[0] || "",
        numero: c[1] || "",
        set: c[2] || "",
        langue: c[3] || "",
        pokemon: c[4] || "",
        prix: Number(r[3]),
        devise: r[5] ? String(r[5]).toUpperCase() : "EUR",
        date: r[4] || "",
        etat: r[6] || "",
        photo: r[8] || c[5] || "",
        lien: id ? "https://www." + (com ? "ebay.com" : "ebay.fr") + "/itm/" + id : "",
        source: src[1] || "Site"
      });
    });
    return out;
  }
  var siteCache = null;
  function source() {
    var base = (Array.isArray(window.ARCHIVE_VENTES) ? window.ARCHIVE_VENTES : []).map(function (v) {
      if (v && !v.source) v.source = "Ventes passées Spécial Mimiqui";
      return v;
    });
    var sdb = normaliseSdb(window.SET_DE_BASE_VENTES).map(function (v) { v.source = "Set de Base"; return v; });
    if (!siteCache && window.ARCHIVE_SITE_VENTES) siteCache = deplieSite(window.ARCHIVE_SITE_VENTES);
    var liste = dedupe(base.concat(sdb, siteCache || []));
    liste.forEach(function (v) {
      if (v && v._q === undefined) v._q = norm(v.carte) + " " + norm(v.pokemon || "");
    });
    return liste;
  }

  function remplit(select, valeurs, etiquette, label) {
    var garde = select.value;
    select.textContent = "";
    var tous = document.createElement("option");
    tous.value = "";
    tous.textContent = etiquette;
    select.appendChild(tous);
    valeurs.forEach(function (v) {
      var o = document.createElement("option");
      o.value = v;
      o.textContent = label(v);
      select.appendChild(o);
    });
    if (garde && valeurs.indexOf(garde) >= 0) select.value = garde;
  }

  function devisesListe(ventes) {
    var d = [];
    (ventes || []).forEach(function (v) {
      var x = deviseDe(v);
      if (d.indexOf(x) < 0) d.push(x);
    });
    return d;
  }
  function dessin(ventes) {
    var svg = $("av-chart");
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var devises = devisesListe(ventes);
    if (devises.length > 1) {
      // Plusieurs devises : le graphique suit la devise la plus fréquente (jamais de conversion).
      var nb = {};
      ventes.forEach(function (v) { var d = deviseDe(v); nb[d] = (nb[d] || 0) + 1; });
      var top = devises.sort(function (a, b) { return nb[b] - nb[a]; })[0];
      ventes = ventes.filter(function (v) { return deviseDe(v) === top; });
      devises = [top];
    }
    if (!ventes.length) { svg.setAttribute("hidden", ""); return; }
    svg.removeAttribute("hidden");
    var devise = devises[0];
    var NS = "http://www.w3.org/2000/svg";
    function el(name, attrs) {
      var e = document.createElementNS(NS, name);
      Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
      return e;
    }
    var ord = ventes.slice().sort(function (a, b) {
      if (a.date !== b.date) return a.date < b.date ? -1 : 1;
      if (a.prix !== b.prix) return a.prix - b.prix;
      return String(a.id || "").localeCompare(String(b.id || ""));
    });
    var parJour = false;
    if (ord.length > 200) {
      // Beaucoup de ventes : une barre par jour (prix médian du jour).
      parJour = true;
      var jours = [];
      ord.forEach(function (v) {
        var dern = jours[jours.length - 1];
        if (!dern || dern.date !== v.date) { dern = { date: v.date, prix: [], n: 0 }; jours.push(dern); }
        dern.prix.push(v.prix);
      });
      ord = jours.map(function (j) {
        var p = j.prix.slice().sort(function (a, b) { return a - b; });
        var m = p.length % 2 ? p[(p.length - 1) / 2] : (p[p.length / 2 - 1] + p[p.length / 2]) / 2;
        return { date: j.date, prix: m, n: p.length, carte: "prix médian de " + p.length + " vente" + (p.length > 1 ? "s" : ""), devise: devise };
      });
    }
    var W = 640, H = 188, pl = 78, pr = 10, pt = 16, pb = 28;
    var max = ord.reduce(function (m, v) { return v.prix > m ? v.prix : m; }, 0);
    if (!(max > 0)) max = 1;
    var innerW = W - pl - pr, innerH = H - pt - pb;
    var n = ord.length;
    var gap = n > 1 ? Math.min(3, innerW / n * 0.25) : 0;
    var bw = n > 1 ? (innerW - gap * (n - 1)) / n : Math.min(28, innerW);
    var titre = el("title", {});
    titre.textContent = parJour
      ? "Historique des prix : prix médian par jour sur " + n + " jours"
      : "Historique des prix : " + n + " vente" + (n > 1 ? "s" : "") + ", de " + formatPrix(ord[0].prix, devise) + " à " + formatPrix(max, devise);
    svg.appendChild(titre);
    svg.appendChild(el("line", { x1: pl, y1: pt + innerH, x2: W - pr, y2: pt + innerH, stroke: "#0b3d91", "stroke-width": "1" }));
    ord.forEach(function (v, i) {
      var h = Math.max(1, (v.prix / max) * innerH);
      var x = pl + (n > 1 ? i * (bw + gap) : (innerW - bw) / 2);
      var y = pt + innerH - h;
      var rect = el("rect", {
        x: x.toFixed(2), y: y.toFixed(2), width: Math.max(bw, 0.6).toFixed(2), height: h.toFixed(2),
        fill: "#0a58ca", rx: "1"
      });
      var tip = document.createElementNS(NS, "title");
      tip.textContent = jour(v.date) + " · " + formatPrix(v.prix, deviseDe(v)) + " · " + v.carte + (v.numero ? " " + v.numero : "");
      rect.appendChild(tip);
      svg.appendChild(rect);
    });
    function lab(txt, x, y, anchor) {
      var te = el("text", {
        x: x, y: y, fill: "#0b3d91", "font-size": "12",
        "font-family": "Source Sans 3, Arial, sans-serif", "text-anchor": anchor || "end"
      });
      te.textContent = txt;
      svg.appendChild(te);
    }
    lab(formatPrix(max, devise), pl - 6, pt + 4);
    lab(formatPrix(0, devise), pl - 6, pt + innerH);
    lab(jourCourt(ord[0].date), pl, H - 8, "start");
    if (ord.length > 1) lab(jourCourt(ord[ord.length - 1].date), W - pr, H - 8, "end");
  }

  function carte(v) {
    var li = document.createElement("li");
    li.className = "av-carte";
    if (v.photo) {
      var img = document.createElement("img");
      img.alt = v.carte + (v.numero ? " " + v.numero : "");
      img.width = 84;
      img.height = 118;
      img.decoding = "async";
      img.loading = "lazy";
      img.src = v.photo;
      img.addEventListener("error", function () {
        if (img.dataset.step === "jpg") { img.remove(); return; }
        if (/\.webp(\?|$)/.test(img.src)) {
          img.dataset.step = "jpg";
          img.src = img.src.replace(/\.webp(\?|$)/, ".jpg$1");
          return;
        }
        img.remove();
      });
      li.appendChild(img);
    }
    var body = document.createElement("div");
    body.className = "av-corps";
    var h = document.createElement("h3");
    h.textContent = v.carte + (v.numero ? " " + v.numero : "");
    body.appendChild(h);
    if (v.set) {
      var set = document.createElement("p");
      set.className = "av-set";
      set.textContent = v.set + (v.pokemon ? " · " + v.pokemon : "");
      body.appendChild(set);
    }
    var meta = document.createElement("p");
    meta.className = "av-meta";
    var prix = document.createElement("strong");
    prix.textContent = formatPrix(v.prix, deviseDe(v));
    meta.appendChild(prix);
    var time = document.createElement("time");
    time.dateTime = v.date;
    time.textContent = jour(v.date);
    meta.appendChild(time);
    body.appendChild(meta);
    var extra = document.createElement("p");
    extra.className = "av-extra";
    var bits = [];
    if (v.langue && langueLabel(v.langue)) bits.push(langueLabel(v.langue));
    var et = etatLabel(v.etat);
    if (et) bits.push(et);
    if (v.source) bits.push(v.source);
    extra.textContent = bits.join(" · ");
    if (bits.length) body.appendChild(extra);
    var url = lienEbay(v);
    if (url) {
      var a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "nofollow sponsored noopener";
      a.textContent = "Voir sur eBay";
      body.appendChild(a);
    }
    li.appendChild(body);
    return li;
  }

  function median(l) {
    var p = l.map(function (v) { return v.prix; }).sort(function (a, b) { return a - b; });
    if (!p.length) return 0;
    return p.length % 2 ? p[(p.length - 1) / 2] : (p[p.length / 2 - 1] + p[p.length / 2]) / 2;
  }
  function resume(q, ventes) {
    var box = $("av-resume");
    var titre = $("av-resume-titre");
    var stats = $("av-stats");
    var hist = $("av-hist");
    var legende = $("av-hist-legende");
    if (!q) {
      box.hidden = true;
      stats.textContent = "";
      hist.textContent = "";
      dessin([]);
      return;
    }
    box.hidden = false;
    titre.textContent = "« " + q + " »";
    stats.textContent = "";
    if (!ventes.length) {
      var vide = document.createElement("p");
      vide.className = "av-aucune";
      vide.textContent = "Aucune vente affichée pour « " + q + " ».";
      stats.appendChild(vide);
      hist.textContent = "";
      if (legende) legende.hidden = true;
      dessin([]);
      return;
    }
    function ajouteLignes(lignes) {
      lignes.forEach(function (l) {
        var wrap = document.createElement("div");
        var dt = document.createElement("dt");
        dt.textContent = l[0];
        var dd = document.createElement("dd");
        dd.textContent = l[1];
        wrap.appendChild(dt);
        wrap.appendChild(dd);
        stats.appendChild(wrap);
      });
    }
    var devises = devisesListe(ventes);
    devises.forEach(function (dev) {
      var sous = ventes.filter(function (v) { return deviseDe(v) === dev; });
      var somme = 0, min = sous[0].prix, max = sous[0].prix;
      sous.forEach(function (v) {
        somme += v.prix;
        if (v.prix < min) min = v.prix;
        if (v.prix > max) max = v.prix;
      });
      var prefixe = devises.length > 1 ? " (" + dev + ")" : "";
      ajouteLignes([
        [devises.length > 1 ? "Ventes" + prefixe : "Ventes", String(sous.length)],
        ["Prix moyen" + prefixe, formatPrix(somme / sous.length, dev)],
        ["Prix minimum" + prefixe, formatPrix(min, dev)],
        ["Prix médian" + prefixe, formatPrix(median(sous), dev)],
        ["Prix maximum" + prefixe, formatPrix(max, dev)]
      ]);
    });
    var note = document.createElement("p");
    note.className = "av-calc";
    note.textContent = "Calculé sur les " + ventes.length + " vente" + (ventes.length > 1 ? "s" : "") + " affichée" + (ventes.length > 1 ? "s" : "") + " (365 derniers jours, ventes du Set de Base conservées au-delà).";
    stats.appendChild(note);
    var parType = repartit(ventes);
    var blocs = document.createElement("div");
    blocs.className = "av-types";
    var typTitre = document.createElement("p");
    typTitre.className = "av-types-titre";
    typTitre.textContent = "Par type";
    blocs.appendChild(typTitre);
    GROUPES.forEach(function (g) {
      var sous = parType[g.id] || [];
      if (!sous.length) return;
      var art = document.createElement("article");
      art.className = "av-type";
      var h = document.createElement("h3");
      h.textContent = g.titre + " (" + sous.length.toLocaleString("fr-FR") + ")";
      art.appendChild(h);
      var dl = document.createElement("dl");
      dl.className = "av-stats av-stats-type";
      statsDevise(sous).forEach(function (s) {
        var prefixe = s.devise && devisesListe(sous).length > 1 ? " (" + s.devise + ")" : "";
        [
          ["Ventes" + prefixe, String(s.n)],
          ["Prix moyen" + prefixe, formatPrix(s.moyen, s.devise)],
          ["Prix minimum" + prefixe, formatPrix(s.min, s.devise)],
          ["Prix maximum" + prefixe, formatPrix(s.max, s.devise)]
        ].forEach(function (l) {
          var wrap = document.createElement("div");
          var dt = document.createElement("dt");
          dt.textContent = l[0];
          var dd = document.createElement("dd");
          dd.textContent = l[1];
          wrap.appendChild(dt);
          wrap.appendChild(dd);
          dl.appendChild(wrap);
        });
      });
      art.appendChild(dl);
      if (g.id === "autre") {
        var hint = document.createElement("p");
        hint.className = "av-calc";
        hint.textContent = "Ventes dont l'état (brute ou gradée) ou la langue n'est pas indiqué dans l'archive, sans interprétation.";
        art.appendChild(hint);
      }
      blocs.appendChild(art);
    });
    if (blocs.querySelector(".av-type")) stats.appendChild(blocs);
    dessin(ventes);
    hist.textContent = "";
    if (legende) legende.hidden = false;
    var ord = ventes.slice().sort(function (a, b) {
      if (a.date !== b.date) return a.date < b.date ? -1 : 1;
      return a.prix - b.prix;
    });
    var MAXH = 120;
    if (ord.length > MAXH) {
      ord = ord.slice(ord.length - MAXH);
      if (legende) legende.textContent = "Historique des prix (les " + MAXH + " ventes les plus récentes)";
    } else if (legende) {
      legende.textContent = "Historique des prix";
    }
    ord.forEach(function (v) {
      var li = document.createElement("li");
      var time = document.createElement("time");
      time.dateTime = v.date;
      time.textContent = jour(v.date);
      var b = document.createElement("b");
      b.textContent = formatPrix(v.prix, deviseDe(v));
      var span = document.createElement("span");
      span.textContent = v.carte + (v.numero ? " " + v.numero : "");
      li.appendChild(time);
      li.appendChild(b);
      li.appendChild(span);
      hist.appendChild(li);
    });
  }

  function apiBase() {
    try {
      if (window.MIMIQUI_ABO && typeof window.MIMIQUI_ABO.apiBase === "function") {
        return window.MIMIQUI_ABO.apiBase();
      }
    } catch (e) {}
    var h = location.hostname;
    if (h === "localhost" || h === "127.0.0.1") return "http://127.0.0.1:8787/api";
    return "/api";
  }

  function boot() {
    var limite = PAGE;
    var derniere = [];
    var ongletActif = "";
    var parType = {};
    var dernierPayload = null;
    var requete = 0;
    var chargement = false;
    var erreurApi = "";

    function prepareFiltres(payload) {
      remplit($("av-set"), payload.sets || [], "Tous les sets", function (s) { return s; });
      remplit($("av-langue"), payload.langues || [], "Toutes", langueLabel);
      remplit($("av-mois"), payload.mois || [], "Tous les mois", moisLabel);
      sourcesTable(payload.sources || {}, payload.total || 0);
      var note = $("av-note");
      if (note) {
        note.textContent = "Les ventes de plus de 365 jours restent dans l'archive et ne s'affichent pas. Les ventes du Set de Base restent visibles, en USD, même après 365 jours. Les 3 ventes les plus récentes ainsi que le prix moyen, le plus bas et le plus haut sont visibles sans abonnement.";
      }
    }

    function sourcesTable(parSource, total) {
      var box = $("av-sources");
      var ul = $("av-sources-liste");
      var sum = $("av-sources-titre");
      if (!box || !ul) return;
      var noms = Object.keys(parSource).sort(function (a, b) {
        return parSource[b] - parSource[a] || a.localeCompare(b, "fr");
      });
      ul.textContent = "";
      noms.forEach(function (nom) {
        var li = document.createElement("li");
        var span = document.createElement("span");
        span.textContent = nom;
        var b = document.createElement("b");
        b.textContent = parSource[nom].toLocaleString("fr-FR");
        li.appendChild(span);
        li.appendChild(b);
        ul.appendChild(li);
      });
      if (sum) sum.textContent = "Ventes par source : " + total.toLocaleString("fr-FR") + " ventes, " + noms.length + " source" + (noms.length > 1 ? "s" : "");
      box.hidden = !noms.length;
    }

    var params = new URLSearchParams(location.search);
    if (params.get("q")) $("av-q").value = params.get("q");
    if (params.get("onglet")) ongletActif = params.get("onglet");

    function listeActive() { return derniere; }

    function rendCadenas(payload) {
      var box = $("av-cadenas");
      if (!box) return;
      box.textContent = "";
      if (!payload || payload.abonne || !payload.q || !(payload.masquees > 0 || (payload.total_onglet || payload.total || 0) > (payload.visible || 0))) {
        box.hidden = true;
        return;
      }
      box.hidden = false;
      var p = document.createElement("p");
      p.className = "av-cadenas-titre";
      var n = payload.masquees || 0;
      p.textContent = "🔒 " + n.toLocaleString("fr-FR") + " vente" + (n > 1 ? "s" : "") + " masquée" + (n > 1 ? "s" : "") + " — détail réservé aux abonnés.";
      var t = document.createElement("p");
      t.textContent = "Les 3 ventes les plus récentes et les prix moyen, minimum et maximum restent visibles. Abonnement : " + (payload.prix || "2,99 € / semaine") + ".";
      var a = document.createElement("a");
      a.className = "av-cadenas-btn";
      a.href = "mon-compte.html";
      a.textContent = "Débloquer avec l'abonnement";
      box.appendChild(p);
      box.appendChild(t);
      box.appendChild(a);
    }

    function rendOnglets(payload) {
      var bar = $("av-onglets");
      var panel = $("av-groupe-stats");
      if (!bar) return;
      bar.textContent = "";
      var onglets = (payload && payload.onglets) || {};
      var ids = GROUPES.filter(function (g) { return onglets[g.id] && onglets[g.id].n; }).map(function (g) { return g.id; });
      if (!payload || !payload.q || !ids.length) {
        bar.hidden = true;
        if (panel) { panel.hidden = true; panel.textContent = ""; }
        return;
      }
      bar.hidden = false;
      if (ids.indexOf(ongletActif) < 0) ongletActif = ids[0] || "";
      GROUPES.forEach(function (g) {
        var info = onglets[g.id];
        if (!info || !info.n) return;
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("role", "tab");
        b.id = "av-onglet-" + g.id;
        b.setAttribute("aria-selected", g.id === ongletActif ? "true" : "false");
        b.setAttribute("aria-controls", "av-liste");
        b.textContent = g.court + " (" + info.n.toLocaleString("fr-FR") + ")";
        b.addEventListener("click", function () {
          ongletActif = g.id;
          limite = PAGE;
          charger();
        });
        bar.appendChild(b);
      });
      if (panel) {
        panel.textContent = "";
        var g = GROUPES.filter(function (x) { return x.id === ongletActif; })[0];
        var info = g ? onglets[g.id] : null;
        if (!g || !info) { panel.hidden = true; return; }
        panel.hidden = false;
        var h = document.createElement("h2");
        h.className = "av-groupe-titre";
        h.textContent = g.titre + " — " + info.n.toLocaleString("fr-FR") + " vente" + (info.n > 1 ? "s" : "");
        panel.appendChild(h);
        var dl = document.createElement("dl");
        dl.className = "av-stats av-stats-type";
        (info.stats || []).forEach(function (s) {
          var prefixe = (info.stats.length > 1 ? " (" + s.devise + ")" : "");
          [
            ["Prix moyen" + prefixe, formatPrix(s.moyen, s.devise)],
            ["Prix minimum" + prefixe, formatPrix(s.min, s.devise)],
            ["Prix maximum" + prefixe, formatPrix(s.max, s.devise)]
          ].forEach(function (l) {
            var wrap = document.createElement("div");
            var dt = document.createElement("dt");
            dt.textContent = l[0];
            var dd = document.createElement("dd");
            dd.textContent = l[1];
            wrap.appendChild(dt);
            wrap.appendChild(dd);
            dl.appendChild(wrap);
          });
        });
        panel.appendChild(dl);
        if (g.id === "autre") {
          var hint = document.createElement("p");
          hint.className = "av-calc";
          hint.textContent = "Ventes dont l'état (brute ou gradée) ou la langue n'est pas indiqué dans l'archive, sans interprétation.";
          panel.appendChild(hint);
        }
      }
    }

    function rendListe(payload) {
      var ol = $("av-liste");
      var plus = $("av-plus");
      ol.textContent = "";
      var frag = document.createDocumentFragment();
      var sourceListe = listeActive();
      sourceListe.slice(0, limite).forEach(function (v) { frag.appendChild(carte(v)); });
      if (payload && !payload.abonne && payload.masquees > 0) {
        var nFlou = Math.min(6, payload.masquees);
        for (var i = 0; i < nFlou; i++) {
          var li = document.createElement("li");
          li.className = "av-carte av-masquee";
          li.setAttribute("aria-hidden", "true");
          li.innerHTML = "<div class=\"av-meta\"><strong>••••</strong><span>vente masquée</span></div>";
          frag.appendChild(li);
        }
      }
      ol.appendChild(frag);
      if (plus) {
        var reste = sourceListe.length - limite;
        plus.hidden = reste <= 0;
        if (reste > 0) plus.textContent = "Afficher " + Math.min(PAGE, reste) + " ventes de plus (" + reste.toLocaleString("fr-FR") + " restantes)";
      }
    }

    function affichePayload(payload) {
      dernierPayload = payload;
      var qRaw = $("av-q").value.trim();
      if (payload && payload.matches && payload.matches.length) {
        parType = {};
        derniere = [];
        rendOnglets(null);
        rendListe(payload);
        rendCadenas(null);
        var compte = $("av-compte");
        var vide = $("av-vide");
        if (compte) compte.textContent = payload.matches.length + " Pokémon correspondent à « " + qRaw + " ». Choisissez :";
        if (vide) {
          vide.hidden = false;
          vide.textContent = "";
          payload.matches.forEach(function (m) {
            var b = document.createElement("button");
            b.type = "button";
            b.className = "av-plus";
            b.style.margin = "0 8px 8px 0";
            b.textContent = m.nom + " (" + (m.n || 0).toLocaleString("fr-FR") + ")";
            b.addEventListener("click", function () {
              $("av-q").value = m.nom;
              charger({ slug: m.slug });
            });
            vide.appendChild(b);
          });
        }
        resume("", []);
        sourcesTable({}, 0);
        return;
      }
      derniere = (payload && payload.ventes) || [];
      prepareFiltres(payload || { sets: [], langues: [], mois: [], sources: {}, total: 0 });
      rendOnglets(payload);
      var compte = $("av-compte");
      var vide = $("av-vide");
      rendListe(payload);
      rendCadenas(payload);
      var n = payload ? (payload.abonne ? (payload.total_onglet || payload.total || derniere.length) : payload.total) : 0;
      if (compte) {
        if (!qRaw) {
          compte.textContent = "Cherchez un Pokémon pour voir les ventes de l'archive.";
        } else if (payload && payload.abonne) {
          compte.textContent = n.toLocaleString("fr-FR") + " vente" + (n > 1 ? "s" : "") + " trouvée" + (n > 1 ? "s" : "") + " (365 derniers jours, Set de Base conservé au-delà)" + (n > PAGE ? ", les plus récentes d'abord" : "");
        } else if (payload) {
          compte.textContent = n.toLocaleString("fr-FR") + " vente" + (n > 1 ? "s" : "") + " au total. " + (payload.visible || 0) + " visible" + ((payload.visible || 0) > 1 ? "s" : "") + " sans abonnement.";
        } else {
          compte.textContent = "";
        }
      }
      if (vide) {
        if (erreurApi) {
          vide.hidden = false;
          vide.textContent = erreurApi;
        } else if (chargement) {
          vide.hidden = false;
          vide.textContent = "Recherche dans l'archive…";
        } else if (!qRaw) {
          vide.hidden = false;
          vide.textContent = "Indiquez un nom de Pokémon pour afficher les ventes (3 dernières et moyenne, minimum, maximum visibles gratuitement).";
        } else {
          vide.hidden = derniere.length > 0;
          if (!derniere.length) vide.textContent = payload && payload.message ? payload.message : ("Aucune vente affichée pour « " + qRaw + " ».");
        }
      }
      resume(qRaw, payload && payload.abonne ? derniere : derniere);
    }

    function charger(extra) {
      var qRaw = $("av-q").value.trim();
      var mon = ++requete;
      erreurApi = "";
      if (!qRaw && !(extra && extra.slug)) {
        chargement = false;
        ongletActif = "";
        affichePayload({ q: "", ventes: [], total: 0, abonne: !!(dernierPayload && dernierPayload.abonne), besoin: "pokemon" });
        rendOnglets(null);
        rendCadenas(null);
        sourcesTable({}, 0);
        return;
      }
      chargement = true;
      affichePayload(dernierPayload && dernierPayload.q === qRaw ? dernierPayload : { q: qRaw, ventes: [], total: 0 });
      var url = apiBase() + "/ventes?q=" + encodeURIComponent(qRaw);
      if (extra && extra.slug) url += "&slug=" + encodeURIComponent(extra.slug);
      var set = $("av-set") && $("av-set").value;
      var langue = $("av-langue") && $("av-langue").value;
      var mois = $("av-mois") && $("av-mois").value;
      if (set) url += "&set=" + encodeURIComponent(set);
      if (langue) url += "&langue=" + encodeURIComponent(langue);
      if (mois) url += "&mois=" + encodeURIComponent(mois);
      if (ongletActif) url += "&onglet=" + encodeURIComponent(ongletActif);
      fetch(url, { credentials: "include" })
        .then(function (r) {
          if (!r.ok) throw new Error("api-" + r.status);
          return r.json();
        })
        .then(function (data) {
          if (mon !== requete) return;
          chargement = false;
          affichePayload(data);
        })
        .catch(function () {
          if (mon !== requete) return;
          chargement = false;
          erreurApi = "L'archive abonnés n'est pas encore joignable (API /api). Elle le sera après la mise en ligne du Worker. En local : wrangler dev sur le port 8787.";
          affichePayload({ q: qRaw, ventes: [], total: 0, abonne: false });
        });
    }

    function afficheBientot() {
      if (minuterie) clearTimeout(minuterie);
      minuterie = setTimeout(function () { ongletActif = ""; charger(); }, 160);
    }
    var minuterie = null;
    $("av-q").addEventListener("input", afficheBientot);
    $("av-q").addEventListener("change", function () { ongletActif = ""; charger(); });
    ["input", "change"].forEach(function (ev) {
      $("av-set").addEventListener(ev, function () { charger(); });
      $("av-langue").addEventListener(ev, function () { charger(); });
      $("av-mois").addEventListener(ev, function () { charger(); });
    });
    var form = $("av-form");
    if (form) form.addEventListener("submit", function (e) { e.preventDefault(); charger(); });
    var reset = $("av-reset");
    if (reset) reset.addEventListener("click", function () {
      $("av-q").value = "";
      $("av-set").value = "";
      $("av-langue").value = "";
      $("av-mois").value = "";
      ongletActif = "";
      charger();
    });
    var plus = $("av-plus");
    if (plus) plus.addEventListener("click", function () { limite += PAGE; rendListe(dernierPayload); });

    charger();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
