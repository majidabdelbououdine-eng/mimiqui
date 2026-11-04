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
      ['Cotation','cotation.html'],['Ventes pass\u00e9es Sp\u00e9cial Mimiqui','registre.html'],['Registre des cartes pass\u00e9es','registre-pokemon.html']]},
    {t:'Acheter',h:'boutique.html',p:['boutique.html'],s:[['Boutique','boutique.html'],['Boosters','jeu.html#boosters']]},
    {t:'Vendre sur eBay',h:'vendre.html',p:['vendre.html','estimer-ma-carte.html','guide-vendre-ebay.html'],s:[['Vendre sur eBay','vendre.html'],['Estimer ma carte','estimer-ma-carte.html'],['Guide pour vendre sur eBay','guide-vendre-ebay.html']]}
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
      ['Prix',[['Cotation','cotation.html'],['Ventes pass\u00e9es Sp\u00e9cial Mimiqui','registre.html'],['Registre des cartes pass\u00e9es','registre-pokemon.html']]],
      ['Acheter et vendre',[['Boutique','boutique.html'],['Boosters','jeu.html#boosters'],['Vendre sur eBay','vendre.html'],['Estimer ma carte','estimer-ma-carte.html'],['Guide pour vendre sur eBay','guide-vendre-ebay.html']]],
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

/* Mini-lecteur teaser Pokemon : Wild Card - video locale (sans YouTube) */
(function(){
  if(window.__miniTeaser)return;window.__miniTeaser=1;
  var SRC='videos/wild-card-bande-annonce.mp4',KT='mimiquiTeaserTemps',KR='mimiquiTeaserReduit';
  function go(){
    if(/(^|\/)registre-pokemon\.html$/i.test(location.pathname))return;if(document.getElementById('mini-teaser'))return;window.__mtAuto=true;
    var t=0;try{t=parseFloat(localStorage.getItem(KT))||0}catch(e){}
    var red=false;try{red=localStorage.getItem(KR)==='1'}catch(e){}
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
    b.addEventListener('click',function(){box.classList.toggle('reduit');try{localStorage.setItem(KR,box.classList.contains('reduit')?'1':'0')}catch(e){}lab()});
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
(function(){function majSM(li){var sm=li.querySelector('ul.sous-menu');if(!sm||!window.__fdFond)return;
 var L=window.__fdFond(sm);sm.classList.toggle('sm-clair',L>0.4);sm.classList.toggle('sm-sombre',L<=0.4)}
 function att(e){var li=e.target.closest&&e.target.closest('ul.menu-principal>li');if(!li)return;setTimeout(function(){majSM(li)},40);setTimeout(function(){majSM(li)},260)}
 document.addEventListener('mouseover',att,{passive:true});document.addEventListener('focusin',att);
 addEventListener('scroll',function(){var o=document.querySelectorAll('ul.menu-principal>li:hover,ul.menu-principal>li:focus-within');for(var i=0;i<o.length;i++)majSM(o[i])},{passive:true});})();
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
/* Sous-rubrique « Cartes Mimiqui » : flyout a droite, a gauche si pas de place (t358u) */
(function(){function init(){document.querySelectorAll('.sm-groupe').forEach(function(g){var b=g.querySelector('.sm-tog'),s=g.querySelector('.sm-sous');if(!b||!s)return;
function cote(){var r=g.getBoundingClientRect(),d=window.innerWidth>600,gc=d&&r.left-s.offsetWidth-8>=0;if(d&&!gc&&r.right+s.offsetWidth+8>window.innerWidth)gc=true;g.classList.toggle('sm-gauche',gc);var f=g.querySelector('.sm-fl');if(f)f.textContent=gc?'\u25C2':'\u25B8';}cote();window.addEventListener('resize',cote);
g.addEventListener('mouseenter',cote);
b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();cote();var o=g.classList.toggle('sm-ouvert');b.setAttribute('aria-expanded',o?'true':'false');});
var li=g.closest('ul.menu-principal>li');if(li)li.addEventListener('mouseleave',function(){g.classList.remove('sm-ouvert');b.setAttribute('aria-expanded','false');});});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})();

/* menu-vendre : le sous-menu « Vendre sur eBay » s'ouvre dans l'espace libre, au-dessus de tout */
(function(){
 var css='@media (min-width:1000px){'+
 'nav ul.menu-principal>li.li-vendre{position:relative}'+
 'nav ul.menu-principal>li.li-vendre>ul.sous-menu{z-index:2147483000!important;background:#fff!important;background-image:none!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;opacity:1!important;box-shadow:0 12px 32px rgba(0,0,0,.28)!important}nav ul.menu-principal>li.li-vendre>ul.sous-menu a{color:#111!important;text-shadow:none!important}nav ul.menu-principal>li.li-vendre>ul.sous-menu a:hover{color:#d0021b!important}'+
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
