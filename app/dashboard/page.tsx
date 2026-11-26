"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
type Business={id:string;business_name:string|null;category:string|null;phone:string|null;email:string|null;website:string|null;address:string|null;city:string|null;description:string|null};
const empty={business_name:"",category:"",phone:"",email:"",website:"",address:"",city:"",description:""};
function profileErrorMessage(error:{code?:string;message:string}){
 const message=error.message.toLowerCase();
 if(error.code==="PGRST205"||(message.includes("business_profiles")&&(message.includes("schema cache")||message.includes("does not exist")))){
  return "Business profile table is missing. Run the full supabase/schema.sql in your Supabase SQL Editor, then try again.";
 }
 return error.message;
}
export default function Dashboard(){
 const router=useRouter();const [user,setUser]=useState<any>(null);const [business,setBusiness]=useState<Business|null>(null);const [form,setForm]=useState(empty);const [loading,setLoading]=useState(true);const [saving,setSaving]=useState(false);const [notice,setNotice]=useState("");const [error,setError]=useState("");
 useEffect(()=>{let alive=true;(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user){router.replace("/login");return;}if(!alive)return;setUser(user);const {data,error}=await supabase.from("business_profiles").select("*").eq("user_id",user.id).maybeSingle();if(error){setError(profileErrorMessage(error));}else if(data){setBusiness(data);setForm({business_name:data.business_name||"",category:data.category||"",phone:data.phone||"",email:data.email||"",website:data.website||"",address:data.address||"",city:data.city||"",description:data.description||""});}setLoading(false);})();return()=>{alive=false}},[router]);
 async function save(e:React.FormEvent){e.preventDefault();setSaving(true);setNotice("");setError("");const payload={...form,user_id:user.id,updated_at:new Date().toISOString()};const {data,error}=await supabase.from("business_profiles").upsert(payload,{onConflict:"user_id"}).select().single();setSaving(false);if(error){setError(profileErrorMessage(error));}else{setBusiness(data);setNotice("Business profile saved successfully.");}}
 async function logout(){await supabase.auth.signOut();router.push("/");}
 if(loading)return <main className="dashLoading">Loading your workspace…</main>;
 return <main className="dashboard"><aside className="sidebar"><Link href="/" className="brand"><span className="brandMark">G</span> GenZ SEO</Link><div className="sideLabel">WORKSPACE</div><div className="sideActive">▦ &nbsp; Overview</div><div className="sideItem">◎ &nbsp; Business profile</div><Link className="sideActive" href="/dashboard/website-builder">✧ &nbsp; AI Website Builder</Link>{user?.email?.toLowerCase()===process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase()&&<Link className="sideItem" href="/dashboard/admin">▤ &nbsp; Admin analytics</Link>}<div className="sideItem muted">✧ &nbsp; SEO tools <small>Coming soon</small></div><div className="sideItem muted">◉ &nbsp; AI visibility <small>Coming soon</small></div><div className="sideItem muted">☆ &nbsp; Reviews <small>Coming soon</small></div><div className="sideBottom"><div className="userEmail">{user?.email}</div><button className="logout" onClick={logout}>Log out ↗</button></div></aside>
 <section className="dashMain"><header className="dashHeader"><div><div className="eyebrow">YOUR WORKSPACE</div><h1>Business dashboard</h1><p>Manage your business details from one place.</p></div><div className="avatar">{(user?.email||"U")[0].toUpperCase()}</div></header>
 <div className="welcome"><div><b>Welcome to GenZ SEO</b><p>First, add your business details. You can update them anytime.</p></div><span className="pill">Account active</span></div>
 <div className="sectionHead"><div><h2>Business profile</h2><p>This information is saved privately to your account.</p></div></div>
 <form className="profileForm" onSubmit={save}>
 <div className="formGrid">
 <div><label>Business name *</label><input required value={form.business_name} onChange={e=>setForm({...form,business_name:e.target.value})} placeholder="e.g. Sharma Traders"/></div>
 <div><label>Business category</label><input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="e.g. Real estate, Restaurant"/></div>
 <div><label>Phone number</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+91"/></div>
 <div><label>Business email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="business@example.com"/></div>
 <div><label>Website</label><input value={form.website} onChange={e=>setForm({...form,website:e.target.value})} placeholder="https://"/></div>
 <div><label>City</label><input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} placeholder="Jaipur"/></div>
 <div className="wide"><label>Full business address</label><input value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="Street, area, PIN code"/></div>
 <div className="wide"><label>Business description</label><textarea rows={4} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Tell customers what your business offers…"/></div>
 </div>
 <div className="formActions"><span className="formHint">Your details are protected by account-level database rules.</span><button className="btn" disabled={saving}>{saving?"Saving…":business?"Save changes":"Save business profile"}</button></div>
 </form>
 {notice&&<div className="success">{notice}</div>}{error&&<div className="error">{error}</div>}
 <div className="nextSteps"><h3>AI Website Builder</h3><p>Create a responsive business website from your business details, preview it live, save your draft and export HTML. <a href="/dashboard/website-builder" style={{color:"var(--green)",fontWeight:700}}>Open Website Builder →</a></p></div><div className="nextSteps"><h3>What’s next?</h3><p>Google connection, directory publishing, live SEO audits, review tools and AI visibility features are planned integrations. They will only be marked active after their APIs and permissions are configured.</p></div>
 <footer>GenZ SEO · Your Business. Everywhere Online.</footer></section></main>;
}
