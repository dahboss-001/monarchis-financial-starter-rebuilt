"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/client";

type Mode = "signin" | "signup";

export default function AuthPanel() {
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [signedInEmail, setSignedInEmail] = useState("");

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      if (data?.user) setSignedInEmail(data.user.email);
    }).catch(() => {});
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setBusy(true);
    try {
      if (mode === "signup") {
        const result = await authClient.signUp.email({ name: name.trim(), email: email.trim(), password });
        if (result.error) throw new Error(result.error.message || "Registration failed.");
        setMessage("Your account request was submitted. Check your email for the verification message, then sign in.");
        setMode("signin");
        setPassword("");
      } else {
        const result = await authClient.signIn.email({ email: email.trim(), password });
        if (result.error) throw new Error(result.error.message || "Sign-in failed.");
        window.location.assign("/dashboard");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication could not be completed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    setBusy(true);
    try {
      await authClient.signOut();
      setSignedInEmail("");
      setMessage("You have signed out.");
    } catch {
      setMessage("Sign-out could not be completed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (signedInEmail) {
    return <section className="authcard">
      <div className="eyebrow">MONARCHIS CLIENT PORTAL</div>
      <h1>You're signed in.</h1>
      <p className="muted">{signedInEmail}</p>
      <a className="goldbtn" href="/dashboard">Open client dashboard</a>
      <button className="goldbtn" type="button" onClick={signOut} disabled={busy}>Sign out</button>
      {message && <p role="status" className="notice">{message}</p>}
    </section>;
  }

  return <section className="authcard">
    <div className="eyebrow">MONARCHIS CLIENT PORTAL</div>
    <h1>{mode === "signin" ? "Welcome back." : "Create your account."}</h1>
    <p className="muted">Secure access powered by Monarchis authentication.</p>
    <div className="notice">Use an email address you control. Email verification may be required before your account can be used.</div>
    <form onSubmit={submit}>
      {mode === "signup" && <div className="field"><label htmlFor="name">Full name</label><input id="name" autoComplete="name" required value={name} onChange={e => setName(e.target.value)} /></div>}
      <div className="field"><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>
      <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={8} required value={password} onChange={e => setPassword(e.target.value)} /></div>
      <button className="goldbtn" type="submit" disabled={busy}>{busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}</button>
    </form>
    <p className="muted">{mode === "signin" ? "New to Monarchis?" : "Already registered?"} <button className="textbtn" type="button" onClick={() => {setMode(mode === "signin" ? "signup" : "signin"); setMessage("");}}>{mode === "signin" ? "Create an account" : "Sign in instead"}</button></p>
    {message && <p role="status" className="notice">{message}</p>}
  </section>;
}
