"use client";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import GoogleAuthButton from "@/app/components/google-auth-button";
export default function Signup() {
 const [name,setName]=useState("");const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");const [error,setError]=useState("");
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError("");setMessage("");const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:name}}});setBusy(false);if(error){setError(error.message);return;}if(data.session){window.location.href="/dashboard";}else{setMessage("Account created. Please check your email to confirm your address, then log in.");}}
 return <main className="authWrap"><div className="authCard"><Link href="/" className="brand"><span className="brandMark">G</span> GenZ SEO</Link><h1>Create your account</h1><p>Your business workspace starts here.</p><GoogleAuthButton/><form onSubmit={submit}><label>Your name</label><input required value={name} onChange={e=>setName(e.target.value)} placeholder="Full name"/><label>Email address</label><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/><label>Password</label><input type="password" minLength={8} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters"/><button className="btn full" disabled={busy}>{busy?"Creating account…":"Create free account"}</button></form>{error&&<div className="error">{error}</div>}{message&&<div className="success">{message}</div>}<div className="authFoot">Already registered? <Link href="/login">Login</Link></div></div></main>;
}
