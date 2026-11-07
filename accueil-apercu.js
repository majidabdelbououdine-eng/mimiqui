/* Dernières ventes (registre-ventes-data.js) et recherche de cote (cotation-data.js). */
(function () {
  "use strict";
  var NB = 8;
  var CAMP = "5339225196";

  function norm(s) {
    return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }
  function cle(n) {
    return String(n || "").replace(/\s/g, "").split("/").map(function (x) { return x.replace(/^0+(?=\d)/, ""); }).join("/").toLowerCase();
  }
  function slug(carte, numero) {
    return (String(carte || "") + "-" + String(numero || "")).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  function euros(n) {
    return Number(n).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
  }
  function dateOk(d) { return /^\d{4}-\d{2}-\d{2}$/.test(d || ""); }
  function jour(d) {
    if (!dateOk(d)) return "";
    var t = new Date(d + "T12:00:00");
    return isNaN(t.getTime()) ? "" : t.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  }
  function isoLocal(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function lienEbay(itm) {
    return "https://www.ebay.fr/itm/" + encodeURIComponent(itm) + "?mkcid=1&mkrid=709-53476-19255-0&siteid=71&campid=" + CAMP + "&customid=accueil&toolid=10001&mkevt=1";
  }
  function langueDe(c) {
    return c && c.langue === "ja" ? "ja" : c && c.langue === "en" ? "en" : "fr";
  }
  function cartesCote() {
    var C = (window.COTATION && window.COTATION.cartes) || {};
    return Object.keys(C).map(function (id) {
      var c = C[id] || {};
      return {
        id: id,
        nom: String(c.nom || ""),
        ext: String(c.extension || ""),
        num: String(c.numero || ""),
        langue: langueDe(c),
        tendance: typeof c.tendance === "number" ? c.tendance : null,
        page: c.page || "",
        photo: c.photo || ""
      };
    });
  }
  function indexCotes(cartes) {
    var map = {};
    cartes.forEach(function (c) {
      var k = c.langue + "|" + cle(c.num);
      (map[k] = map[k] || []).push(c);
    });
    return map;
  }
  function matchCarte(v, map) {
    var hits = map[(v.langue || "") + "|" + cle(v.numero)] || [];
    if (!hits.length) return null;
    if (hits.length === 1) return hits[0];
    var nom = norm(v.carte);
    return hits.filter(function (h) { return norm(h.nom) === nom; })[0] || hits[0];
  }
  function pageDe(c) {
    if (!c) return "registre.html";
    if (c.page) return c.page;
    if (c.langue === "ja") return "cartes-japonaises.html#" + encodeURIComponent(c.id);
    if (c.langue === "en") return "cartes-anglaises.html#" + encodeURIComponent(String(c.id).replace(/^en-/, ""));
    return "cartes.html#" + encodeURIComponent(c.id);
  }
  function photoDe(v) {
    var dir = v.langue === "ja" ? "jp" : v.langue === "en" ? "en" : "fr";
    return "photos-ventes/" + dir + "/" + slug(v.carte, v.numero) + "_itm-" + v.itm + ".webp";
  }

  function renduVentes(cartes) {
    var source = Array.isArray(window.REGISTRE_VENTES) ? window.REGISTRE_VENTES : null;
    var compteur = document.getElementById("ap-compteur");
    var ol = document.getElementById("ap-liste");
    if (!source || !ol) return;
    var ventes = source.filter(function (v) {
      return v && typeof v.prix === "number" && v.prix > 0 && v.carte;
    });
    if (compteur) {
      var n = ventes.length;
      var txt = n + " vente" + (n > 1 ? "s" : "") + " relevée" + (n > 1 ? "s" : "") + " dans le registre";
      if (ventes.some(function (v) { return dateOk(v.date); })) {
        var today = new Date();
        var fin = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        var debut = new Date(fin.getTime());
        debut.setDate(debut.getDate() - 6);
        var a = isoLocal(debut), b = isoLocal(fin);
        var x = ventes.filter(function (v) { return dateOk(v.date) && v.date >= a && v.date <= b; }).length;
        txt += ", dont " + x + " ces 7 derniers jours";
      }
      compteur.textContent = txt;
    }
    var map = indexCotes(cartes);
    var top = ventes.slice().sort(function (a, b) {
      var da = a.date || "", db = b.date || "";
      if (da === db) return 0;
      return da < db ? 1 : -1;
    }).slice(0, NB);
    ol.textContent = "";
    top.forEach(function (v) {
      var c = matchCarte(v, map);
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.className = "ap-item";
      if (v.itm) {
        a.href = lienEbay(v.itm);
        a.target = "_blank";
        a.rel = "sponsored noopener";
      } else {
        a.href = pageDe(c);
      }
      var img = document.createElement("img");
      img.alt = v.carte + (v.numero ? " " + v.numero : "");
      img.width = 54;
      img.height = 76;
      img.decoding = "async";
      img.loading = "lazy";
      img.src = v.itm ? photoDe(v) : "";
      img.addEventListener("error", function () {
        if (img.dataset.step === "done") { img.remove(); return; }
        if (img.dataset.step !== "jpg" && /\.webp(\?|$)/.test(img.src)) {
          img.dataset.step = "jpg";
          img.src = img.src.replace(/\.webp(\?|$)/, ".jpg$1");
          return;
        }
        if (img.dataset.step !== "art" && c && c.langue === "fr") {
          img.dataset.step = "art";
          img.src = "img/" + c.id + ".webp";
          return;
        }
        if (img.dataset.step !== "art" && c && c.photo) {
          img.dataset.step = "art";
          img.src = c.photo;
          return;
        }
        img.dataset.step = "done";
        img.remove();
      });
      var body = document.createElement("span");
      body.className = "ap-txt";
      var nom = document.createElement("b");
      nom.textContent = v.carte + (v.numero ? " " + v.numero : "");
      body.appendChild(nom);
      if (c && c.ext) {
        var set = document.createElement("small");
        set.textContent = c.ext;
        body.appendChild(set);
      }
      var meta = document.createElement("span");
      meta.className = "ap-meta";
      var prix = document.createElement("strong");
      prix.textContent = euros(v.prix);
      meta.appendChild(prix);
      var d = jour(v.date);
      if (d) {
        var time = document.createElement("time");
        time.dateTime = v.date;
        time.textContent = d;
        meta.appendChild(time);
      }
      body.appendChild(meta);
      if (v.itm) a.appendChild(img);
      a.appendChild(body);
      li.appendChild(a);
      ol.appendChild(li);
    });
  }

  function renduRecherche(cartes) {
    var input = document.getElementById("ap-q");
    var ul = document.getElementById("ap-res");
    var form = document.getElementById("ap-form");
    if (!input || !ul || !form) return;
    var lg = { fr: "FR", ja: "JP", en: "EN" };
    function nomIndex(c) {
      var n = norm(c.nom + " " + c.num);
      if (n.indexOf("mimikyu") >= 0) n += " mimiqui";
      else if (n.indexOf("mimiqui") >= 0) n += " mimikyu";
      return n;
    }
    function chercher(q) {
      var mots = norm(q).trim().split(/\s+/).filter(Boolean);
      if (!mots.length || norm(q).trim().length < 2) return [];
      function ok(c, champs) {
        return mots.every(function (m) { return champs.indexOf(m) >= 0; });
      }
      var parNom = cartes.filter(function (c) { return ok(c, nomIndex(c)); });
      var liste = parNom.length ? parNom : cartes.filter(function (c) {
        return ok(c, norm([c.nom, c.ext, c.num, c.id].join(" ")));
      });
      return liste.slice(0, 8);
    }
    function fermer() {
      ul.hidden = true;
      input.setAttribute("aria-expanded", "false");
    }
    function afficher(list) {
      ul.textContent = "";
      if (!list.length) { fermer(); return; }
      list.forEach(function (c) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = pageDe(c);
        var b = document.createElement("b");
        b.textContent = c.nom || c.id;
        var s = document.createElement("small");
        s.textContent = [c.ext, c.num, lg[c.langue]].filter(Boolean).join(" · ");
        a.appendChild(b);
        a.appendChild(s);
        if (c.tendance != null) {
          var p = document.createElement("span");
          p.textContent = euros(c.tendance);
          a.appendChild(p);
        }
        li.appendChild(a);
        ul.appendChild(li);
      });
      ul.hidden = false;
      input.setAttribute("aria-expanded", "true");
    }
    input.addEventListener("input", function () { afficher(chercher(input.value)); });
    form.addEventListener("submit", function (e) {
      var q = input.value.trim();
      var list = chercher(q);
      if (list.length === 1) {
        e.preventDefault();
        location.href = pageDe(list[0]);
        return;
      }
      if (q) {
        e.preventDefault();
        location.href = "registre.html?q=" + encodeURIComponent(q);
      }
    });
    document.addEventListener("click", function (e) {
      if (!form.parentNode.contains(e.target)) fermer();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") fermer();
    });
  }

  function boot() {
    var cartes = cartesCote();
    renduVentes(cartes);
    renduRecherche(cartes);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
