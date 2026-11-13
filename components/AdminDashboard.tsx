"use client";

import { useState } from "react";
import type { AdminOverview } from "@/lib/monarchis-data";

export default function AdminDashboard({ initialData }: { initialData: AdminOverview }) {
  const [data, setData] = useState(initialData);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    summary: "",
    riskBand: "Balanced",
    minAmount: "1000",
    maxAmount: "50000",
    feePercent: "0.75",
    durationMonths: "12",
    currency: "USD",
  });

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: productForm.name,
          summary: productForm.summary,
          riskBand: productForm.riskBand,
          minAmount: Number(productForm.minAmount),
          maxAmount: Number(productForm.maxAmount),
          feePercent: Number(productForm.feePercent),
          durationMonths: Number(productForm.durationMonths),
          currency: productForm.currency,
        }),
      });

      const json = (await response.json()) as { message?: string; product?: unknown };
      if (!response.ok) {
        throw new Error(json.message || "The product could not be created.");
      }

      const refreshed = await fetch("/api/admin/overview").then((res) => res.json());
      setData(refreshed.data as AdminOverview);
      setMessage(json.message || "Product saved as a draft.");
      setProductForm({
        name: "",
        summary: "",
        riskBand: "Balanced",
        minAmount: "1000",
        maxAmount: "50000",
        feePercent: "0.75",
        durationMonths: "12",
        currency: "USD",
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create the investment product.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="dashhead">
        <div>
          <div className="eyebrow">ADMINISTRATION</div>
          <h1>Operations overview</h1>
          <p className="muted">Restricted administrator area. This workspace keeps live financial execution disabled until operational controls are approved.</p>
        </div>
        <span className="pill">ADMIN ACCESS</span>
      </div>

      <div className="stats">
        {[
          ["Client records", String(data.totals.users)],
          ["Active users", String(data.totals.activeUsers)],
          ["KYC queue", String(data.totals.pendingKyc)],
          ["Pending deposits", String(data.totals.pendingDeposits)],
          ["Pending withdrawals", String(data.totals.pendingWithdrawals)],
          ["Audit events", String(data.totals.auditEvents)],
          ["Payment requests", String(data.totals.paymentRequests)],
          ["Products", String(data.products.length)],
        ].map(([label, value]) => (
          <div className="stat" key={label}><small>{label}</small><strong>{value}</strong></div>
        ))}
      </div>

      <div className="split">
        <section className="panel">
          <h3>Platform activity</h3>
          {data.auditLogs.map((entry) => (
            <div key={entry.id} className="activity-item">
              <strong>{entry.action}</strong>
              <p>{entry.detail}</p>
              <span>{entry.actor} · {new Date(entry.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </section>
        <section className="panel">
          <h3>Support queue</h3>
          {data.supportTickets.length ? data.supportTickets.map((ticket) => (
            <div key={ticket.id} className="list-line compact-line">
              <span>{ticket.subject}</span>
              <em>{ticket.status}</em>
            </div>
          )) : <p className="muted">No support tickets found.</p>}
        </section>
      </div>

      <div className="forms-grid">
        <section className="panel">
          <h3>Create investment product</h3>
          <form onSubmit={saveProduct} className="compact-form">
            <div className="field-grid">
              <label>Product name<input value={productForm.name} onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))} required /></label>
              <label>Risk band<select value={productForm.riskBand} onChange={(event) => setProductForm((prev) => ({ ...prev, riskBand: event.target.value }))}>
                <option>Conservative</option>
                <option>Balanced</option>
                <option>Growth</option>
                <option>Opportunistic</option>
              </select></label>
              <label>Min amount<input type="number" min={1} value={productForm.minAmount} onChange={(event) => setProductForm((prev) => ({ ...prev, minAmount: event.target.value }))} required /></label>
              <label>Max amount<input type="number" min={1} value={productForm.maxAmount} onChange={(event) => setProductForm((prev) => ({ ...prev, maxAmount: event.target.value }))} required /></label>
              <label>Fee %<input type="number" min={0} step="0.01" value={productForm.feePercent} onChange={(event) => setProductForm((prev) => ({ ...prev, feePercent: event.target.value }))} required /></label>
              <label>Duration (months)<input type="number" min={1} value={productForm.durationMonths} onChange={(event) => setProductForm((prev) => ({ ...prev, durationMonths: event.target.value }))} required /></label>
              <label>Currency<select value={productForm.currency} onChange={(event) => setProductForm((prev) => ({ ...prev, currency: event.target.value }))}><option>USD</option><option>EUR</option><option>GBP</option></select></label>
              <label className="span-two">Summary<textarea rows={3} value={productForm.summary} onChange={(event) => setProductForm((prev) => ({ ...prev, summary: event.target.value }))} required /></label>
            </div>
            <button type="submit" className="goldbtn" disabled={loading}>{loading ? "Saving..." : "Create product"}</button>
          </form>
        </section>

        <section className="panel">
          <h3>Product catalogue</h3>
          {data.products.length ? data.products.map((product) => (
            <div key={product.id} className="list-line product-item">
              <div>
                <strong>{product.name}</strong>
                <span>{product.summary}</span>
              </div>
              <em>{product.status}</em>
            </div>
          )) : <p className="muted">No products have been configured.</p>}
        </section>
      </div>

      <div className="split">
        <section className="panel">
          <h3>Users</h3>
          {data.users.length ? data.users.map((user) => (
            <div key={user.id} className="list-line compact-line">
              <span>{user.name || user.email}</span>
              <em>{user.status}</em>
            </div>
          )) : <p className="muted">No users found.</p>}
        </section>
        <section className="panel">
          <h3>KYC cases</h3>
          {data.kycCases.length ? data.kycCases.map((caseItem) => (
            <div key={caseItem.id} className="list-line compact-line">
              <span>{caseItem.firstName} {caseItem.lastName}</span>
              <em>{caseItem.status}</em>
            </div>
          )) : <p className="muted">No pending KYC cases.</p>}
        </section>
      </div>

      {message ? <div className="notice form-status">{message}</div> : null}
    </>
  );
}
