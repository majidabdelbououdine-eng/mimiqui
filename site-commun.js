var __acc=/(\/|\/index\.html?)$/i.test(location.pathname);
/* site-commun.js : menu, hamburger, fil d'Ariane, pied de page (Le Coin de Mimiqui) */

/* echelle site ~90% cumulé v2 */
(function(){if(document.getElementById('echelle-site'))return;var s=document.createElement('style');s.id='echelle-site';s.textContent='html{font-size:106%!important}';(document.head||document.documentElement).appendChild(s);})();

/* effets holographiques (holo.css / holo.js) */
(function(){if(document.getElementById('holo-css'))return;var v='20261112u';var l=document.createElement('link');l.id='holo-css';l.rel='stylesheet';l.href='holo.css?v='+v;(document.head||document.documentElement).appendChild(l);var s=document.createElement('script');s.id='holo-js';s.src='holo.js?v='+v;s.defer=true;(document.head||document.documentElement).appendChild(s);})();
/* i18n FR / EN / JA */
(function(){if(document.getElementById('i18n-js'))return;var v='20261112u';var page=(location.pathname.split('/').pop()||'index.html').toLowerCase();var lang='fr';try{var q=new URLSearchParams(location.search);var l=q.get('uilang')||((page!=='carte-pikachu.html')?q.get('lang'):'')||localStorage.getItem('mimiqui-lang')||'fr';if(/^(fr|en|ja)$/.test(l))lang=l;}catch(e){}document.documentElement.setAttribute('lang',lang==='ja'?'ja':lang==='en'?'en':'fr');if(lang!=='fr'){var h=document.createElement('style');h.id='i18n-hide';h.textContent='html:not(.i18n-ready) body{opacity:0}';(document.head||document.documentElement).appendChild(h);setTimeout(function(){var x=document.getElementById('i18n-hide');if(x&&x.parentNode)x.parentNode.removeChild(x);document.documentElement.classList.add('i18n-ready');},1500);}function add(src,id){var s=document.createElement('script');s.id=id;s.src=src;s.async=false;(document.head||document.documentElement).appendChild(s);}if(lang==='en')add('i18n-en.js?v='+v,'i18n-en');if(lang==='ja')add('i18n-ja.js?v='+v,'i18n-ja');add('i18n.js?v='+v,'i18n-js');})();

(function(){
  "use strict";
  var page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(page==='accueil.html')page='index.html';

  var SITE_CACHE="20261112y";
  var EBAY_ENCOURS="https://www.ebay.fr/sch/i.html?_nkw=carte%20Pok%C3%A9mon&mkcid=1&mkrid=709-53476-19255-0&siteid=71&campid=5339225196&customid=encours-menu&toolid=10001&mkevt=1";
  var SERIES_MEGA=[
    {t:"Règne Delta",n:141,s:[["Française","regne-delta.html",141],["Japonaise","regne-delta-ja.html",113]]},
    {t:"Nuit Noire",n:120,s:[["Française","nuit-noire-ventes.html",120],["Japonaise","nuit-noire-ja.html",118],["Anglaise","nuit-noire-en.html",120]]},
    {t:"Chaos Ascendant",n:122,s:[["Française","chaos-ascendant-ventes.html",122],["Japonaise","chaos-ascendant-ja.html",120],["Anglaise","chaos-ascendant-en.html",122]]},
    {t:"Équilibre Parfait",n:124,s:[["Française","equilibre-parfait-ventes.html",124],["Japonaise","equilibre-parfait-ja.html",117],["Anglaise","equilibre-parfait-en.html",124]]},
    {t:"30ᵉ Anniversaire",n:191,s:[["Française","trentieme-anniversaire-ventes.html",191],["Anglaise","trentieme-anniversaire-en.html",158]]},
    {t:"Héros Transcendants",n:295,s:[["Française","heros-transcendants.html",295],["Anglaise","heros-transcendants-en.html",295]]},
    {t:"Flammes Fantasmagoriques",n:130,s:[["Française","heros-fantasmagoriques.html",130],["Japonaise","flammes-fantasmagoriques-ja.html",116],["Anglaise","flammes-fantasmagoriques-en.html",130]]},
    {t:"Méga-Évolution",n:88,s:[["Française","mega-evolution-cartes.html",88],["Anglaise","mega-evolution-en.html",89]]}
  ];
  var SERIES_EV=[
    {t:"Flamme Blanche",n:173,s:[["Française","flamme-blanche.html",173],["Japonaise","flamme-blanche-ja.html",174],["Anglaise","flamme-blanche-en.html",173]]},
    {t:"Foudre Noire",n:172,s:[["Française","foudre-noire.html",172],["Japonaise","foudre-noire-ja.html",174],["Anglaise","foudre-noire-en.html",172]]},
    {t:"Rivalités Destinées",n:244,s:[["Française","rivalites-destinees.html",244],["Japonaise","rivalites-destinees-ja.html",132],["Anglaise","rivalites-destinees-en.html",244]]},
    {t:"Aventures Ensemble",n:190,s:[["Française","aventures-ensemble.html",190],["Japonaise","aventures-ensemble-ja.html",132],["Anglaise","aventures-ensemble-en.html",190]]},
    {t:"Évolutions Prismatiques",n:180,s:[["Française","evolutions-prismatiques.html",180],["Japonaise","evolutions-prismatiques-ja.html",237],["Anglaise","evolutions-prismatiques-en.html",180]]},
    {t:"Étincelles Déferlantes",n:252,s:[["Française","etincelles-deferlantes.html",252],["Japonaise","etincelles-deferlantes-ja.html",138],["Anglaise","etincelles-deferlantes-en.html",252]]},
    {t:"Couronne Stellaire",n:175,s:[["Française","couronne-stellaire.html",175],["Japonaise","couronne-stellaire-ja.html",135],["Anglaise","couronne-stellaire-en.html",175]]},
    {t:"Fable Nébuleuse",n:99,s:[["Française","fable-nebuleuse.html",99],["Japonaise","fable-nebuleuse-ja.html",94],["Anglaise","fable-nebuleuse-en.html",99]]},
    {t:"Mascarade Crépusculaire",n:226,s:[["Française","mascarade-crepusculaire.html",226],["Japonaise","mascarade-crepusculaire-ja.html",133],["Anglaise","mascarade-crepusculaire-en.html",226]]},
    {t:"Forces Temporelles",n:218,s:[["Française","forces-temporelles.html",218],["Japonaise","forces-temporelles-ja.html",200],["Anglaise","forces-temporelles-en.html",218]]},
    {t:"Destinées de Paldea",n:245,s:[["Française","destinees-de-paldea.html",245],["Japonaise","destinees-de-paldea-ja.html",320],["Anglaise","destinees-de-paldea-en.html",245]]},
    {t:"Faille Paradoxe",n:266,s:[["Française","faille-paradoxe.html",266],["Japonaise","faille-paradoxe-ja.html",190],["Anglaise","faille-paradoxe-en.html",266]]},
    {t:"151",n:207,s:[["Française","ecarlate-violet-151.html",207],["Japonaise","ecarlate-violet-151-ja.html",210],["Anglaise","ecarlate-violet-151-en.html",207]]},
    {t:"Flammes Obsidiennes",n:230,s:[["Française","flammes-obsidiennes.html",230],["Japonaise","flammes-obsidiennes-ja.html",141],["Anglaise","flammes-obsidiennes-en.html",230]]},
    {t:"Évolutions à Paldea",n:279,s:[["Française","evolutions-paldea.html",279],["Japonaise","evolutions-paldea-ja.html",198],["Anglaise","evolutions-paldea-en.html",279]]},
    {t:"Écarlate et Violet",n:258,s:[["Française","ecarlate-violet.html",258],["Japonaise","ecarlate-violet-ja.html",216],["Anglaise","ecarlate-violet-en.html",258]]}
  ];
  var PAGES_SERIES=["regne-delta.html","regne-delta-ja.html","equilibre-parfait-ventes.html","equilibre-parfait-ja.html","equilibre-parfait-en.html","equilibre-parfait.html","trentieme-anniversaire-ventes.html","trentieme-anniversaire-en.html","trentieme-anniversaire.html","heros-transcendants.html","heros-transcendants-en.html","nuit-noire-ventes.html","nuit-noire-ja.html","nuit-noire-en.html","mega-evolution-cartes.html","mega-evolution-en.html","heros-fantasmagoriques.html","flammes-fantasmagoriques-ja.html","flammes-fantasmagoriques-en.html","chaos-ascendant-ventes.html","chaos-ascendant-ja.html","chaos-ascendant-en.html","chaos-ascendant.html","ecarlate-violet.html","evolutions-paldea.html","flammes-obsidiennes.html","ecarlate-violet-151.html","destinees-de-paldea.html","destinees-de-paldea-en.html","destinees-de-paldea-ja.html","ecarlate-violet-151-en.html","ecarlate-violet-151-ja.html","flammes-obsidiennes-en.html","flammes-obsidiennes-ja.html","evolutions-paldea-en.html","evolutions-paldea-ja.html","ecarlate-violet-en.html","ecarlate-violet-ja.html","couronne-stellaire.html","couronne-stellaire-en.html","couronne-stellaire-ja.html","etincelles-deferlantes.html","etincelles-deferlantes-en.html","etincelles-deferlantes-ja.html","faille-paradoxe.html","faille-paradoxe-en.html","faille-paradoxe-ja.html","flamme-blanche.html","flamme-blanche-en.html","flamme-blanche-ja.html","aventures-ensemble.html","aventures-ensemble-en.html","aventures-ensemble-ja.html","evolutions-prismatiques.html","evolutions-prismatiques-en.html","evolutions-prismatiques-ja.html","rivalites-destinees.html","rivalites-destinees-en.html","rivalites-destinees-ja.html","forces-temporelles.html","forces-temporelles-en.html","forces-temporelles-ja.html","mascarade-crepusculaire.html","mascarade-crepusculaire-en.html","mascarade-crepusculaire-ja.html","fable-nebuleuse.html","fable-nebuleuse-en.html","fable-nebuleuse-ja.html","foudre-noire.html","foudre-noire-en.html","foudre-noire-ja.html"];
  var SECTIONS=[
    {t:"Accueil",h:"index.html",p:["index.html"]},
    {t:"Cartes",h:"cartes.html",p:["cartes.html","cartes-japonaises.html","cartes-anglaises.html","cartes-pokemon.html","pokemon.html"].concat(PAGES_SERIES),s:[
      ["Cartes FR","cartes.html"],["Cartes JA","cartes-japonaises.html"],["Cartes EN","cartes-anglaises.html"],["Cartes Pokémon / séries","cartes-pokemon.html"]
    ]},
    {t:"Pokémon",h:"cartes-generation-1.html",p:["cartes-generation-1.html","cartes-pikachu-ventes.html","cartes-dracaufeu-ventes.html","cartes-evoli-ventes.html","cartes-mewtwo-ventes.html","carte-pikachu.html"],s:[
      ["Pikachu","cartes-pikachu-ventes.html"],["Dracaufeu","cartes-dracaufeu-ventes.html"],["Évoli","cartes-evoli-ventes.html"],["Mewtwo","cartes-mewtwo-ventes.html"],["Génération 1","cartes-generation-1.html"],["1025 Pokémon","cartes-pokemon.html"]
    ]},
    {t:"Prix",h:"top-ventes.html",p:["cotation.html","cotes-series.html","top-ventes-semaine.html","top-ventes.html","cartes-gradees.html","registre.html","archive-ventes.html","registre-pokemon.html","adjuge.html"],s:[
      ["Top ventes","top-ventes.html"],["Cartes gradées PSA","cartes-gradees.html"],["Ventes passées Mimiqui","registre.html"],["Cartes Pokémon passées, par type","registre-pokemon.html"]
    ]},
    {t:"Acheter",h:"boutique.html",p:["boutique.html","bonnes-affaires.html","acheter-par-serie.html","displays-etb.html","precommandes.html","cartes-psa10.html","guide-acheteur.html"],s:[
      ["Boutique","boutique.html"],["Bonnes affaires eBay","bonnes-affaires.html"],["Acheter par série","acheter-par-serie.html"],["Displays et ETB","displays-etb.html"],["Boosters","jeu.html#boosters"],["Précommandes","precommandes.html"],["Annonces eBay en cours",EBAY_ENCOURS],["Cartes PSA 10","cartes-psa10.html"],["Guide de l’acheteur","guide-acheteur.html"]
    ]},
    {t:"Vendre",h:"vendre.html",p:["vendre.html","estimer-ma-carte.html","guide-vendre-ebay.html"],s:[
      ["Estimer ma carte","estimer-ma-carte.html"],["Guide pour vendre sur eBay","guide-vendre-ebay.html"],["Vendre sur eBay","vendre.html"]
    ]},
    {t:"Nouveautés",h:"nouveautes.html",p:["nouveautes.html"]},
    {t:"Blog",h:"blog.html",p:["blog.html"]}
  ];
  var AUTRES={"confidentialite.html":"Cookies et vie privée","assistant-instagram.html":"Assistant Instagram","404.html":"Page introuvable","mentions-legales.html":"Mentions légales","a-propos.html":"À propos / Contact","jeu.html":"Jeu"};
  function el(tag,attrs,txt){var e=document.createElement(tag);for(var k in attrs||{})e.setAttribute(k,attrs[k]);if(txt!=null)e.textContent=txt;return e;}
  function estPagePkmn(){
    return page==="carte-pikachu.html" || page==="cartes-generation-1.html" || /^cartes-[a-z0-9-]+-ventes\.html$/.test(page);
  }
  function courante(){
    if(estPagePkmn()){
      for(var i=0;i<SECTIONS.length;i++) if(SECTIONS[i].t==="Pokémon") return SECTIONS[i];
    }
    for(var j=0;j<SECTIONS.length;j++) if(SECTIONS[j].p.indexOf(page)>=0) return SECTIONS[j];
    return null;
  }
  function lienEbay(href,label){
    var a=el("a",{href:href},label);
    if(/^https?:/.test(href)){
      a.target="_blank";
      a.rel = href.indexOf("campid=")!=-1 ? "sponsored noopener" : "noopener";
    }
    return a;
  }
  function nomSet(t,n){
    return n? (t+" ("+n+")") : t;
  }
  function groupeSeries(parentUl){
    var li=el("li",{"class":"sm-groupe"});
    var b=el("button",{type:"button","class":"sm-tog","aria-expanded":"false"});
    b.appendChild(document.createTextNode("Cartes Pokémon / séries "));
    b.appendChild(el("span",{"class":"sm-fl","aria-hidden":"true"},"\u25B8"));
    var sous=el("ul",{"class":"sm-sous"});
    var l0=el("li"); l0.appendChild(el("a",{href:"cartes-pokemon.html"},"Toutes les séries")); sous.appendChild(l0);
    var mega=el("li",{"class":"sm-groupe"});
    var bm=el("button",{type:"button","class":"sm-tog","aria-expanded":"false"});
    bm.appendChild(document.createTextNode("Méga-Évolution "));
    bm.appendChild(el("span",{"class":"sm-fl","aria-hidden":"true"},"\u25B8"));
    var sousM=el("ul",{"class":"sm-sous"});
    SERIES_MEGA.forEach(function(set){
      var g=el("li",{"class":"sm-groupe"});
      var bt=el("button",{type:"button","class":"sm-tog","aria-expanded":"false"});
      bt.appendChild(document.createTextNode(nomSet(set.t,set.n)+" "));
      bt.appendChild(el("span",{"class":"sm-fl","aria-hidden":"true"},"\u25B8"));
      var u=el("ul",{"class":"sm-sous"});
      set.s.forEach(function(it){
        var x=el("li");
        var lab=it[0];
        if(it[2]) lab=nomSet(it[0],it[2]);
        x.appendChild(el("a",{href:it[1]},lab));
        u.appendChild(x);
      });
      g.append(bt,u); sousM.appendChild(g);
    });
    mega.append(bm,sousM); sous.appendChild(mega);
    var ev=el("li",{"class":"sm-groupe"});
    var be=el("button",{type:"button","class":"sm-tog","aria-expanded":"false"});
    be.appendChild(document.createTextNode("Écarlate et Violet "));
    be.appendChild(el("span",{"class":"sm-fl","aria-hidden":"true"},"\u25B8"));
    var sousE=el("ul",{"class":"sm-sous"});
    SERIES_EV.forEach(function(set){
      var g=el("li",{"class":"sm-groupe"});
      var bt=el("button",{type:"button","class":"sm-tog","aria-expanded":"false"});
      bt.appendChild(document.createTextNode(nomSet(set.t,set.n)+" "));
      bt.appendChild(el("span",{"class":"sm-fl","aria-hidden":"true"},"\u25B8"));
      var u=el("ul",{"class":"sm-sous"});
      set.s.forEach(function(it){
        var x=el("li");
        var lab=it[0];
        if(it[2]) lab=nomSet(it[0],it[2]);
        x.appendChild(el("a",{href:it[1]},lab));
        u.appendChild(x);
      });
      g.append(bt,u); sousE.appendChild(g);
    });
    ev.append(be,sousE); sous.appendChild(ev);
    li.append(b,sous); parentUl.appendChild(li);
  }

  function menu(){
    var nav=document.querySelector("nav.sitenav,header nav.top"); if(!nav)return;
    var ul=nav.querySelector("ul.menu-principal"); if(!ul)return;
    nav.classList.add("nav-commune");
    ul.id=ul.id||"menu-principal";
    ul.textContent="";
    var cur=courante();
    SECTIONS.forEach(function(sec){
      var li=el("li");
      if(sec.t==="Vendre") li.classList.add("li-vendre");
      var a=el("a",{href:sec.h},sec.t);
      if(sec===cur){ li.classList.add("actif"); a.setAttribute("aria-current", (sec.s&&sec.s.length)?"true":"page"); }
      li.appendChild(a);
      if(sec.s && sec.s.length){
        var btn=el("button",{type:"button","class":"ouvre-sous","aria-expanded":"false","aria-label":"Sous-menu "+sec.t});
        btn.innerHTML="&#9662;";
        var sm=el("ul",{"class":"sous-menu"});
        sec.s.forEach(function(it){
          if(sec.t==="Cartes" && it[1]==="cartes-pokemon.html"){
            groupeSeries(sm);
            return;
          }
          var x=el("li");
          x.appendChild(lienEbay(it[1], it[0]));
          sm.appendChild(x);
        });
        sm.querySelectorAll("a").forEach(function(s){
          var href=(s.getAttribute("href")||"").split("#")[0].toLowerCase();
          if(href===page) s.setAttribute("aria-current","page");
        });
        btn.addEventListener("click",function(e){e.preventDefault();var o=li.classList.toggle("ouvert");btn.setAttribute("aria-expanded",o?"true":"false");});
        li.append(btn,sm);
      }
      ul.appendChild(li);
    });
    if(!nav.querySelector(".hamburger")){
      var h=el("button",{type:"button","class":"hamburger","aria-label":"Ouvrir le menu","aria-expanded":"false","aria-controls":"menu-principal"});
      h.innerHTML="<span></span><span></span><span></span>";
      ul.parentNode.insertBefore(h,ul);
      h.addEventListener("click",function(){var o=nav.classList.toggle("menu-ouvert");h.setAttribute("aria-expanded",o?"true":"false");h.setAttribute("aria-label",o?"Fermer le menu":"Ouvrir le menu");});
    }
    document.addEventListener("click",function(e){if(!nav.contains(e.target)){nav.classList.remove("menu-ouvert");ul.querySelectorAll("li.ouvert").forEach(function(l){l.classList.remove("ouvert");});}});
    document.addEventListener("keydown",function(e){if(e.key==="Escape"){nav.classList.remove("menu-ouvert");ul.querySelectorAll("li.ouvert").forEach(function(l){l.classList.remove("ouvert");});fermerRecherche();}});
    ajouterRecherche(nav);
  }

  /* Fil d'Ariane */
  function ariane(){
    if(page==="index.html"||document.querySelector(".fil-ariane"))return;
    var items=[["Accueil","index.html"]],cur=courante();
    if(cur){
      if(cur.s){items.push([cur.t,cur.h]);
        var sp=cur.s.filter(function(s){return (s[1]||"").split("#")[0].toLowerCase()===page;})[0];
        if(!sp && page==="archive-ventes.html") sp=["Ventes passées Mimiqui",null];
        if(!sp && page==="top-ventes-semaine.html") sp=["Top ventes",null];
        if(sp)items.push([sp[0],null]);
        else if(page==="pokemon.html"){items.push(["Cartes Pokémon","cartes-pokemon.html"]);
          var n=new URLSearchParams(location.search).get("n");items.push([n?decodeURIComponent(n):"Pokémon",null]);}
        else if(page==="carte-pikachu.html"){
          var slug=(new URLSearchParams(location.search).get("pkmn")||"").toLowerCase();
          var nomCarte=document.querySelector("h1");
          items.push([nomCarte&&nomCarte.textContent?nomCarte.textContent.trim(): (slug||"Fiche carte"), null]);
        }
        if(items[items.length-1][1]===cur.h&&!sp)items[items.length-1][1]=null;
      }else items.push([cur.t,null]);
    }else items.push([AUTRES[page]||document.title.split(/[\u2013\u2014|\u00b7-]/)[0].trim(),null]);
    var navA=el("nav",{"class":"fil-ariane wrap","aria-label":"Fil d'Ariane"}),ol=el("ol");
    items.forEach(function(it,i){var li=el("li");
      if(it[1]&&i<items.length-1)li.appendChild(el("a",{href:it[1]},it[0]));else li.appendChild(el("span",{"aria-current":"page"},it[0]));
      ol.appendChild(li);});
    navA.appendChild(ol);
    var header=document.querySelector("header.site,header.wrap,body>header");
    if(header&&header.parentNode)header.parentNode.insertBefore(navA,header.nextSibling);else document.body.insertBefore(navA,document.body.firstChild);
  }

  /* Pied de page */
  function pied(){
    if(document.querySelector(".pied-commun"))return;
    var groupes=[
      ["Cartes",[["Cartes FR","cartes.html"],["Cartes JA","cartes-japonaises.html"],["Cartes EN","cartes-anglaises.html"],["Cartes Pokémon / séries","cartes-pokemon.html"],["Génération 1","cartes-generation-1.html"]]],
      ["Pokémon",[["Pikachu","cartes-pikachu-ventes.html"],["Dracaufeu","cartes-dracaufeu-ventes.html"],["Évoli","cartes-evoli-ventes.html"],["Mewtwo","cartes-mewtwo-ventes.html"],["Génération 1","cartes-generation-1.html"],["1025 Pokémon","cartes-pokemon.html"]]],
      ["Prix",[["Top ventes","top-ventes.html"],["Cartes gradées PSA","cartes-gradees.html"],["Ventes passées Mimiqui","registre.html"],["Cartes Pokémon passées, par type","registre-pokemon.html"]]],
      ["Acheter et vendre",[["Boutique","boutique.html"],["Bonnes affaires eBay","bonnes-affaires.html"],["Acheter par série","acheter-par-serie.html"],["Displays et ETB","displays-etb.html"],["Boosters","jeu.html#boosters"],["Précommandes","precommandes.html"],["Annonces eBay en cours",EBAY_ENCOURS],["Cartes PSA 10","cartes-psa10.html"],["Guide de l’acheteur","guide-acheteur.html"],["Estimer ma carte","estimer-ma-carte.html"],["Guide pour vendre sur eBay","guide-vendre-ebay.html"],["Vendre sur eBay","vendre.html"]]],
      ["Découvrir",[["Nouveautés","nouveautes.html"],["Blog","blog.html"],["Blog Instagram","https://www.instagram.com/lecoindemimiqui/"],["Jeu","jeu.html"],["Le film 2027","index.html#film"],["Le déguisement","index.html#deguisement"],["Faiblesses","index.html#types"]]],
      ["Le site",[["À propos / Contact","a-propos.html"],["Créer un compte","index.html#compte"],["Assistant Instagram","assistant-instagram.html"],["Cookies et vie privée","confidentialite.html"],["Mentions légales","mentions-legales.html"],["Liens affiliés","mentions-legales.html#liens"]]]
    ];
    var box=el("div",{"class":"pied-commun wrap"}),grid=el("div",{"class":"pied-groupes"});
    groupes.forEach(function(g){var c=el("div");c.appendChild(el("h3",null,g[0]));var u=el("ul");
      g[1].forEach(function(l){var li=el("li"),a=lienEbay(l[1],l[0]);li.appendChild(a);u.appendChild(li);});
      c.appendChild(u);grid.appendChild(c);});
    box.appendChild(grid);
    box.appendChild(el("p",{"class":"mention-affiliation"},"Certains liens eBay sont des liens affiliés : le site peut toucher une commission, sans surcoût pour vous."));
    var f=document.querySelector("body>footer")||document.querySelector("footer");
    if(f)f.insertBefore(box,f.firstChild);
    else{f=el("footer",{"class":"pied-site"});f.appendChild(box);var s=document.querySelector("body>script");document.body.appendChild(f);}
  }

    /* Recherche ?q= sur cartes-pokemon.html */
  function rechercheQ(){
    if(page!=='cartes-pokemon.html')return;
    var q=new URLSearchParams(location.search).get('q');if(!q)return;
    var i=document.getElementById('q');if(!i)return;
    i.value=q;['input','change','keyup'].forEach(function(t){i.dispatchEvent(new Event(t,{bubbles:true}));});
  }

  
  function fermerRecherche(){
    var box=document.querySelector(".nav-recherche");
    if(!box)return;
    box.classList.remove("ouvert");
    var b=box.querySelector(".nav-rech-btn");
    if(b)b.setAttribute("aria-expanded","false");
  }
  function chargerIndexRecherche(cb){
    if(window.RECHERCHE_CARTES){ cb(window.RECHERCHE_CARTES); return; }
    if(window.__rechChargement){ window.__rechChargement.push(cb); return; }
    window.__rechChargement=[cb];
    var s=document.createElement("script");
    s.src="recherche-cartes-data.js?v="+(typeof SITE_CACHE==="string"?SITE_CACHE:"20261112y");
    s.onload=function(){
      var fns=window.__rechChargement||[]; window.__rechChargement=null;
      fns.forEach(function(fn){ try{fn(window.RECHERCHE_CARTES||{sets:[]});}catch(e){} });
    };
    s.onerror=function(){ window.__rechChargement=null; cb({sets:[]}); };
    document.head.appendChild(s);
  }
  function normRech(s){
    return String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/œ/g,"oe").replace(/æ/g,"ae");
  }
  function ancreId(k){ return "carte-"+String(k||"").replace(/[^A-Za-z0-9_-]+/g,"-"); }
  function ajouterRecherche(nav){
    if(!nav||nav.querySelector(".nav-recherche"))return;
    var box=el("div",{"class":"nav-recherche"});
    var btn=el("button",{type:"button","class":"nav-rech-btn","aria-expanded":"false","aria-label":"Rechercher une carte","title":"Rechercher une carte"});
    btn.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg>';
    var pan=el("div",{"class":"nav-rech-panneau","role":"search"});
    var inp=el("input",{type:"search",placeholder:"Nom ou numéro d’une carte…","aria-label":"Rechercher une carte par nom","autocomplete":"off"});
    var aide=el("p",{"class":"nav-rech-aide"},"Parmi les cartes des pages de sets déjà en ligne.");
    var liste=el("ul",{"class":"nav-rech-liste",id:"nav-rech-liste"});
    var vide=el("p",{"class":"nav-rech-vide",hidden:"hidden"},"Aucune carte trouvée.");
    pan.append(inp,aide,liste,vide);
    box.append(btn,pan);
    var ham=nav.querySelector(".hamburger");
    if(ham&&ham.parentNode) ham.parentNode.insertBefore(box, ham);
    else nav.appendChild(box);
    btn.addEventListener("click",function(ev){
      ev.preventDefault(); ev.stopPropagation();
      var o=!box.classList.contains("ouvert");
      if(o){ box.classList.add("ouvert"); btn.setAttribute("aria-expanded","true"); chargerIndexRecherche(function(){ inp.focus(); }); }
      else fermerRecherche();
    });
    pan.addEventListener("click",function(ev){ ev.stopPropagation(); });
    var tmr=null;
    function render(){
      var q=normRech(inp.value).trim();
      liste.textContent=""; vide.hidden=true; aide.hidden=!!q;
      if(q.length<2){ if(q) vide.hidden=false, vide.textContent="Saisir au moins 2 caractères."; return; }
      var data=window.RECHERCHE_CARTES||{sets:[]};
      var hits=[], max=30;
      data.sets.forEach(function(st){
        (st.c||[]).forEach(function(c){
          if(hits.length>=max) return;
          var k=c[0], n=c[1], nom=c[2];
          var blob=normRech(nom+" "+n+" "+k);
          if(blob.indexOf(q)<0) return;
          hits.push({k:k,n:n,nom:nom,set:st.s,page:st.p,lang:st.l});
        });
      });
      if(!hits.length){ vide.hidden=false; vide.textContent="Aucune carte trouvée."; return; }
      hits.forEach(function(h){
        var li=el("li");
        var a=el("a",{href:h.page+"?k="+encodeURIComponent(h.k)+"#"+ancreId(h.k)});
        a.appendChild(document.createTextNode(h.nom));
        var sm=el("small",null,(h.n?h.n+" · ":"")+h.set+(h.lang?" · "+h.lang:""));
        a.appendChild(sm);
        li.appendChild(a); liste.appendChild(li);
      });
    }
    inp.addEventListener("input",function(){ if(tmr)clearTimeout(tmr); tmr=setTimeout(render,80); });
    inp.addEventListener("keydown",function(ev){ if(ev.key==="Escape"){ fermerRecherche(); btn.focus(); } });
  }
  function ongletsRegistre(){
    if(page!=="registre.html" && page!=="archive-ventes.html") return;
    if(document.querySelector(".onglets-ventes-mimiqui")) return;
    var bar=el("nav",{"class":"onglets-ventes-mimiqui","aria-label":"Ventes passées Mimiqui"});
    var a1=el("a",{href:"registre.html"},"Par semaine");
    var a2=el("a",{href:"archive-ventes.html"},"Archive (365 jours)");
    if(page==="registre.html") a1.setAttribute("aria-current","page");
    else a2.setAttribute("aria-current","page");
    bar.append(a1,a2);
    var ariane=document.querySelector(".fil-ariane");
    var header=document.querySelector("header.site,header.wrap,body>header");
    var ref=ariane||header;
    if(ref&&ref.parentNode) ref.parentNode.insertBefore(bar, ref.nextSibling);
    else document.body.insertBefore(bar, document.body.firstChild);
  }
  function ancreCarte(){
    var qs; try{ qs=new URLSearchParams(location.search);}catch(e){ qs=new URLSearchParams(); }
    var k=qs.get("k"), nom=qs.get("carte")||"";
    var hash=(location.hash||"").replace(/^#/,"");
    if(!k && hash.indexOf("carte-")===0) k=hash.slice(6);
    if(!k && !nom) return;
    function apply(){
      if(typeof C==="undefined" || !C || !C.length) return false;
      var list=document.getElementById("list");
      if(!list || !list.querySelector("article.card")) return false;
      document.querySelectorAll("article.card button[data-i]").forEach(function(b){
        var i=+b.getAttribute("data-i"), c=C[i]; if(!c)return;
        var art=b.closest("article");
        if(art && !art.id) art.id=ancreId(c.k||c.n||String(i));
      });
      var target=null;
      if(k){
        var want=ancreId(k);
        target=document.getElementById(want);
        if(!target){
          C.forEach(function(c,i){
            if(target) return;
            if(String(c.k)===String(k) || ancreId(c.k)===want || String(c.n)===String(k)){
              var b=document.querySelector('button[data-i="'+i+'"]');
              if(b) target=b.closest("article");
            }
          });
        }
      }
      if(!target && nom){
        var box=document.getElementById("q");
        if(box){ box.value=nom; ["input","change","keyup"].forEach(function(ev){ box.dispatchEvent(new Event(ev,{bubbles:true})); }); }
        var w=nom.toLowerCase();
        document.querySelectorAll("article.card h3").forEach(function(h){
          if(!target && (h.textContent||"").toLowerCase().indexOf(w)>=0) target=h.closest("article");
        });
      }
      if(target){
        try{ target.scrollIntoView({block:"center",behavior:"smooth"}); }catch(e){ target.scrollIntoView(true); }
        var btn=target.querySelector("button.frame,button[data-i]");
        if(btn && k){ try{ btn.click(); }catch(e2){} }
      }
      return true;
    }
    if(apply()) return;
    var n=0, id=setInterval(function(){ if(apply()||++n>25) clearInterval(id); }, 200);
  }

function go(){try{menu();}catch(e){console.error(e);}try{ariane();}catch(e){console.error(e);}try{pied();}catch(e){console.error(e);}try{rechercheQ();}catch(e){console.error(e);}try{ongletsRegistre();}catch(e){console.error(e);}try{ancreCarte();}catch(e){console.error(e);}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
  window.addEventListener('load',rechercheQ);
})();

/* Mini-lecteur teaser Pokemon : Wild Card - video locale (sans YouTube) */
(function(){
  if(window.__miniTeaser)return;window.__miniTeaser=1;
  var SRC='videos/wild-card-bande-annonce.mp4',KT='mimiquiTeaserTemps',KR='mimiquiTeaserReduit';
  var KS='mimiquiBrowseStart',KA='mimiquiTeaserAutoReduit',KO='mimiquiTeaserKeepOpen';
  var AUTO_MS=60000; /* 1 minute de navigation (session) */
  function go(){
    if(/(^|\/)registre-pokemon\.html$/i.test(location.pathname))return;if(document.getElementById('mini-teaser'))return;window.__mtAuto=true;
    var t=0;try{t=parseFloat(localStorage.getItem(KT))||0}catch(e){}
    var red=false;try{red=localStorage.getItem(KR)==='1'}catch(e){}
    var keepOpen=false,autoDone=false,browseStart=0,now=Date.now();
    try{
      browseStart=parseInt(sessionStorage.getItem(KS)||'0',10)||0;
      if(!browseStart){browseStart=now;sessionStorage.setItem(KS,String(browseStart))}
      keepOpen=sessionStorage.getItem(KO)==='1';
      autoDone=sessionStorage.getItem(KA)==='1';
    }catch(e){browseStart=now}
    var elapsed=now-browseStart;
    if(!keepOpen&&(autoDone||elapsed>=AUTO_MS))red=true;
    var box=document.createElement('div');box.id='mini-teaser';if(red)box.className='reduit';
    box.innerHTML='<div class="mt-barre"><span class="mt-titre">Pok\u00e9mon : Wild Card \u2013 teaser</span><button type="button" class="mt-taille" aria-label="R\u00e9duire ou agrandir"></button></div><div class="mt-video"><video id="mini-teaser-yt" src="'+SRC+'" muted autoplay loop playsinline preload="metadata"></video><button type="button" class="mt-play" aria-label="Lecture"></button></div>';
    document.body.appendChild(box);
    var v=box.querySelector('video'),pb=box.querySelector('.mt-play');v.muted=true;
    v.addEventListener('loadedmetadata',function(){try{if(t&&t<v.duration)v.currentTime=t}catch(e){}});
    function maj(){pb.style.display=(!v.paused&&!v.muted)?'none':''}
    v.addEventListener('play',maj);v.addEventListener('pause',maj);v.addEventListener('volumechange',maj);
    var pl=v.play();if(pl&&pl.catch)pl.catch(function(){});
    window.__mtPlayer={unMute:function(){v.muted=false},mute:function(){v.muted=true},setVolume:function(n){v.volume=Math.min(1,n/100)},playVideo:function(){var q=v.play();if(q&&q.catch)q.catch(function(){})},pauseVideo:function(){v.pause()},isMuted:function(){return v.muted},getCurrentTime:function(){return v.currentTime}};
    new MutationObserver(function(){var g=box.classList.contains('mt-grand');v.controls=g;if(g){v.muted=false;v.volume=1;window.__mtPlayer.playVideo()}else{v.muted=true}}).observe(box,{attributes:true,attributeFilter:['class']});
    var b=box.querySelector('.mt-taille');
    function lab(){b.textContent=box.classList.contains('reduit')?'\u2922 Agrandir':'\u2013 R\u00e9duire'}lab();
    function applyReduit(on){
      box.classList.toggle('reduit',!!on);
      try{localStorage.setItem(KR,on?'1':'0')}catch(e){}
      lab();
    }
    function autoReduire(){
      try{if(sessionStorage.getItem(KO)==='1')return}catch(e){}
      if(box.classList.contains('mt-grand'))return; /* ne pas casser le grand ecran */
      applyReduit(true);
      try{sessionStorage.setItem(KA,'1')}catch(e){}
    }
    b.addEventListener('click',function(){
      var next=!box.classList.contains('reduit');
      applyReduit(next);
      try{
        if(next){sessionStorage.removeItem(KO)}
        else{sessionStorage.setItem(KO,'1')} /* utilisateur rouvre : on respecte */
      }catch(e){}
    });
    if(!keepOpen&&!red&&elapsed<AUTO_MS){
      setTimeout(autoReduire, Math.max(0, AUTO_MS-elapsed));
    }else if(!keepOpen&&red){
      try{sessionStorage.setItem(KA,'1')}catch(e){}
    }
    function save(){try{localStorage.setItem(KT,String(v.currentTime||0))}catch(e){}}
    window.addEventListener('beforeunload',save);window.addEventListener('pagehide',save);setInterval(save,3000);
    document.body.classList.add('avec-mini-teaser');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();
/* Son au premier geste du visiteur */
(function(){var fait=false;function son(e){return;if(fait||!window.__mtAuto)return;var p=window.__mtPlayer;if(!p||!p.unMute)return;try{p.unMute();p.setVolume(100);p.playVideo();fait=true;['pointerdown','keydown','touchstart','click'].forEach(function(t){window.removeEventListener(t,son,true)})}catch(x){}}['pointerdown','keydown','touchstart','click'].forEach(function(t){window.addEventListener(t,son,true)})})();
/* Navigation instantanee : precharge une page interne au survol */
(function(){var vu={};function pre(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var u;try{u=new URL(a.href,location.href)}catch(x){return}
if(u.origin!==location.origin||!/\.html?$/.test(u.pathname)||u.pathname===location.pathname||vu[u.pathname])return;vu[u.pathname]=1;
var l=document.createElement('link');l.rel='prefetch';l.href=u.pathname;document.head.appendChild(l)}
document.addEventListener('mouseover',pre,{passive:true});document.addEventListener('touchstart',pre,{passive:true});})();

/* Fenetre defilante hologramme (toutes les pages), fermable et memorisee */
(function(){var K='mimiquiFenetreFermee';
var T='<p class="fd-tag">Au cin\u00e9ma</p><p class="fd-titre">Pok\u00e9mon : <em>Wild Card</em></p><p class="fd-date">\u00c0 venir en 2027</p><p>Le premier film consacr\u00e9 au JCC Pok\u00e9mon, avec Mimiqui en partenaire du h\u00e9ros.</p><p class="fd-tag">Annonce \u00b7 30 ao\u00fbt 2026</p><p><b>Le film est annonc\u00e9</b><br>R\u00e9v\u00e9l\u00e9 \u00e0 la cl\u00f4ture des Championnats du monde Pok\u00e9mon 2026, \u00e0 San Francisco.</p><p class="fd-tag">Vid\u00e9o</p><p><b>Le teaser officiel</b><br>39 secondes, aussi en version japonaise.</p><p class="fd-tag">Blog</p><p><b>Ce qu\u2019on sait du film</b><br>L\u2019histoire, l\u2019\u00e9quipe et le teaser.</p>';
function ferme(){try{return localStorage.getItem(K)==='1'}catch(e){return false}}
function set(v){try{localStorage.setItem(K,v?'1':'0')}catch(e){}}
function tab(){if(document.getElementById('fd-rouvrir'))return;var b=document.createElement('button');b.id='fd-rouvrir';b.type='button';b.textContent='Wild Card \u25b8';b.setAttribute('aria-label','Rouvrir la fen\u00eatre du film');b.addEventListener('click',function(){set(false);b.remove();win()});document.body.appendChild(b)}
function win(){if(document.getElementById('fenetre-defilante'))return;var d=document.createElement('section');d.id='fenetre-defilante';if(/pokemon\.html?$/i.test(location.pathname))d.className='fd-simple';d.setAttribute('aria-label','Le film Pok\u00e9mon : Wild Card en bref');
d.innerHTML='<button type="button" class="fd-fermer" aria-label="Fermer">\u00d7</button><div class="fd-piste"><div class="fd-bloc">'+T+'</div><div class="fd-bloc" aria-hidden="true">'+T+'</div></div>';
d.querySelector('.fd-fermer').addEventListener('click',function(){set(true);d.remove();tab()});document.body.appendChild(d)}
function go(){if(/blog\.html?$/i.test(location.pathname))return;if(window.matchMedia&&matchMedia('(max-width:600px)').matches){tab();return}if(/(\/|\/index\.html?)$/i.test(location.pathname)){set(false);win();return}if(ferme())tab();else win()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();})();
/* Fenetre defilante : profondeur (le texte arrive du fond vers le visiteur en montant) */
(function(){if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
function boucle(){var w=document.getElementById('fenetre-defilante');if(w&&!document.hidden){var r=w.getBoundingClientRect(),ps=w.querySelectorAll('.fd-bloc p');
for(var i=0;i<ps.length;i++){var b=ps[i].getBoundingClientRect(),c=(b.top+b.height/2-r.top)/r.height;if(c<-0.2||c>1.2)continue;
var k=1-Math.min(1,Math.max(0,c));/* 0 en bas, 1 en haut */
var b0=w.classList.contains('fond-clair')?0.4:0.18;ps[i].style.opacity=(b0+(1-b0)*k).toFixed(3);ps[i].style.transform='translateZ('+(-120+150*k).toFixed(1)+'px) scale('+(0.8+0.25*k).toFixed(3)+')'}}
requestAnimationFrame(boucle)}requestAnimationFrame(boucle)})();
/* Fenetre defilante : texte bleu sur fond clair, hologramme blanc/cyan sur fond sombre */
(function(){
function lum(c){var m=c&&c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/);if(!m)return null;if(m[4]!==undefined&&+m[4]<0.35)return null;
 var f=function(v){v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};return 0.2126*f(+m[1])+0.7152*f(+m[2])+0.0722*f(+m[3])}
function fondSous(w){var r=w.getBoundingClientRect(),pts=[[.5,.5],[.25,.3],[.75,.3],[.25,.75],[.75,.75]],tot=0,n=0;
 for(var i=0;i<pts.length;i++){var x=r.left+r.width*pts[i][0],y=r.top+r.height*pts[i][1],els=document.elementsFromPoint?document.elementsFromPoint(x,y):[];
  var L=null;for(var j=0;j<els.length&&L===null;j++){var e=els[j];if(w.contains(e)||e.id==='holo-fond'||e.id==='holo-spot'||e.id==='mini-teaser'||(e.closest&&e.closest('#mini-teaser')))continue;
   for(var a=e;a&&L===null;a=a.parentElement){var cs=getComputedStyle(a);L=lum(cs.backgroundColor);if(L===null&&cs.backgroundImage&&cs.backgroundImage.indexOf('gradient')>=0){var g=cs.backgroundImage.match(/rgba?\([^)]*\)/);if(g)L=lum(g[0])}}}
  if(L===null)L=lum(getComputedStyle(document.body).backgroundColor);if(L===null)L=1;tot+=L;n++}
 return tot/n}
function maj(){var w=document.getElementById('fenetre-defilante');if(!w)return;var L=fondSous(w);w.classList.toggle('fond-clair',L>0.4);w.setAttribute('data-lum',L.toFixed(2))}
var att=false;function plan(){if(att)return;att=true;setTimeout(function(){att=false;maj()},150)}
addEventListener('scroll',plan,{passive:true});addEventListener('resize',plan);addEventListener('load',maj);
var t=setInterval(function(){if(document.getElementById('fenetre-defilante')){maj();clearInterval(t)}},200);setTimeout(function(){clearInterval(t)},10000);
new MutationObserver(function(ms){for(var i=0;i<ms.length;i++)for(var k=0;k<ms[i].addedNodes.length;k++)if(ms[i].addedNodes[k].id==='fenetre-defilante')maj()}).observe(document.documentElement,{childList:true,subtree:true});
window.__fdMaj=maj;window.__fdFond=fondSous;})();
/* Sous-menus hologramme : contraste adaptatif (meme detection que la fenetre defilante) */
(function(){function razSM(){document.querySelectorAll('ul.sous-menu.sm-clair,ul.sous-menu.sm-sombre,ul.sm-sous.sm-clair,ul.sm-sous.sm-sombre').forEach(function(sm){sm.classList.remove('sm-clair','sm-sombre');});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',razSM);else razSM();
 document.addEventListener('mouseover',function(e){var sm=e.target.closest&&e.target.closest('ul.sous-menu,ul.sm-sous');if(sm)sm.classList.remove('sm-clair','sm-sombre');},{passive:true});})();
(function(){
  if(document.getElementById('menu-theme-unique'))return;
  var s=document.createElement('style');s.id='menu-theme-unique';
  s.textContent=
    'html body nav ul.menu-principal ul.sous-menu,html body nav ul.menu-principal ul.sous-menu.sm-clair,html body nav ul.menu-principal ul.sous-menu.sm-sombre,html body nav ul.menu-principal li.li-vendre>ul.sous-menu,html body nav ul.menu-principal ul.sm-sous{'+
    'background-color:rgba(255,255,255,.96)!important;background-image:repeating-linear-gradient(0deg,rgba(0,200,255,.06) 0 1px,transparent 1px 4px)!important;'+
    '-webkit-backdrop-filter:blur(12px) saturate(1.3)!important;backdrop-filter:blur(12px) saturate(1.3)!important;'+
    'border:1px solid rgba(0,210,255,.75)!important;border-radius:12px!important;box-shadow:0 0 14px rgba(0,200,255,.45),0 10px 26px rgba(0,0,0,.18)!important}'+
    'html body nav ul.menu-principal ul.sous-menu a,html body nav ul.menu-principal ul.sous-menu .sm-tog,html body nav ul.menu-principal ul.sm-sous a,html body nav ul.menu-principal li.li-vendre>ul.sous-menu a,html body header.wrap nav.top ul.sous-menu a,html body header.wrap nav.top ul.sm-sous a{'+
    'color:#0b3d91!important;font-weight:800!important;text-shadow:0 0 1px rgba(255,255,255,.9)!important;border-bottom:0!important;border-color:transparent!important}'+
    'html body nav ul.menu-principal ul.sous-menu a:hover,html body nav ul.menu-principal ul.sous-menu a[aria-current],html body nav ul.menu-principal .sm-groupe:hover>.sm-tog,html body nav ul.menu-principal .sm-groupe.sm-ouvert>.sm-tog,html body nav ul.menu-principal ul.sm-sous a:hover,html body nav ul.menu-principal li.li-vendre>ul.sous-menu a:hover{'+
    'background:rgba(0,200,255,.14)!important;color:#0b3d91!important}';
  function place(){(document.body||document.documentElement).appendChild(s);}
  if(document.body)place();else document.addEventListener('DOMContentLoaded',place);
})();

/* Teaser : clic = grand ecran au milieu avec effet ouverture (2026-11-02) */
(function(){
var fond=null,ouvert=false,etaitReduit=false;
function box(){return document.getElementById('mini-teaser')}
function anim(b,r1,r2,inv){if(!b.animate||matchMedia('(prefers-reduced-motion:reduce)').matches)return;var dx=r1.left-r2.left,dy=r1.top-r2.top,s=r1.width/r2.width;
var a='translate(-50%,-50%) translate('+(dx+ (r1.width-r2.width)/2)+'px,'+(dy+(r1.height-r2.height)/2)+'px) scale('+s+')',z='translate(-50%,-50%)';
b.animate([{transform:a,filter:'brightness(1.6) drop-shadow(0 0 30px rgba(0,230,255,.9))'},{transform:z,filter:'brightness(1) drop-shadow(0 0 0 rgba(0,230,255,0))'}],{duration:520,easing:'cubic-bezier(.2,.8,.2,1)'})}
function ouvrir(){var b=box();if(!b||ouvert)return;ouvert=true;var r1=b.getBoundingClientRect();etaitReduit=b.classList.contains('reduit');b.classList.remove('reduit');
fond=document.createElement('div');fond.id='mt-fond';fond.addEventListener('click',fermer);document.body.appendChild(fond);
var x=document.createElement('button');x.type='button';x.className='mt-fermer-grand';x.setAttribute('aria-label','Fermer la grande vid\u00e9o');x.textContent='\u00d7';x.addEventListener('click',function(e){e.stopPropagation();fermer()});b.appendChild(x);
b.classList.add('mt-grand');document.body.classList.add('mt-grand-ouvert');var r2=b.getBoundingClientRect();anim(b,r1,r2);
try{var p=window.__mtPlayer;if(p&&p.unMute){p.unMute();p.setVolume(100);p.playVideo();var pb=b.querySelector('.mt-play');if(pb)pb.style.display='none'}}catch(e){}}
function fermer(){var b=box();if(!b||!ouvert)return;ouvert=false;b.classList.remove('mt-grand');document.body.classList.remove('mt-grand-ouvert');if(etaitReduit)b.classList.add('reduit');
var x=b.querySelector('.mt-fermer-grand');if(x)x.remove();if(fond){fond.remove();fond=null}
if(b.animate&&!matchMedia('(prefers-reduced-motion:reduce)').matches)b.animate([{transform:'scale(1.25)',opacity:.6},{transform:'scale(1)',opacity:1}],{duration:320,easing:'ease-out'})}
window.mimiquiTeaserGrand=ouvrir;document.addEventListener('keydown',function(e){if(e.key==='Escape'&&ouvert)fermer()});document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href*="H6_jMQ6whtQ"],a[href*="wild-card-bande-annonce"]');if(!a||!box()||!/voir le teaser/i.test(a.textContent))return;e.preventDefault();ouvrir()},true);
document.addEventListener('click',function(e){var b=box();if(!b||ouvert||!b.contains(e.target))return;if(e.target.closest('.mt-taille'))return;if(e.target.closest('.mt-barre,.mt-play,.mt-grand-btn,.mt-video')){e.preventDefault();ouvrir()}},true);
function ajout(){var b=box();if(!b){return setTimeout(ajout,300)}if(b.querySelector('.mt-grand-btn'))return;var g=document.createElement('button');g.type='button';g.className='mt-grand-btn';g.setAttribute('aria-label','Voir en grand');g.textContent='\u26f6 Grand';var t=b.querySelector('.mt-taille');if(t)t.parentNode.insertBefore(g,t);var ti=b.querySelector('.mt-titre');if(ti){ti.style.cursor='pointer';ti.title='Voir en grand'}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ajout);else ajout();
})();
/* === holo5 : 5 hologrammes (sauf pokemon.html) === */
(function(){
var page=(location.pathname.split('/').pop()||'index.html').toLowerCase();if(page==='pokemon.html')return;
var MIMI='img/logo-mimiqui.webp';
function holo(src,cls,video){var w=document.createElement('span');w.className='h5-holo h5-anim '+(cls||'');w.style.setProperty('--h5m','url("'+src+'")');
 w.innerHTML='<span class="h5-faisceau"></span>'+(video?'<video src="'+src+'" muted autoplay loop playsinline aria-hidden="true"></video>':'<img src="'+src+'" alt="" aria-hidden="true">')+'<span class="h5-socle"></span>';return w}
function go(){
 if(!document.querySelector('link[href="holo5.css"]')){var l=document.createElement('link');l.rel='stylesheet';l.href='holo5.css';document.head.appendChild(l)}
 var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
 // 1 accueil
 if(page==='index.html'||page===''){var h=document.querySelector('h1');if(h&&!h.querySelector('.h5-holo'))h.appendChild(holo(MIMI,'h5-mimi-titre'))}
 // 3 blog
 if(page==='blog.html'){var t=document.querySelector('.tete');if(t&&!t.querySelector('.h5-film')){var f=holo('videos/wild-card-bande-annonce.mp4','h5-film',true);t.appendChild(f);if(RM){var v=f.querySelector('video');v.removeAttribute('autoplay');v.pause()}}}
 // 4 aide
 document.querySelectorAll('dialog.aide').forEach(function(d){new MutationObserver(function(){if(d.open&&!d.querySelector('.h5-aide'))d.appendChild(holo(MIMI,'h5-aide'))}).observe(d,{attributes:true,attributeFilter:['open']})});
 // 2 cartes
 function estCarte(i){return i&&i.tagName==='IMG'&&((/^cartes(-japonaises|-anglaises)?\.html$/.test(page)&&!!i.closest('.card .frame'))||/(^|\/)img\/(?!logo)[\w-]+\.(webp|png|jpe?g)/i.test(i.getAttribute('src')||''))&&!i.closest('.h5-holo,header,#mini-teaser')&&i.offsetWidth>50}
 var P=document.createElement('div');P.id='h5-proj';document.body.appendChild(P);var cur=null;
 if(matchMedia('(hover:hover)').matches){
  document.addEventListener('mouseover',function(e){var i=e.target;if(!estCarte(i)||i===cur)return;if(cur)cur.classList.remove('h5-on');cur=i;i.classList.add('h5-lift');void i.offsetWidth;i.classList.add('h5-on');P.innerHTML='';P.appendChild(holo(i.currentSrc||i.src,''));var r=i.getBoundingClientRect();P.style.left=Math.max(4,Math.min(innerWidth-(P.offsetWidth||90)-4,r.left+r.width/2-(P.offsetWidth||90)/2))+'px';P.style.top=Math.max(4,r.top-140)+'px';
  var hw=/^cartes(-japonaises|-anglaises)?\.html$/.test(page)&&i.closest('.pic>div')&&i.closest('.pic>div').querySelector('.hi-win');
  if(hw){P.classList.remove('on');var ii=i;clearTimeout(P._t);P._t=setTimeout(function(){if(cur!==ii)return;var q=hw.getBoundingClientRect();P.style.left=Math.round(q.left+q.width/2-(P.offsetWidth||90)/2)+'px';P.style.top=Math.round(q.top+10)+'px';P.classList.add('on')},480)}
  else P.classList.add('on')});
  document.addEventListener('mouseout',function(e){if(cur&&e.target===cur){cur.classList.remove('h5-on');cur=null;P.classList.remove('on')}});
  addEventListener('scroll',function(){if(cur){cur.classList.remove('h5-on');cur=null;P.classList.remove('on')}},{passive:true})}
 // 5 socle bas de page
 if(!document.querySelector('.h5-pied')){var src=MIMI;if(page!=='index.html'&&page!=='blog.html'){var c=[].filter.call(document.images,function(i){return /(^|\/)img\/(?!logo)[\w-]+\.webp/i.test(i.getAttribute('src')||'')})[0];if(c)src=c.getAttribute('src')}
  var d=document.createElement('div');d.className='h5-pied';d.appendChild(holo(src,''));var pl=document.querySelector('.pied-legal');if(pl)pl.parentNode.insertBefore(d,pl);else document.body.appendChild(d)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();
/* === Entree / sortie hologramme (sauf pokemon.html) === */
(function(){
var page=(location.pathname.split('/').pop()||'index.html').toLowerCase();if(page==='pokemon.html')return;
var H=document.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches;if(RM)return;
H.classList.add('h5-in');setTimeout(function(){H.classList.remove('h5-in')},900);
addEventListener('pageshow',function(e){if(e.persisted)H.classList.remove('h5-out')});
document.addEventListener('click',function(e){if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;var a=e.target.closest&&e.target.closest('a[href]');if(!a||a.target&&a.target!=='_self'||a.hasAttribute('download'))return;
 var u;try{u=new URL(a.href,location.href)}catch(x){return}if(u.origin!==location.origin||(u.pathname===location.pathname&&u.hash))return;if(u.href===location.href)return;
 e.preventDefault();H.classList.add('h5-out');setTimeout(function(){location.href=u.href},280)});
})();
/* Sous-rubrique : flyout droite/gauche + hauteur viewport (menus compacts) */
(function(){
function fitSous(sm, anchorTop){
  if(!sm) return;
  /* Pas de max-height / scrollbar : menus compacts + colonnes côté CSS */
  sm.classList.remove('sm-scroll');
  sm.style.maxHeight = '';
  sm.style.overflow = '';
}
function init(){
  document.querySelectorAll('.sm-groupe').forEach(function(g){
    var b=g.querySelector(':scope > .sm-tog') || g.querySelector('.sm-tog');
    var s=g.querySelector(':scope > .sm-sous') || g.querySelector('.sm-sous');
    if(!b||!s)return;
    function cote(){
      var d=window.innerWidth>600;
      var gc=false;
      if(d){
        var rr=g.getBoundingClientRect();
        var need=(s.offsetWidth||160)+8;
        gc=(rr.right+need>window.innerWidth-8)&&(rr.left-8>=need);
      }
      g.classList.toggle('sm-gauche', gc);
      var f=g.querySelector(':scope > .sm-tog .sm-fl') || g.querySelector('.sm-fl');
      if(f){ f.textContent = gc ? '\u25C2' : '\u25B8'; }
      fitSous(s, b.getBoundingClientRect().top);
      ['position','left','right','top','bottom','transform','width','max-width','columns','column-gap','visibility','opacity','pointer-events','display'].forEach(function(p){ s.style.removeProperty(p); });
    }
    cote();
    window.addEventListener('resize', cote);
    var closeTimer=null;
    var CLOSE_MS=150;
    function openG(){
      if(closeTimer){ clearTimeout(closeTimer); closeTimer=null; }
      g.classList.add('sm-ouvert');
      b.setAttribute('aria-expanded','true');
      cote();
    }
    function scheduleClose(){
      if(closeTimer) clearTimeout(closeTimer);
      closeTimer=setTimeout(function(){
        /* ne ferme pas si le pointeur est encore sur le groupe ou son flyout */
        if(g.matches(':hover') || s.matches(':hover')){ closeTimer=null; return; }
        g.classList.remove('sm-ouvert');
        b.setAttribute('aria-expanded','false');
        closeTimer=null;
      }, CLOSE_MS);
    }
    g.addEventListener('mouseenter', openG);
    s.addEventListener('mouseenter', openG);
    g.addEventListener('mouseleave', scheduleClose);
    s.addEventListener('mouseleave', scheduleClose);
    b.addEventListener('click', function(e){
      e.preventDefault(); e.stopPropagation();
      if(g.classList.contains('sm-ouvert')){
        g.classList.remove('sm-ouvert'); b.setAttribute('aria-expanded','false');
      } else {
        openG();
      }
    });
  });
  function fitTop(){
    document.querySelectorAll('nav ul.menu-principal>li>ul.sous-menu').forEach(function(sm){
      var li=sm.parentElement, r=li.getBoundingClientRect();
      fitSous(sm, r.bottom + 4);
    });
  }
  fitTop();
  window.addEventListener('resize', fitTop);
  document.querySelectorAll('nav ul.menu-principal>li').forEach(function(li){
    li.addEventListener('mouseenter', fitTop);
  });
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* menu-vendre : le sous-menu « Vendre sur eBay » s'ouvre dans l'espace libre, au-dessus de tout */
(function(){
 var css='@media (min-width:1000px){'+
 'nav ul.menu-principal>li.li-vendre{position:relative}'+
 'nav ul.menu-principal>li.li-vendre>ul.sous-menu{z-index:2147483000!important}'+
 'nav ul.menu-principal>li.li-vendre.v-droite>ul.sous-menu{left:auto!important;right:0!important}'+
 'header:has(li.li-vendre:hover),header:has(li.li-vendre:focus-within),header:has(li.li-vendre .ouvre-sous[aria-expanded=true]),nav:has(li.li-vendre:hover),nav:has(li.li-vendre:focus-within){z-index:2147483000!important}'+
 '}';
 var st=document.createElement('style');st.id='menu-vendre-css';st.textContent=css;document.head.appendChild(st);
 function place(){var a=document.querySelector('nav ul.menu-principal>li>a[href="vendre.html"]');if(!a)return;var li=a.parentElement;li.classList.add('li-vendre');
  li.classList.remove('v-droite');if(innerWidth<1000)return;
  var r=li.getBoundingClientRect(),sm=li.querySelector('ul.sous-menu'),w=sm?Math.max(sm.scrollWidth,340):340;
  if(r.left+w>innerWidth-16)li.classList.add('v-droite');}
 if(document.readyState!=='loading')place();else document.addEventListener('DOMContentLoaded',place);
 addEventListener('load',place);addEventListener('resize',place);
})();

/* Bouton haut de page — bas gauche, au-dessus de #fen-com si présent */
(function(){
 if(document.getElementById('btn-haut'))return;
 var css=
 '#btn-haut-wrap{position:fixed;left:1rem;bottom:1.2rem;z-index:8500;display:flex;flex-direction:column;align-items:center;gap:4px;opacity:0;pointer-events:none;transform:translateY(8px);transition:opacity .2s,transform .2s,bottom .2s}'+
 '#btn-haut-wrap.on{opacity:1;pointer-events:auto;transform:none}'+
 '#btn-haut-lab{margin:0;padding:0;border:0;background:transparent!important;box-shadow:none!important;cursor:pointer;font:900 18px/1.15 "Source Sans 3",Arial,sans-serif;color:#0b3d91!important;-webkit-text-fill-color:#0b3d91!important;opacity:1!important;letter-spacing:.5px;white-space:nowrap;-webkit-text-stroke:1px #fff;paint-order:stroke fill;text-shadow:0 0 3px #fff,0 0 6px #fff,0 0 10px #fff,0 0 14px rgba(10,88,202,.55),0 0 22px rgba(11,61,145,.4)}'+
 '#btn-haut-wrap #btn-haut{width:2.85rem;height:2.85rem;border:0;border-radius:999px;cursor:pointer;font:900 1.35rem/1 "Source Sans 3",Arial,sans-serif;color:#fff!important;-webkit-text-fill-color:#fff!important;background:linear-gradient(180deg,#0a58ca,#0b3d91)!important;box-shadow:0 4px 16px rgba(11,61,145,.5);display:flex;align-items:center;justify-content:center;padding:0}'+
 '#btn-haut:hover,#btn-haut-lab:hover{filter:brightness(1.08)}'+
 '@media(max-width:500px){#btn-haut-wrap{left:.7rem}#btn-haut-wrap #btn-haut{width:2.6rem;height:2.6rem}#btn-haut-lab{font-size:16px}}';
 var st=document.createElement('style');st.id='btn-haut-css';st.textContent=css;document.head.appendChild(st);
 var w=document.createElement('div');w.id='btn-haut-wrap';
 var lab=document.createElement('button');lab.type='button';lab.id='btn-haut-lab';lab.textContent='Haut de page';lab.title='Haut de page';lab.setAttribute('aria-label','Haut de page');
 var b=document.createElement('button');b.type='button';b.id='btn-haut';b.title='Haut de page';b.setAttribute('aria-label','Haut de page');b.textContent='\u2191';
 w.appendChild(lab);w.appendChild(b);document.body.appendChild(w);
 function go(){scrollTo({top:0,behavior:'smooth'})}
 lab.addEventListener('click',go);b.addEventListener('click',go);
 function place(){var bot=18,fc=document.getElementById('fen-com');
  if(fc){var r=fc.getBoundingClientRect(),cs=getComputedStyle(fc);if(cs.display!=='none'&&cs.visibility!=='hidden'&&r.height>10)bot=Math.max(18,Math.round(innerHeight-r.top+10))}
  w.style.bottom=bot+'px'}
 function m(){w.classList.toggle('on',scrollY>120);place()}
 addEventListener('scroll',m,{passive:true});addEventListener('resize',place);m();
 new MutationObserver(place).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','hidden']});
})();


/* Grande barre de recherche dans l'en-tête (Génération 1 incluse). Le menu n'est pas réorganisé, seul un lien Génération 1 est ajouté à côté de Mewtwo. */
(function(){
  "use strict";
  if (window.__barreRechercheSite) return;
  window.__barreRechercheSite = 1;

  var CSS = ''
    + 'form.barre-recherche-site{flex:1 1 360px;max-width:740px;min-width:min(100%,260px);position:relative;margin:0;}'
    + 'form.barre-recherche-site .brs-ligne{display:flex;align-items:stretch;width:100%;}'
    + 'form.barre-recherche-site input[type="search"]{flex:1 1 auto;width:100%;font:600 1.05rem/1.3 "Source Sans 3","Helvetica Neue",Arial,sans-serif;color:#111;padding:12px 18px;border:2px solid #111;border-right:0;border-radius:999px 0 0 999px;background:#fff;min-height:48px;-webkit-appearance:none;appearance:none;}'
    + 'form.barre-recherche-site input[type="search"]:focus{outline:none;box-shadow:0 0 0 3px rgba(208,2,27,.2);}'
    + 'form.barre-recherche-site button[type="submit"]{flex:none;font:700 .75rem "Source Sans 3",Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:0 18px;border:2px solid #111;border-radius:0 999px 999px 0;background:#111;color:#fff;cursor:pointer;min-height:48px;}'
    + 'form.barre-recherche-site button[type="submit"]:hover{background:#d0021b;border-color:#d0021b;}'
    + 'form.barre-recherche-site .brs-liste{position:absolute;left:0;right:0;top:calc(100% + 6px);z-index:2147483002;background:#fff;border:1px solid #111;border-radius:14px;box-shadow:0 12px 32px rgba(0,0,0,.18);max-height:min(70vh,420px);overflow:auto;padding:6px;}'
    + 'form.barre-recherche-site .brs-liste[hidden]{display:none!important;}'
    + 'form.barre-recherche-site .brs-liste a{display:block;padding:8px 10px;border-radius:10px;text-decoration:none;color:#111;}'
    + 'form.barre-recherche-site .brs-liste a:hover,form.barre-recherche-site .brs-liste a[aria-selected="true"]{background:#f6f5f2;}'
    + 'form.barre-recherche-site .brs-liste a b{display:block;font:700 1rem "Bodoni Moda",Georgia,serif;}'
    + 'form.barre-recherche-site .brs-liste a span{display:block;font-size:.78rem;color:#5a5a5a;}'
    + 'form.barre-recherche-site .brs-vide{padding:10px 12px;color:#5a5a5a;font-size:.9rem;}'
    + 'form.barre-recherche-site .brs-lg{display:inline-block;font:700 .62rem "Source Sans 3",Arial,sans-serif;letter-spacing:.08em;border:1px solid #111;padding:0 5px;margin-right:6px;}'
    + '@media (max-width:800px){form.barre-recherche-site{flex:1 1 100%;max-width:none;order:3;}}';

  function el(tag, attrs, txt){
    var e=document.createElement(tag);
    for (var k in attrs||{}) e.setAttribute(k, attrs[k]);
    if (txt!=null) e.textContent=txt;
    return e;
  }
  function norm(s){
    return String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  }
  function hrefCarte(c){
    return "carte-pikachu.html?pkmn="+encodeURIComponent(c.pkmn||"pikachu")+"&lang="+encodeURIComponent(c.l||"fr")+"&id="+encodeURIComponent(c.id);
  }
  function filtrer(q){
    q=norm(q);
    if(!q||q.length<1) return [];
    var src=window.RECH_CARTES||[];
    var out=[];
    for(var i=0;i<src.length;i++){
      var c=src[i];
      var blob=[c.nom,c.serie,c.num,c.r,c.id,c.l].concat(c.al||[]).join(" ");
      if(norm(blob).indexOf(q)!==-1) out.push(c);
      if(out.length>=12) break;
    }
    return out;
  }

  function chargerIndex(cb){
    if(window.RECH_CARTES && window.RECH_CARTES.length && window.__rechCartesPret){ cb(); return; }
    if(window.__barreRechercheChargement){ window.__barreRechercheChargement.push(cb); return; }
    window.__barreRechercheChargement=[cb];
    function fini(){
      window.__rechCartesPret=1;
      var q=window.__barreRechercheChargement||[];
      window.__barreRechercheChargement=null;
      q.forEach(function(fn){ try{fn();}catch(e){} });
    }
    var s=document.createElement("script");
    s.src="recherche-cartes-pkmn.js";
    s.onload=function(){
      if(window.RECH_CARTES && window.RECH_CARTES.length){ fini(); return; }
      var s2=document.createElement("script");
      s2.src="recherche-cartes-pikachu.js";
      s2.onload=fini;
      s2.onerror=fini;
      document.head.appendChild(s2);
    };
    s.onerror=function(){
      var s2=document.createElement("script");
      s2.src="recherche-cartes-pikachu.js";
      s2.onload=fini;
      s2.onerror=fini;
      document.head.appendChild(s2);
    };
    document.head.appendChild(s);
  }

  function monter(){
    if(document.getElementById("barre-recherche-site")) return;
    var nav=document.querySelector("nav.sitenav, header nav.top, header.site nav");
    if(!nav) return;
    if(!document.getElementById("barre-recherche-css")){
      var st=document.createElement("style");
      st.id="barre-recherche-css";
      st.textContent=CSS;
      document.head.appendChild(st);
    }
    var form=el("form",{id:"barre-recherche-site","class":"barre-recherche-site",role:"search",action:"cartes-generation-1.html",method:"get"});
    var ligne=el("div",{"class":"brs-ligne"});
    var input=el("input",{type:"search",name:"q",placeholder:"Rechercher une carte (Génération 1)…","aria-label":"Rechercher une carte de la première génération",autocomplete:"off","aria-autocomplete":"list","aria-controls":"barre-recherche-liste"});
    var btn=el("button",{type:"submit"},"Rechercher");
    var liste=el("div",{id:"barre-recherche-liste","class":"brs-liste",role:"listbox",hidden:"hidden"});
    ligne.append(input, btn);
    form.append(ligne, liste);

    var logo=nav.querySelector("a.logo");
    if(logo&&logo.nextSibling) nav.insertBefore(form, logo.nextSibling);
    else nav.insertBefore(form, nav.querySelector("ul.menu-principal")||nav.firstChild);

    var actif=-1;
    function fermer(){ liste.hidden=true; liste.innerHTML=""; actif=-1; }
    function rendre(){
      var q=input.value;
      if(!String(q).trim()){ fermer(); return; }
      chargerIndex(function(){
        if(input.value!==q) return;
        var res=filtrer(q);
        liste.innerHTML="";
        if(!res.length){
          var v=el("div",{"class":"brs-vide"},"Aucune carte ne correspond. Essayez un nom, une extension ou un numéro.");
          liste.appendChild(v);
        } else {
          res.forEach(function(c,i){
            var a=el("a",{href:hrefCarte(c),role:"option",id:"brs-opt-"+i});
            a.setAttribute("aria-selected","false");
            var b=el("b");
            b.appendChild(el("span",{"class":"brs-lg"},String(c.l||"").toUpperCase()));
            b.appendChild(document.createTextNode(c.nom||c.pkmn||"Carte"));
            var sp=el("span",null, [c.serie, c.num?("n° "+c.num):""].filter(Boolean).join(" · "));
            a.append(b,sp);
            liste.appendChild(a);
          });
        }
        liste.hidden=false;
        actif=-1;
      });
    }
    input.addEventListener("input", rendre);
    input.addEventListener("focus", function(){ if(input.value) rendre(); });
    form.addEventListener("submit", function(e){
      var q=input.value;
      var res=(window.RECH_CARTES && String(q).trim()) ? filtrer(q) : [];
      if(res.length===1){
        e.preventDefault();
        location.href=hrefCarte(res[0]);
        return;
      }
      if(res.length>1){
        var slug=res[0].pkmn||"pikachu";
        var meme=res.every(function(c){ return (c.pkmn||"pikachu")===slug; });
        if(meme) form.action="cartes-"+slug+"-ventes.html";
        else {
          e.preventDefault();
          rendre();
        }
      }
    });
    input.addEventListener("keydown", function(e){
      var opts=liste.querySelectorAll("a[href]");
      if(e.key==="Escape"){ fermer(); return; }
      if(e.key==="ArrowDown" && opts.length){
        e.preventDefault();
        actif=Math.min(opts.length-1, actif+1);
        opts.forEach(function(o,i){ o.setAttribute("aria-selected", i===actif?"true":"false"); });
        if(opts[actif]) opts[actif].scrollIntoView({block:"nearest"});
      } else if(e.key==="ArrowUp" && opts.length){
        e.preventDefault();
        actif=Math.max(0, actif-1);
        opts.forEach(function(o,i){ o.setAttribute("aria-selected", i===actif?"true":"false"); });
      } else if(e.key==="Enter" && actif>=0 && opts[actif]){
        e.preventDefault();
        location.href=opts[actif].href;
      }
    });
    document.addEventListener("click", function(e){ if(!form.contains(e.target)) fermer(); });
  }

  function go(){ try{ monter(); }catch(e){ console.error(e); } }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", go);
  else go();
})();

/* Affiliation eBay Partner Network (campid 5339225196) : liens des ventes et bouton annonces en cours */
(function(){
  "use strict";
  var CAMPID = "5339225196";
  var PAGE = (location.pathname.split("/").pop() || "").toLowerCase();

  function estPageVentes(){
    return /^cartes-[a-z0-9-]+-ventes\.html$/.test(PAGE) || PAGE === "carte-pikachu.html";
  }

  function slugPage(){
    try {
      var q = new URLSearchParams(location.search).get("pkmn");
      if (q) return String(q).toLowerCase().replace(/[^a-z0-9-]/g, "");
    } catch (e) {}
    var m = PAGE.match(/^cartes-([a-z0-9-]+)-ventes\.html$/);
    return m ? m[1] : "";
  }

  function estEbayFr(host){
    host = String(host || "").toLowerCase().replace(/^www\./, "");
    return host === "ebay.fr";
  }

  function estEbay(host){
    host = String(host || "").toLowerCase().replace(/^www\./, "");
    return host === "ebay.com" || host === "ebay.fr" || /\.ebay\.(com|fr)$/.test(host);
  }

  function paramsAffilie(isFr, customid){
    var mkrid = isFr ? "709-53476-19255-0" : "711-53200-19255-0";
    var siteid = isFr ? "71" : "0";
    var cid = encodeURIComponent(customid || "");
    return "mkcid=1&mkrid=" + mkrid + "&siteid=" + siteid + "&campid=" + CAMPID + "&customid=" + cid + "&toolid=10001&mkevt=1";
  }

  function affilier(url, customid){
    if (!url) return url;
    var u;
    try { u = new URL(url, location.href); }
    catch (e) { return url; }
    if (!estEbay(u.hostname)) return url;
    var isFr = estEbayFr(u.hostname);
    ["mkcid","mkrid","siteid","campid","customid","toolid","mkevt"].forEach(function(k){ u.searchParams.delete(k); });
    var parts = paramsAffilie(isFr, customid).split("&");
    parts.forEach(function(p){
      var i = p.indexOf("=");
      if (i > 0) u.searchParams.set(p.slice(0, i), decodeURIComponent(p.slice(i + 1)));
    });
    return u.toString();
  }

  function rechercheEnCours(query, customid){
    var nkw = encodeURIComponent(String(query || "").trim()).replace(/%2F/gi, "/");
    return "https://www.ebay.fr/sch/i.html?_nkw=" + nkw + "&" + paramsAffilie(true, customid);
  }

  window.mimiquiEbaySlug = slugPage;
  window.mimiquiEbayAffilier = affilier;
  window.mimiquiEbayRecherche = rechercheEnCours;

  function requeteNomNumero(texte){
    var t = String(texte || "").replace(/\s+/g, " ").trim();
    if (!t) return "";
    var nom = t.split("·")[0].trim();
    var m = t.match(/n°\s*(\S+)/i);
    return (nom + (m ? " " + m[1] : "")).trim();
  }

  function boutonEnCours(query, slug){
    var a = document.createElement("a");
    a.className = "btn-encours";
    a.textContent = "Voir les annonces en cours sur eBay";
    a.href = rechercheEnCours(query, "encours-" + slug);
    a.target = "_blank";
    a.rel = "sponsored noopener";
    return a;
  }

  var enCours = false;
  function enrichir(){
    if (!estPageVentes() || enCours) return;
    var slug = slugPage();
    if (!slug) return;
    enCours = true;
    try {
      document.querySelectorAll("a.lv-lien").forEach(function(a){
        var raw = a.getAttribute("href") || a.href;
        if (!raw) return;
        var deja = raw.indexOf("campid=" + CAMPID) !== -1;
        if (a.dataset.affilie === "1" && deja) return;
        a.href = affilier(raw, "ventes-" + slug);
        a.target = "_blank";
        a.rel = "sponsored noopener";
        a.dataset.affilie = "1";
      });

      document.querySelectorAll(".liste-ventes li").forEach(function(li){
        if (li.querySelector("a.btn-encours")) return;
        if (li.closest("#ventes")) return;
        var tit = li.querySelector(".lv-titre");
        if (!tit) return;
        if (!/n°\s*\S+/i.test(tit.textContent || "")) return;
        var q = requeteNomNumero(tit.textContent);
        if (!q) return;
        var mid = tit.parentElement || li;
        mid.appendChild(boutonEnCours(q, slug));
      });

      document.querySelectorAll("a.tuile").forEach(function(a){
        if (a.parentElement && a.parentElement.classList.contains("tuile-bloc")) return;
        var h = a.querySelector("h3");
        var meta = a.querySelector(".meta");
        var nom = h ? h.textContent.trim() : "";
        var num = "";
        if (meta) {
          var m = meta.textContent.match(/n°\s*(\S+)/i);
          if (m) num = m[1];
        }
        var q = (nom + (num ? " " + num : "")).trim();
        if (!q) return;
        var wrap = document.createElement("div");
        wrap.className = "tuile-bloc";
        a.parentNode.insertBefore(wrap, a);
        wrap.appendChild(a);
        wrap.appendChild(boutonEnCours(q, slug));
      });

      var btnVentes = document.getElementById("btn-ventes");
      if (btnVentes && !document.getElementById("btn-encours")) {
        var h1 = document.querySelector(".fiche-info h1");
        var meta = document.querySelector(".fiche-info .meta");
        var nom = h1 ? h1.textContent.trim() : "";
        var num = "";
        if (meta) {
          var m = meta.textContent.match(/n°\s*(\S+)/i);
          if (m) num = m[1];
        }
        var q = (nom + (num ? " " + num : "")).trim();
        if (q) {
          var b = boutonEnCours(q, slug);
          b.id = "btn-encours";
          btnVentes.insertAdjacentElement("afterend", b);
        }
      }
    } finally {
      enCours = false;
    }
  }

  function demarrer(){
    if (!estPageVentes()) return;
    enrichir();
    if (window.MutationObserver && document.body) {
      var obs = new MutationObserver(function(){ enrichir(); });
      obs.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();
})();
