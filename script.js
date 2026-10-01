const nav=document.getElementById('nav');
const menu=document.getElementById('menu');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
document.getElementById('year').textContent=new Date().getFullYear();

// Inquiry form -> delivered to info@akscom.net via FormSubmit (no mail app needed)
const form=document.getElementById('form');
const msg=document.getElementById('msg');
const btn=form.querySelector('button[type="submit"]');
form.addEventListener('submit',async e=>{
  e.preventDefault();
  const data=new FormData(form);
  if(data.get('_honey'))return; // spam trap
  btn.disabled=true;
  msg.className='full';
  msg.textContent='Sending your inquiry…';
  try{
    const res=await fetch('https://formsubmit.co/ajax/info@akscom.net',{method:'POST',headers:{'Accept':'application/json'},body:data});
    const out=await res.json();
    if(!res.ok||!(out.success===true||out.success==='true'))throw new Error(out.message||'Send failed');
    form.reset();
    msg.className='full ok';
    msg.textContent='Thank you — your inquiry has been sent. We will get back to you shortly.';
  }catch(err){
    msg.className='full err';
    msg.innerHTML='We could not send your inquiry. Please email <a href="mailto:info@akscom.net">info@akscom.net</a> or WhatsApp <a href="https://wa.me/923214331700">+92 321 4331700</a>.';
  }finally{btn.disabled=false}
});

// Hero background: connected-network animation (+ optional video at assets/hero.mp4)
(()=>{
  const hero=document.querySelector('.hero'),cv=document.getElementById('hero-net'),vid=document.getElementById('hero-vid');
  if(!hero||!cv)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Optional video: only shown if the file exists and can play
  if(vid&&!reduce){vid.addEventListener('canplay',()=>{vid.classList.add('on');hero.classList.add('has-video');vid.play().catch(()=>{})},{once:true});vid.addEventListener('error',()=>vid.remove(),true);vid.querySelector('source').addEventListener('error',()=>vid.remove())}
  else if(vid)vid.remove();
  const ctx=cv.getContext('2d');let w=0,h=0,dpr=1,nodes=[],raf=0,visible=true;
  const GOLD='224,196,148',TEAL='35,166,178',LINK=180;
  function size(){dpr=Math.min(devicePixelRatio||1,2);w=hero.clientWidth;h=hero.clientHeight;cv.width=w*dpr;cv.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    const n=Math.round(Math.min(70,Math.max(24,w*h/22000)));
    nodes=Array.from({length:n},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,r:Math.random()*1.8+1.4,c:Math.random()<.3?TEAL:GOLD}))}
  function frame(){
    ctx.clearRect(0,0,w,h);
    for(const p of nodes){if(!reduce){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1}}
    for(let i=0;i<nodes.length;i++){const a=nodes[i];
      for(let j=i+1;j<nodes.length;j++){const b=nodes[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);
        if(d<LINK){ctx.strokeStyle=`rgba(${a.c},${(1-d/LINK)*.75})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}
      ctx.fillStyle=`rgba(${a.c},1)`;ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,6.283);ctx.fill()}
    if(!reduce&&visible)raf=requestAnimationFrame(frame)}
  size();frame();
  addEventListener('resize',()=>{size();if(reduce)frame()});
  if(!reduce&&'IntersectionObserver'in window)new IntersectionObserver(([e])=>{visible=e.isIntersecting;cancelAnimationFrame(raf);if(visible)frame()}).observe(hero);
})();
