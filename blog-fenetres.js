/* Repaire des Fans : fenetre droite (infos) + bandeau bas (messages lies), synchronises */
(function(){
var I=[
 {t:"Le film",h:"Pok\u00e9mon : Wild Card",p:"Annonc\u00e9 le 30 ao\u00fbt 2026, \u00e0 la cl\u00f4ture des Championnats du monde Pok\u00e9mon \u00e0 San Francisco.",m:["Wild Card a \u00e9t\u00e9 r\u00e9v\u00e9l\u00e9 aux Championnats du monde 2026","Annonce faite \u00e0 San Francisco le 30 ao\u00fbt 2026"]},
 {t:"Le film",h:"Sortie en 2027",p:"Le premier film Pok\u00e9mon au cin\u00e9ma depuis Les Secrets de la jungle (2020).",m:["Rendez-vous au cin\u00e9ma en 2027","Date exacte en France : \u00e0 compl\u00e9ter"]},
 {t:"Mimiqui",h:"Partenaire du h\u00e9ros",p:"Le h\u00e9ros est un joueur du JCC Pok\u00e9mon qui veut devenir champion, et son partenaire est Mimiqui.",m:["Mimiqui tient la vedette","Le premier film consacr\u00e9 au jeu de cartes","Sacha n\u2019appara\u00eet pas dans ce film"]},
 {t:"Vid\u00e9o",h:"Le teaser officiel",p:"39 secondes, aussi en version japonaise.",m:["Regarde le teaser dans le mini-lecteur","Existe aussi en version japonaise"]},
 {t:"Mimiqui",h:"Le talent Fant\u00f4masque",p:"La premi\u00e8re attaque qui touche Mimiqui est absorb\u00e9e par son d\u00e9guisement.",m:["Fant\u00f4masque = Disguise en anglais","Depuis la 8e g\u00e9n\u00e9ration, Mimiqui perd 1/8 de ses PV quand le d\u00e9guisement se brise"]},
 {t:"Conseil",h:"Rep\u00e9rer une fausse carte",p:"Un prix tr\u00e8s en dessous de la cote doit vous mettre en alerte.",m:["Compare couleurs, police, finition holo et \u00e9paisseur","Demande des photos nettes du recto et du verso","Regarde la note du vendeur"]},
 {t:"Conseil",h:"Conserver sa collection",p:"Sleeve, puis toploader ou classeur adapt\u00e9.",m:["\u00c9vite la lumi\u00e8re directe","\u00c9vite l\u2019humidit\u00e9 et la chaleur"]},
 {t:"Cartes",h:"Nouvelles cartes et bonnes affaires",p:"Suivez les prix sur la page cotation du site.",m:["Consulte la cotation avant d\u2019acheter","Nouveaut\u00e9s du moment : \u00e0 compl\u00e9ter"]}
];
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function rfC(c){var l=c.langue&&c.langue!=='fr'?' \u00b7 traduit'+(c.langue==='en'?' de l\u2019anglais':''):'';var src=c.source?esc(c.source)+' ('+esc(c.provenance)+')':esc(c.provenance);
 return '<span class="rf-com">'+(window.rfBadge?window.rfBadge(c.provenance):'')+'<span class="rf-q">\u00ab '+esc(c.texte_fr)+' \u00bb</span><span class="rf-a"><b>'+esc(c.pseudo)+'</b> \u00b7 '+(c.lien?'<a href="'+esc(c.lien)+'" target="_blank" rel="noopener">'+src+'</a>':src)+l+'</span></span>'}
function okF(c){var f=window.rfFiltre||'Tous';if(f==='Tous')return true;var g=['Instagram','TikTok','X','YouTube','Reddit'];return f==='Autres'?g.indexOf(c.provenance)<0:c.provenance===f}
function comsDe(i){return (window.COMMENTAIRES_FANS||[]).filter(function(c){return (c.carte==null||c.carte===i)&&okF(c)}).map(rfC)}
var C={};
var dur=9000,ecoule=0,VIT=70;var DUREE=9000,n=0,pause=false,timer=null,K='rfFenetres';
function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
function etat(k){try{var v=localStorage.getItem(K+k);if(v!==null)return v==='1'}catch(e){}return !matchMedia('(max-width:900px)').matches}
function mem(k,v){try{localStorage.setItem(K+k,v?'1':'0')}catch(e){}}
var D,B,piste,band;
function build(){
 D=el('aside','rf-win rf-droite');D.setAttribute('aria-label','Infos du Repaire des Fans');
 D.innerHTML='<div class="rf-barre"><b>Infos des fans</b><button type="button" class="rf-x" aria-label="Fermer">\u00d7</button></div><div class="rf-vue"><div class="rf-piste"></div></div><div class="rf-points"></div>';
 piste=D.querySelector('.rf-piste');
 I.forEach(function(it,i){var c=el('div','rf-carte','<p class="rf-tag">'+it.t+'</p><h3>'+it.h+'</h3><p>'+it.p+'</p>');piste.appendChild(c);var d=el('button','rf-pt');d.type='button';d.setAttribute('aria-label','Info '+(i+1));d.onclick=function(){aller(i)};D.querySelector('.rf-points').appendChild(d)});
 B=el('aside','rf-win rf-bas');B.setAttribute('aria-label','Messages li\u00e9s');
 B.innerHTML='<button type="button" class="rf-x" aria-label="Fermer">\u00d7</button><div class="rf-bande"><div class="rf-defil"></div></div>';
 band=B.querySelector('.rf-defil');
 [D,B].forEach(function(w){w.addEventListener('mouseenter',function(){pause=true;document.body.classList.add('rf-pause')});w.addEventListener('mouseleave',function(){pause=false;document.body.classList.remove('rf-pause')})});
 D.querySelector('.rf-x').onclick=function(){montrer('D',false)};B.querySelector('.rf-x').onclick=function(){montrer('B',false)};
 document.body.appendChild(D);document.body.appendChild(B);
 var r=el('div','rf-rouvrir');r.innerHTML='<button type="button" data-k="D">Infos \u25b8</button><button type="button" data-k="B">Messages \u25b8</button>';
 r.addEventListener('click',function(e){var k=e.target.getAttribute('data-k');if(k)montrer(k,true)});document.body.appendChild(r);
 montrer('D',etat('D'),1);montrer('B',etat('B'),1);aller(0);
 I.forEach(function(it){piste.appendChild(el('div','rf-carte','<p class="rf-tag">'+it.t+'</p><h3>'+it.h+'</h3><p>'+it.p+'</p>')).setAttribute('aria-hidden','true')});
 piste.style.transition='none';var vue=D.querySelector('.rf-vue'),RM=matchMedia('(prefers-reduced-motion: reduce)'),last=0,PXS=18;
 function hC(){return piste.children[0].offsetHeight||1}
 function tick(){var ts=Date.now();var dt=last?Math.min(100,ts-last):0;last=ts;var H=hC()*I.length;
  if(!RM.matches){if(!pause&&!document.hidden&&!D.hidden)off+=PXS*dt/1000;if(off>=H)off-=H;piste.style.transform='translateY('+(-off)+'px)'}
  var k=Math.floor((off+vue.clientHeight*0.35)/hC())%I.length;if(k!==n)bandeDe(k);
  if(RM.matches){ecoule+=dt;if(!pause&&ecoule>=dur)aller((n+1)%I.length)}
}
 setInterval(tick,40);
}
function montrer(k,v,init){var w=k==='D'?D:B;w.hidden=!v;if(!init)mem(k,v);document.querySelector('.rf-rouvrir [data-k="'+k+'"]').hidden=v;document.body.classList.toggle('rf-avec-'+k,v)}
var off=0;function aller(i){off=i*hC0();piste.style.transform='translateY('+(-off)+'px)';bandeDe(i)}
function hC0(){return piste.children[0].offsetHeight||0}
function bandeDe(i){n=i;var p=D.querySelectorAll('.rf-pt');for(var j=0;j<p.length;j++)p[j].classList.toggle('on',j===i);
 var txt=I[i].m.map(function(s){return '<span><b>'+I[i].h+' :</b> '+s+'</span>'}).join('')+comsDe(i).join('');band.innerHTML=txt+txt;band.style.animation='none';void band.offsetWidth;band.style.animation='';var w=band.scrollWidth/2,s=Math.max(8,w/VIT);band.style.animationDuration=s+'s';dur=Math.max(DUREE,s*1000+800);ecoule=0}
document.addEventListener('rf-filtre',function(){if(band)aller(n)});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();