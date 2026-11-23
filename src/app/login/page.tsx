"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FlaskConical, ArrowRight, ShieldCheck } from "lucide-react";
import { useSettings } from "../providers";

export default function LoginPage() {
  const router = useRouter();
  const { lang } = useSettings();
  const en = lang === "en";
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then(async (response) => {
        if (!response.ok) return;
        const data = await response.json();
        if (active) router.replace(data.user.role === "admin" ? "/admin" : "/dashboard");
      })
      .catch(() => {});
    return () => { active = false; };
  }, [router]);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    try {
      const response = await fetch("/api/auth/login", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({identifier:email,password}) });
      const data = await response.json();
      if (!response.ok) { setError(data.error || (en ? "Unable to sign in." : "تعذر تسجيل الدخول.")); return; }
      router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch { setError(en ? "Could not connect to the server. Please try again." : "تعذر الاتصال بالخادم. حاول مرة أخرى."); }
  }

  return <main className="auth-page"><div className="auth-glow"/><section className="auth-card">
    <Link className="brand auth-brand" href="/"><span className="brand-icon"><FlaskConical size={22}/></span><span>Chemistry<span className="brand-blue">Pro</span></span></Link>
    <span className="auth-kicker">WELCOME BACK</span><h1>{en ? "Welcome back" : "أهلاً بعودتك"}</h1><p>{en ? "Sign in to continue your chemistry learning journey." : "سجّل دخولك عشان تكمّل رحلة التفوق في الكيمياء."}</p>
    <form onSubmit={submit} className="auth-form">
      <label>{en ? "Phone number or email" : "رقم الموبايل أو البريد الإلكتروني"}<input type="text" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="01xxxxxxxxx أو name@example.com"/></label>
      <label>{en ? "Password" : "كلمة المرور"}<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder={en ? "Enter your password" : "اكتب كلمة المرور"}/></label>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="btn auth-submit">{en ? "Sign in" : "تسجيل الدخول"} <ArrowRight size={17}/></button>
    </form>
    <div className="demo-credentials"><ShieldCheck size={17}/><div><b>{en ? "Administrator access" : "دخول الإدارة"}</b><small>{en ? "Admin credentials are configured in .env.local" : "بيانات المدير تُحدد من ملف البيئة .env.local"}</small></div></div>
    <p className="auth-bottom">{en ? "Don’t have an account?" : "لسه معندكش حساب؟"} <Link href="/#register">{en ? "Register as a student" : "سجّل كطالب جديد"}</Link></p>
    <Link href="/" className="auth-home">{en ? "Back to home" : "العودة للرئيسية"}</Link>
  </section></main>;
}
