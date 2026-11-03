/* Repaire des Fans : badges, filtres, commentaire du jour, compteur, humeur, mots-cles, sondage */
(function(){
var NET={Instagram:['IG','#c13584'],Reddit:['R','#ff4500'],X:['X','#111'],YouTube:['YT','#e00'],TikTok:['TT','#010101'],Facebook:['f','#1877f2'],Threads:['@','#222'],Bluesky:['B','#1185fe'],'Fan du site':['\u2665','#0b3d91']};
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
window.rfBadge=function(p){var n=NET[p]||['\u2709','#5a6b85'];return '<span class="rf-badge" style="background:'+n[1]+'" title="'+esc(p)+'">'+n[0]+'</span>'+(p==='Fan du site'?'<span class="rf-fan">Fan du site</span>':'')};
function carte(c){return '<article class="rfx-com">'+window.rfBadge(c.provenance)+'<p class="rfx-q">\u00ab '+esc(c.texte_fr)+' \u00bb</p><p class="rfx-a"><b>'+esc(c.pseudo)+'</b> \u00b7 '+(c.lien?'<a href="'+esc(c.lien)+'" target="_blank" rel="noopener">'+esc(c.source||c.provenance)+' ('+esc(c.provenance)+')</a>':esc(c.provenance))+(c.date?' \u00b7 '+esc(c.date):'')+'</p></article>'}
function init(){
 var D=window.COMMENTAIRES_FANS||[],S=document.getElementById('rf-fans');if(!S)return;
 S.querySelector('.rfx-compte').textContent=D.length+' commentaire'+(D.length>1?'s':'')+' de fans sur Wild Card';
 if(D.length){var j=Math.floor(Date.now()/864e5)%D.length;S.querySelector('.rfx-jour').innerHTML='<p class="rfx-et">Commentaire du jour</p>'+carte(D[j]);}
 var cnt={impatient:0,content:0,'d\u00e9\u00e7u':0},tot=0;D.forEach(function(c){if(cnt.hasOwnProperty(c.sentiment)){cnt[c.sentiment]++;tot++}});
 var H=S.querySelector('.rfx-humeur');if(!tot)H.hidden=true;else{var lab={impatient:'Impatients',content:'Contents','d\u00e9\u00e7u':'D\u00e9\u00e7us'};H.innerHTML='<h3>L\u2019humeur des fans</h3>'+Object.keys(cnt).map(function(k){var p=Math.round(cnt[k]*100/tot);return '<div class="rfx-jauge"><span>'+lab[k]+'</span><div class="rfx-bar"><i class="rfx-'+(k==='content'?'c':k==='impatient'?'i':'d')+'" style="width:'+p+'%"></i></div><b>'+p+' %</b></div>'}).join('')+'<p class="rfx-note">Sur '+tot+' commentaires class\u00e9s.</p>'}
 var tags={};D.forEach(function(c){(c.hashtags||[]).forEach(function(h){h='#'+String(h).replace(/^#/,'');tags[h]=(tags[h]||0)+1})});
 var titre='Hashtags des fans';if(Object.keys(tags).length<5){tags={};titre='Les mots qui reviennent';var stop='pour avec dans mais plus tout tous cette sont avoir faire comme leur leurs elle elles vous nous quand alors aussi encore depuis vraiment franchement juste ⁠quelqu ils qu\u2019ils c\u2019est j\u2019ai n\u2019a pas une des les est que qui sur son ses mon'.split(' ');
  D.forEach(function(c){(c.texte_fr.toLowerCase().match(/[a-z\u00e0-\u00ff]{4,}/g)||[]).forEach(function(w){if(stop.indexOf(w)<0)tags[w]=(tags[w]||0)+1})})}
 var top=Object.keys(tags).filter(function(k){return tags[k]>1}).sort(function(a,b){return tags[b]-tags[a]}).slice(0,18),mx=top.length?tags[top[0]]:1;
 S.querySelector('.rfx-mots').innerHTML='<h3>'+titre+'</h3><p>'+top.map(function(k){return '<span style="font-size:'+(0.85+0.9*tags[k]/mx).toFixed(2)+'rem" title="'+tags[k]+' fois">'+esc(k)+'</span>'}).join(' ')+'</p>';
 var L=S.querySelector('.rfx-liste');function liste(){var f=window.rfFiltre||'Tous',g=['Instagram','TikTok','X','YouTube','Reddit'];var v=D.filter(function(c){return f==='Tous'||(f==='Autres'?g.indexOf(c.provenance)<0:c.provenance===f)});L.innerHTML=v.length?v.map(carte).join(''):'<p class="rfx-note">Aucun commentaire pour ce r\u00e9seau pour l\u2019instant.</p>'}
 S.querySelector('.rfx-filtres').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;window.rfFiltre=b.getAttribute('data-f');[].forEach.call(this.children,function(x){x.classList.toggle('on',x===b)});liste();document.dispatchEvent(new Event('rf-filtre'))});liste();
 var P=S.querySelector('.rfx-sondage'),K='rfSondageWildCard',dv=null;try{dv=localStorage.getItem(K)}catch(e){}
 function merci(v){P.querySelector('.rfx-choix').innerHTML='<p class="rfx-merci">Merci ! Tu as vot\u00e9 <b>'+esc(v)+'</b>.</p>'}
 if(dv)merci(dv);else P.querySelector('.rfx-choix').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var v=b.textContent;try{localStorage.setItem(K,v)}catch(x){}merci(v);
  try{fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({access_key:'c8f600de-749f-4654-9435-5e034ccd29f1',subject:'Sondage Wild Card : '+v,from_name:'Sondage du Repaire des Fans',message:'Vote : '+v})})}catch(x){}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();