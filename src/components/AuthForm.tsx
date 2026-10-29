"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// ===================== Shared auth form =====================
// Used by both the sign-in and sign-up pages. Keeps the form
// markup and validation in one place so the two routes stay
// in sync.
export default function AuthForm({
  mode,
  onModeChange,
}: {
  mode: "signin" | "signup";
  onModeChange: (mode: "signin" | "signup") => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) return setError("Please enter your email.");
    if (!name.trim() && mode === "signup") return setError("Please enter your name.");
    if (!password) return setError("Please enter your password.");
  };

  return (
    <form
      className="auth-form"
      onSubmit={handleSubmit}
      noValidate
    >
      {mode === "signup" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="field"
        >
          <label htmlFor="signup-name" className="field-label">
            Full Name
          </label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Smith"
            className="field-input"
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08 }}
        className="field"
      >
        <label htmlFor="auth-email" className="field-label">
          Email Address
        </label>
        <input
          id="auth-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="field-input"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.16 }}
        className="field"
      >
        <label htmlFor="auth-password" className="field-label">
          Password
        </label>
        <input
          id="auth-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="field-input"
        />
      </motion.div>

      {mode === "signin" && (
        <div className="auth-options">
          <label className="auth-option">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>Remember me</span>
          </label>
          <button type="button" className="auth-text-link">Forgot password?</button>
        </div>
      )}

      {error && (
        <motion.p
          key={error}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="auth-error"
        >
          {error}
        </motion.p>
      )}

      <motion.button
        type="submit"
        className="btn auth-btn auth-btn-primary"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {mode === "signin" ? "Sign In" : "Create Account"}
      </motion.button>

      {mode === "signin" && (
        <div className="auth-too">
          <span className="icon">+</span> New to Office Insight?{" "}
          <button type="button" className="auth-text-link" onClick={() => onModeChange("signup")}>
            Sign Up
          </button>
        </div>
      )}

      {mode === "signup" && (
        <div className="auth-too">
          <span className="icon">+</span> Already have an account?{" "}
          <button type="button" className="auth-text-link" onClick={() => onModeChange("signin")}>
            Sign In
          </button>
        </div>
      )}
    </form>
  );
}
