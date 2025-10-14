import React, { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

const CustomersView: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/customers`)
      .then((r) => r.json())
      .then(setCustomers)
      .catch(console.error);
  }, []);

  return (
    <div className="container mt-4">
      <h2>Customers</h2>
      <table className="table table-striped">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th></tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersView;
