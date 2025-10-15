import React, { useState, forwardRef, useImperativeHandle, ForwardRefRenderFunction } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import "../styles.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

// Define what functions the parent can call via ref
export interface NewLeadRef {
  handleSubmit: () => void;
}

interface NewLeadProps {
  onSuccess?: () => void;
}

const NewLead: ForwardRefRenderFunction<NewLeadRef, NewLeadProps> = (
  { onSuccess },
  ref
) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [leadTitle, setLeadTitle] = useState("");
  const [leadDescription, setLeadDescription] = useState("");
  const [status, setStatus] = useState("NEW");

  const handleSubmit = async () => {
    console.log("Submitting")
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      if (!token) throw new Error("You must be signed in first!");

      const customerRes = await fetch(`${API_BASE}/api/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, phone }),
      });
      if (!customerRes.ok) throw new Error("Failed to create customer");
      const customer = await customerRes.json();

      const leadRes = await fetch(`${API_BASE}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: leadTitle,
          description: leadDescription,
          status,
          customerId: customer.id,
        }),
      });
      if (!leadRes.ok) throw new Error("Failed to create lead");

      alert(`✅ Created Customer ${customer.name} and Lead ${leadTitle}`);

      // Notify parent to close modal & refresh
      if (onSuccess) onSuccess();

    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error creating customer and lead");
    }
  };

  // Expose to parent via ref
  useImperativeHandle(ref, () => ({ handleSubmit }));

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-xl-form-container">
        {/* ===== Customer Info Card ===== */}
        <div className="card mb-3 shadow-sm">
          <div
            className="card-header d-flex align-items-center btn-toggle bg-light"
            data-bs-toggle="collapse"
            data-bs-target="#customerInfo"
            aria-expanded="true"
          >
            <span className="arrow"></span>
            <h5 className="mb-0 ms-1">Customer Info</h5>
          </div>

          {/* Put collapse around the card-body */}
          <div className="collapse show" id="customerInfo">
            <div className="card-body">
              <label className="form-label">Name</label>
              <input
                className="form-control mb-2"
                placeholder=""
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label className="form-label">Email</label>
              <input
                className="form-control mb-2"
                placeholder=""
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label className="form-label">Phone</label>
              <input
                className="form-control mb-2"
                placeholder=""
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ===== Lead Info ===== */}
        <div className="card mb-3 shadow-sm">
          <div
            className="card-header d-flex align-items-center btn-toggle bg-light"
            data-bs-toggle="collapse"
            data-bs-target="#leadInfo"
            aria-expanded="true"
          >
            <span className="arrow"></span>
            <h5 className="mb-0 ms-1">Lead Info</h5>
          </div>
          <div className="collapse show" id="leadInfo">
            <div className="card-body">
              <label className="form-label">Title</label>
              <input
                className="form-control mb-2"
                placeholder=""
                value={leadTitle}
                onChange={(e) => setLeadTitle(e.target.value)}
                required
              />
              <label className="form-label">Description</label>
              <input
                className="form-control mb-2"
                placeholder=""
                value={leadDescription}
                onChange={(e) => setLeadDescription(e.target.value)}
              />
              <label className="form-label">Status</label>
              <select
                className="form-select mb-3"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="NEW">NEW</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="QUALIFIED">QUALIFIED</option>
                <option value="LOST">LOST</option>
                <option value="WON">WON</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default forwardRef(NewLead);
