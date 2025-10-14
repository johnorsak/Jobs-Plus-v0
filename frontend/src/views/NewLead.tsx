import React, { useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

interface NewLeadProps {
  onSaved?: () => void; // ✅ optional callback
}

const NewLead: React.FC<NewLeadProps> = ({ onSaved }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [leadTitle, setLeadTitle] = useState("");
  const [leadDescription, setLeadDescription] = useState("");
  const [status, setStatus] = useState("NEW");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      if (!token) throw new Error("You must be signed in first!");

      const customerRes = await fetch(`${API_BASE}/api/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email, phone }),
      });
      if (!customerRes.ok) throw new Error("Failed to create customer");
      const customer = await customerRes.json();

      const leadRes = await fetch(`${API_BASE}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: leadTitle,
          description: leadDescription,
          status,
          customerId: customer.id,
        }),
      });
      if (!leadRes.ok) throw new Error("Failed to create lead");
      const lead = await leadRes.json();

      alert(`✅ Created Customer ${customer.name} and Lead ${lead.title}`);

      // ✅ Call parent callback
      if (onSaved) onSaved();

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setLeadTitle("");
      setLeadDescription("");
      setStatus("NEW");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error creating customer and lead");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Customer Info</h4>
      <input className="form-control mb-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input className="form-control mb-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className="form-control mb-2" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

      <h4>Lead Info</h4>
      <input className="form-control mb-2" placeholder="Title" value={leadTitle} onChange={(e) => setLeadTitle(e.target.value)} required />
      <input className="form-control mb-2" placeholder="Description" value={leadDescription} onChange={(e) => setLeadDescription(e.target.value)} />
      <select className="form-select mb-3" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="NEW">NEW</option>
        <option value="CONTACTED">CONTACTED</option>
        <option value="QUALIFIED">QUALIFIED</option>
        <option value="LOST">LOST</option>
        <option value="WON">WON</option>
      </select>
      <button className="btn btn-success">Save</button>
    </form>
  );
};

export default NewLead;
