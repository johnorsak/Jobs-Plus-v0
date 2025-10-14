import React, { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

const LeadsView: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/leads`)
      .then((r) => r.json())
      .then(setLeads)
      .catch(console.error);
  }, []);

  return (
    <div className="container mt-4">
      <h2>Leads</h2>
      <table className="table table-striped">
        <thead>
          <tr><th>ID</th><th>Title</th><th>Status</th><th>Customer</th></tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.title}</td>
              <td>{l.status}</td>
              <td>{l.customer?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsView;
