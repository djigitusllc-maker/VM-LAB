const GA_MEASUREMENT_ID='G-4GXT0F4NBY';
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config',GA_MEASUREMENT_ID);
const gaScript=document.createElement('script');
gaScript.async=true;
gaScript.src='https://www.googletagmanager.com/gtag/js?id='+GA_MEASUREMENT_ID;
document.head.appendChild(gaScript);

const trackEvent=(eventName,eventParameters)=>{
 if(typeof gtag==='function'){
  gtag('event',eventName,eventParameters);
 }
};

const menuBtn=document.querySelector('.menu-btn');
const nav=document.querySelector('.nav');
if(menuBtn&&nav){menuBtn.addEventListener('click',()=>{nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',nav.classList.contains('open'))});}

const observer=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')})},{threshold:.12});
document.querySelectorAll('.fade').forEach(el=>observer.observe(el));

if(!window.__vmLabContactTrackingInitialized){
 window.__vmLabContactTrackingInitialized=true;
 document.addEventListener('click',(event)=>{
  const link=event.target.closest?.('a[href]');
  if(!link)return;

  const href=link.getAttribute('href')||'';
  let contactMethod='';
  if(href.startsWith('tel:'))contactMethod='phone';
  else if(href.startsWith('mailto:'))contactMethod='email';
  else if(/(?:wa\.me|whatsapp\.com)/i.test(href))contactMethod='whatsapp';
  else if(/(?:t\.me|telegram\.me)/i.test(href))contactMethod='telegram';

  if(contactMethod){
   trackEvent('contact_click',{
    contact_method:contactMethod,
    page_location:window.location.href
   });
  }
 });
}

const form=document.querySelector('[data-contact-form]');
if(form&&!form.dataset.vmLabHandlerAttached){
 form.dataset.vmLabHandlerAttached='true';
 const success=document.querySelector('[data-success]');
 const error=document.querySelector('[data-error]');
 const btn=form.querySelector('button[type="submit"]');
 form.addEventListener('submit',async(e)=>{
  e.preventDefault();
  if(form.dataset.submitting==='true')return;
  success.style.display='none';
  error.style.display='none';
  if(form.website.value){return}
  const endpoint=form.dataset.endpoint;
  if(!endpoint||endpoint.includes('PASTE_GOOGLE_APPS_SCRIPT_URL_HERE')){
   error.textContent='Something went wrong. Please try again.';
   error.style.display='block';
   return;
  }
  form.dataset.submitting='true';
  btn.disabled=true;
  const old=btn.textContent;
  btn.textContent='Sending...';
  try{
   const res=await fetch(endpoint,{method:'POST',body:new FormData(form)});
   if(!res.ok)throw new Error('Bad response');
   trackEvent('generate_lead',{
    form_name:'contact_form',
    form_location:'contact_page',
    page_location:window.location.href
   });
   form.reset();
   success.style.display='block';
  }catch(err){
   error.textContent='Something went wrong. Please try again.';
   error.style.display='block';
  }finally{
   delete form.dataset.submitting;
   btn.disabled=false;
   btn.textContent=old;
  }
 })
}
