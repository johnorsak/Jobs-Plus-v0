import React, { useState } from "react";
import AuthButtons from "./AuthButtons";
import { fetchAuthSession } from "aws-amplify/auth";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [leadTitle, setLeadTitle] = useState("");
  const [leadDescription, setLeadDescription] = useState("");
  const [status, setStatus] = useState("NEW");
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 🔑 Get current Cognito token test
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      if (!token) {
        alert("You must be signed in first!");
        return;
      }

      // First, create or upsert the customer
      const customerRes = await fetch(`${API_BASE}/api/customers`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 👈 attach token
        },
        body: JSON.stringify({ name, email, phone }),
      });

      if (!customerRes.ok) throw new Error("Failed to create customer");
      const customer = await customerRes.json();

      // Then, create the lead linked to that customer
      const leadRes = await fetch(`${API_BASE}/api/leads`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 👈 attach token
        },
        body: JSON.stringify({
          title: leadTitle,
          description: leadDescription,
          status,
          customerId: customer.id,
        }),
      });

      if (!leadRes.ok) throw new Error("Failed to create lead");
      const lead = await leadRes.json();

      alert(`Created Customer ${customer.name} and Lead ${lead.title}`);
      setName("");
      setEmail("");
      setPhone("");
      setLeadTitle("");
      setLeadDescription("");
      setStatus("NEW");
    } catch (err) {
      console.error(err);
      alert("Error creating customer and lead");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h1>Create Customer + Lead</h1>

      {/* 🔑 Add login/logout buttons */}
      <AuthButtons />

      <form onSubmit={handleSubmit}>
        <h2>Customer Info</h2>
        <div>
          <label>Name: </label>
          <input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email: </label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Phone: </label>
          <input value={phone} onChange={e => setPhone(e.target.value)} />
        </div>

        <h2>Lead Info</h2>
        <div>
          <label>Title: </label>
          <input value={leadTitle} onChange={e => setLeadTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description: </label>
          <input value={leadDescription} onChange={e => setLeadDescription(e.target.value)} />
        </div>
        <div>
          <label>Status: </label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="NEW">NEW</option>
            <option value="CONTACTED">CONTACTED</option>
            <option value="QUALIFIED">QUALIFIED</option>
            <option value="LOST">LOST</option>
            <option value="WON">WON</option>
          </select>
        </div>

        <button type="submit" style={{ marginTop: "1rem" }}>
          Save
        </button>
      </form>
    </div>
  );
}

export default App;
