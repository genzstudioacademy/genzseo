"use client";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import GoogleAuthButton from "@/app/components/google-auth-button";
export default function Login() {
 const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [busy,setBusy]=useState(false); const [error,setError]=useState("");
 const router=useRouter();
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError("");const {error}=await supabase.auth.signInWithPassword({email,password});setBusy(false);if(error){setError(error.message);return;}router.push("/dashboard");}
 return <main className="authWrap"><div className="authCard"><Link href="/" className="brand"><span className="brandMark">G</span> GenZ SEO</Link><h1>Welcome back</h1><p>Login to your business workspace.</p><GoogleAuthButton/><form onSubmit={submit}><label>Email address</label><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/><label>Password</label><input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password"/><button className="btn full" disabled={busy}>{busy?"Please wait…":"Login"}</button></form>{error&&<div className="error">{error}</div>}<div className="authFoot">New to GenZ SEO? <Link href="/signup">Create an account</Link></div></div></main>;
}
