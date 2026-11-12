"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AuthForm from "./AuthForm";

export default function AuthPage({ initialMode }: { initialMode: "signin" | "signup" }) {
  const [mode, setMode] = useState(initialMode);
  const isSignIn = mode === "signin";

  return (
    <main className="auth-page">
      <section className="auth-visual" aria-label="Flex Office">
        <Image
          src="/hero/slide-3.jpeg"
          alt="A bright, collaborative office"
          fill
          priority
          sizes="(max-width: 760px) 100vw, 46vw"
          className="auth-visual-image"
        />
        <div className="auth-visual-overlay" />
        <Link href="/" className="auth-brand" aria-label="Flex Office home">
          <span className="brand-mark"><span /></span>
          <span className="brand-name">flex<span>office</span></span>
        </Link>
        <div className="auth-visual-copy">
          <p className="auth-visual-eyebrow">A BETTER WAY TO WORK</p>
          <h2>Make room<br />for your best work.</h2>
          <p>Find your place, bring your team together, and make every workday count.</p>
          <div className="auth-visual-note">
            <span className="auth-note-dot" />
            <span>Spaces that work around you</span>
          </div>
        </div>
        <span className="auth-visual-caption">YOUR WORKPLACE, REIMAGINED</span>
      </section>

      <section className="auth-content">
        <div className="auth-panel">
          <p className="auth-kicker">{isSignIn ? "WELCOME BACK" : "GET STARTED"}</p>
          <h1 className="auth-heading">{isSignIn ? "Sign in to Flex Office" : "Create your account"}</h1>
          <p className="auth-subheading">
            {isSignIn
              ? "Enter your details to continue to your workspace."
              : "A more flexible workday starts with your account."}
          </p>
          <AuthForm mode={mode} onModeChange={setMode} />
          <p className="auth-legal">
            By continuing, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
