"use client";

import { useState } from "react";
import type { DashboardOverview } from "@/lib/monarchis-data";

export default function ClientDashboard({ initialData }: { initialData: DashboardOverview }) {
  const [data, setData] = useState(initialData);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitTransaction(type: "deposit" | "withdrawal") {
    const form = document.getElementById(`transaction-${type}`) as HTMLFormElement | null;
    if (!form) return;

    const formData = new FormData(form);
    const payload = {
      type,
      amount: Number(formData.get("amount") ?? 0),
      currency: String(formData.get("currency") ?? "USD"),
      paymentMethod: String(formData.get("paymentMethod") ?? "Bank transfer"),
      note: String(formData.get("note") ?? ""),
    };

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(json.message || "The request could not be submitted.");
      }

      setMessage(json.message || "Your request was submitted for review.");
      form.reset();
      const refreshed = await fetch("/api/dashboard/summary").then((res) => res.json());
      setData(refreshed.data as DashboardOverview);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to submit the request.");
    } finally {
      setLoading(false);
    }
  }

  async function submitKyc(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      country: String(formData.get("country") ?? ""),
      documentType: String(formData.get("documentType") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    };

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(json.message || "KYC could not be submitted.");
      setMessage(json.message || "KYC documentation was submitted.");
      form.reset();
      const refreshed = await fetch("/api/dashboard/summary").then((res) => res.json());
      setData(refreshed.data as DashboardOverview);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "KYC submission failed.");
    } finally {
      setLoading(false);
    }
  }

  async function submitSupport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(json.message || "Support ticket could not be created.");
      setMessage(json.message || "Support request created.");
      form.reset();
      const refreshed = await fetch("/api/dashboard/summary").then((res) => res.json());
      setData(refreshed.data as DashboardOverview);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Support request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="dashhead">
        <div>
          <div className="eyebrow">CLIENT OVERVIEW</div>
          <h1>Welcome to your portal.</h1>
          <p className="muted">{data.userEmail ? `Signed in as ${data.userEmail}.` : "Sign in to access your secure account workspace."} Account services remain review-only until onboarding is completed.</p>
        </div>
        <span className="pill">{data.status === "database-connected" ? "DATABASE CONNECTED" : "LOCAL REVIEW MODE"}</span>
      </div>

      <div className="stats">
        {data.stats.map((item) => (
          <div className="stat" key={item.label}>
            <small>{item.label}</small>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>

      <div className="split">
        <section className="panel">
          <h3>Account activity</h3>
          {data.activity.length ? data.activity.map((item) => (
            <div key={item.title} className="activity-item">
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
              <span>{item.meta}</span>
            </div>
          )) : <p className="muted">No account activity has been recorded.</p>}
        </section>
        <section className="panel">
          <h3>Notifications</h3>
          {data.notifications.length ? data.notifications.map((item) => (
            <div key={`${item.title}-${item.time}`} className="activity-item">
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
              <span>{item.time}</span>
            </div>
          )) : <p className="muted">No notifications are available.</p>}
        </section>
      </div>

      <div className="split stacked-layout">
        <section className="panel">
          <h3>Portfolio overview</h3>
          {data.portfolio.length ? data.portfolio.map((item) => (
            <div key={item.name} className="list-line">
              <span>{item.name}</span>
              <span>{item.allocation}</span>
              <em>{item.status}</em>
            </div>
          )) : <p className="muted">No holdings are recorded. Investment execution is disabled.</p>}
        </section>

        <section className="panel">
          <h3>Recent payment requests</h3>
          {data.paymentRequests.length ? data.paymentRequests.map((item) => (
            <div key={item.id} className="list-line">
              <span>{item.type}</span>
              <span>{item.amount} {item.currency}</span>
              <em>{item.status}</em>
            </div>
          )) : <p className="muted">No payment requests have been created yet.</p>}
        </section>
      </div>

      <div className="forms-grid">
        <section className="panel">
          <h3>Deposit request</h3>
          <form id="transaction-deposit" onSubmit={(event) => { event.preventDefault(); void submitTransaction("deposit"); }}>
            <div className="field-grid">
              <label>Amount<input name="amount" type="number" min={1} step="0.01" required /></label>
              <label>Currency<select name="currency" defaultValue="USD"><option>USD</option><option>EUR</option><option>GBP</option></select></label>
              <label>Method<select name="paymentMethod" defaultValue="Bank transfer"><option>Bank transfer</option><option>Wire</option><option>Card</option></select></label>
              <label>Notes<input name="note" placeholder="Reference or payment note" /></label>
            </div>
            <button type="submit" className="goldbtn" disabled={loading}>Submit deposit request</button>
          </form>
        </section>

        <section className="panel">
          <h3>Withdrawal request</h3>
          <form id="transaction-withdrawal" onSubmit={(event) => { event.preventDefault(); void submitTransaction("withdrawal"); }}>
            <div className="field-grid">
              <label>Amount<input name="amount" type="number" min={1} step="0.01" required /></label>
              <label>Currency<select name="currency" defaultValue="USD"><option>USD</option><option>EUR</option><option>GBP</option></select></label>
              <label>Method<select name="paymentMethod" defaultValue="Bank transfer"><option>Bank transfer</option><option>Wire</option><option>ACH</option></select></label>
              <label>Notes<input name="note" placeholder="Withdrawal details" /></label>
            </div>
            <button type="submit" className="goldbtn" disabled={loading}>Submit withdrawal request</button>
          </form>
        </section>
      </div>

      <div className="forms-grid">
        <section className="panel">
          <h3>KYC submission</h3>
          <form onSubmit={submitKyc} className="compact-form">
            <div className="field-grid">
              <label>First name<input name="firstName" required /></label>
              <label>Last name<input name="lastName" required /></label>
              <label>Country<input name="country" placeholder="United States" required /></label>
              <label>Document type<select name="documentType" defaultValue="Passport"><option>Passport</option><option>National ID</option><option>Driving licence</option></select></label>
              <label className="span-two">Notes<textarea name="notes" rows={4} placeholder="Residency and identification notes." /></label>
            </div>
            <button type="submit" className="goldbtn" disabled={loading}>Submit KYC</button>
          </form>
        </section>

        <section className="panel">
          <h3>Support request</h3>
          <form onSubmit={submitSupport} className="compact-form">
            <div className="field-grid">
              <label className="span-two">Subject<input name="subject" placeholder="Account access or verification issue" required /></label>
              <label className="span-two">Message<textarea name="message" rows={5} placeholder="Describe your support request." required></textarea></label>
            </div>
            <button type="submit" className="goldbtn" disabled={loading}>Create support ticket</button>
          </form>
        </section>
      </div>

      {message ? <div className="notice form-status">{message}</div> : null}
    </>
  );
}
