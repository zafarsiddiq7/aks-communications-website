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
