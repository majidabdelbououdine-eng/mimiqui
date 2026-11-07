/* Archive des ventes : filtre client, fenêtre de 365 jours, résumé par Pokémon.
   Les chiffres viennent uniquement de window.ARCHIVE_VENTES. */
(function () {
  "use strict";
  var JOURS = 365;
  var CAMP = "5339225196";
  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  var LANGUES = { fr: "Français", ja: "Japonais", en: "Anglais" };

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
    var mots = { nm: "Near Mint", ex: "Excellent", bon: "Bon", neuve: "Neuve" };
    return mots[s.toLowerCase()] || s;
  }
  function lienEbay(v) {
    var idt = identifiants(v);
    if (!idt.id) return idt.lien || "";
    return "https://www.ebay.fr/itm/" + encodeURIComponent(idt.id) +
      "?mkcid=1&mkrid=709-53476-19255-0&siteid=71&campid=" + CAMP +
      "&customid=archive&toolid=10001&mkevt=1";
  }
  function langueLabel(code) {
    return LANGUES[code] || code || "";
  }

  function source() {
    return dedupe(Array.isArray(window.ARCHIVE_VENTES) ? window.ARCHIVE_VENTES : []);
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

  function dessin(ventes) {
    var svg = $("av-chart");
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    if (!ventes.length) { svg.hidden = true; return; }
    svg.hidden = false;
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
    var W = 640, H = 188, pl = 78, pr = 10, pt = 16, pb = 28;
    var max = ord.reduce(function (m, v) { return v.prix > m ? v.prix : m; }, 0);
    if (!(max > 0)) max = 1;
    var innerW = W - pl - pr, innerH = H - pt - pb;
    var n = ord.length;
    var gap = n > 1 ? Math.min(3, innerW / n * 0.25) : 0;
    var bw = n > 1 ? (innerW - gap * (n - 1)) / n : Math.min(28, innerW);
    var titre = el("title", {});
    titre.textContent = "Historique des prix : " + n + " vente" + (n > 1 ? "s" : "") + ", de " + euros(ord[0].prix) + " à " + euros(max);
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
      tip.textContent = jour(v.date) + " · " + euros(v.prix) + " · " + v.carte + (v.numero ? " " + v.numero : "");
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
    lab(euros(max), pl - 6, pt + 4);
    lab("0 €", pl - 6, pt + innerH);
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
      set.textContent = v.set;
      body.appendChild(set);
    }
    var meta = document.createElement("p");
    meta.className = "av-meta";
    var prix = document.createElement("strong");
    prix.textContent = euros(v.prix);
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
    extra.textContent = bits.join(" · ");
    if (bits.length) body.appendChild(extra);
    var url = lienEbay(v);
    if (url) {
      var a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "sponsored noopener";
      a.textContent = "Voir sur eBay";
      body.appendChild(a);
    }
    li.appendChild(body);
    return li;
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
    titre.textContent = "« " + q + " » — 12 derniers mois";
    stats.textContent = "";
    if (!ventes.length) {
      var vide = document.createElement("p");
      vide.className = "av-aucune";
      vide.textContent = "Aucune vente pour « " + q + " » sur les 12 derniers mois.";
      stats.appendChild(vide);
      hist.textContent = "";
      if (legende) legende.hidden = true;
      dessin([]);
      return;
    }
    var somme = 0, min = ventes[0].prix, max = ventes[0].prix;
    ventes.forEach(function (v) {
      somme += v.prix;
      if (v.prix < min) min = v.prix;
      if (v.prix > max) max = v.prix;
    });
    var moy = somme / ventes.length;
    var lignes = [
      ["Ventes", String(ventes.length)],
      ["Prix moyen", euros(moy)],
      ["Prix minimum", euros(min)],
      ["Prix maximum", euros(max)]
    ];
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
    var note = document.createElement("p");
    note.className = "av-calc";
    note.textContent = "Calculé sur les " + ventes.length + " vente" + (ventes.length > 1 ? "s" : "") + " affichée" + (ventes.length > 1 ? "s" : "") + " (365 derniers jours).";
    stats.appendChild(note);
    dessin(ventes);
    hist.textContent = "";
    if (legende) legende.hidden = false;
    var ord = ventes.slice().sort(function (a, b) {
      if (a.date !== b.date) return a.date < b.date ? -1 : 1;
      return a.prix - b.prix;
    });
    ord.forEach(function (v) {
      var li = document.createElement("li");
      var time = document.createElement("time");
      time.dateTime = v.date;
      time.textContent = jour(v.date);
      var b = document.createElement("b");
      b.textContent = euros(v.prix);
      var span = document.createElement("span");
      span.textContent = v.carte + (v.numero ? " " + v.numero : "");
      li.appendChild(time);
      li.appendChild(b);
      li.appendChild(span);
      hist.appendChild(li);
    });
  }

  function boot() {
    var f = fenetre();
    var toutes = source().filter(valide);
    var recentes = toutes.filter(function (v) { return dansFenetre(v, f); });
    var anciennes = toutes.filter(function (v) { return v.date < f.debut || v.date > f.fin; });
    var note = $("av-note");
    if (note) {
      note.textContent = anciennes.length
        ? anciennes.length + " vente" + (anciennes.length > 1 ? "s" : "") + " de plus de 365 jours " + (anciennes.length > 1 ? "restent" : "reste") + " dans l'archive et " + (anciennes.length > 1 ? "ne sont pas affichées" : "n'est pas affichée") + "."
        : "Les ventes de plus de 365 jours restent dans l'archive et ne s'affichent pas.";
    }
    var sets = [];
    var langues = [];
    var mois = [];
    recentes.forEach(function (v) {
      if (v.set && sets.indexOf(v.set) < 0) sets.push(v.set);
      if (v.langue && langues.indexOf(v.langue) < 0) langues.push(v.langue);
      var ym = v.date.slice(0, 7);
      if (mois.indexOf(ym) < 0) mois.push(ym);
    });
    sets.sort(function (a, b) { return a.localeCompare(b, "fr"); });
    langues.sort();
    mois.sort();
    remplit($("av-set"), sets, "Tous les sets", function (s) { return s; });
    remplit($("av-langue"), langues, "Toutes", langueLabel);
    remplit($("av-mois"), mois, "Tous les mois", moisLabel);

    var params = new URLSearchParams(location.search);
    if (params.get("q")) $("av-q").value = params.get("q");

    function affiche() {
      var qRaw = $("av-q").value.trim();
      var q = norm(qRaw);
      var set = $("av-set").value;
      var langue = $("av-langue").value;
      var mois = $("av-mois").value;
      var liste = recentes.filter(function (v) {
        if (q && norm(v.carte).indexOf(q) < 0) return false;
        if (set && v.set !== set) return false;
        if (langue && v.langue !== langue) return false;
        if (mois && v.date.slice(0, 7) !== mois) return false;
        return true;
      });
      liste.sort(function (a, b) {
        if (a.date !== b.date) return a.date < b.date ? 1 : -1;
        if (a.prix !== b.prix) return b.prix - a.prix;
        return String(a.carte).localeCompare(String(b.carte), "fr");
      });
      var compte = $("av-compte");
      var ol = $("av-liste");
      var vide = $("av-vide");
      ol.textContent = "";
      liste.forEach(function (v) { ol.appendChild(carte(v)); });
      if (compte) {
        var n = liste.length;
        compte.textContent = n + " vente" + (n > 1 ? "s" : "") + " sur les 365 derniers jours";
      }
      if (vide) {
        vide.hidden = liste.length > 0;
        if (!liste.length) {
          vide.textContent = qRaw
            ? "Aucune vente pour « " + qRaw + " » sur les 12 derniers mois."
            : (recentes.length ? "Aucune vente ne correspond à ces filtres." : "Aucune vente de moins d'un an dans l'archive.");
        }
      }
      resume(qRaw, liste);
    }

    ["input", "change"].forEach(function (ev) {
      $("av-q").addEventListener(ev, affiche);
      $("av-set").addEventListener(ev, affiche);
      $("av-langue").addEventListener(ev, affiche);
      $("av-mois").addEventListener(ev, affiche);
    });
    var form = $("av-form");
    if (form) form.addEventListener("submit", function (e) { e.preventDefault(); affiche(); });
    var reset = $("av-reset");
    if (reset) reset.addEventListener("click", function () {
      $("av-q").value = "";
      $("av-set").value = "";
      $("av-langue").value = "";
      $("av-mois").value = "";
      affiche();
    });
    affiche();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
