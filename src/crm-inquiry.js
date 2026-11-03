// Public inquiry bridge: validates Turnstile, forwards to the private CRM server-side only.
// Mailto links stay available if configuration is incomplete or CRM is offline.
const allowedHost=new Set(["kingdommissionsglobal.org","www.kingdommissionsglobal.org"]);
const txt=(v,n)=>typeof v==="string"?v.trim().slice(0,n):"";
const reply=(v,status=200)=>Response.json(v,{status,headers:{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
const ready=env=>Boolean(env.TURNSTILE_SITE_KEY&&env.TURNSTILE_SECRET_KEY&&env.KMI_CRM_URL&&env.KMI_CRM_INGEST_TOKEN);
export function config(env){return reply({enabled:ready(env),site_key:ready(env)?env.TURNSTILE_SITE_KEY:""});}
export async function submit(request,env){
 if(!ready(env))return reply({error:"Online inquiry form is not configured. Please use the email link."},503);
 const origin=request.headers.get("Origin");
 if(!origin||origin!==new URL(request.url).origin||!allowedHost.has(new URL(request.url).hostname))return reply({error:"Invalid request origin"},403);
 if(!(request.headers.get("Content-Type")||"").includes("application/json"))return reply({error:"Expected JSON"},415);
 const raw=await request.text();if(raw.length>6000)return reply({error:"Request too large"},413);
 let b;try{b=JSON.parse(raw);}catch{return reply({error:"Invalid JSON"},400);}
 if(!b||typeof b!=="object"||Array.isArray(b))return reply({error:"Invalid inquiry"},400);
 if(txt(b.website,80))return reply({ok:true,message:"Thank you for contacting KMI."},201);
 const name=txt(b.name,120),email=txt(b.email,254).toLowerCase(),topic=txt(b.topic,90),message=txt(b.message,1500),token=txt(b.turnstile_token,2048);
 if(!name||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!["Resource Guidance","Volunteer","Community Partnership","Education","General Inquiry"].includes(topic)||message.length<10||b.contact_consent!==true||!token)
  return reply({error:"Please complete the form and verification."},422);
 const body=new URLSearchParams({secret:env.TURNSTILE_SECRET_KEY,response:token});
 const ip=request.headers.get("CF-Connecting-IP");if(ip)body.set("remoteip",ip);
 let verified;
 try{
  const result=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",body});
  verified=await result.json();
 }catch{return reply({error:"Verification is temporarily unavailable. Please try again."},503);}
 if(!verified.success||!allowedHost.has(verified.hostname))return reply({error:"Please complete the security verification again."},403);
 const endpoint=new URL(env.KMI_CRM_URL);
 if(endpoint.protocol!=="https:"||endpoint.username||endpoint.password||endpoint.search||endpoint.hash||endpoint.pathname!=="/")return reply({error:"Inquiry routing is not available."},503);
 const ref=crypto.randomUUID();
 let result;
 try{
  const payload=JSON.stringify({reference:ref,name,email,topic,message,contact_consent:true});
  const outbound=new Request(endpoint.origin+"/api/integrations/website",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+env.KMI_CRM_INGEST_TOKEN},body:payload});
  result=env.CRM_SERVICE?await env.CRM_SERVICE.fetch(outbound):await fetch(outbound);
 }catch{return reply({error:"KMI could not receive your inquiry right now. Please email the ministry."},503);}
 if(!result.ok)return reply({error:"KMI could not receive your inquiry right now. Please email the ministry."},503);
 return reply({ok:true,reference:ref,message:"Your inquiry has been received."},201);
}