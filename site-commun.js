var __acc=/(\/|\/index\.html?)$/i.test(location.pathname);
/* site-commun.js : menu, hamburger, fil d'Ariane, pied de page (Le Coin de Mimiqui) */
(function(){
  "use strict";
  var page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(page==='accueil.html')page='index.html';
  var SECTIONS=[
    {t:'Accueil',h:'index.html',p:['index.html']},
    {t:'Cartes',h:'cartes.html',p:['cartes.html','cartes-japonaises.html','cartes-anglaises.html','cartes-pokemon.html','pokemon.html'],s:[
      ['Cartes FR','cartes.html'],['Cartes JA','cartes-japonaises.html'],['Cartes EN','cartes-anglaises.html'],['Cartes Pok\u00e9mon','cartes-pokemon.html']]},
    {t:'Prix',h:'cotation.html',p:['cotation.html','registre.html','registre-pokemon.html','adjuge.html'],s:[
      ['Cotation','cotation.html'],['Registre des ventes pass\u00e9es','registre.html'],['Registre des cartes pass\u00e9es','registre-pokemon.html'],['Adjug\u00e9','adjuge.html']]},
    {t:'Acheter',h:'boutique.html',p:['boutique.html'],s:[['Boutique','boutique.html'],['Boosters','jeu.html#boosters']]},
    {t:'Vendre sur eBay',h:'vendre.html',p:['vendre.html']}
  ];
  var AUTRES={'blog.html':'Blog','jeu.html':'Jeu','confidentialite.html':'Cookies et vie priv\u00e9e','assistant-instagram.html':'Assistant Instagram','404.html':'Page introuvable'};
  function el(tag,attrs,txt){var e=document.createElement(tag);for(var k in attrs||{})e.setAttribute(k,attrs[k]);if(txt!=null)e.textContent=txt;return e;}
  function courante(){for(var i=0;i<SECTIONS.length;i++)if(SECTIONS[i].p.indexOf(page)>=0)return SECTIONS[i];return null;}

  /* Menu */
  function menu(){
    var nav=document.querySelector('nav.sitenav,header nav.top');if(!nav)return;
    var ul=nav.querySelector('ul.menu-principal');if(!ul)return;
    nav.classList.add('nav-commune');
    var cur=courante();
    ul.querySelectorAll(':scope>li').forEach(function(li,i){
      var sec=SECTIONS[i];if(!sec)return;var a=li.querySelector(':scope>a');
      if(sec===cur){li.classList.add('actif');a.setAttribute('aria-current',sec.p.length===1?'page':'true');}
      li.querySelectorAll('.sous-menu a').forEach(function(s){if(s.getAttribute('href').toLowerCase()===page)s.setAttribute('aria-current','page');});
      var btn=li.querySelector(':scope>button.ouvre-sous');
      if(btn)btn.addEventListener('click',function(e){e.preventDefault();var o=li.classList.toggle('ouvert');btn.setAttribute('aria-expanded',o?'true':'false');});
    });
    if(!nav.querySelector('.hamburger')){
      var h=el('button',{type:'button','class':'hamburger','aria-label':'Ouvrir le menu','aria-expanded':'false','aria-controls':'menu-principal'});
      h.innerHTML='<span></span><span></span><span></span>';
      ul.id=ul.id||'menu-principal';
      ul.parentNode.insertBefore(h,ul);
      h.addEventListener('click',function(){var o=nav.classList.toggle('menu-ouvert');h.setAttribute('aria-expanded',o?'true':'false');h.setAttribute('aria-label',o?'Fermer le menu':'Ouvrir le menu');});
    }
    document.addEventListener('click',function(e){if(!nav.contains(e.target)){nav.classList.remove('menu-ouvert');ul.querySelectorAll('li.ouvert').forEach(function(l){l.classList.remove('ouvert');});}});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'){nav.classList.remove('menu-ouvert');ul.querySelectorAll('li.ouvert').forEach(function(l){l.classList.remove('ouvert');});}});
  }

  /* Fil d'Ariane */
  function ariane(){
    if(page==='index.html'||document.querySelector('.fil-ariane'))return;
    var items=[['Accueil','index.html']],cur=courante();
    if(cur){
      if(cur.s){items.push([cur.t,cur.h]);
        var sp=cur.s.filter(function(s){return s[1].toLowerCase()===page;})[0];
        if(sp)items.push([sp[0],null]);
        else if(page==='pokemon.html'){items.push(['Cartes Pok\u00e9mon','cartes-pokemon.html']);
          var n=new URLSearchParams(location.search).get('n');items.push([n?decodeURIComponent(n):'Pok\u00e9mon',null]);}
        if(items[items.length-1][1]===cur.h&&!sp)items[items.length-1][1]=null;
      }else items.push([cur.t,null]);
    }else items.push([AUTRES[page]||document.title.split(/[\u2013\u2014|\u00b7-]/)[0].trim(),null]);
    var nav=el('nav',{'class':'fil-ariane wrap','aria-label':"Fil d'Ariane"}),ol=el('ol');
    items.forEach(function(it,i){var li=el('li');
      if(it[1]&&i<items.length-1)li.appendChild(el('a',{href:it[1]},it[0]));else li.appendChild(el('span',{'aria-current':'page'},it[0]));
      ol.appendChild(li);});
    nav.appendChild(ol);
    var header=document.querySelector('header.site,header.wrap,body>header');
    if(header&&header.parentNode)header.parentNode.insertBefore(nav,header.nextSibling);else document.body.insertBefore(nav,document.body.firstChild);
  }

  /* Pied de page */
  function pied(){
    if(document.querySelector('.pied-commun'))return;
    var groupes=[
      ['Cartes',[['Cartes FR','cartes.html'],['Cartes JA','cartes-japonaises.html'],['Cartes EN','cartes-anglaises.html'],['Cartes Pok\u00e9mon','cartes-pokemon.html']]],
      ['Prix',[['Cotation','cotation.html'],['Registre des ventes pass\u00e9es','registre.html'],['Registre des cartes pass\u00e9es','registre-pokemon.html'],['Adjug\u00e9','adjuge.html']]],
      ['Acheter et vendre',[['Boutique','boutique.html'],['Boosters','jeu.html#boosters'],['Vendre sur eBay','vendre.html']]],
      ['D\u00e9couvrir',[['Blog','blog.html'],['Blog Instagram','https://www.instagram.com/lecoindemimiqui/'],['Jeu','jeu.html'],['Le film 2027','index.html#film'],['Le d\u00e9guisement','index.html#deguisement'],['Faiblesses','index.html#types'],['Rubriques','index.html#rubriques']]],
      ['Le site',[['Cr\u00e9er un compte','index.html#compte'],['Assistant Instagram','assistant-instagram.html'],['Cookies et vie priv\u00e9e','confidentialite.html']]]
    ];
    var box=el('div',{'class':'pied-commun wrap'}),grid=el('div',{'class':'pied-groupes'});
    groupes.forEach(function(g){var c=el('div');c.appendChild(el('h3',null,g[0]));var u=el('ul');
      g[1].forEach(function(l){var li=el('li'),a=el('a',{href:l[1]},l[0]);if(/^https?:/.test(l[1])){a.target='_blank';a.rel='noopener';}li.appendChild(a);u.appendChild(li);});
      c.appendChild(u);grid.appendChild(c);});
    box.appendChild(grid);
    box.appendChild(el('p',{'class':'mention-affiliation'},'Certains liens eBay sont des liens affili\u00e9s : le site peut toucher une commission, sans surco\u00fbt pour vous.'));
    var f=document.querySelector('body>footer')||document.querySelector('footer');
    if(f)f.insertBefore(box,f.firstChild);
    else{f=el('footer',{'class':'pied-site'});f.appendChild(box);var s=document.querySelector('body>script');document.body.appendChild(f);}
  }

  /* Recherche ?q= sur cartes-pokemon.html */
  function rechercheQ(){
    if(page!=='cartes-pokemon.html')return;
    var q=new URLSearchParams(location.search).get('q');if(!q)return;
    var i=document.getElementById('q');if(!i)return;
    i.value=q;['input','change','keyup'].forEach(function(t){i.dispatchEvent(new Event(t,{bubbles:true}));});
  }

  function go(){try{menu();}catch(e){console.error(e);}try{ariane();}catch(e){console.error(e);}try{pied();}catch(e){console.error(e);}try{rechercheQ();}catch(e){console.error(e);}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
  window.addEventListener('load',rechercheQ);
})();

/* Mini-lecteur teaser Pokémon : Wild Card (toujours visible, sans bouton fermer) */
(function(){
  if(window.__miniTeaser)return;window.__miniTeaser=1;
  var VID='H6_jMQ6whtQ',KT='mimiquiTeaserTemps',KR='mimiquiTeaserReduit',player=null;
  function go(){
    if(document.getElementById('mini-teaser'))return;var auto=true;try{auto=sessionStorage.getItem('mimiquiTeaserVu')!=='1';sessionStorage.setItem('mimiquiTeaserVu','1')}catch(e){}window.__mtAuto=auto;
    var t=0;try{t=Math.floor(parseFloat(localStorage.getItem(KT))||0)}catch(e){}
    var red=false;try{red=localStorage.getItem(KR)==='1'}catch(e){}
    var box=document.createElement('div');box.id='mini-teaser';if(red)box.className='reduit';
    box.innerHTML='<div class="mt-barre"><span class="mt-titre">Pok\u00e9mon : Wild Card \u2013 teaser</span><button type="button" class="mt-taille" aria-label="R\u00e9duire ou agrandir"></button></div><div class="mt-video"><div id="mini-teaser-yt"></div><button type="button" class="mt-play" aria-label="Lecture"></button></div>';
    document.body.appendChild(box);
    var pb=box.querySelector('.mt-play');
    pb.addEventListener('click',function(){try{if(player&&player.playVideo){player.unMute();player.setVolume(100);player.playVideo();pb.style.display='none'}}catch(x){}});
    var b=box.querySelector('.mt-taille');
    function lab(){b.textContent=box.classList.contains('reduit')?'\u2922 Agrandir':'\u2013 R\u00e9duire'}lab();
    b.addEventListener('click',function(){box.classList.toggle('reduit');try{localStorage.setItem(KR,box.classList.contains('reduit')?'1':'0')}catch(e){}lab()});
    window.onYouTubeIframeAPIReady=function(){
      player=window.__mtPlayer=new YT.Player('mini-teaser-yt',{host:'https://www.youtube.com',videoId:VID,width:'100%',height:'100%',
        playerVars:{autoplay:auto?1:0,mute:1,controls:1,loop:1,playlist:VID,start:t,playsinline:1,rel:0,modestbranding:1,origin:location.origin,widget_referrer:location.href},
        events:{onStateChange:function(e){try{pb.style.display=(e.data===1&&!e.target.isMuted())||e.data===3&&pb.style.display==='none'?'none':''}catch(x){}},onReady:function(e){try{e.target.mute();if(t)e.target.seekTo(t,true);if(auto)e.target.playVideo();else e.target.pauseVideo()}catch(x){}}}});
    };
    function api(){var s=document.createElement('script');s.src='https://www.youtube.com/iframe_api';document.head.appendChild(s)}if(document.readyState==='complete')setTimeout(api,300);else window.addEventListener('load',function(){setTimeout(api,300)});
    function save(){try{if(player&&player.getCurrentTime)localStorage.setItem(KT,String(player.getCurrentTime()))}catch(e){}}
    window.addEventListener('beforeunload',save);window.addEventListener('pagehide',save);setInterval(save,3000);
    document.body.classList.add('avec-mini-teaser');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();

/* Son au premier geste du visiteur */
(function(){var fait=false;function son(e){if(fait||!window.__mtAuto)return;var p=window.__mtPlayer;if(!p||!p.unMute)return;try{p.unMute();p.setVolume(100);p.playVideo();fait=true;['pointerdown','keydown','touchstart','click'].forEach(function(t){window.removeEventListener(t,son,true)})}catch(x){}}['pointerdown','keydown','touchstart','click'].forEach(function(t){window.addEventListener(t,son,true)})})();
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
function win(){if(document.getElementById('fenetre-defilante'))return;var d=document.createElement('section');d.id='fenetre-defilante';d.setAttribute('aria-label','Le film Pok\u00e9mon : Wild Card en bref');
d.innerHTML='<button type="button" class="fd-fermer" aria-label="Fermer">\u00d7</button><div class="fd-piste"><div class="fd-bloc">'+T+'</div><div class="fd-bloc" aria-hidden="true">'+T+'</div></div>';
d.querySelector('.fd-fermer').addEventListener('click',function(){set(true);d.remove();tab()});document.body.appendChild(d)}
function go(){if(window.matchMedia&&matchMedia('(max-width:600px)').matches){tab();return}if(/(\/|\/index\.html?)$/i.test(location.pathname)){set(false);win();return}if(ferme())tab();else win()}
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
(function(){function majSM(li){var sm=li.querySelector('ul.sous-menu');if(!sm||!window.__fdFond)return;
 var L=window.__fdFond(sm);sm.classList.toggle('sm-clair',L>0.4);sm.classList.toggle('sm-sombre',L<=0.4)}
 function att(e){var li=e.target.closest&&e.target.closest('ul.menu-principal>li');if(!li)return;setTimeout(function(){majSM(li)},40);setTimeout(function(){majSM(li)},260)}
 document.addEventListener('mouseover',att,{passive:true});document.addEventListener('focusin',att);
 addEventListener('scroll',function(){var o=document.querySelectorAll('ul.menu-principal>li:hover,ul.menu-principal>li:focus-within');for(var i=0;i<o.length;i++)majSM(o[i])},{passive:true});})();