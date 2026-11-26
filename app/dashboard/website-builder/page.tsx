"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type SiteForm = {
  business_name: string; category: string; city: string; phone: string;
  email: string; address: string; website: string; description: string;
  services: string; tagline: string; primary_color: string; template: string;
};
const initial: SiteForm = {
  business_name:"", category:"", city:"", phone:"", email:"", address:"",
  website:"", description:"", services:"", tagline:"Quality service you can trust",
  primary_color:"#0d8067", template:"modern"
};
function esc(s:string){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c] as string));}
export default function WebsiteBuilder(){
 const [f,setF]=useState<SiteForm>(initial);
 const [busy,setBusy]=useState(false); const [notice,setNotice]=useState(""); const [error,setError]=useState("");
 const services=useMemo(()=>f.services.split(",").map(x=>x.trim()).filter(Boolean),[f.services]);
 const title=f.business_name.trim() || "Your Business";
 const description=f.description.trim() || `${title} provides trusted ${f.category || "professional"} services${f.city ? ` in ${f.city}` : ""}. Contact us to learn more.`;
 const seoTitle=`${title}${f.city ? ` | ${f.city}` : ""}${f.category ? ` - ${f.category}` : ""}`.slice(0,60);
 const seoDescription=description.slice(0,155);
 async function save(){
   setBusy(true);setNotice("");setError("");
   const {data:{user}}=await supabase.auth.getUser();
   if(!user){setError("Please log in again.");setBusy(false);return;}
   const payload={user_id:user.id, business_name:title, category:f.category, city:f.city, phone:f.phone,
     email:f.email, address:f.address, website:f.website, description, tagline:f.tagline,
     services, template:f.template, primary_color:f.primary_color, seo_title:seoTitle,
     seo_description:seoDescription, updated_at:new Date().toISOString()};
   const {error}=await supabase.from("generated_sites").upsert(payload,{onConflict:"user_id"});
   setBusy(false);
   if(error){setError(error.message.includes("generated_sites") ? "Database table not found. Run the updated supabase/schema.sql in your Supabase SQL Editor, then try again." : error.message);return;}
   setNotice("Website draft saved to your account.");
 }
 function exportHtml(){
   const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(seoTitle)}</title><meta name="description" content="${esc(seoDescription)}"><meta name="robots" content="index,follow"><style>:root{--brand:${f.primary_color}}*{box-sizing:border-box}body{margin:0;font:16px Arial,sans-serif;color:#17211f;line-height:1.6}.hero{background:#f0f7f4;padding:80px 8%;border-bottom:4px solid var(--brand)}.tag{color:var(--brand);font-weight:bold;text-transform:uppercase;letter-spacing:2px}.wrap{max-width:1050px;margin:auto;padding:48px 8%}h1{font-size:clamp(38px,7vw,68px);line-height:1.08;margin:18px 0}h2{font-size:30px}.btn{display:inline-block;background:var(--brand);color:white;padding:13px 22px;border-radius:8px;text-decoration:none;font-weight:bold}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px}.card{border:1px solid #e1e9e5;border-radius:12px;padding:20px}.foot{background:#14231e;color:white;padding:35px 8%}@media(max-width:600px){.hero{padding:55px 7%}}</style></head><body><header class="hero"><div class="tag">${esc(f.category || "Welcome")}</div><h1>${esc(title)}</h1><p>${esc(f.tagline)}</p><p>${esc(description)}</p>${f.phone?`<a class="btn" href="tel:${esc(f.phone)}">Call ${esc(f.phone)}</a>`:""}</header><main class="wrap"><h2>Our Services</h2><div class="grid">${(services.length?services:["Professional service","Customer support","Quality solutions"]).map(s=>`<article class="card"><h3>${esc(s)}</h3><p>Get in touch with ${esc(title)} to know more about this service.</p></article>`).join("")}</div><h2>About Us</h2><p>${esc(description)}</p><h2>Contact</h2><p>${esc(f.address)} ${esc(f.city)}</p><p>${esc(f.email)}</p>${f.phone?`<p>${esc(f.phone)}</p>`:""}${f.website?`<p><a href="${esc(f.website)}">${esc(f.website)}</a></p>`:""}${f.phone?`<a class="btn" href="https://wa.me/${esc(f.phone.replace(/\D/g,""))}">Chat on WhatsApp</a>`:""}</main><footer class="foot">© ${new Date().getFullYear()} ${esc(title)}. All rights reserved.</footer></body></html>`;
   const blob=new Blob([html],{type:"text/html;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`${(f.business_name||"business").toLowerCase().replace(/[^a-z0-9]+/g,"-")}-website.html`;a.click();URL.revokeObjectURL(url);
 }
 const set=(k:keyof SiteForm,v:string)=>setF(old=>({...old,[k]:v}));
 return <main className="builderPage">
  <header className="builderTop"><Link href="/dashboard" className="brand"><span className="brandMark">G</span> GenZ SEO</Link><Link href="/dashboard" className="btn secondary small">← Dashboard</Link></header>
  <section className="builderIntro"><div className="eyebrow">GENZ SEO / WEBSITE STUDIO</div><h1>Build your business website.</h1><p>Enter your business details, preview your website instantly, save the draft to your account and export a ready-to-host HTML file.</p></section>
  <div className="builderGrid">
   <section className="builderForm">
    <h2>Business information</h2><p className="builderMuted">Use accurate details so customers and search engines can understand your business.</p>
    <div className="builderFields">
     <label>Business name *<input value={f.business_name} onChange={e=>set("business_name",e.target.value)} placeholder="e.g. Sharma Traders"/></label>
     <label>Business category<input value={f.category} onChange={e=>set("category",e.target.value)} placeholder="e.g. Real Estate, Salon, Restaurant"/></label>
     <label>City<input value={f.city} onChange={e=>set("city",e.target.value)} placeholder="e.g. Jaipur"/></label>
     <label>Phone / WhatsApp<input value={f.phone} onChange={e=>set("phone",e.target.value)} placeholder="+91 98765 43210"/></label>
     <label>Business email<input type="email" value={f.email} onChange={e=>set("email",e.target.value)} placeholder="hello@example.com"/></label>
     <label>Existing website (optional)<input value={f.website} onChange={e=>set("website",e.target.value)} placeholder="https://example.com"/></label>
     <label className="wide">Full address<input value={f.address} onChange={e=>set("address",e.target.value)} placeholder="Street, area, PIN code"/></label>
     <label className="wide">Tagline<input value={f.tagline} onChange={e=>set("tagline",e.target.value)} placeholder="A short line about your business"/></label>
     <label className="wide">Business description<textarea rows={4} value={f.description} onChange={e=>set("description",e.target.value)} placeholder="What do you offer? Who do you serve? What makes your business different?"/></label>
     <label className="wide">Services (comma separated)<textarea rows={3} value={f.services} onChange={e=>set("services",e.target.value)} placeholder="Website Design, SEO, Social Media Management"/></label>
     <label>Website style<select value={f.template} onChange={e=>set("template",e.target.value)}><option value="modern">Modern business</option><option value="minimal">Clean & minimal</option><option value="bold">Bold & premium</option></select></label>
     <label>Brand colour<input type="color" value={f.primary_color} onChange={e=>set("primary_color",e.target.value)}/></label>
    </div>
    <div className="builderActions"><button className="btn" onClick={save} disabled={busy||!f.business_name.trim()}>{busy?"Saving…":"Save website draft"}</button><button className="btn secondary" onClick={exportHtml} disabled={!f.business_name.trim()}>Export HTML</button></div>
    {notice&&<div className="success">{notice}</div>}{error&&<div className="error">{error}</div>}
    <p className="builderFine">Note: this version creates a responsive template-based website draft. AI text generation, image library, domain connection and one-click hosting require additional API/deployment setup.</p>
   </section>
   <section className="previewPanel"><div className="previewBar"><b>Live website preview</b><span>Responsive draft</span></div>
    <div className="sitePreview" style={{"--preview-brand":f.primary_color} as React.CSSProperties}>
     <div className="previewHero"><small>{f.category||"YOUR BUSINESS"}</small><h2>{title}</h2><b>{f.tagline}</b><p>{description}</p>{f.phone&&<a href={`tel:${f.phone}`}>Call {f.phone}</a>}</div>
     <div className="previewBody"><h3>Our Services</h3><div className="previewCards">{(services.length?services:["Your first service","Your second service","Customer support"]).map((s,i)=><article key={i}><strong>{s}</strong><p>Contact us to learn more about this service.</p></article>)}</div><h3>About {title}</h3><p>{description}</p><h3>Contact us</h3><p>{f.address} {f.city}</p><p>{f.email}</p>{f.phone&&<a className="previewCall" href={`https://wa.me/${f.phone.replace(/\D/g,"")}`}>Chat on WhatsApp</a>}</div>
     <div className="previewFooter">© {new Date().getFullYear()} {title}</div>
    </div>
    <div className="seoPreview"><b>SEO preview</b><strong>{seoTitle||"Your website title"}</strong><span>{seoDescription||"Your meta description will appear here."}</span><small>Generated from the details you enter. Review before publishing.</small></div>
   </section>
  </div>
 </main>;
}
