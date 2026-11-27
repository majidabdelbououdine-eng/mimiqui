/* Cadenas des ventes terminées — Le Coin de Mimiqui.
   Les ventes ne sont plus dans les fichiers publics : elles viennent de /api/verrou.
   Sans abonnement : les 3 ventes les plus récentes + le nombre de ventes masquées.
   En cas d'erreur, aucune vente n'est affichée (fail-closed). */
(function () {
  "use strict";
  if (window.MQV) return;
  var PRIX = "2,99 € / semaine";
  var etat = { abonne: false, erreur: false, cles: {}, pret: false };
  try { document.documentElement.classList.add("mq-verrou-serveur"); } catch (e) {}
  /* Les ventes libres sont de vraies ventes gratuites : pas de flou (le reste n'est pas chargé). */
  try {
    var st0 = document.createElement("style");
    st0.id = "mq-verrou-libres";
    st0.textContent = "html.mq-verrou-serveur:not(.mq-abonne) .liste-ventes li .prix-vente,html.mq-verrou-serveur:not(.mq-abonne) .derniere-vente:not(.vide) .prix-vente,html.mq-verrou-serveur:not(.mq-abonne) .ep-v a,html.mq-verrou-serveur:not(.mq-abonne) .ep-dep-in a,html.mq-verrou-serveur:not(.mq-abonne) #fr-cartes li.fv b,html.mq-verrou-serveur:not(.mq-abonne) #ja-cartes li.fv b,html.mq-verrou-serveur:not(.mq-abonne) #en-cartes li.fv b,html.mq-verrou-serveur:not(.mq-abonne) #ventes li:not(.groupe-v):not(.sans) b,html.mq-verrou-serveur:not(.mq-abonne) li.vente > .p,html.mq-verrou-serveur:not(.mq-abonne) table.ventes td.prix{color:inherit;-webkit-text-fill-color:inherit;text-shadow:none;user-select:auto;cursor:auto}html.mq-verrou-serveur:not(.mq-abonne) .liste-ventes li .prix-vente::before,html.mq-verrou-serveur:not(.mq-abonne) .derniere-vente:not(.vide) .prix-vente::before,html.mq-verrou-serveur:not(.mq-abonne) .ep-v a::before,html.mq-verrou-serveur:not(.mq-abonne) .ep-dep-in a::before,html.mq-verrou-serveur:not(.mq-abonne) #fr-cartes li.fv b::before,html.mq-verrou-serveur:not(.mq-abonne) #ja-cartes li.fv b::before,html.mq-verrou-serveur:not(.mq-abonne) #en-cartes li.fv b::before,html.mq-verrou-serveur:not(.mq-abonne) #ventes li:not(.groupe-v):not(.sans) b::before,html.mq-verrou-serveur:not(.mq-abonne) li.vente > .p::before,html.mq-verrou-serveur:not(.mq-abonne) table.ventes td.prix::before{content:none}";
    (document.head || document.documentElement).appendChild(st0);
  } catch (e) {}

  function apiBase() {
    var h = location.hostname;
    if (h === "localhost" || h === "127.0.0.1") return window.MIMIQUI_API_BASE || "http://127.0.0.1:8787/api";
    return "/api";
  }
  function charger(cles, opts) {
    var url = apiBase() + "/verrou?k=" + encodeURIComponent(cles.join(","));
    if (opts && opts.carte) url += "&carte=" + encodeURIComponent(opts.carte);
    return fetch(url, { credentials: "include" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (j) {
        etat.abonne = !!j.abonne;
        etat.prix = j.prix || PRIX;
        etat.cles = j.cles || {};
        etat.pret = true;
        return etat;
      })
      .catch(function () { etat.erreur = true; etat.pret = true; etat.cles = {}; return etat; });
  }
  function domPret() {
    return new Promise(function (res) {
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { res(); });
      else res();
    });
  }
  function injecter(cle, obj) {
    var info = etat.cles[cle];
    if (!obj || !info || !info.ajouts || obj.__mqv) return obj;
    try { Object.defineProperty(obj, "__mqv", { value: true, enumerable: false }); } catch (e) {}
    var groupes = {};
    info.ajouts.forEach(function (a) {
      var k = JSON.stringify(a[0]);
      (groupes[k] = groupes[k] || { chemin: a[0], items: [] }).items.push(a);
    });
    Object.keys(groupes).forEach(function (k) {
      var g = groupes[k], cible = obj;
      for (var i = 0; i < g.chemin.length && cible != null; i++) {
        var seg = g.chemin[i];
        if (cible[seg] == null) cible[seg] = typeof g.chemin[i + 1] === "number" ? [] : (i === g.chemin.length - 1 ? [] : {});
        cible = cible[seg];
      }
      if (!Array.isArray(cible)) return;
      g.items.sort(function (a, b) { return a[1] - b[1]; }).forEach(function (a) {
        var v = a[2];
        if (v && v.prix_masque) {
          if (etat.sansLibres) return; // page d'outil (Vendre) : pas de vente libre sans prix
          CHAMPS_PRIX.forEach(function (k) { if (k in v && v[k] == null) v[k] = SENTINELLE; });
          etat.prixMasques = true;
        }
        cible.push(v);
      });
    });
    return obj;
  }
  /* Prix des 3 ventes libres : le Worker n'envoie aucun montant (null). On met une valeur
     repère pour que le code d'origine de la page s'exécute, puis chaque montant affiché
     qui en dérive est remplacé par « Prix réservé aux abonnés ». */
  var CHAMPS_PRIX = ["p", "prix", "prix_eur", "price"];
  var SENTINELLE = 8888888.88;
  var RE_REPERE = /[-+]?8[\s\u00a0\u202f.,']?888[\s\u00a0\u202f.,']?88[89](?:[.,]\d{1,2})?(?:[\s\u00a0\u202f]*(?:€|\$\s?US|US\$|\$|USD|EUR|¥|JPY))?/g;
  var TEXTE_RESERVE = "Prix réservé aux abonnés";
  function remplacerTexte(node) {
    var t = node.nodeValue;
    if (!t || t.indexOf("888") < 0) return;
    RE_REPERE.lastIndex = 0;
    if (!RE_REPERE.test(t)) return;
    RE_REPERE.lastIndex = 0;
    node.nodeValue = t.replace(RE_REPERE, TEXTE_RESERVE);
    var el = node.parentNode;
    if (el && el.classList) {
      var svg = el.closest && el.closest("svg");
      if (svg) { masquerGraphique(svg); return; }
      el.classList.add("mq-prix-reserve");
    }
  }
  function masquerGraphique(svg) {
    var box = svg.parentNode;
    if (!box || box.getAttribute("data-mq-graph")) return;
    box.setAttribute("data-mq-graph", "1");
    svg.style.display = "none";
    var p = document.createElement("p");
    p.className = "mq-prix-reserve mq-graph-note";
    p.textContent = "🔒 Graphique des prix réservé aux abonnés.";
    box.insertBefore(p, svg);
  }
  function balayer(root) {
    if (!etat.prixMasques || !root) return;
    if (root.nodeType === 3) { remplacerTexte(root); return; }
    if (root.nodeType !== 1) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var n, liste = [];
    while ((n = w.nextNode())) liste.push(n);
    liste.forEach(remplacerTexte);
    var attrs = root.querySelectorAll ? root.querySelectorAll("[title],[aria-label]") : [];
    for (var i = 0; i < attrs.length; i++) {
      ["title", "aria-label"].forEach(function (a) {
        var v = attrs[i].getAttribute(a);
        if (v && v.indexOf("888") >= 0) { RE_REPERE.lastIndex = 0; attrs[i].setAttribute(a, v.replace(RE_REPERE, TEXTE_RESERVE)); }
      });
    }
  }
  function surveillerPrix() {
    if (!etat.prixMasques || etat.surveille) return;
    etat.surveille = true;
    balayer(document.body);
    if (window.MutationObserver) {
      new MutationObserver(function (ms) {
        ms.forEach(function (m) {
          if (m.type === "characterData") remplacerTexte(m.target);
          else for (var i = 0; i < m.addedNodes.length; i++) balayer(m.addedNodes[i]);
        });
      }).observe(document.body, { childList: true, subtree: true, characterData: true });
    }
  }
  function masquees() {
    var n = 0;
    Object.keys(etat.cles).forEach(function (k) { n += etat.cles[k].masquees || 0; });
    return n;
  }
  function boite(compact) {
    var n = masquees();
    var box = document.createElement("div");
    box.className = "av-cadenas mq-cadenas-ventes" + (compact ? " compact" : "");
    var p = document.createElement("p");
    p.className = "av-cadenas-titre";
    if (etat.erreur) p.textContent = "🔒 Ventes terminées réservées aux abonnés.";
    else p.textContent = "🔒 " + n.toLocaleString("fr-FR") + " vente" + (n > 1 ? "s" : "") + " terminée" + (n > 1 ? "s" : "") + " masquée" + (n > 1 ? "s" : "") + " — détail réservé aux abonnés.";
    var t = document.createElement("p");
    t.textContent = etat.erreur
      ? "Le service des ventes est momentanément indisponible. Réessayez plus tard."
      : "Les 3 ventes les plus récentes restent visibles, sans leur prix. Abonnement : " + (etat.prix || PRIX) + ".";
    var a = document.createElement("a");
    a.className = "av-cadenas-btn";
    a.href = "mon-compte.html";
    a.textContent = "Débloquer avec l’abonnement";
    box.appendChild(p); box.appendChild(t); box.appendChild(a);
    return box;
  }
  function doitAfficher() { return !etat.abonne && (etat.erreur || masquees() > 0); }
  function poser(cibles) {
    if (!doitAfficher()) return;
    (cibles || []).forEach(function (c) {
      var sel = c.avant || c.dans || c.apres;
      var el = document.querySelector(sel);
      if (!el) return;
      function assurer() {
        if (c.dans) {
          if (!el.childNodes.length || el.querySelector(".mq-cadenas-ventes")) return;
          (el.querySelector("div") && c.dans === "#vp-in" ? el.lastElementChild : el).appendChild(boite(true));
        } else if (c.avant) {
          var prev = el.previousElementSibling;
          if (!prev || !prev.classList.contains("mq-cadenas-ventes")) el.parentNode.insertBefore(boite(false), el);
        } else if (c.apres) {
          var next = el.nextElementSibling;
          if (!next || !next.classList.contains("mq-cadenas-ventes")) el.parentNode.insertBefore(boite(false), el.nextSibling);
        }
      }
      assurer();
      if (c.dans && window.MutationObserver) new MutationObserver(assurer).observe(el, { childList: true });
    });
  }
  function style() {
    if (document.getElementById("mq-cadenas-style")) return;
    var s = document.createElement("style");
    s.id = "mq-cadenas-style";
    s.textContent =
      ".mq-cadenas-ventes{box-sizing:border-box;max-width:1148px;width:calc(100% - 32px);margin:18px auto 28px;padding:18px 20px;border:2px solid #0b3d91;border-radius:16px;background:#fff;text-align:left}" +
      ".mq-cadenas-ventes.compact,#dernieres-ventes .mq-cadenas-ventes,#ventes .mq-cadenas-ventes{width:auto;max-width:none;margin-left:0;margin-right:0}" +
      ".mq-cadenas-ventes.compact{margin:14px 0;padding:12px 14px}" +
      ".mq-cadenas-ventes .av-cadenas-titre{margin:0 0 8px;font:700 1.05rem 'Source Sans 3',Arial,sans-serif;color:#0b3d91}" +
      ".mq-cadenas-ventes p{margin:0 0 10px;color:#5b6474}" +
      ".mq-cadenas-ventes .av-cadenas-btn{display:inline-block;background:#0b3d91;color:#fff;text-decoration:none;font:700 .95rem 'Source Sans 3',Arial,sans-serif;padding:10px 18px;border-radius:999px}" +
      ".mq-cadenas-ventes .av-cadenas-btn:hover{background:#082d6b}" +
      "html .mq-prix-reserve.mq-prix-reserve{color:#0b3d91!important;-webkit-text-fill-color:#0b3d91!important;font-size:.9rem!important;font-weight:700;white-space:normal;text-shadow:none!important}" +
      "html .liste-ventes li .mq-prix-reserve.mq-prix-reserve{font-size:.95rem!important}" +
      "html.mq-verrou-serveur .mq-prix-reserve.mq-prix-reserve::before{content:\"\\1F512\\00a0\"!important;color:#0b3d91;-webkit-text-fill-color:#0b3d91}" +
      "html.mq-verrou-serveur .mq-graph-note.mq-graph-note::before{content:none!important}" +
      ".mq-graph-note{margin:8px 0;padding:10px 12px;border:1px dashed #0b3d91;border-radius:10px}";
    (document.head || document.documentElement).appendChild(s);
  }
  /** Charge les clés, attend le DOM, puis lance fn (le code d'origine de la page). */
  function attendre(cles, fn, opts) {
    opts = opts || {};
    etat.sansLibres = opts.libres === false;
    return Promise.all([charger(cles, opts), domPret()]).then(function () {
      try { fn(); } finally { style(); surveillerPrix(); poser(opts.cibles); }
    });
  }
  window.MQV = { attendre: attendre, charger: charger, injecter: injecter, poser: function (c) { style(); poser(c); }, etat: etat };
})();
