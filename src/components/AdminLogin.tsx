"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your admin email and password to continue.");
      return;
    }
    router.push("/admin/dashboard");
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-aside">
        <Link href="/" className="booking-brand"><span className="brand-mark"><span /></span><span>flex<span>office</span></span></Link>
        <div className="admin-login-message"><p className="booking-eyebrow">BUILDING ADMIN PORTAL</p><h1>Make every<br /><em>space count.</em></h1><p>One clear view of your building, from the first desk to the last parking slot.</p><div className="admin-login-stat"><strong>24/7</strong><span>real-time visibility<br />for your workplace</span></div></div>
      </div>
      <section className="admin-login-card">
        <Link href="/" className="admin-mobile-brand">flex<span>office</span></Link>
        <div className="admin-login-heading"><span className="admin-lock"></span><p className="booking-eyebrow">SECURE ACCESS</p><h2>Welcome back, admin.</h2><p>Sign in to manage your building spaces.</p></div>
        <form className="admin-login-form" onSubmit={handleSubmit} noValidate>
          <label className="admin-field"><span>ADMIN EMAIL</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@yourbuilding.com" /></label>
          <label className="admin-field"><span>PASSWORD</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" /></label>
          {error && <p className="admin-form-error">{error}</p>}
          <div className="admin-form-options"><label><input type="checkbox" /> Remember me</label><button type="button">Forgot password?</button></div>
          <button type="submit" className="admin-submit">Sign in to dashboard <span>↗</span></button>
        </form>
        <p className="admin-login-footer">Need access? <a href="mailto:support@flexoffice.com">Contact your Flex Office representative</a></p>
      </section>
    </main>
  );
}


