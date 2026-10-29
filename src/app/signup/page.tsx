"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import AuthForm from "../../components/AuthForm";

export default function SignUpPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signup");

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-card-top">
          <div className="brand">
            <Image
              src="/hero/slide-3.jpeg"
              alt="Office team collaboration"
              width={48}
              height={48}
              className="brand-logo"
            />
            <span className="brand-name">Office Insight</span>
          </div>
          <h1 className="auth-heading">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="auth-subheading">
            {mode === "signin"
              ? "Sign in to continue to your office design projects."
              : "Start your office design journey with Office Insight."}
          </p>
        </div>

        <div className="auth-card-body">
          <AuthForm mode={mode} onModeChange={setMode} />
        </div>

        <div className="auth-card-bottom">
          <p className="auth-footer-link">
            Already have an account?{" "}
            <a href="#" className="auth-link">
              Sign In
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}

