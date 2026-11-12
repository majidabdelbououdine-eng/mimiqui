/* holo.js — effets holographiques (Le Coin de Mimiqui)
   Chargé depuis site-commun.js. Ne modifie aucune donnée. */
(function(){
  "use strict";
  if (window.__mimiquiHolo) return;
  window.__mimiquiHolo = true;

  var REDUIT = false;
  try {
    REDUIT = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {}

  var RE_RARE = /illustration\s+sp[eé]ciale\s+rare|illustration\s+rare|\bSIR\b|hyper\s*rare|secret\s*rare|rare\s*secr[eè]te|ultra\s*rare|rare\s*ultra|rare\s*rainbow|rainbow\s*rare|rare\s*gold|gold\s*rare|rare\s*or|alternative(?:\s+art)?|full\s*art/i;

  function estImageCarte(img){
    if (!img || img.tagName !== "IMG") return false;
    if (img.dataset.holo === "1") return false;
    if (img.classList.contains("logo-img")) return false;
    if (img.closest("header, footer, .h5-holo, #mini-teaser, #h5-proj, .holo-fx, .holo-titre")) return false;
    var src = img.getAttribute("src") || img.currentSrc || "";
    var alt = img.getAttribute("alt") || "";
    if (/pokecardex-scans|assets\.tcgdex|tcgplayer/i.test(src)) return true;
    if (/^Carte\b/i.test(alt)) return true;
    if (img.closest("article.card, button.frame, .t10-img, div.carte, a.tuile, .pic")) return true;
    if (img.naturalWidth >= 80 && img.naturalHeight >= 80) {
      var r = img.naturalHeight / img.naturalWidth;
      if (r > 1.2 && r < 1.7 && /(^|\/)img\/(?!logo)/i.test(src)) return true;
    }
    return false;
  }

  function texteRarete(img){
    var parts = [];
    var serie = img.closest("section.serie");
    if (serie) {
      var h2 = serie.querySelector("h2");
      if (h2) {
        var c = h2.cloneNode(true);
        var petits = c.querySelectorAll("small");
        for (var i = 0; i < petits.length; i++) petits[i].remove();
        parts.push(c.textContent || "");
      }
    }
    var box = img.closest("article.card, .t10, div.carte, a.tuile, li");
    if (box) {
      var lab = box.querySelector(".t10-rar, .rarete, .rarity, .rar, .vp-n");
      if (lab) parts.push(lab.textContent || "");
      parts.push(box.getAttribute("data-r") || "");
      parts.push(box.getAttribute("data-rarete") || "");
    }
    return parts.join(" ");
  }

  function estRare(img){
    return RE_RARE.test(texteRarete(img));
  }

  function activer(img){
    if (!img || img.dataset.holo === "1") return;
    if (img.offsetWidth && img.offsetWidth < 44) return;
    img.dataset.holo = "1";
    var host = img.closest("button.frame, .t10-img, a.tuile, div.carte");
    if (!host) {
      var p = img.parentElement;
      if (p && p !== document.body && p.children.length === 1 && p.tagName !== "PICTURE") host = p;
    }
    if (!host) {
      host = document.createElement("span");
      host.className = "holo-fx";
      if (img.parentNode) {
        img.parentNode.insertBefore(host, img);
        host.appendChild(img);
      }
    }
    host.classList.add("holo-fx");
    if (estRare(img)) {
      host.classList.add("holo-rare");
      var carte = img.closest("article.card, .t10, div.carte");
      if (carte) carte.classList.add("holo-rare-wrap");
    }
  }

  function parcourir(racine){
    var scope = racine && racine.querySelectorAll ? racine : document;
    var imgs = scope.querySelectorAll ? scope.querySelectorAll("img") : [];
    if (racine && racine.tagName === "IMG") {
      if (estImageCarte(racine)) activer(racine);
      return;
    }
    for (var i = 0; i < imgs.length; i++) {
      if (estImageCarte(imgs[i])) activer(imgs[i]);
    }
  }

  function iriserLogo(){
    var logos = document.querySelectorAll("a.logo");
    for (var i = 0; i < logos.length; i++) {
      var a = logos[i];
      if (a.querySelector(".holo-titre")) continue;
      var wrap = document.createElement("span");
      wrap.className = "holo-titre";
      var nodes = [];
      for (var n = a.firstChild; n; n = n.nextSibling) nodes.push(n);
      var moved = false;
      for (var j = 0; j < nodes.length; j++) {
        var node = nodes[j];
        if (node.nodeType === 3 && /mimiqui/i.test(node.textContent || "")) {
          if (!wrap.parentNode) a.insertBefore(wrap, node);
          wrap.appendChild(node);
          moved = true;
        } else if (node.nodeType === 1 && node.tagName === "SPAN" && !node.classList.contains("logo-img") && (wrap.parentNode || /mimiqui/i.test((a.textContent || "")))) {
          if (!wrap.parentNode) a.insertBefore(wrap, node);
          wrap.appendChild(node);
          moved = true;
        }
      }
      if (!moved && wrap.parentNode) wrap.parentNode.removeChild(wrap);
    }
  }

  function heroAccueil(){
    var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (page === "accueil.html") page = "index.html";
    var estAccueil = (document.body && document.body.classList.contains("page-accueil")) || page === "index.html" || page === "";
    if (!estAccueil) return;
    if (document.body) document.body.classList.add("page-accueil");
    var hero = document.querySelector(".wrap.hero, .hero");
    if (!hero) return;
    hero.classList.add("holo-hero");
    if (hero.querySelector(".holo-wordmark")) return;
    var p = document.createElement("p");
    p.className = "holo-wordmark";
    p.textContent = "le coin de mimiqui";
    var inner = hero.querySelector(":scope > div") || hero;
    inner.insertBefore(p, inner.firstChild);
  }

  function badgesTop(){
    var elts = document.querySelectorAll(".rang");
    for (var i = 0; i < elts.length; i++) {
      var el = elts[i];
      if (el.classList.contains("holo-badge")) continue;
      var t = (el.textContent || "").trim();
      var m = t.match(/n[°ºo]?\s*(\d+)/i) || t.match(/^(\d+)$/);
      if (!m) continue;
      var n = parseInt(m[1], 10);
      if (n >= 1 && n <= 3) {
        el.classList.add("holo-badge", "holo-badge-" + n);
      }
    }
  }

  var MAX = 14;
  function pointerSur(e){
    if (REDUIT) return;
    var t = e.target && e.target.closest ? e.target.closest(".holo-fx") : null;
    if (!t) return;
    var r = t.getBoundingClientRect();
    if (!r.width || !r.height) return;
    var x = (e.clientX - r.left) / r.width;
    var y = (e.clientY - r.top) / r.height;
    x = Math.max(0, Math.min(1, x));
    y = Math.max(0, Math.min(1, y));
    var max = (window.innerWidth && window.innerWidth < 800) ? 8 : MAX;
    t.style.setProperty("--mx", (x * 100).toFixed(2) + "%");
    t.style.setProperty("--my", (y * 100).toFixed(2) + "%");
    t.style.setProperty("--ry", ((x - 0.5) * 2 * max).toFixed(2) + "deg");
    t.style.setProperty("--rx", ((0.5 - y) * 2 * max).toFixed(2) + "deg");
    t.classList.add("holo-on");
  }

  function pointerHors(e){
    var t = e.target && e.target.closest ? e.target.closest(".holo-fx") : null;
    if (!t) return;
    if (e.relatedTarget && t.contains(e.relatedTarget)) return;
    t.style.setProperty("--rx", "0deg");
    t.style.setProperty("--ry", "0deg");
    t.classList.remove("holo-on");
  }

  var prevu = 0;
  function programmer(){
    if (prevu) return;
    prevu = setTimeout(function(){
      prevu = 0;
      parcourir(document);
      badgesTop();
    }, 80);
  }

  function demarrer(){
    iriserLogo();
    heroAccueil();
    parcourir(document);
    badgesTop();

    document.addEventListener("pointermove", pointerSur, {passive: true});
    document.addEventListener("pointerdown", pointerSur, {passive: true});
    document.addEventListener("pointerout", pointerHors, true);

    if (window.MutationObserver && document.body) {
      var obs = new MutationObserver(function(muts){
        for (var i = 0; i < muts.length; i++) {
          if (muts[i].addedNodes && muts[i].addedNodes.length) { programmer(); break; }
        }
      });
      obs.observe(document.body, {childList: true, subtree: true});
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();
})();
