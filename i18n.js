/* i18n.js — interface FR / EN / JA for Le Coin de Mimiqui
   Dictionaries: i18n-en.js / i18n-ja.js (window.I18N_DICT_EN / I18N_DICT_JA)
   Language: localStorage mimiqui-lang, or ?lang=en|ja|fr (or ?uilang= on carte-pikachu.html)
   Default: French. Does not touch hrefs (eBay affiliate links stay intact). */
(function () {
  "use strict";
  if (window.__mimiquiI18n) return;
  window.__mimiquiI18n = 1;

  var KEY = "mimiqui-lang";
  var PAGE = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (PAGE === "accueil.html") PAGE = "index.html";

  function valid(l) { return l === "fr" || l === "en" || l === "ja"; }

  function readLang() {
    try {
      var q = new URLSearchParams(location.search);
      var l = q.get("uilang") || "";
      if (!l && PAGE !== "carte-pikachu.html") l = q.get("lang") || "";
      if (valid(l)) {
        try { localStorage.setItem(KEY, l); } catch (e) {}
        return l;
      }
      var s = localStorage.getItem(KEY);
      if (valid(s)) return s;
    } catch (e) {}
    return "fr";
  }

  var lang = readLang();
  document.documentElement.setAttribute("lang", lang === "ja" ? "ja" : lang === "en" ? "en" : "fr");

  /* Dedicated language versions of a page (selector redirects when they exist). */
  var GROUPS = [
    ["regne-delta.html", null, "regne-delta-ja.html"],
    ["nuit-noire-ventes.html", "nuit-noire-en.html", "nuit-noire-ja.html"],
    ["nuit-noire.html", "nuit-noire-en.html", "nuit-noire-ja.html"],
    ["chaos-ascendant-ventes.html", "chaos-ascendant-en.html", "chaos-ascendant-ja.html"],
    ["chaos-ascendant.html", "chaos-ascendant-en.html", "chaos-ascendant-ja.html"],
    ["equilibre-parfait-ventes.html", "equilibre-parfait-en.html", "equilibre-parfait-ja.html"],
    ["equilibre-parfait.html", "equilibre-parfait-en.html", "equilibre-parfait-ja.html"],
    ["trentieme-anniversaire-ventes.html", "trentieme-anniversaire-en.html", null],
    ["trentieme-anniversaire.html", "trentieme-anniversaire-en.html", null],
    ["heros-transcendants.html", "heros-transcendants-en.html", null],
    ["heros-fantasmagoriques.html", "flammes-fantasmagoriques-en.html", "flammes-fantasmagoriques-ja.html"],
    ["flammes-fantasmagoriques.html", "flammes-fantasmagoriques-en.html", "flammes-fantasmagoriques-ja.html"],
    ["mega-evolution-cartes.html", "mega-evolution-en.html", null],
    ["mega-evolution.html", "mega-evolution-en.html", null],
    ["destinees-de-paldea.html", "destinees-de-paldea-en.html", "destinees-de-paldea-ja.html"],
    ["ecarlate-violet-151.html", "ecarlate-violet-151-en.html", "ecarlate-violet-151-ja.html"],
    ["flammes-obsidiennes.html", "flammes-obsidiennes-en.html", "flammes-obsidiennes-ja.html"],
    ["evolutions-paldea.html", "evolutions-paldea-en.html", "evolutions-paldea-ja.html"],
    ["ecarlate-violet.html", "ecarlate-violet-en.html", "ecarlate-violet-ja.html"],
    ["cartes.html", "cartes-anglaises.html", "cartes-japonaises.html"]
  ];
  var PAGE_TO_GROUP = {};
  GROUPS.forEach(function (g) {
    [g[0], g[1], g[2]].forEach(function (p) {
      if (p) PAGE_TO_GROUP[p] = g;
    });
  });

  function pageFor(target) {
    var g = PAGE_TO_GROUP[PAGE];
    if (!g) return PAGE;
    var idx = target === "en" ? 1 : target === "ja" ? 2 : 0;
    return g[idx] || g[0] || PAGE;
  }

  function go(next) {
    if (!valid(next)) return;
    try { localStorage.setItem(KEY, next); } catch (e) {}
    var dest = pageFor(next);
    var url;
    if (dest !== PAGE) {
      url = new URL(dest, location.href);
      /* Keep useful query params (q, k, serie…) but set/replace lang. */
      var cur = new URLSearchParams(location.search);
      cur.forEach(function (v, k) {
        if (k === "lang" || k === "uilang") return;
        url.searchParams.set(k, v);
      });
    } else {
      url = new URL(location.href);
    }
    if (dest === "carte-pikachu.html" || PAGE === "carte-pikachu.html") {
      if (next === "fr") url.searchParams.delete("uilang");
      else url.searchParams.set("uilang", next);
    } else {
      if (next === "fr") url.searchParams.delete("lang");
      else url.searchParams.set("lang", next);
      url.searchParams.delete("uilang");
    }
    url.hash = location.hash;
    location.href = url.toString();
  }

  /* ---------- CSS ---------- */
  function injectCss() {
    if (document.getElementById("i18n-css")) return;
    var s = document.createElement("style");
    s.id = "i18n-css";
    s.textContent = [
      'html[lang="ja"] body,html[lang="ja"] button,html[lang="ja"] input,html[lang="ja"] select,html[lang="ja"] textarea{font-family:"Source Sans 3","Noto Sans JP","Hiragino Kaku Gothic ProN","Hiragino Sans","Yu Gothic",Meiryo,sans-serif}',
      '.lang-switch{display:inline-flex;align-items:center;gap:2px;margin:0 .35rem 0 auto;padding:2px;border:1px solid rgba(0,200,255,.55);border-radius:999px;background:rgba(0,0,0,.18);flex:none;z-index:45}',
      '.lang-switch button{appearance:none;-webkit-appearance:none;border:0;background:transparent;color:inherit;cursor:pointer;font:700 .72rem/1 "Source Sans 3",Arial,sans-serif;letter-spacing:.06em;padding:6px 8px;border-radius:999px;min-width:2.1rem}',
      '.lang-switch button[aria-pressed="true"]{background:rgba(0,200,255,.28);box-shadow:0 0 0 1px rgba(0,220,255,.7)}',
      '.lang-switch button:hover,.lang-switch button:focus-visible{background:rgba(0,200,255,.18);outline:none}',
      'html body nav ul.menu-principal>li.lang-switch-item,html body header nav ul.menu-principal>li.lang-switch-item{display:none!important}',
      '@media (max-width:799px){',
      '  .lang-switch{margin-left:auto;margin-right:.25rem}',
      '  html body nav .hamburger{margin-left:0}',
      '  html body nav.menu-ouvert ul.menu-principal>li.lang-switch-item,html body header nav.menu-ouvert ul.menu-principal>li.lang-switch-item{display:flex!important;width:100%;justify-content:center;padding:.55rem .4rem;border-top:0!important;order:-1}',
      '  li.lang-switch-item .lang-switch-menu{margin:0;background:rgba(11,61,145,.08);border-color:rgba(11,61,145,.35)}',
      '  nav.menu-ouvert li.lang-switch-item .lang-switch-menu button{color:#111}',
      '  nav.menu-ouvert li.lang-switch-item .lang-switch-menu button[aria-pressed="true"]{background:#0b3d91;color:#fff}',
      '}'
    ].join("");
    (document.head || document.documentElement).appendChild(s);
  }

  function buildSwitch(id, extraClass) {
    var box = document.createElement("div");
    if (id) box.id = id;
    box.className = "lang-switch" + (extraClass ? " " + extraClass : "");
    box.setAttribute("role", "navigation");
    box.setAttribute("aria-label", lang === "ja" ? "言語" : lang === "en" ? "Language" : "Langue");
    [
      { l: "fr", lab: "FR", title: "Français" },
      { l: "en", lab: "EN", title: "English" },
      { l: "ja", lab: "JA", title: "日本語" }
    ].forEach(function (it) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("data-lang", it.l);
      b.setAttribute("aria-pressed", it.l === lang ? "true" : "false");
      b.setAttribute("lang", it.l === "ja" ? "ja" : it.l);
      b.title = it.title;
      b.textContent = it.lab;
      b.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if (it.l === lang && pageFor(it.l) === PAGE) return;
        go(it.l);
      });
      box.appendChild(b);
    });
    return box;
  }

  function injectSwitcher() {
    injectCss();
    var nav = document.querySelector("nav.sitenav, header nav.top, header.site nav, nav.nav-commune");
    if (nav && !document.getElementById("lang-switch")) {
      var box = buildSwitch("lang-switch");
      var ham = nav.querySelector(".hamburger");
      var rech = nav.querySelector(".nav-recherche");
      if (ham && ham.parentNode) ham.parentNode.insertBefore(box, ham);
      else if (rech && rech.parentNode) rech.parentNode.insertBefore(box, rech);
      else {
        var menu = nav.querySelector("ul.menu-principal");
        if (menu) nav.insertBefore(box, menu);
        else nav.appendChild(box);
      }
    }
    var ul = document.querySelector("ul.menu-principal");
    if (ul && !ul.querySelector(".lang-switch-menu")) {
      var li = document.createElement("li");
      li.className = "lang-switch-item";
      li.appendChild(buildSwitch(null, "lang-switch-menu"));
      ul.insertBefore(li, ul.firstChild);
    }
  }

  /* ---------- Translation ---------- */
  function norm(s) {
    return String(s || "")
      .replace(/\u00a0|\u202f|&nbsp;/g, " ")
      .replace(/[\u2019\u2018\u02BC]/g, "'")
      .replace(/[\u2013\u2014]/g, "-")
      .replace(/\s+/g, " ")
      .trim();
  }

  function dictFor() {
    if (lang === "en") return window.I18N_DICT_EN || {};
    if (lang === "ja") return window.I18N_DICT_JA || {};
    return {};
  }

  function buildIndex(dict) {
    var map = Object.create(null);
    Object.keys(dict).forEach(function (k) { map[norm(k)] = dict[k]; });
    return map;
  }

  /* Dynamic / patterned strings (numbers, dates kept). */
  function pattern(s) {
    var n = s;
    /* "245 cartes" / "1 carte" */
    var m = /^(\d+)\s+cartes?$/.exec(n);
    if (m) {
      if (lang === "en") return m[1] === "1" ? "1 card" : m[1] + " cards";
      return m[1] + "枚";
    }
    m = /^(\d+)\s+ventes?$/.exec(n);
    if (m) {
      if (lang === "en") return m[1] === "1" ? "1 sale" : m[1] + " sales";
      return m[1] + "件";
    }
    m = /^(\d+)\s+cotes? Cardmarket$/.exec(n);
    if (m) {
      if (lang === "en") return m[1] + " Cardmarket price" + (m[1] === "1" ? "" : "s");
      return "カードマーケット相場 " + m[1] + "件";
    }
    m = /^(\d+)\s+cartes? avec ventes$/.exec(n);
    if (m) {
      if (lang === "en") return m[1] + (m[1] === "1" ? " card with sales" : " cards with sales");
      return "販売あり " + m[1] + "枚";
    }
    m = /^(\d+)\s+ventes? eBay\.fr$/.exec(n);
    if (m) {
      if (lang === "en") return m[1] + " eBay.fr sale" + (m[1] === "1" ? "" : "s");
      return "eBay.frの販売 " + m[1] + "件";
    }
    m = /^(Française|Japonaise|Anglaise) · (\d+) cartes?$/.exec(n);
    if (m) {
      var lab = { Française: ["French", "フランス語版"], Japonaise: ["Japanese", "日本語版"], Anglaise: ["English", "英語版"] }[m[1]];
      if (lang === "en") return lab[0] + " · " + m[2] + " card" + (m[2] === "1" ? "" : "s");
      return lab[1] + " · " + m[2] + "枚";
    }
    m = /^(Française|Japonaise|Anglaise) \((\d+)\)$/.exec(n);
    if (m) {
      var lab2 = { Française: ["French", "フランス語版"], Japonaise: ["Japanese", "日本語版"], Anglaise: ["English", "英語版"] }[m[1]];
      return (lang === "en" ? lab2[0] : lab2[1]) + " (" + m[2] + ")";
    }
    /* Set name + count: "Destinées de Paldea (245)" — name translated via dict */
    m = /^(.+?) \((\d+)\)$/.exec(n);
    if (m) {
      var left = translateOnce(m[1]);
      if (left !== m[1]) return left + " (" + m[2] + ")";
    }
    m = /^Cote Cardmarket(?:\s+)(.+)$/.exec(n);
    if (m) {
      if (lang === "en") return "Cardmarket price " + m[1];
      return "カードマーケット相場 " + m[1];
    }
    m = /^N°\s+(.+)$/.exec(n);
    if (m && /vente|Cote|·/.test(m[1])) {
      /* keep structure, translate trailing labels later as separate nodes */
    }
    m = /^(\d+)\s+ventes? non gradées?(.*)$/.exec(n);
    if (m) {
      var rest = m[2] || "";
      if (lang === "en") return m[1] + " raw sale" + (m[1] === "1" ? "" : "s") + rest;
      return "未鑑定 " + m[1] + "件" + rest;
    }
    m = /^Une seule vente \((.+)\), prix peu fiable\.$/.exec(n);
    if (m) {
      if (lang === "en") return "Only one sale (" + m[1] + "); the price is not very reliable.";
      return "販売は1件のみ（" + m[1] + "）。価格の信頼性は低めです。";
    }
    m = /^Bon achat : sous (.+)$/.exec(n);
    if (m) {
      if (lang === "en") return "Good buy: under " + m[1];
      return "お買い得： " + m[1] + " 未満";
    }
    m = /^Prix correct : entre (.+)$/.exec(n);
    if (m) {
      if (lang === "en") return "Fair price: between " + m[1];
      return "妥当な価格： " + m[1] + " の間";
    }
    m = /^Trop cher : au-dessus de (.+)$/.exec(n);
    if (m) {
      if (lang === "en") return "Too expensive: above " + m[1];
      return "高め： " + m[1] + " 超";
    }
    m = /^Prix d'achat conseillé :\s*(.*)$/.exec(n);
    if (m) {
      if (lang === "en") return "Suggested buying price: " + m[1];
      return "購入の目安： " + m[1];
    }
    m = /^Prix de revente conseillé :\s*(.*)$/.exec(n);
    if (m) {
      if (lang === "en") return "Suggested resale price: " + m[1];
      return "売却の目安： " + m[1];
    }
    m = /^Cote (.+) \(tendance\) :\s*(.*)$/.exec(n);
    if (m) {
      if (lang === "en") return m[1] + " price (trend): " + m[2];
      return m[1] + "相場（トレンド）： " + m[2];
    }
    m = /^Ventes eBay de la semaine \((\d+)\)$/.exec(n);
    if (m) {
      if (lang === "en") return "eBay sales this week (" + m[1] + ")";
      return "今週のeBay販売（" + m[1] + "）";
    }
    m = /^Ventes eBay du (.+) \((\d+)\)$/.exec(n);
    if (m) {
      if (lang === "en") return "eBay sales from " + m[1] + " (" + m[2] + ")";
      return m[1] + " のeBay販売（" + m[2] + "）";
    }
    m = /^Cotes Cardmarket et ventes eBay du (.+) au (.+)$/.exec(n);
    if (m) {
      if (lang === "en") return "Cardmarket prices and eBay sales from " + m[1] + " to " + m[2];
      return "カードマーケット相場とeBay販売：" + m[1] + "〜" + m[2];
    }
    m = /^Prix vendus hors frais de port, relevés sur eBay\.fr \((.+)\)$/.exec(n);
    if (m) {
      if (lang === "en") return "Sold prices excluding shipping, recorded on eBay.fr (" + m[1] + ")";
      return "送料除く落札価格。eBay.frで確認（" + m[1] + "）";
    }
    m = /^(cote − 20\s*%)$/i.exec(n);
    if (m) return lang === "en" ? "(price − 20%)" : "（相場 − 20%）";
    m = /^(cote \+ 20\s*%)$/i.exec(n);
    if (m) return lang === "en" ? "(price + 20%)" : "（相場 + 20%）";
    /* Set-page footer with variable dates */
    m = /^Photos\s*:\s*Pokécardex\.\s*Cote Cardmarket\s*:\s*tendance \(EUR\), source Cardmarket via l'API TCGdex, mise à jour le ([^;]+);\s*jamais inventée\.\s*Ventes eBay\.fr du ([^,]+), relevées sur lastsold\.com le ([^(]+)\(prix hors frais de port\)\.\s*Liens eBay affiliés\.\s*Pokémon est une marque de Nintendo, Game Freak et The Pokémon Company\s*;\s*site de fan non officiel\.$/.exec(n);
    if (m) {
      if (lang === "en") return "Photos: Pokécardex. Cardmarket price: trend (EUR), source Cardmarket via the TCGdex API, updated " + m[1].trim() + "; never made up. eBay.fr sales from " + m[2].trim() + ", recorded on lastsold.com on " + m[3].trim() + " (prices exclude shipping). Affiliate eBay links. Pokémon is a trademark of Nintendo, Game Freak and The Pokémon Company; unofficial fan site.";
      return "写真：Pokécardex。カードマーケット相場：トレンド（EUR）。出典はTCGdex API経由のCardmarket、更新日 " + m[1].trim() + "。価格の創作はありません。eBay.frの販売は " + m[2].trim() + "、lastsold.comで " + m[3].trim() + " に確認（送料別）。eBayアフィリエイトリンク。ポケモンは任天堂、ゲームフリーク、株式会社ポケモンの商標です。非公式ファンサイト。";
    }
    m = /^Toutes les séries · (\d+) cartes$/.exec(n);
    if (m) {
      if (lang === "en") return "All sets · " + m[1] + " cards";
      return "すべてのシリーズ · " + m[1] + "枚";
    }
    m = /^Cartes Mimiqui \(FR, JP, EN\) · (\d+) cartes$/.exec(n);
    if (m) {
      if (lang === "en") return "Mimikyu cards (FR, JP, EN) · " + m[1] + " cards";
      return "ミミッキュカード（FR、JP、EN） · " + m[1] + "枚";
    }
    m = /^Voir la fiche de (.+)$/.exec(n);
    if (m) {
      if (lang === "en") return "See the page for " + m[1];
      return m[1] + " の詳細を見る";
    }
    m = /^Carte (.+)$/.exec(n);
    /* only if it starts a short alt like "Carte Pomdepik 001/091" — keep the name */
    if (m && /^Carte /.test(s) && s.length < 80) {
      if (lang === "en") return "Card " + m[1];
      return "カード " + m[1];
    }
    m = /^Sous-menu (.+)$/.exec(n);
    if (m) {
      var t = translateOnce(m[1]);
      if (lang === "en") return t + " submenu";
      return t + "のサブメニュー";
    }
    m = /^(\d+) ventes relevées dans le registre, dont (\d+) ces 7 derniers jours$/.exec(n);
    if (m) {
      if (lang === "en") return m[1] + " sales recorded in the register, including " + m[2] + " in the last 7 days";
      return "登録上の販売 " + m[1] + "件（この7日間：" + m[2] + "件）";
    }
    return null;
  }

  var INDEX = null;
  function translateOnce(s) {
    if (s == null) return s;
    var raw = String(s);
    if (!raw) return raw;
    /* Don't touch pure numbers, prices, isolated symbols */
    if (/^[\d\s.,/€$％%\-–—·•x×+():]+$/i.test(raw.trim())) return raw;
    var n = norm(raw);
    if (!n) return raw;
    if (INDEX && INDEX[n] != null) return INDEX[n];
    var stripped = n.replace(/^[·•.\-–—]+\s*/, "");
    if (stripped !== n && INDEX && INDEX[stripped] != null) {
      var pre = raw.match(/^[·•.\-–—\s]+/);
      return (pre ? pre[0] : "") + INDEX[stripped];
    }
    var p = pattern(n);
    if (p != null) return p;
    return raw;
  }

  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, CODE: 1, SVG: 1, PATH: 1, IFRAME: 1 };

  function translateAttr(el, attr) {
    var v = el.getAttribute(attr);
    if (!v) return;
    var t = translateOnce(v);
    if (t !== v) el.setAttribute(attr, t);
  }

  function walk(root) {
    if (!root) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (node.nodeType === 3) {
          var p = node.parentNode;
          if (!p || SKIP[p.nodeName]) return NodeFilter.FILTER_REJECT;
          if (p.isContentEditable) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
        if (SKIP[node.nodeName]) return NodeFilter.FILTER_REJECT;
        if (node.getAttribute && node.getAttribute("data-no-i18n") != null) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n, list = [];
    while ((n = w.nextNode())) list.push(n);
    list.forEach(function (node) {
      if (node.nodeType === 3) {
        var cur = node.nodeValue;
        /* Preserve leading/trailing whitespace */
        var lead = cur.match(/^\s*/)[0];
        var trail = cur.match(/\s*$/)[0];
        var mid = cur.slice(lead.length, cur.length - trail.length);
        if (!mid) return;
        var t = translateOnce(mid);
        if (t !== mid) node.nodeValue = lead + t + trail;
      } else if (node.nodeType === 1) {
        translateAttr(node, "placeholder");
        translateAttr(node, "aria-label");
        translateAttr(node, "title");
        translateAttr(node, "alt");
      }
    });
  }

  function translateTitle() {
    var t = translateOnce(document.title);
    if (t !== document.title) {
      document.title = t;
      return;
    }
    /* Split on common separators and translate the first clause */
    var parts = document.title.split(/(\s+[–—·|-]\s+)/);
    if (parts.length >= 3) {
      var head = translateOnce(parts[0]);
      if (head !== parts[0]) document.title = head + parts.slice(1).join("");
    }
  }

  var scheduled = false;
  function applyAll() {
    scheduled = false;
    if (lang === "fr") {
      injectSwitcher();
      reveal();
      return;
    }
    if (!INDEX) INDEX = buildIndex(dictFor());
    translateTitle();
    walk(document.body);
    injectSwitcher();
    reveal();
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(applyAll);
  }

  function reveal() {
    document.documentElement.classList.add("i18n-ready");
    var hide = document.getElementById("i18n-hide");
    if (hide && hide.parentNode) hide.parentNode.removeChild(hide);
    document.documentElement.style.removeProperty("opacity");
  }

  /* Observe late JS renders (set pages, search, cookie banner, hamburger labels). */
  function observe() {
    if (!document.body) return;
    var t = 0;
    var obs = new MutationObserver(function () {
      if (t) return;
      t = 1;
      setTimeout(function () { t = 0; schedule(); }, 40);
    });
    obs.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "aria-label", "title", "alt"]
    });
  }

  window.MIMIQUI_I18N = {
    lang: lang,
    t: translateOnce,
    setLang: go
  };

  function start() {
    applyAll();
    observe();
    /* Menu is rebuilt once by site-commun.js; catch a late pass. */
    setTimeout(applyAll, 120);
    setTimeout(applyAll, 600);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
