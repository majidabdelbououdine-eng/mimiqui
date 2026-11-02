/* Accueil interactif : fond hologramme, halo souris, inclinaison 3D, apparitions */
(function(){
  var reduit=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tactile=window.matchMedia&&matchMedia('(hover: none)').matches;
  function go(){
    /* Apparitions au defilement (sans masquer ce qui est deja visible) */
    var els=[].slice.call(document.querySelectorAll('.accueil-tuiles>*,.rub,.billet-c,.t10,.insta-carte,.bloc,.pf-card'));
    if(!reduit&&'IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('ai-vu');io.unobserve(e.target)}})},{rootMargin:'0px 0px -5% 0px'});
      els.forEach(function(el,i){var r=el.getBoundingClientRect();if(r.top>innerHeight){el.classList.add('ai-entree');el.style.transitionDelay=(i%4)*70+'ms';io.observe(el)}});
    }
    if(reduit)return;
    /* Inclinaison 3D + reflet sur les tuiles (souris uniquement) */
    if(!tactile){
      document.querySelectorAll('.accueil-tuiles>*,.rub,.t10,.pf-card,.insta-carte').forEach(function(el){
        el.classList.add('ai-tilt');if(getComputedStyle(el).position==='static')el.style.position='relative';
        var g=document.createElement('span');g.className='ai-glare';g.setAttribute('aria-hidden','true');el.appendChild(g);
        el.addEventListener('mousemove',function(e){var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
          el.style.transform='perspective(700px) rotateX('+((.5-y)*8).toFixed(2)+'deg) rotateY('+((x-.5)*10).toFixed(2)+'deg) translateY(-3px)';
          el.style.setProperty('--gx',(x*100)+'%');el.style.setProperty('--gy',(y*100)+'%')});
        el.addEventListener('mouseleave',function(){el.style.transform=''});
      });
      /* Halo cyan qui suit la souris */
      var spot=document.createElement('div');spot.id='holo-spot';spot.setAttribute('aria-hidden','true');document.body.appendChild(spot);
      var sx=-500,sy=-500,pend=false;
      addEventListener('mousemove',function(e){sx=e.clientX;sy=e.clientY;if(!pend){pend=true;requestAnimationFrame(function(){spot.style.transform='translate('+sx+'px,'+sy+'px)';pend=false})}},{passive:true});
    }
    /* Fond : grille + particules qui reagissent a la souris */
    var c=document.createElement('canvas');c.id='holo-fond';c.setAttribute('aria-hidden','true');document.body.insertBefore(c,document.body.firstChild);
    var x=c.getContext('2d'),W,H,dpr=Math.min(devicePixelRatio||1,1.5),P=[],mx=-9999,my=-9999,run=true;
    function taille(){W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;c.style.width=W+'px';c.style.height=H+'px';x.setTransform(dpr,0,0,dpr,0,0);
      var n=Math.round(Math.min(70,W*H/22000));P=[];for(var i=0;i<n;i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25})}
    taille();addEventListener('resize',taille);
    addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY},{passive:true});
    addEventListener('touchmove',function(e){var t=e.touches[0];if(t){mx=t.clientX;my=t.clientY}},{passive:true});
    document.addEventListener('visibilitychange',function(){run=!document.hidden;if(run)requestAnimationFrame(f)});
    var t0=0;
    function f(t){if(!run)return;
      x.clearRect(0,0,W,H);
      var off=(t/80)%40;x.strokeStyle='rgba(34,211,238,.07)';x.lineWidth=1;x.beginPath();
      for(var gx=0;gx<W;gx+=40){x.moveTo(gx,0);x.lineTo(gx,H)}for(var gy=off;gy<H;gy+=40){x.moveTo(0,gy);x.lineTo(W,gy)}x.stroke();
      for(var i=0;i<P.length;i++){var p=P[i],dx=p.x-mx,dy=p.y-my,d2=dx*dx+dy*dy;
        if(d2<14400){var d=Math.sqrt(d2)||1;p.vx+=dx/d*.05;p.vy+=dy/d*.05}
        p.vx*=.98;p.vy*=.98;p.vx+=(Math.random()-.5)*.02;p.vy+=(Math.random()-.5)*.02;p.x+=p.vx;p.y+=p.vy;
        if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
        x.fillStyle='rgba(34,211,238,.55)';x.beginPath();x.arc(p.x,p.y,1.6,0,6.283);x.fill();
        for(var j=i+1;j<P.length;j++){var q=P[j],ex=p.x-q.x,ey=p.y-q.y,e2=ex*ex+ey*ey;if(e2<9000){x.strokeStyle='rgba(56,189,248,'+(.18*(1-e2/9000)).toFixed(3)+')';x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.stroke()}}}
      requestAnimationFrame(f)}
    requestAnimationFrame(f);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();