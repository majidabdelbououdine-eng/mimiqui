var __acc=/(\/|\/index\.html?)$/i.test(location.pathname);
/* site-commun.js : menu, hamburger, fil d'Ariane, pied de page (Le Coin de Mimiqui) */

/* Cloudflare Web Analytics (jeton public, mesure d'audience sans cookie) */
(function(){if(document.querySelector('script[data-cf-beacon]'))return;var s=document.createElement('script');s.defer=true;s.src='https://static.cloudflareinsights.com/beacon.min.js';s.setAttribute('data-cf-beacon','{"token":"fb91e56b56b94a10a05b89652de23f97"}');(document.head||document.documentElement).appendChild(s);})();


/* echelle site ~90% cumulé v2 */
(function(){if(document.getElementById('echelle-site'))return;var s=document.createElement('style');s.id='echelle-site';s.textContent='html{font-size:106%!important}';(document.head||document.documentElement).appendChild(s);})();

/* effets holographiques (holo.css / holo.js) */
(function(){if(document.getElementById('holo-css'))return;var v='20261120d';var l=document.createElement('link');l.id='holo-css';l.rel='stylesheet';l.href='holo.css?v='+v;(document.head||document.documentElement).appendChild(l);var s=document.createElement('script');s.id='holo-js';s.src='holo.js?v='+v;s.defer=true;(document.head||document.documentElement).appendChild(s);})();
/* maquette-pro : surcharge chargee apres holo.css */
(function(){var v='20261120d';function go(){if(document.getElementById('maquette-pro-css'))return;var l=document.createElement('link');l.id='maquette-pro-css';l.rel='stylesheet';l.href='maquette-pro.css?v='+v;var h=document.getElementById('holo-css');if(h&&h.parentNode){if(h.nextSibling)h.parentNode.insertBefore(l,h.nextSibling);else h.parentNode.appendChild(l);}else{(document.head||document.documentElement).appendChild(l);}}go();if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);setTimeout(go,50);})();
/* i18n FR / EN / JA */
(function(){if(document.getElementById('i18n-js'))return;var v='20261120d';var page=(location.pathname.split('/').pop()||'index.html').toLowerCase();var lang='fr';try{var q=new URLSearchParams(location.search);var l=q.get('uilang')||((page!=='carte-pikachu.html')?q.get('lang'):'')||localStorage.getItem('mimiqui-lang')||'fr';if(/^(fr|en|ja)$/.test(l))lang=l;}catch(e){}document.documentElement.setAttribute('lang',lang==='ja'?'ja':lang==='en'?'en':'fr');if(lang!=='fr'){var h=document.createElement('style');h.id='i18n-hide';h.textContent='html:not(.i18n-ready) body{opacity:0}';(document.head||document.documentElement).appendChild(h);setTimeout(function(){var x=document.getElementById('i18n-hide');if(x&&x.parentNode)x.parentNode.removeChild(x);document.documentElement.classList.add('i18n-ready');},400);}function add(src,id){var s=document.createElement('script');s.id=id;s.src=src;s.async=false;(document.head||document.documentElement).appendChild(s);}if(lang==='en')add('i18n-en.js?v='+v,'i18n-en');if(lang==='ja')add('i18n-ja.js?v='+v,'i18n-ja');add('i18n.js?v='+v,'i18n-js');})();

(function(){
  "use strict";
  var page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(page==='accueil.html')page='index.html';

  var SITE_CACHE="20261120d";
  var EBAY_ENCOURS="https://www.ebay.fr/sch/i.html?_nkw=carte%20Pok%C3%A9mon&mkcid=1&mkrid=709-53476-19255-0&siteid=71&campid=5339225196&customid=encours-menu&toolid=10001&mkevt=1";
  var SERIES_MEGA=[
    {t:"Poings Fluides",s:[["Page du set (à venir, 6 fév. 2027)","poings-fluides.html"]]},
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
  var PAGES_SERIES=["poings-fluides.html","regne-delta.html","regne-delta-ja.html","equilibre-parfait-ventes.html","equilibre-parfait-ja.html","equilibre-parfait-en.html","equilibre-parfait.html","trentieme-anniversaire-ventes.html","trentieme-anniversaire-en.html","trentieme-anniversaire.html","heros-transcendants.html","heros-transcendants-en.html","nuit-noire-ventes.html","nuit-noire-ja.html","nuit-noire-en.html","mega-evolution-cartes.html","mega-evolution-en.html","heros-fantasmagoriques.html","flammes-fantasmagoriques-ja.html","flammes-fantasmagoriques-en.html","chaos-ascendant-ventes.html","chaos-ascendant-ja.html","chaos-ascendant-en.html","chaos-ascendant.html","ecarlate-violet.html","evolutions-paldea.html","flammes-obsidiennes.html","ecarlate-violet-151.html","destinees-de-paldea.html","destinees-de-paldea-en.html","destinees-de-paldea-ja.html","ecarlate-violet-151-en.html","ecarlate-violet-151-ja.html","flammes-obsidiennes-en.html","flammes-obsidiennes-ja.html","evolutions-paldea-en.html","evolutions-paldea-ja.html","ecarlate-violet-en.html","ecarlate-violet-ja.html","couronne-stellaire.html","couronne-stellaire-en.html","couronne-stellaire-ja.html","etincelles-deferlantes.html","etincelles-deferlantes-en.html","etincelles-deferlantes-ja.html","faille-paradoxe.html","faille-paradoxe-en.html","faille-paradoxe-ja.html","flamme-blanche.html","flamme-blanche-en.html","flamme-blanche-ja.html","aventures-ensemble.html","aventures-ensemble-en.html","aventures-ensemble-ja.html","evolutions-prismatiques.html","evolutions-prismatiques-en.html","evolutions-prismatiques-ja.html","rivalites-destinees.html","rivalites-destinees-en.html","rivalites-destinees-ja.html","forces-temporelles.html","forces-temporelles-en.html","forces-temporelles-ja.html","mascarade-crepusculaire.html","mascarade-crepusculaire-en.html","mascarade-crepusculaire-ja.html","fable-nebuleuse.html","fable-nebuleuse-en.html","fable-nebuleuse-ja.html","foudre-noire.html","foudre-noire-en.html","foudre-noire-ja.html"];
  var SECTIONS=[
    {t:"Accueil",h:"index.html",p:["index.html"]},
    {t:"Spécial mimiqui",h:"cartes.html",p:["cartes.html","cartes-anglaises.html","cartes-japonaises.html"],s:[
      ["Cartes FR","cartes.html"],["Cartes EN","cartes-anglaises.html"],["Cartes JA","cartes-japonaises.html"]
    ]},
    {t:"Cartes",h:"cartes-pokemon.html",p:["cartes-pokemon.html","pokemon.html"].concat(PAGES_SERIES),s:[
      ["Cartes Pokémon / séries","cartes-pokemon.html"]
    ]},
    {t:"Pokémon",h:"cartes-generation-1.html",p:["cartes-generation-1.html","cartes-pikachu-ventes.html","cartes-dracaufeu-ventes.html","cartes-evoli-ventes.html","cartes-mewtwo-ventes.html","carte-pikachu.html"],s:[
      ["Pikachu","cartes-pikachu-ventes.html"],["Dracaufeu","cartes-dracaufeu-ventes.html"],["Évoli","cartes-evoli-ventes.html"],["Mewtwo","cartes-mewtwo-ventes.html"],["Génération 1","cartes-generation-1.html"],["1025 Pokémon","cartes-pokemon.html"]
    ]},
    {t:"Prix",h:"top-ventes.html",p:["cotes-series.html","top-ventes-semaine.html","top-ventes.html","cartes-gradees.html","registre.html","archive-ventes.html","registre-pokemon.html"],s:[
      ["Top ventes","top-ventes.html"],["Cartes gradées PSA","cartes-gradees.html"],["Ventes passées Mimiqui","registre.html"],["Cartes Pokémon passées, par type","registre-pokemon.html"]
    ]},
    {t:"Acheter",h:"boutique.html",p:["boutique.html","bonnes-affaires.html","acheter-par-serie.html","displays-etb.html","precommandes.html","cartes-psa10.html","guide-acheteur.html","conseils-ebay.html"],s:[
      ["Boutique","boutique.html"],["Bonnes affaires eBay","bonnes-affaires.html"],["Acheter par série","acheter-par-serie.html"],["Displays et ETB","displays-etb.html"],["Boosters","jeu.html#boosters"],["Précommandes","precommandes.html"],["Annonces eBay en cours",EBAY_ENCOURS],["Cartes PSA 10","cartes-psa10.html"],["Guide de l’acheteur","guide-acheteur.html"],["Conseils eBay","conseils-ebay.html"]
    ]},
    {t:"Vendre",h:"vendre.html",p:["vendre.html","estimer-ma-carte.html","guide-vendre-ebay.html","conseils-ebay.html"],s:[
      ["Conseils eBay","conseils-ebay.html"],["Estimer ma carte","estimer-ma-carte.html"],["Guide pour vendre sur eBay","guide-vendre-ebay.html"],["Vendre sur eBay","vendre.html"]
    ]},
    {t:"Conseils achat",h:"conseils-achat.html",p:["conseils-achat.html"],s:[["#001 Bulbizarre","conseils-achat.html#p001"],["#002 Herbizarre","conseils-achat.html#p002"],["#003 Florizarre","conseils-achat.html#p003"],["#004 Salamèche","conseils-achat.html#p004"],["#005 Reptincel","conseils-achat.html#p005"],["#006 Dracaufeu","conseils-achat.html#p006"],["#007 Carapuce","conseils-achat.html#p007"],["#008 Carabaffe","conseils-achat.html#p008"],["#009 Tortank","conseils-achat.html#p009"],["#010 Chenipan","conseils-achat.html#p010"],["#011 Chrysacier","conseils-achat.html#p011"],["#012 Papilusion","conseils-achat.html#p012"],["#013 Aspicot","conseils-achat.html#p013"],["#014 Coconfort","conseils-achat.html#p014"],["#015 Dardargnan","conseils-achat.html#p015"],["#016 Roucool","conseils-achat.html#p016"],["#017 Roucoups","conseils-achat.html#p017"],["#018 Roucarnage","conseils-achat.html#p018"],["#019 Rattata","conseils-achat.html#p019"],["#020 Rattatac","conseils-achat.html#p020"],["#021 Piafabec","conseils-achat.html#p021"],["#022 Rapasdepic","conseils-achat.html#p022"],["#023 Abo","conseils-achat.html#p023"],["#024 Arbok","conseils-achat.html#p024"],["#025 Pikachu","conseils-achat.html#p025"],["#026 Raichu","conseils-achat.html#p026"],["#027 Sabelette","conseils-achat.html#p027"],["#028 Sablaireau","conseils-achat.html#p028"],["#029 Nidoran♀","conseils-achat.html#p029"],["#030 Nidorina","conseils-achat.html#p030"],["#031 Nidoqueen","conseils-achat.html#p031"],["#032 Nidoran♂","conseils-achat.html#p032"],["#033 Nidorino","conseils-achat.html#p033"],["#034 Nidoking","conseils-achat.html#p034"],["#035 Mélofée","conseils-achat.html#p035"],["#036 Mélodelfe","conseils-achat.html#p036"],["#037 Goupix","conseils-achat.html#p037"],["#038 Feunard","conseils-achat.html#p038"],["#039 Rondoudou","conseils-achat.html#p039"],["#040 Grodoudou","conseils-achat.html#p040"],["#041 Nosferapti","conseils-achat.html#p041"],["#042 Nosferalto","conseils-achat.html#p042"],["#043 Mystherbe","conseils-achat.html#p043"],["#044 Ortide","conseils-achat.html#p044"],["#045 Rafflesia","conseils-achat.html#p045"],["#046 Paras","conseils-achat.html#p046"],["#047 Parasect","conseils-achat.html#p047"],["#048 Mimitoss","conseils-achat.html#p048"],["#049 Aéromite","conseils-achat.html#p049"],["#050 Taupiqueur","conseils-achat.html#p050"],["#051 Triopikeur","conseils-achat.html#p051"],["#052 Miaouss","conseils-achat.html#p052"],["#053 Persian","conseils-achat.html#p053"],["#054 Psykokwak","conseils-achat.html#p054"],["#055 Akwakwak","conseils-achat.html#p055"],["#056 Férosinge","conseils-achat.html#p056"],["#057 Colossinge","conseils-achat.html#p057"],["#058 Caninos","conseils-achat.html#p058"],["#059 Arcanin","conseils-achat.html#p059"],["#060 Ptitard","conseils-achat.html#p060"],["#061 Têtarte","conseils-achat.html#p061"],["#062 Tartard","conseils-achat.html#p062"],["#063 Abra","conseils-achat.html#p063"],["#064 Kadabra","conseils-achat.html#p064"],["#065 Alakazam","conseils-achat.html#p065"],["#066 Machoc","conseils-achat.html#p066"],["#067 Machopeur","conseils-achat.html#p067"],["#068 Mackogneur","conseils-achat.html#p068"],["#069 Chétiflor","conseils-achat.html#p069"],["#070 Boustiflor","conseils-achat.html#p070"],["#071 Empiflor","conseils-achat.html#p071"],["#072 Tentacool","conseils-achat.html#p072"],["#073 Tentacruel","conseils-achat.html#p073"],["#074 Racaillou","conseils-achat.html#p074"],["#075 Gravalanch","conseils-achat.html#p075"],["#076 Grolem","conseils-achat.html#p076"],["#077 Ponyta","conseils-achat.html#p077"],["#078 Galopa","conseils-achat.html#p078"],["#079 Ramoloss","conseils-achat.html#p079"],["#080 Flagadoss","conseils-achat.html#p080"],["#081 Magnéti","conseils-achat.html#p081"],["#082 Magnéton","conseils-achat.html#p082"],["#083 Canarticho","conseils-achat.html#p083"],["#084 Doduo","conseils-achat.html#p084"],["#085 Dodrio","conseils-achat.html#p085"],["#086 Otaria","conseils-achat.html#p086"],["#087 Lamantine","conseils-achat.html#p087"],["#088 Tadmorv","conseils-achat.html#p088"],["#089 Grotadmorv","conseils-achat.html#p089"],["#090 Kokiyas","conseils-achat.html#p090"],["#091 Crustabri","conseils-achat.html#p091"],["#092 Fantominus","conseils-achat.html#p092"],["#093 Spectrum","conseils-achat.html#p093"],["#094 Ectoplasma","conseils-achat.html#p094"],["#095 Onix","conseils-achat.html#p095"],["#096 Soporifik","conseils-achat.html#p096"],["#097 Hypnomade","conseils-achat.html#p097"],["#098 Krabby","conseils-achat.html#p098"],["#099 Krabboss","conseils-achat.html#p099"],["#100 Voltorbe","conseils-achat.html#p100"],["#101 Électrode","conseils-achat.html#p101"],["#102 Noeunoeuf","conseils-achat.html#p102"],["#103 Noadkoko","conseils-achat.html#p103"],["#104 Osselait","conseils-achat.html#p104"],["#105 Ossatueur","conseils-achat.html#p105"],["#106 Kicklee","conseils-achat.html#p106"],["#107 Tygnon","conseils-achat.html#p107"],["#108 Excelangue","conseils-achat.html#p108"],["#109 Smogo","conseils-achat.html#p109"],["#110 Smogogo","conseils-achat.html#p110"],["#111 Rhinocorne","conseils-achat.html#p111"],["#112 Rhinoféros","conseils-achat.html#p112"],["#113 Leveinard","conseils-achat.html#p113"],["#114 Saquedeneu","conseils-achat.html#p114"],["#115 Kangourex","conseils-achat.html#p115"],["#116 Hypotrempe","conseils-achat.html#p116"],["#117 Hypocéan","conseils-achat.html#p117"],["#118 Poissirène","conseils-achat.html#p118"],["#119 Poissoroy","conseils-achat.html#p119"],["#120 Stari","conseils-achat.html#p120"],["#121 Staross","conseils-achat.html#p121"],["#122 M. Mime","conseils-achat.html#p122"],["#123 Insécateur","conseils-achat.html#p123"],["#124 Lippoutou","conseils-achat.html#p124"],["#125 Élektek","conseils-achat.html#p125"],["#126 Magmar","conseils-achat.html#p126"],["#127 Scarabrute","conseils-achat.html#p127"],["#128 Tauros","conseils-achat.html#p128"],["#129 Magicarpe","conseils-achat.html#p129"],["#130 Léviator","conseils-achat.html#p130"],["#131 Lokhlass","conseils-achat.html#p131"],["#132 Métamorph","conseils-achat.html#p132"],["#133 Évoli","conseils-achat.html#p133"],["#134 Aquali","conseils-achat.html#p134"],["#135 Voltali","conseils-achat.html#p135"],["#136 Pyroli","conseils-achat.html#p136"],["#137 Porygon","conseils-achat.html#p137"],["#138 Amonita","conseils-achat.html#p138"],["#139 Amonistar","conseils-achat.html#p139"],["#140 Kabuto","conseils-achat.html#p140"],["#141 Kabutops","conseils-achat.html#p141"],["#142 Ptéra","conseils-achat.html#p142"],["#143 Ronflex","conseils-achat.html#p143"],["#144 Artikodin","conseils-achat.html#p144"],["#145 Électhor","conseils-achat.html#p145"],["#146 Sulfura","conseils-achat.html#p146"],["#147 Minidraco","conseils-achat.html#p147"],["#148 Draco","conseils-achat.html#p148"],["#149 Dracolosse","conseils-achat.html#p149"],["#150 Mewtwo","conseils-achat.html#p150"],["#151 Mew","conseils-achat.html#p151"]]},
    {t:"Conseils vente",h:"conseils-vente.html",p:["conseils-vente.html"]},
    {t:"Nouveautés",h:"nouveautes.html",p:["nouveautes.html","sets-a-venir.html"],s:[["Nouveautés","nouveautes.html"],["Sets à venir","sets-a-venir.html"],["Poings Fluides (à venir)","poings-fluides.html"]]},
    {t:"Blog",h:"blog.html",p:["blog.html"]},
    {t:"Mon compte",h:"mon-compte.html",p:["mon-compte.html"]}
  ];
  var AUTRES={"mon-compte.html":"Mon compte","confidentialite.html":"Cookies et vie privée","assistant-instagram.html":"Assistant Instagram","404.html":"Page introuvable","mentions-legales.html":"Mentions légales","conditions-abonnement.html":"Conditions d’abonnement","a-propos.html":"À propos / Contact","jeu.html":"Jeu"};
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
      if(sec.t==="Conseils achat") li.classList.add("li-conseils-achat");
      var a=el("a",{href:sec.h},sec.t);
      if(sec===cur){ li.classList.add("actif"); a.setAttribute("aria-current", (sec.s&&sec.s.length)?"true":"page"); }
      li.appendChild(a);
      if(sec.s && sec.s.length){
        var btn=el("button",{type:"button","class":"ouvre-sous","aria-expanded":"false","aria-label":"Sous-menu "+sec.t});
        btn.innerHTML="&#9662;";
        var sm=el("ul",{"class":"sous-menu"+(sec.t==="Conseils achat"?" sous-menu-conseils-achat":"")});
        if(sec.t==="Conseils achat"){
          var g=el("li",{"class":"sm-groupe sm-groupe-top1gen"});
          var tb=el("button",{type:"button","class":"sm-tog","aria-expanded":"false"});
          tb.appendChild(document.createTextNode("151 Pokémon 1er génération Le top "));
          tb.appendChild(el("span",{"class":"sm-fl","aria-hidden":"true"},"\u25B8"));
          var sous=el("ul",{"class":"liste-top1gen"});
          var liTop=el("li",{"class":"li-le-top-menu"});
          var bTop=el("button",{type:"button","class":"btn-le-top-menu","id":"btn-le-top-menu","aria-haspopup":"dialog","aria-controls":"dialog-le-top-site","aria-expanded":"false"});
          bTop.appendChild(document.createTextNode("Le top"));
          liTop.appendChild(bTop);
          sous.appendChild(liTop);
          sec.s.forEach(function(it){
            var x=el("li");
            x.appendChild(lienEbay(it[1], it[0]));
            sous.appendChild(x);
          });
          g.append(tb,sous);
          sm.appendChild(g);
          var liAchat=el("li",{"class":"li-achat-prix-bas"});
          liAchat.appendChild(el("a",{href:"conseils-achat.html"},"Achète au prix bas"));
          sm.appendChild(liAchat);
        } else {
        sec.s.forEach(function(it){
          if(sec.t==="Cartes" && it[1]==="cartes-pokemon.html"){
            groupeSeries(sm);
            return;
          }
          var x=el("li");
          x.appendChild(lienEbay(it[1], it[0]));
          sm.appendChild(x);
        });
        }
        sm.querySelectorAll("a").forEach(function(s){
          var raw=(s.getAttribute("href")||"");
          var href=raw.split("#")[0].toLowerCase();
          if(sec.t==="Conseils achat"){
            var h=raw.indexOf("#")>=0?raw.slice(raw.indexOf("#")):"";
            if(href===page && h && h===(location.hash||"")) s.setAttribute("aria-current","page");
          }else if(href===page) s.setAttribute("aria-current","page");
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
      ["Spécial mimiqui",[["Cartes FR","cartes.html"],["Cartes EN","cartes-anglaises.html"],["Cartes JA","cartes-japonaises.html"]]],
      ["Cartes",[["Cartes Pokémon / séries","cartes-pokemon.html"],["Génération 1","cartes-generation-1.html"]]],
      ["Pokémon",[["Pikachu","cartes-pikachu-ventes.html"],["Dracaufeu","cartes-dracaufeu-ventes.html"],["Évoli","cartes-evoli-ventes.html"],["Mewtwo","cartes-mewtwo-ventes.html"],["Génération 1","cartes-generation-1.html"],["1025 Pokémon","cartes-pokemon.html"]]],
      ["Prix",[["Top ventes","top-ventes.html"],["Cartes gradées PSA","cartes-gradees.html"],["Ventes passées Mimiqui","registre.html"],["Cartes Pokémon passées, par type","registre-pokemon.html"]]],
      ["Acheter et vendre",[["Boutique","boutique.html"],["Bonnes affaires eBay","bonnes-affaires.html"],["Acheter par série","acheter-par-serie.html"],["Displays et ETB","displays-etb.html"],["Boosters","jeu.html#boosters"],["Précommandes","precommandes.html"],["Annonces eBay en cours",EBAY_ENCOURS],["Cartes PSA 10","cartes-psa10.html"],["Guide de l’acheteur","guide-acheteur.html"],["Conseils eBay","conseils-ebay.html"],["Estimer ma carte","estimer-ma-carte.html"],["Guide pour vendre sur eBay","guide-vendre-ebay.html"],["Vendre sur eBay","vendre.html"]]],
      ["Découvrir",[["Nouveautés","nouveautes.html"],["Sets à venir","sets-a-venir.html"],["Blog","blog.html"],["Blog Instagram","https://www.instagram.com/lecoindemimiqui/"],["Jeu","jeu.html"],["Le film 2027","index.html#film"],["Le déguisement","index.html#deguisement"],["Faiblesses","index.html#types"]]],
      ["Le site",[["À propos / Contact","a-propos.html"],["Mon compte","mon-compte.html"],["Créer un compte","index.html#compte"],["Assistant Instagram","assistant-instagram.html"],["Cookies et vie privée","confidentialite.html"],["Mentions légales","mentions-legales.html"],["Conditions d’abonnement","conditions-abonnement.html"],["Liens affiliés","mentions-legales.html#liens"]]]
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
    s.src="recherche-cartes-data.js?v="+(typeof SITE_CACHE==="string"?SITE_CACHE:"20261112z");
    s.onload=function(){
      var fns=window.__rechChargement||[]; window.__rechChargement=null;
      try{ if(window.mimiquiPreparerRecherche) window.mimiquiPreparerRecherche(); }catch(e){}
      fns.forEach(function(fn){ try{fn(window.RECHERCHE_CARTES||{sets:[]});}catch(e){} });
    };
    s.onerror=function(){ window.__rechChargement=null; cb({sets:[]}); };
    document.head.appendChild(s);
  }

function normRech(s){
    return String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/œ/g,"oe").replace(/æ/g,"ae");
  }
  function rechMots(s){
    return normRech(s).split(/[^a-z0-9\u3040-\u30ff\u4e00-\u9fff]+/).filter(Boolean);
  }
  function rechDist(a,b,max){
    max=max||1;
    var n=a.length,m=b.length,d=n-m; if(d<0)d=-d; if(d>max) return max+1;
    if(!n) return m; if(!m) return n;
    var prev=new Array(m+1), cur=new Array(m+1), i,j,k,minv,tmp;
    for(j=0;j<=m;j++) prev[j]=j;
    for(i=1;i<=n;i++){
      cur[0]=i; minv=cur[0];
      for(j=1;j<=m;j++){
        k=prev[j-1]+(a.charAt(i-1)===b.charAt(j-1)?0:1);
        if(prev[j]+1<k)k=prev[j]+1;
        if(cur[j-1]+1<k)k=cur[j-1]+1;
        cur[j]=k; if(k<minv)minv=k;
      }
      if(minv>max) return max+1;
      tmp=prev; prev=cur; cur=tmp;
    }
    return prev[m];
  }
  function rechTokenDans(tok, mots, blob, fuzzy){
    if(!tok) return 0;
    if(blob.indexOf(tok)!==-1){
      for(var i=0;i<mots.length;i++){
        if(mots[i]===tok) return 100;
        if(mots[i].indexOf(tok)===0) return 86;
      }
      return 70;
    }
    if(!fuzzy || tok.length<4 || /^\d/.test(tok)) return 0;
    var max=tok.length>=7?2:1, best=0, i,w,d, first=tok.charAt(0);
    for(i=0;i<mots.length;i++){
      w=mots[i];
      if(!w||w.charAt(0)!==first||Math.abs(w.length-tok.length)>max) continue;
      d=rechDist(tok,w,max);
      if(d===0) return 100;
      if(d===1 && best<58) best=58;
      else if(d===2 && tok.length>=7 && best<42) best=42;
    }
    return best;
  }
  var SET_CODE={"ecarlate-violet":"SVI","evolutions-paldea":"PAL","flammes-obsidiennes":"OBF","ecarlate-violet-151":"MEW","destinees-de-paldea":"PAF","forces-temporelles":"TEF","mascarade-crepusculaire":"TWM","fable-nebuleuse":"SFA","couronne-stellaire":"SCR","etincelles-deferlantes":"SSP","faille-paradoxe":"PAR","flamme-blanche":"WHT","foudre-noire":"BLK","aventures-ensemble":"JTG","rivalites-destinees":"DRI","evolutions-prismatiques":"PRE"};
  function rechCodePage(p){
    var b=String(p||"").replace(/-en\.html$|-ja\.html$|\.html$/i,"");
    return SET_CODE[b]||"";
  }
  function rechPreparer(){
    var data=window.RECHERCHE_CARTES||{sets:[]};
    var src=window.RECH_CARTES||[];
    var key=((data.sets||[]).length)+":"+src.length;
    if(window.__rechPrep && window.__rechPrep.key===key) return window.__rechPrep;
    var items=[], setList=[], st, c, k, n, nom, al, nameParts, setParts, code, i;
    (data.sets||[]).forEach(function(st){
      code=st.g||rechCodePage(st.p);
      setParts=[st.s,code].concat(st.al||[]);
      var setBlob=normRech(setParts.join(" ")), setMots=rechMots(setParts.join(" "));
      setList.push({type:"set",nom:st.s,n:"",set:st.s,page:st.p,lang:st.l||"",k:"",href:st.p,setBlob:setBlob,setMots:setMots});
      (st.c||[]).forEach(function(c){
        k=c[0]; n=c[1]; nom=c[2]; al=c[3]||[];
        if(!Array.isArray(al)) al=al?[al]:[];
        nameParts=[nom,n,k].concat(al);
        items.push({type:"carte",nom:nom,n:n||"",set:st.s,page:st.p,lang:st.l||"",k:k,
          href:st.p+"?k="+encodeURIComponent(k)+"#carte-"+String(k).replace(/[^A-Za-z0-9_-]+/g,"-"),
          nameBlob:normRech(nameParts.join(" ")), nameMots:rechMots(nameParts.join(" ")),
          setBlob:setBlob, setMots:setMots, fr:st.l==="FR"});
      });
    });
    for(i=0;i<src.length;i++){
      c=src[i]; al=c.al||[];
      nameParts=[c.nom,c.num,c.id,c.pkmn].concat(al);
      setParts=[c.serie,c.r,c.l];
      items.push({type:"carte",nom:c.nom||c.pkmn||"Carte",n:c.num||"",set:c.serie||"",page:"",lang:String(c.l||"").toUpperCase(),k:c.id,
        href:"carte-pikachu.html?pkmn="+encodeURIComponent(c.pkmn||"pikachu")+"&lang="+encodeURIComponent(c.l||"fr")+"&id="+encodeURIComponent(c.id),
        nameBlob:normRech(nameParts.join(" ")), nameMots:rechMots(nameParts.join(" ")),
        setBlob:normRech(setParts.join(" ")), setMots:rechMots(setParts.join(" ")), fr:String(c.l||"").toLowerCase()==="fr", pkmn:c.pkmn});
    }
    window.__rechPrep={key:key,items:items,sets:setList};
    return window.__rechPrep;
  }
  function mimiquiChercherCartes(q,max){
    max=max||16;
    q=normRech(q).trim();
    if(q.length<2) return [];
    var toks=q.split(/\s+/).filter(Boolean);
    if(!toks.length) return [];
    var alias=window.RECHERCHE_ALIAS||{};
    var prep=rechPreparer();
    var forms=toks.map(function(tok){
      var f=[tok], a=alias[tok]||[], i,n;
      for(i=0;i<a.length && f.length<8;i++){ n=normRech(a[i]); if(n&&f.indexOf(n)<0) f.push(n); }
      return f;
    });
    function scoreTok(ti, mots, blob, fuzzy){
      var tf=forms[ti], tok=toks[ti], best=0, i, sc;
      for(i=0;i<tf.length;i++){
        sc=rechTokenDans(tf[i], mots, blob, fuzzy && i===0);
        if(sc>best) best=sc;
      }
      if(/^\d+[a-z]?$/.test(tok) || /^\d+\/\d+$/.test(tok)){
        for(i=0;i<mots.length;i++){
          if(mots[i]===tok || mots[i].indexOf(tok)===0) { if(best<88) best=88; }
          else if(/^\d+$/.test(tok) && /^\d+$/.test(mots[i]) && String(parseInt(mots[i],10))===String(parseInt(tok,10))) { if(best<88) best=88; }
        }
      }
      return best;
    }
    function scoreParts(mots, blob, fuzzy){
      var score=0, ti, sc;
      for(ti=0;ti<toks.length;ti++){
        sc=scoreTok(ti, mots, blob, fuzzy);
        if(sc<=0) return 0;
        score+=sc;
      }
      return Math.round(score/toks.length);
    }
    var hits=[], i, it, sn, sc, setSc;
    for(i=0;i<prep.sets.length;i++){
      it=prep.sets[i];
      sn=scoreParts(it.setMots, it.setBlob, false);
      if(sn>=70) hits.push({type:it.type,nom:it.nom,n:"",set:it.set,page:it.page,lang:it.lang,k:"",href:it.href,score:sn+24});
    }
    for(i=0;i<prep.items.length;i++){
      it=prep.items[i];
      sc=scoreParts(it.nameMots, it.nameBlob, true);
      setSc=0;
      if(sc<=0){
        sc=scoreParts(it.nameMots.concat(it.setMots), it.nameBlob+" "+it.setBlob, true);
        if(sc<=0) continue;
      } else {
        setSc=scoreParts(it.setMots, it.setBlob, false);
        if(setSc>=70) sc+=5;
      }
      if(it.fr) sc+=2;
      if(it.page) sc+=3;
      hits.push({type:it.type,nom:it.nom,n:it.n,set:it.set,page:it.page,lang:it.lang,k:it.k,href:it.href,score:sc,pkmn:it.pkmn});
    }
    hits.sort(function(a,b){
      if(b.score!==a.score) return b.score-a.score;
      if((a.type==="set")!==(b.type==="set")) return a.type==="set"?-1:1;
      if((a.lang==="FR")!==(b.lang==="FR")) return a.lang==="FR"?-1:1;
      return String(a.n).localeCompare(String(b.n),"fr");
    });
    var out=[], seen={};
    for(i=0;i<hits.length;i++){
      it=hits[i]; if(!it.href||seen[it.href]) continue;
      seen[it.href]=1; out.push(it); if(out.length>=max) break;
    }
    return out;
  }
  window.mimiquiChercherCartes=mimiquiChercherCartes;
  window.mimiquiPreparerRecherche=rechPreparer;
  function ajouterRecherche(nav){
    if(!nav||nav.querySelector(".nav-recherche"))return;
    var box=el("div",{"class":"nav-recherche"});
    var btn=el("button",{type:"button","class":"nav-rech-btn","aria-expanded":"false","aria-label":"Rechercher une carte","title":"Rechercher une carte"});
    btn.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg>';
    var pan=el("div",{"class":"nav-rech-panneau","role":"search"});
    var inp=el("input",{type:"search",placeholder:"Nom, n° ou série (FR, EN, JA)…","aria-label":"Rechercher une carte par nom","autocomplete":"off"});
    var aide=el("p",{"class":"nav-rech-aide"},"Nom, numéro ou série, en français, anglais ou japonais.");
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
      var q=inp.value;
      liste.textContent=""; vide.hidden=true; aide.hidden=!!String(q).trim();
      if(normRech(q).trim().length<2){ if(String(q).trim()){ vide.hidden=false; vide.textContent="Saisir au moins 2 caractères."; } return; }
      chargerIndexRecherche(function(){
        if(inp.value!==q) return;
        var hits=mimiquiChercherCartes(q,20);
        if(!hits.length){ vide.hidden=false; vide.textContent="Aucune carte trouvée."; return; }
        hits.forEach(function(h){
          var li=el("li");
          var a=el("a",{href:h.href});
          a.appendChild(document.createTextNode(h.nom));
          var sm=el("small");
          if(h.type==="set") sm.textContent="Série"+(h.lang?" · "+h.lang:"");
          else sm.textContent=(h.n?h.n+" · ":"")+h.set+(h.lang?" · "+h.lang:"");
          a.appendChild(sm);
          li.appendChild(a); liste.appendChild(li);
        });
      });
    }
    inp.addEventListener("input",function(){ if(tmr)clearTimeout(tmr); tmr=setTimeout(render,40); });
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
    if(/(^|\/)registre-pokemon\.html$/i.test(location.pathname))return;if(/(^|\/)conseils-achat\.html$/i.test(location.pathname))return;if(document.documentElement.classList.contains('sans-mini-teaser')||(document.body&&document.body.classList.contains('sans-mini-teaser')))return;if(document.getElementById('mini-teaser'))return;window.__mtAuto=true;
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
/* Navigation instantanee : precharge une page interne au survol / focus / touche */
(function(){
  var vu={};
  function cible(a){
    if(!a||!a.getAttribute) return null;
    if(a.target&&a.target!=='_self') return null;
    if(a.hasAttribute('download')) return null;
    var u;try{u=new URL(a.href,location.href)}catch(x){return null}
    if(u.origin!==location.origin) return null;
    if(!/\.html?$/.test(u.pathname) && u.pathname.slice(-1)!=='/') return null;
    if(u.pathname===location.pathname && u.search===location.search) return null;
    return u;
  }
  function pre(e){
    var a=e.target.closest&&e.target.closest('a[href]');
    var u=cible(a); if(!u) return;
    var key=u.pathname+u.search;
    if(vu[key]) return; vu[key]=1;
    var l=document.createElement('link');
    l.rel='prefetch';
    l.as='document';
    l.href=u.pathname+u.search;
    document.head.appendChild(l);
  }
  document.addEventListener('pointerover',pre,{passive:true});
  document.addEventListener('touchstart',pre,{passive:true});
  document.addEventListener('focusin',pre,{passive:true});
  function speculation(){
    if(!(window.HTMLScriptElement&&HTMLScriptElement.supports&&HTMLScriptElement.supports('speculationrules'))) return;
    if(document.getElementById('mq-spec')) return;
    var hrefs=[], seen={};
    var links=document.querySelectorAll('nav a[href], .menu-principal a[href]');
    for(var i=0;i<links.length && hrefs.length<12;i++){
      var u=cible(links[i]); if(!u) continue;
      var k=u.pathname+u.search; if(seen[k]) continue; seen[k]=1; hrefs.push(k);
    }
    if(!hrefs.length) return;
    var s=document.createElement('script');
    s.type='speculationrules';
    s.id='mq-spec';
    s.textContent=JSON.stringify({prefetch:[{source:'list',urls:hrefs,eagerness:'moderate'}]});
    document.head.appendChild(s);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',speculation);
  else speculation();
})();

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
/* === Entree hologramme courte (sauf pokemon.html). Plus d'attente a la sortie : navigation native immediate. === */
(function(){
var page=(location.pathname.split('/').pop()||'index.html').toLowerCase();if(page==='pokemon.html')return;
var H=document.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches;if(RM)return;
H.classList.add('h5-in');setTimeout(function(){H.classList.remove('h5-in')},220);
addEventListener('pageshow',function(e){if(e.persisted)H.classList.remove('h5-out','h5-in')});
})();
/* Sous-rubrique : flyout droite/gauche + hauteur viewport (menus compacts) */
(function(){
function fitSous(sm, anchorTop){
  if(!sm) return;
  if(sm.classList.contains('sous-menu-151')||sm.classList.contains('sm-sous-151')||sm.classList.contains('sous-menu-conseils-achat')||(sm.parentElement&&(sm.parentElement.classList.contains('li-conseils-achat')||sm.parentElement.classList.contains('sm-groupe-top1gen')))) return;
  /* Pas de max-height / scrollbar : menus compacts + colonnes côté CSS */
  sm.classList.remove('sm-scroll');
  sm.style.maxHeight = '';
  sm.style.overflow = '';
}
function init(){
  document.querySelectorAll('.sm-groupe').forEach(function(g){
    var b=g.querySelector(':scope > .sm-tog') || g.querySelector('.sm-tog');
    var s=g.querySelector(':scope > .sm-sous') || g.querySelector('.sm-sous') || g.querySelector(':scope > .liste-top1gen');
    if(g.classList.contains('sm-groupe-top1gen')){
      /* Dépliant : clic pour ouvrir/fermer, pas de flyout */
      if(!b)return;
      var f=g.querySelector(':scope > .sm-tog .sm-fl') || g.querySelector('.sm-fl');
      if(f) f.textContent=g.classList.contains('sm-ouvert')?'\u25BE':'\u25B8';
      b.addEventListener('click', function(e){
        e.preventDefault(); e.stopPropagation();
        var o=g.classList.toggle('sm-ouvert');
        b.setAttribute('aria-expanded', o?'true':'false');
        if(f) f.textContent = o ? '\u25BE' : '\u25B8';
      });
      return;
    }
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

/* Conseils achat : rubrique « 151 Pokémon 1er génération Le top » + liste 151 défilante */
(function(){
  if(document.getElementById('menu-conseils-achat-css'))return;
  var css=
    'html body nav ul.menu-principal>li.li-conseils-achat .liste-top1gen{display:none;list-style:none;margin:0;padding:.15rem 0 .25rem;max-height:min(22rem,65vh);overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;scrollbar-width:thin;width:100%;box-sizing:border-box;columns:auto;column-count:auto;}'+
    'html body nav ul.menu-principal>li.li-conseils-achat .sm-groupe-top1gen.sm-ouvert>.liste-top1gen{display:block;}'+
    'html body nav ul.menu-principal>li.li-conseils-achat .liste-top1gen>li{display:block;}'+
    'html body nav ul.menu-principal>li.li-conseils-achat .liste-top1gen a{display:block;padding:.28rem .9rem;font-size:.88rem;line-height:1.25;white-space:nowrap;}'+
    '@media (max-width:799px){html body nav.menu-ouvert ul.menu-principal>li.li-conseils-achat .sm-groupe-top1gen.sm-ouvert>.liste-top1gen{max-height:min(16rem,45vh);width:100%;}}'+
    'html body nav ul.menu-principal>li.li-conseils-achat>ul.sous-menu,'+
    'html body nav ul.menu-principal>li.li-conseils-achat>ul.sous-menu-conseils-achat,'+
    'html body nav ul.menu-principal>li.li-conseils-achat.ouvert>ul.sous-menu{'+
      'max-height:none!important;overflow:visible!important;'+
      'min-width:16.5rem!important;max-width:min(24rem,92vw)!important;padding:.25rem 0!important;'+
    '}'+
    '@media (min-width:800px){'+
      'html body nav ul.menu-principal>li.li-conseils-achat>ul.sous-menu{left:auto!important;right:0!important}'+
    '}'+
    'html body nav ul.menu-principal>li.li-conseils-achat>ul.sous-menu>li.li-achat-prix-bas,html body nav ul.menu-principal>li.li-conseils-achat>ul.sous-menu-conseils-achat>li.li-achat-prix-bas{display:block;list-style:none;margin:0;padding:0}'+    'html body nav ul.menu-principal>li.li-conseils-achat>ul.sous-menu>li.li-achat-prix-bas>a,html body nav ul.menu-principal>li.li-conseils-achat>ul.sous-menu-conseils-achat>li.li-achat-prix-bas>a{display:block;padding:.4rem .9rem;font-size:.9rem;font-weight:800;line-height:1.25;white-space:normal}'+
    'html body nav ul.menu-principal>li.li-conseils-achat .sm-groupe-top1gen>button.sm-tog{'+
      'width:100%;font-weight:800!important;padding:.4rem .9rem!important;font-size:.9rem!important;white-space:normal;text-align:left;line-height:1.25;'+
    '}'+
    'html body nav ul.menu-principal>li.li-conseils-achat .sm-groupe-top1gen>ul.sm-sous,'+
    'html body nav ul.menu-principal>li.li-conseils-achat .sm-groupe-top1gen>ul.sm-sous-151,'+
    'html body nav ul.menu-principal>li.li-conseils-achat .sm-groupe-top1gen.sm-ouvert>ul.sm-sous{'+
      'position:static!important;left:auto!important;right:auto!important;top:auto!important;transform:none!important;'+
      'display:none!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;'+
      'min-width:0!important;width:100%!important;max-width:100%!important;margin:0!important;padding:.15rem 0 .25rem!important;'+
      'border:0!important;box-shadow:none!important;background:transparent!important;border-radius:0!important;'+
    '}'+
    'html body nav ul.menu-principal>li.li-conseils-achat .sm-groupe-top1gen.sm-ouvert>ul.sm-sous,'+
    'html body nav ul.menu-principal>li.li-conseils-achat .sm-groupe-top1gen.sm-ouvert>ul.sm-sous-151,'+
    'html body nav ul.menu-principal>li.li-conseils-achat.ouvert .sm-groupe-top1gen.sm-ouvert>ul.sm-sous{'+
      'display:block!important;'+
      'max-height:min(22rem,65vh)!important;overflow-x:hidden!important;overflow-y:auto!important;'+
      'overscroll-behavior:contain;-webkit-overflow-scrolling:touch;scrollbar-width:thin;'+
    '}'+
    'html body nav ul.menu-principal>li.li-conseils-achat .sm-groupe-top1gen>ul.sm-sous,'+'html body nav ul.menu-principal>li.li-conseils-achat .sm-groupe-top1gen>ul.sm-sous-151,'+'html body nav.menu-ouvert ul.menu-principal>li.li-conseils-achat .sm-groupe-top1gen>ul.sm-sous{'+'columns:1!important;column-count:1!important;-webkit-columns:1!important;column-width:auto!important;'+'}'+'html body nav ul.menu-principal>li.li-conseils-achat .sm-groupe-top1gen>ul.sm-sous a{'+
      'padding:.28rem .9rem!important;font-size:.88rem!important;line-height:1.25;white-space:nowrap;'+
    '}'+
    '@media (hover:hover) and (min-width:800px){'+
      'html body nav ul.menu-principal>li.li-conseils-achat .sm-groupe-top1gen:hover>ul.sm-sous,'+
      'html body nav ul.menu-principal>li.li-conseils-achat .sm-groupe-top1gen:focus-within>ul.sm-sous{'+
        'display:block!important;max-height:min(22rem,65vh)!important;overflow-x:hidden!important;overflow-y:auto!important;'+
      '}'+
    '}'+
    '@media (max-width:799px){'+
      'html body nav.menu-ouvert ul.menu-principal>li.li-conseils-achat>ul.sous-menu,'+
      'html body nav.menu-ouvert ul.menu-principal>li.li-conseils-achat.ouvert>ul.sous-menu{'+
        'max-height:none!important;overflow:visible!important;width:100%!important;max-width:100%!important;min-width:0!important;'+
        'position:static!important;display:block!important;flex:none!important;'+
      '}'+
      'html body nav.menu-ouvert ul.menu-principal>li.li-conseils-achat .sm-groupe-top1gen.sm-ouvert>ul.sm-sous,'+
      'html body nav.nav-commune.menu-ouvert ul.menu-principal>li.li-conseils-achat .sm-groupe-top1gen.sm-ouvert>ul.sm-sous-151{'+
        'display:block!important;position:static!important;max-height:min(16rem,45vh)!important;'+
        'overflow-x:hidden!important;overflow-y:auto!important;width:100%!important;flex:none!important;'+
      '}'+
      'html body nav.menu-ouvert ul.menu-principal>li.li-conseils-achat .sm-groupe-top1gen>ul.sm-sous>li{'+
        'flex:0 0 auto!important;display:block!important;width:100%;'+
      '}'+
    '}';
  var st=document.createElement('style');st.id='menu-conseils-achat-css';st.textContent=css;document.head.appendChild(st);
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
    if(typeof window.mimiquiChercherCartes==="function") return window.mimiquiChercherCartes(q,16);
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
    if(window.__rechCartesPret && window.RECHERCHE_CARTES){ cb(); return; }
    if(window.__barreRechercheChargement){ window.__barreRechercheChargement.push(cb); return; }
    window.__barreRechercheChargement=[cb];
    function fini(){
      window.__rechCartesPret=1;
      try{ if(window.mimiquiPreparerRecherche) window.mimiquiPreparerRecherche(); }catch(e){}
      var q=window.__barreRechercheChargement||[];
      window.__barreRechercheChargement=null;
      q.forEach(function(fn){ try{fn();}catch(e){} });
    }
    var left=2;
    function one(){ if(--left<=0) fini(); }
    function load(src, next){
      var s=document.createElement("script");
      s.src=src;
      s.onload=next; s.onerror=next;
      document.head.appendChild(s);
    }
    if(window.RECHERCHE_CARTES){ one(); }
    else {
      load("recherche-cartes-data.js?v="+(typeof SITE_CACHE==="string"?SITE_CACHE:"20261112z"), one);
    }
    if(window.RECH_CARTES && window.RECH_CARTES.length){ one(); }
    else {
      load("recherche-cartes-pkmn.js", function(){
        if(window.RECH_CARTES && window.RECH_CARTES.length){ one(); return; }
        load("recherche-cartes-pikachu.js", one);
      });
    }
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
    var form=el("form",{id:"barre-recherche-site","class":"barre-recherche-site",role:"search",action:"cartes-pokemon.html",method:"get"});
    var ligne=el("div",{"class":"brs-ligne"});
    var input=el("input",{type:"search",name:"q",placeholder:"Rechercher une carte (nom, n°, série)…","aria-label":"Rechercher une carte par nom, numéro ou série",autocomplete:"off","aria-autocomplete":"list","aria-controls":"barre-recherche-liste"});
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
          var v=el("div",{"class":"brs-vide"},"Aucune carte ne correspond. Essayez un nom, une série ou un numéro.");
          liste.appendChild(v);
        } else {
          res.forEach(function(c,i){
            var href=c.href||hrefCarte(c);
            var a=el("a",{href:href,role:"option",id:"brs-opt-"+i});
            a.setAttribute("aria-selected","false");
            var b=el("b");
            b.appendChild(el("span",{"class":"brs-lg"},String(c.lang||c.l||(c.type==="set"?"SET":"")).toUpperCase()));
            b.appendChild(document.createTextNode(c.nom||c.pkmn||"Carte"));
            var sp=el("span",null, (c.type==="set"?["Série", c.set||c.serie]:[c.set||c.serie, (c.n||c.num)?("n° "+(c.n||c.num)):""]).filter(Boolean).join(" · "));
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
      var res=String(q).trim() ? filtrer(q) : [];
      if(res.length){
        e.preventDefault();
        var opts=liste.querySelectorAll("a[href]");
        if(actif>=0 && opts[actif]){ location.href=opts[actif].href; return; }
        if(res.length===1){ location.href=res[0].href||hrefCarte(res[0]); return; }
        rendre();
        return;
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

(function(){
  "use strict";
  var KEY="mimiqui_acces";
  var STRIPE="https://buy.stripe.com/aFa9AVcwYdTOgDcdez67S00";
  var MSG="Données de vente réservées aux abonnés – 2,99 €/semaine";
  var BTN="S’abonner";
  var ARIA="Abonnement aux données de vente";

  function aAcces(){
    try{ return localStorage.getItem(KEY)==="ok"; }catch(e){ return false; }
  }
  try{ document.documentElement.classList.toggle("mq-abonne", aAcces()); }catch(e){}
  window.MIMIQUI_ABO = window.MIMIQUI_ABO || {};
  window.MIMIQUI_ABO.aAcces = aAcces;
  window.MIMIQUI_ABO.KEY = KEY;
  window.MIMIQUI_ABO.STRIPE = STRIPE;
  function tr(s){
    try{
      if(window.MIMIQUI_I18N && typeof window.MIMIQUI_I18N.t==="function"){
        var x=window.MIMIQUI_I18N.t(s);
        if(x) return x;
      }
    }catch(e){}
    return s;
  }
  function estLienVentes(a){
    if(!a || !a.getAttribute) return false;
    if(a.classList && a.classList.contains("btn-ebay-recherche")) return false;
    var href=(a.getAttribute("href")||"");
    return a.classList && a.classList.contains("btn-ebay") && href.indexOf("LH_Sold")!==-1;
  }
  function boutonAbonner(){
    var a=document.createElement("a");
    a.className="mq-abo-btn";
    a.href=STRIPE;
    a.target="_blank";
    a.rel="noopener";
    a.textContent=tr(BTN);
    return a;
  }
  function message(){
    var p=document.createElement("p");
    p.className="mq-abo-msg";
    p.textContent=tr(MSG);
    return p;
  }
  function ouvrirFenetre(){
    var fond=document.getElementById("mq-abo-fond");
    if(!fond){
      fond=document.createElement("div");
      fond.id="mq-abo-fond";
      fond.className="mq-abo-fond";
      fond.setAttribute("hidden","");
      fond.innerHTML="";
      var fen=document.createElement("div");
      fen.className="mq-abo-fen";
      fen.setAttribute("role","dialog");
      fen.setAttribute("aria-modal","true");
      fen.setAttribute("aria-labelledby","mq-abo-titre");
      var titre=document.createElement("p");
      titre.id="mq-abo-titre";
      titre.className="mq-abo-msg";
      titre.textContent=tr(MSG);
      var x=document.createElement("button");
      x.type="button";
      x.className="mq-abo-x";
      x.setAttribute("aria-label",tr("Fermer"));
      x.innerHTML="&times;";
      fen.appendChild(x);
      fen.appendChild(titre);
      fen.appendChild(boutonAbonner());
      fond.appendChild(fen);
      (document.body||document.documentElement).appendChild(fond);
      function fermer(){
        fond.setAttribute("hidden","");
        fond.setAttribute("aria-hidden","true");
      }
      fond.addEventListener("click",function(ev){ if(ev.target===fond) fermer(); });
      x.addEventListener("click",fermer);
      document.addEventListener("keydown",function(ev){
        if(ev.key==="Escape" && !fond.hasAttribute("hidden")){
          ev.preventDefault();
          ev.stopPropagation();
          fermer();
        }
      }, true);
    }else{
      var t=fond.querySelector("#mq-abo-titre, .mq-abo-msg");
      if(t) t.textContent=tr(MSG);
      var b=fond.querySelector(".mq-abo-btn");
      if(b){ b.textContent=tr(BTN); b.href=STRIPE; }
    }
    fond.removeAttribute("hidden");
    fond.removeAttribute("aria-hidden");
    var focus=fond.querySelector(".mq-abo-btn");
    if(focus) focus.focus();
  }
  window.MIMIQUI_ABO.ouvrir = ouvrirFenetre;
  function masquerDansFiche(vin){
    if(!vin || aAcces() || vin.querySelector(".mq-paywall")) return;
    var nodes=[], seen=[];
    function add(n){
      if(!n || seen.indexOf(n)>=0 || (n.classList && n.classList.contains("vp-pied"))) return;
      seen.push(n); nodes.push(n);
    }
    add(vin.querySelector(".vp-hb"));
    var hs=vin.querySelectorAll("h4");
    for(var i=0;i<hs.length;i++){
      var tx=(hs[i].textContent||"");
      if(/ventes/i.test(tx)){
        add(hs[i]);
        var nxt=hs[i].nextElementSibling;
        if(nxt && !nxt.classList.contains("vp-pied") && !nxt.classList.contains("vp-note")) add(nxt);
      }
    }
    add(vin.querySelector(".vp-cs"));
    if(!nodes.length) return;
    var wrap=document.createElement("div");
    wrap.className="mq-paywall";
    nodes[0].parentNode.insertBefore(wrap, nodes[0]);
    for(var j=0;j<nodes.length;j++) wrap.appendChild(nodes[j]);
    var veil=document.createElement("div");
    veil.className="mq-paywall-veil";
    veil.appendChild(message());
    veil.appendChild(boutonAbonner());
    wrap.appendChild(veil);
  }
  function scruter(){
    if(aAcces()) return;
    var vin=document.getElementById("vp-in");
    if(vin) masquerDansFiche(vin);
    var autres=document.querySelectorAll(".vp-in");
    for(var i=0;i<autres.length;i++) masquerDansFiche(autres[i]);
  }

  document.addEventListener("click",function(ev){
    if(aAcces()) return;
    var a=ev.target.closest && ev.target.closest("a");
    if(!estLienVentes(a)) return;
    ev.preventDefault();
    ev.stopPropagation();
    ouvrirFenetre();
  }, true);

  function demarrer(){
    if(aAcces()) return;
    scruter();
    if(window.MutationObserver && document.body){
      var t=0;
      var obs=new MutationObserver(function(){
        if(t) return;
        t=1;
        setTimeout(function(){ t=0; scruter(); }, 30);
      });
      obs.observe(document.body,{childList:true,subtree:true});
    }
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();
})();

(function(){
  "use strict";
  var LABEL_RECH="🔎 Rechercher sur eBay";
  var LABEL_VEND="Ventes réalisées";
  var CAMP="5339225196";
  var cachedC=null, triedC=false;

  function tr(s){
    try{
      if(window.MIMIQUI_I18N && typeof window.MIMIQUI_I18N.t==="function"){
        var x=window.MIMIQUI_I18N.t(s);
        if(x) return x;
      }
    }catch(e){}
    return s;
  }
  function extraireC(){
    if(triedC) return cachedC;
    triedC=true;
    var scripts=document.getElementsByTagName("script");
    for(var i=0;i<scripts.length;i++){
      var txt=scripts[i].textContent||"";
      var idx=txt.indexOf("var C=");
      if(idx<0) idx=txt.indexOf("var C =");
      if(idx<0 || txt.indexOf("vend")<0) continue;
      var start=txt.indexOf("[", idx);
      if(start<0) continue;
      var depth=0, inS=false, quote="", esc=false;
      for(var j=start;j<txt.length;j++){
        var ch=txt.charAt(j);
        if(inS){
          if(esc){ esc=false; continue; }
          if(ch==="\\"){ esc=true; continue; }
          if(ch===quote){ inS=false; quote=""; }
          continue;
        }
        if(ch==="\""||ch==="'"){ inS=true; quote=ch; continue; }
        if(ch==="[") depth++;
        else if(ch==="]"){
          depth--;
          if(depth===0){
            var raw=txt.slice(start,j+1);
            try{ cachedC=JSON.parse(raw); }
            catch(e){
              try{ cachedC=(new Function("return "+raw))(); }
              catch(e2){ cachedC=null; }
            }
            return cachedC;
          }
        }
      }
    }
    return null;
  }
  function enc(s){ return encodeURIComponent(String(s||"")); }
  function urlRecherche(c){
    var href=(c && (c.s||c.rech))||"";
    if(href && href.indexOf("ebay")!==-1) return href;
    var q=("pokemon "+((c&&c.nom)||"")+" "+((c&&c.n)||"")).replace(/\s+/g," ").trim();
    return "https://www.ebay.fr/sch/i.html?_nkw="+enc(q)+"&mkcid=1&mkrid=709-53476-19255-0&siteid=71&campid="+CAMP+"&customid=grille-rech&toolid=10001&mkevt=1";
  }
  function urlVentes(c){
    return (c && c.vend) || "";
  }
  function lien(cls, href, label, sponsored){
    var a=document.createElement("a");
    a.className=cls;
    a.href=href;
    a.target="_blank";
    a.rel=sponsored ? "sponsored noopener" : "noopener";
    a.textContent=label;
    a.addEventListener("click", function(ev){ ev.stopPropagation(); }, true);
    return a;
  }
  function injecter(){
    var C=extraireC();
    if(!C || !C.length) return;
    var cards=document.querySelectorAll("#list article.card, .grid article.card");
    for(var i=0;i<cards.length;i++){
      var art=cards[i];
      if(art.querySelector(".mq-btns-grille")) continue;
      var btn=art.querySelector("button.frame[data-i]");
      if(!btn) continue;
      var c=C[+btn.getAttribute("data-i")];
      if(!c) continue;
      var row=document.createElement("div");
      row.className="mq-btns-grille";
      row.addEventListener("click", function(ev){ ev.stopPropagation(); }, true);
      var rech=urlRecherche(c);
      if(rech){
        row.appendChild(lien("btn-ebay btn-ebay-recherche btn-ebay-grille", rech, tr(LABEL_RECH), true));
      }
      var vend=urlVentes(c);
      if(vend){
        row.appendChild(lien("btn-ebay btn-ebay-grille", vend, tr(LABEL_VEND), true));
      }
      if(!row.firstChild) continue;
      var pic=art.querySelector(".pic");
      if(pic && pic.parentNode===art) art.appendChild(row);
      else art.appendChild(row);
    }
  }
  function demarrer(){
    injecter();
    if(window.MutationObserver && document.body){
      var t=0;
      var obs=new MutationObserver(function(){
        if(t) return;
        t=1;
        setTimeout(function(){ t=0; injecter(); }, 40);
      });
      var list=document.getElementById("list")||document.body;
      obs.observe(list,{childList:true,subtree:true});
    }
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();
})();


(function(){
  "use strict";
  var SEL=[
    ".liste-ventes li .prix-vente",
    ".derniere-vente:not(.vide) .prix-vente",
    ".ep-v a",
    ".ep-dep-in a",
    "#fr-cartes li.fv b",
    "#ja-cartes li.fv b",
    "#en-cartes li.fv b",
    "#ventes li:not(.groupe-v):not(.sans) b",
    "#par-pays .rc ul li b",
    "#par-pays .rc .rr",
    "#ap-liste .ap-meta strong",
    ".ap-liste .ap-meta strong",
    "li.vente > .p",
    "li.av-carte .av-meta strong",
    "table.ventes td.prix"
  ].join(",");

  function aAcces(){
    try{
      if(window.MIMIQUI_ABO && typeof window.MIMIQUI_ABO.aAcces==="function") return window.MIMIQUI_ABO.aAcces();
      return localStorage.getItem("mimiqui_acces")==="ok";
    }catch(e){ return false; }
  }
  function ouvrirAbo(){
    try{
      if(window.MIMIQUI_ABO && typeof window.MIMIQUI_ABO.ouvrir==="function"){
        window.MIMIQUI_ABO.ouvrir();
        return;
      }
    }catch(e){}
    location.href="https://buy.stripe.com/aFa9AVcwYdTOgDcdez67S00";
  }
  function aUnPrix(el){
    var t=(el.textContent||"").replace(/\s+/g," ").trim();
    if(!t) return false;
    if(/^[–—\-·.…]+$/.test(t)) return false;
    if(/aucune vente/i.test(t)) return false;
    if(/^à venir$/i.test(t)) return false;
    if(/^0\s*ventes?$/i.test(t)) return false;
    return /\d/.test(t);
  }
  function ignore(el){
    if(!el || !el.closest) return true;
    if(el.closest("#vp-in, .vp-in, .mq-paywall, .mq-paywall-veil, .mq-abo-fen, .mq-abo-fond")) return true;
    if(el.closest("a.btn-ebay, a.eb-sous, a.pc-btn, .mq-btns-grille")) return true;
    return false;
  }
  function assurerFlou(el){
    if(!el) return;
    var kids=el.children;
    for(var i=0;i<kids.length;i++){
      if(kids[i].classList && kids[i].classList.contains("mq-prix-masque")) return;
    }
    var wrap=document.createElement("span");
    wrap.className="mq-prix-masque";
    while(el.firstChild) wrap.appendChild(el.firstChild);
    el.appendChild(wrap);
  }
  function retirerFlou(el){
    if(!el) return;
    var kids=el.children;
    var w=null;
    for(var i=0;i<kids.length;i++){
      if(kids[i].classList && kids[i].classList.contains("mq-prix-masque")){ w=kids[i]; break; }
    }
    if(!w) return;
    while(w.firstChild) el.insertBefore(w.firstChild, w);
    el.removeChild(w);
  }
  function poser(el, ok){
    if(!el) return;
    if(ignore(el)){
      el.classList.remove("mq-cadenas","mq-verrou");
      retirerFlou(el);
      return;
    }
    if(ok && !aAcces()){
      el.classList.add("mq-cadenas","mq-verrou");
      assurerFlou(el);
    }else{
      el.classList.remove("mq-verrou");
      retirerFlou(el);
      el.classList.remove("mq-cadenas");
    }
  }
  function marquerCadenas(){
    var btns=document.querySelectorAll("a.btn-ebay, a.eb-sous, a.pc-btn, .mq-btns-grille a");
    for(var i=0;i<btns.length;i++){
      btns[i].classList.remove("mq-cadenas","mq-verrou");
      retirerFlou(btns[i]);
    }

    var nodes=document.querySelectorAll(SEL);
    for(var s=0;s<nodes.length;s++) poser(nodes[s], aUnPrix(nodes[s]));

    var tds=document.querySelectorAll('#tableau td[data-l="Prix le plus vendu"], #tableau td[data-l="Plus bas"], #tableau td[data-l="Plus haut"]');
    for(var j=0;j<tds.length;j++) poser(tds[j], aUnPrix(tds[j]));

    var dts=document.querySelectorAll("dl.chiffres dt, .chiffres dt");
    var lab=/eBay\s*:\s*(plus haute vente|vente la plus basse)|vente la plus (haute|basse)|plus haute vente|dernière vente/i;
    for(var k=0;k<dts.length;k++){
      var dt=dts[k];
      if(!lab.test(dt.textContent||"")) continue;
      var dd=dt.nextElementSibling;
      if(dd && dd.tagName==="DD") poser(dd, aUnPrix(dd) && !dd.classList.contains("na"));
    }

    var tables=document.querySelectorAll(".journal table, .journal-box table");
    for(var ti=0;ti<tables.length;ti++){
      var ths=tables[ti].querySelectorAll("thead th, tr:first-child th");
      if(!ths.length) ths=tables[ti].querySelectorAll("tr:first-child th, tr:first-child td");
      var cols=[];
      for(var c=0;c<ths.length;c++){
        var tx=ths[c].textContent||"";
        if(/eBay\s*:\s*(plus haute vente|vente la plus basse)|plus haute vente|vente la plus basse/i.test(tx)) cols.push(c);
      }
      var rows=tables[ti].querySelectorAll("tr");
      for(var r=0;r<rows.length;r++){
        var cells=rows[r].querySelectorAll("td");
        for(var ci=0;ci<cols.length;ci++){
          if(cells[cols[ci]]) poser(cells[cols[ci]], aUnPrix(cells[cols[ci]]));
        }
      }
    }

    var vms=document.querySelectorAll(".cm-v.vm, [data-vm]");
    for(var v=0;v<vms.length;v++){
      var el=vms[v];
      var t=(el.textContent||"").trim();
      poser(el, aUnPrix(el) && !/^…$/.test(t) && !/aucune vente/i.test(t));
    }
  }
  function cibleVerrou(el){
    if(!el || !el.closest) return null;
    var v=el.closest(".mq-verrou");
    if(v && !ignore(v)) return v;
    var n=el.closest(SEL);
    if(n && !ignore(n) && aUnPrix(n) && !aAcces()) return n;
    return null;
  }
  function onLockEvent(ev){
    if(aAcces()) return;
    var t=cibleVerrou(ev.target);
    if(!t) return;
    ev.preventDefault();
    ev.stopPropagation();
    ouvrirAbo();
  }
  function demarrer(){
    try{ document.documentElement.classList.toggle("mq-abonne", aAcces()); }catch(e){}
    marquerCadenas();
    if(window.MutationObserver&&document.body){
      var t=0;
      var obs=new MutationObserver(function(){
        if(t) return;
        t=1;
        setTimeout(function(){ t=0; marquerCadenas(); }, 40);
      });
      obs.observe(document.body,{childList:true,subtree:true});
    }
  }
  document.addEventListener("click", onLockEvent, true);
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();
})();


(function(){
  "use strict";
  function lazyImages(){
    var vh=window.innerHeight||800;
    var imgs=document.querySelectorAll("img:not([loading])");
    for(var i=0;i<imgs.length;i++){
      var im=imgs[i];
      if(im.closest("header,.logo,#mini-teaser")) continue;
      if(im.classList.contains("logo-img")) continue;
      var top=0;
      try{ top=im.getBoundingClientRect().top; }catch(e){ top=vh+1; }
      if(top<vh*1.15) continue;
      im.loading="lazy";
      if(!im.hasAttribute("decoding")) im.decoding="async";
    }
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", lazyImages);
  else lazyImages();
})();

/* Popup « Le top » depuis le menu, toutes les pages */
(function(){
  var TEXT="Le top, c'est la cotation approximative du Pokémon.";
  function injectCss(){
    if(document.getElementById("le-top-site-css"))return;
    var css=
      "html body nav ul.menu-principal>li.li-conseils-achat .liste-top1gen>li.li-le-top-menu{position:sticky;top:0;z-index:2;display:block;padding:.3rem .75rem .4rem;background:#fff;}"+
      "html body nav ul.menu-principal>li.li-conseils-achat .btn-le-top-menu{display:inline-block;font-family:inherit;font-weight:700;font-size:.88rem;line-height:1.2;padding:7px 12px;min-height:36px;border:1px solid var(--rouge,#d0021b);border-radius:10px;background:#fff;color:var(--rouge,#d0021b);cursor:pointer;white-space:nowrap}"+
      "html body nav ul.menu-principal>li.li-conseils-achat .btn-le-top-menu:hover,html body nav ul.menu-principal>li.li-conseils-achat .btn-le-top-menu:focus-visible{background:var(--rouge,#d0021b);color:#fff;outline:none}"+
      ".fond-le-top-site{position:fixed;inset:0;z-index:12000;background:transparent}"+
      ".fond-le-top-site[hidden]{display:none !important}"+
      ".dialog-le-top-site{position:fixed;width:7.5cm;height:10cm;box-sizing:border-box;background:transparent !important;border:0 !important;outline:0 !important;border-radius:14px;box-shadow:0 0 16px rgba(120,230,255,.3),0 0 28px rgba(255,130,220,.16),inset 0 0 22px rgba(200,245,255,.12) !important;padding:22px 16px 14px;overflow:hidden;isolation:isolate;color:#000 !important;font-weight:700;display:flex;flex-direction:column;right:max(16px, env(safe-area-inset-right));bottom:max(16px, env(safe-area-inset-bottom));z-index:12001}"+
      ".dialog-le-top-site::before{content:\"\";position:absolute;inset:-45%;width:190%;height:190%;margin:auto;pointer-events:none;z-index:0;opacity:.2;background:conic-gradient(from 0deg,rgba(255,90,200,.7),rgba(255,220,90,.65),rgba(80,255,210,.65),rgba(80,170,255,.7),rgba(190,110,255,.7),rgba(255,90,200,.7));mix-blend-mode:screen;animation:le-top-holo-spin 14s linear infinite}"+
      ".dialog-le-top-site::after{content:\"\";position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:0;opacity:.2;background:linear-gradient(115deg,transparent 20%,rgba(255,255,255,.5) 46%,rgba(180,255,255,.35) 52%,transparent 70%);background-size:220% 220%;mix-blend-mode:screen;animation:le-top-holo-shine 7s ease-in-out infinite,le-top-holo-flicker 3.8s ease-in-out infinite}"+
      ".dialog-le-top-site>*{position:relative;z-index:1}"+
      ".dialog-le-top-site p{margin:0 0 1.2em;font-size:.95rem;line-height:1.45;color:#000;font-weight:700;text-shadow:0 0 5px rgba(255,255,255,.85),0 1px 0 rgba(255,255,255,.7)}"+
      ".dialog-le-top-defile{position:relative;flex:1 1 auto;min-height:0;overflow:hidden}"+
      ".dialog-le-top-piste{position:absolute;left:0;right:0;top:0;animation:le-top-defile 16s linear infinite}"+
      ".dialog-le-top-site:hover .dialog-le-top-piste{animation-play-state:paused}"+
      "@keyframes le-top-defile{0%,18%{top:0;transform:translateY(0)}100%{top:100%;transform:translateY(-100%)}}"+
      "@keyframes le-top-holo-spin{to{transform:rotate(360deg)}}"+
      "@keyframes le-top-holo-shine{0%,100%{background-position:0% 40%}50%{background-position:100% 60%}}"+
      "@keyframes le-top-holo-flicker{0%,100%{opacity:.16}40%{opacity:.26}55%{opacity:.18}70%{opacity:.24}}"+
      "@media (prefers-reduced-motion:reduce){.dialog-le-top-piste{animation:none;transform:none;position:static}.dialog-le-top-defile{overflow:auto}.dialog-le-top-site::before,.dialog-le-top-site::after{animation:none;opacity:.16}}"+
      ".fermer-le-top-site{position:absolute;top:0;right:0;width:28px;height:28px;border:0;background:transparent;font-size:.85rem;line-height:1;cursor:pointer;color:#000;font-weight:600;border-radius:6px;z-index:2;opacity:.35;padding:0}"+
      ".fermer-le-top-site:hover,.fermer-le-top-site:focus-visible{opacity:.9;background:transparent;outline:none}";
    var st=document.createElement("style");
    st.id="le-top-site-css";
    st.textContent=css;
    (document.head||document.documentElement).appendChild(st);
  }
  function overlaps(a,b,pad){
    pad=pad||8;
    return !(a.right+pad<b.left||a.left-pad>b.right||a.bottom+pad<b.top||a.top-pad>b.bottom);
  }
  function place(){
    var box=document.getElementById("dialog-le-top-site");
    if(!box||box.parentElement&&box.parentElement.hidden)return;
    var margin=16;
    var right=margin, bottom=margin;
    box.style.right=right+"px";
    box.style.bottom=bottom+"px";
    var boxR=box.getBoundingClientRect();
    var avoid=[];
    var teaser=document.getElementById("mini-teaser");
    if(teaser){
      var tr=teaser.getBoundingClientRect(), cs=getComputedStyle(teaser);
      if(cs.display!=="none"&&cs.visibility!=="hidden"&&tr.width>2&&tr.height>2) avoid.push(tr);
    }
    var haut=document.getElementById("btn-haut-wrap");
    if(haut){
      var hr=haut.getBoundingClientRect(), hcs=getComputedStyle(haut);
      if(hcs.display!=="none"&&hr.width>2&&hr.height>2) avoid.push(hr);
    }
    document.querySelectorAll("nav .sous-menu, nav .liste-top1gen, header, nav").forEach(function(el){
      var r=el.getBoundingClientRect();
      if(r.width>2&&r.height>2) avoid.push(r);
    });
    var i, hit, tries=0;
    function rectAt(rt,bt){
      return {left:innerWidth-rt-boxR.width, right:innerWidth-rt, top:innerHeight-bt-boxR.height, bottom:innerHeight-bt, width:boxR.width, height:boxR.height};
    }
    while(tries<8){
      hit=null;
      var cur=rectAt(right,bottom);
      if(cur.top<margin){ bottom=Math.max(margin, innerHeight-boxR.height-margin); cur=rectAt(right,bottom); }
      for(i=0;i<avoid.length;i++){ if(overlaps(cur,avoid[i])){ hit=avoid[i]; break; } }
      if(!hit)break;
      /* Prefer sitting above a bottom-right obstacle, else slide left */
      var needBottom=Math.round(innerHeight-hit.top+12);
      if(needBottom+boxR.height+margin<=innerHeight){ bottom=needBottom; }
      else { right=Math.round(innerWidth-hit.left+12); }
      tries++;
    }
    box.style.right=Math.max(margin,right)+"px";
    box.style.bottom=Math.max(margin,bottom)+"px";
  }
  var last=null;
  function openTop(from){
    ensure();
    var fond=document.getElementById("fond-le-top-site");
    var box=document.getElementById("dialog-le-top-site");
    var close=document.getElementById("fermer-le-top-site");
    if(!fond||!box)return;
    last=from||document.activeElement;
    fond.hidden=false;
    var btn=document.getElementById("btn-le-top-menu");
    if(btn) btn.setAttribute("aria-expanded","true");
    place();
    (close&&close.focus?close:box).focus();
    requestAnimationFrame(place);
  }
  function closeTop(){
    var fond=document.getElementById("fond-le-top-site");
    if(!fond||fond.hidden)return;
    fond.hidden=true;
    var btn=document.getElementById("btn-le-top-menu");
    if(btn) btn.setAttribute("aria-expanded","false");
    if(last&&last.focus) last.focus();
    else if(btn) btn.focus();
  }
  function ensure(){
    injectCss();
    if(document.getElementById("fond-le-top-site"))return;
    var fond=document.createElement("div");
    fond.className="fond-le-top-site";
    fond.id="fond-le-top-site";
    fond.hidden=true;
    fond.innerHTML='<div class="dialog-le-top-site" id="dialog-le-top-site" role="dialog" aria-modal="true" aria-label="Le top" tabindex="-1"><button type="button" class="fermer-le-top-site" id="fermer-le-top-site" aria-label="Fermer">×</button><div class="dialog-le-top-defile"><div class="dialog-le-top-piste"><p>'+TEXT+"</p></div></div></div>";
    (document.body||document.documentElement).appendChild(fond);
    var box=document.getElementById("dialog-le-top-site");
    var close=document.getElementById("fermer-le-top-site");
    close.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();closeTop();});
    fond.addEventListener("click",function(e){if(e.target===fond)closeTop();});
    document.addEventListener("keydown",function(e){
      if(fond.hidden)return;
      if(e.key==="Escape"){e.preventDefault();closeTop();return;}
      if(e.key!=="Tab")return;
      var list=[].slice.call(box.querySelectorAll("button,[href],input,select,textarea,[tabindex]:not([tabindex='-1'])"));
      if(!list.length){e.preventDefault();close.focus();return;}
      var first=list[0], lastEl=list[list.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();lastEl.focus();}
      else if(!e.shiftKey&&document.activeElement===lastEl){e.preventDefault();first.focus();}
    });
    addEventListener("resize",function(){ if(!fond.hidden) place(); });
  }
  function bind(){
    injectCss();
    document.addEventListener("click",function(e){
      var b=e.target.closest&&e.target.closest(".btn-le-top-menu, #btn-le-top-menu");
      if(!b)return;
      e.preventDefault();
      e.stopPropagation();
      openTop(b);
    },true);
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",bind);
  else bind();
})();
