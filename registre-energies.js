/* Registre des cartes passees : symboles d'energie JCC (dessines a la main) + effets hologramme */
(function(){
var I={
 feu:['Feu','#e8452c','#ff9a3c','<path d="M12 3c1 3 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 3 2 3-1-3 0-6 0-8z" fill="#fff"/>'],
 eau:['Eau','#1e6fd9','#5fb0ff','<path d="M12 4c3 4 5 7 5 10a5 5 0 0 1-10 0c0-3 2-6 5-10z" fill="#fff"/>'],
 plante:['Plante','#2f9a3a','#7fd36b','<path d="M6 17c0-7 5-11 12-11 0 7-4 12-11 12l-1 1v-2zm2-1c3-3 5-5 8-8" fill="#fff" stroke="#2f9a3a" stroke-width="1"/>'],
 electrique:['\u00c9lectrique','#e7b400','#ffe45c','<path d="M13 3 6 13h5l-1 8 7-11h-5z" fill="#fff"/>'],
 psy:['Psy','#7b3fb0','#c07ae8','<path d="M3 12c3-5 15-5 18 0-3 5-15 5-18 0z" fill="#fff"/><circle cx="12" cy="12" r="3" fill="#7b3fb0"/>'],
 combat:['Combat','#9a5a2a','#d48a4a','<rect x="6.5" y="6" width="3" height="5" rx="1.5" fill="#fff"/><rect x="9.6" y="5.5" width="3" height="5.5" rx="1.5" fill="#fff"/><rect x="12.7" y="6" width="3" height="5" rx="1.5" fill="#fff"/><rect x="15.6" y="7" width="2.6" height="4.5" rx="1.3" fill="#fff"/><path d="M6.5 10.5h11.7v4.5a4 4 0 0 1-4 4h-3.7a4 4 0 0 1-4-4z" fill="#fff"/><path d="M5 11.5c0-1 2-1.3 4.5-.3l1.5.8c.6.4.3 1.3-.4 1.2L8 12.8" fill="#fff" stroke="#9a5a2a" stroke-width=".9" stroke-linejoin="round"/><path d="M9.5 6.5v3.5M12.6 6v4M15.7 6.5v3.5" stroke="#9a5a2a" stroke-width=".6"/>'],
 obscurite:['Obscurit\u00e9','#2b2f3a','#5a6073','<path d="M15 4a8 8 0 1 0 5 13A7 7 0 0 1 15 4z" fill="#fff"/>'],
 metal:['M\u00e9tal','#7d8794','#c3cbd5','<path d="M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm-1-4h2l.5 2.5 2-1 1.5 1.5-1 2 2.5.5v2l-2.5.5 1 2-1.5 1.5-2-1L13 20.5h-2l-.5-2.5-2 1L7 17.5l1-2-2.5-.5v-2L8 12.5l-1-2L8.5 9l2 1z" fill="#fff"/><circle cx="12" cy="12" r="2" fill="#7d8794"/>'],
 dragon:['Dragon','#b8902a','#f0cf5a','<path d="M5 18c2-8 8-12 14-13-3 2-4 4-4 6l3-1c-2 3-5 5-9 6l3 1c-2 1-5 1-7 1z" fill="#fff"/>'],
 fee:['F\u00e9e','#e05a9e','#ffa6d2','<path d="M12 3l2 6h6l-5 3.6L17 19l-5-3.8L7 19l2-6.4L4 9h6z" fill="#fff"/>'],
 incolore:['Incolore','#a9adb3','#f4f4f4','<path d="M12 3l2.2 6.8H21l-5.6 4 2.2 6.8-5.6-4.2-5.6 4.2 2.2-6.8-5.6-4H9.8z" fill="#7a7f86"/>']};
var MAP={fire:'feu',water:'eau',ice:'eau',grass:'plante',bug:'plante',electric:'electrique',psychic:'psy',poison:'psy',ghost:'psy',fighting:'combat',ground:'combat',rock:'combat',dark:'obscurite',steel:'metal',dragon:'dragon',fairy:'fee',normal:'incolore',flying:'incolore'};
function svg(e){return '<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true" focusable="false"><defs><radialGradient id="g-'+e+'" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="'+I[e][2]+'"/><stop offset="1" stop-color="'+I[e][1]+'"/></radialGradient></defs><circle cx="12" cy="12" r="11" fill="url(#g-'+e+')" stroke="rgba(255,255,255,.85)" stroke-width="1"/>'+I[e][3]+'</svg>'}
function energies(){var F=document.getElementById('filtres');if(!F||F.dataset.energie)return !!F;F.dataset.energie='1';F.classList.add('energies');
 F.querySelectorAll('a[href^="#type-"]').forEach(function(a){var k=a.getAttribute('href').slice(6),e=MAP[k]||'incolore',txt=a.textContent.trim(),m=txt.match(/^(.*?)\s*\((\d+)\)$/),nom=m?m[1]:txt,n=m?m[2]:'';
  var lab=nom+(nom!==I[e][0]?' (\u00e9nergie '+I[e][0]+')':' (\u00e9nergie)')+(n?' \u2013 '+n+' Pok\u00e9mon':'');
  a.removeAttribute('style');a.className='energie e-'+e;a.title=lab;a.setAttribute('aria-label',lab);a.innerHTML=svg(e)+'<span class="e-nom">'+nom+'</span>'+(n?'<span class="e-n">'+n+'</span>':'');
  a.addEventListener('click',function(ev){ev.preventDefault();choisir(a)})});
 var tous=document.createElement('a');tous.href='#';tous.className='energie e-tous';tous.title=tous.ariaLabel='Tous les types';tous.setAttribute('aria-label','Tous les types');var tot=0;F.querySelectorAll('a.energie .e-n').forEach(function(x){tot+=+x.textContent});tous.innerHTML='<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#0b3d91" stroke="rgba(255,255,255,.85)"/><circle cx="8" cy="9" r="2.3" fill="#e8452c"/><circle cx="16" cy="9" r="2.3" fill="#5fb0ff"/><circle cx="8" cy="15" r="2.3" fill="#7fd36b"/><circle cx="16" cy="15" r="2.3" fill="#ffe45c"/></svg><span class="e-nom">Tous</span><span class="e-n">'+tot+'</span>';tous.addEventListener('click',function(ev){ev.preventDefault();choisir(tous)});F.insertBefore(tous,F.firstChild);
 function choisir(a){var k=a.classList.contains('e-tous')?null:a.getAttribute('href').slice(6);F.querySelectorAll('a.energie').forEach(function(x){x.classList.toggle('on',x===a);x.setAttribute('aria-current',x===a?'true':'false')});document.querySelectorAll('section.ty').forEach(function(sec){var ok=!k||sec.id==='type-'+k;sec.style.display=ok?'':'none';var d=sec.querySelector('details');if(d)d.open=!!k&&ok});if(k){var sc=document.getElementById('type-'+k);if(sc)sc.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}try{history.replaceState(null,'',k?'#type-'+k:location.pathname)}catch(e){}}

 var h=location.hash,s0=h&&F.querySelector('a[href="'+h+'"]');choisir(s0||tous);return true}
function effets(){var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
 var io=('IntersectionObserver' in window)&&!RM?new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('rp-vu');io.unobserve(x.target)}})},{rootMargin:'0px 0px -5% 0px'}):null;
 function scan(){document.querySelectorAll('section.ty,details.p').forEach(function(el){if(el.classList.contains('rp-el'))return;el.classList.add('rp-el');if(io)io.observe(el)});
  document.querySelectorAll('.corps td b,.corps b').forEach(function(b){if(/\d/.test(b.textContent))b.classList.add('rp-prix')})}
 scan();new MutationObserver(function(){clearTimeout(scan.t);scan.t=setTimeout(scan,200)}).observe(document.body,{childList:true,subtree:true})}
function go(){var n=0;(function t(){if(!energies()&&n++<40)return setTimeout(t,150)})();effets()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();