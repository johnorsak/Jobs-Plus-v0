import React, { useEffect, useRef, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

declare const dhx: any; // 👈 add this to let TypeScript recognize global dhx

const CustomersView: React.FC = () => {
  const gridContainer = useRef<HTMLDivElement>(null);
  const gridInstance = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();
        if (!token) throw new Error("Missing token");

        const res = await fetch(`${API_BASE}/api/customers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Failed to fetch customers (${res.status})`);

        const data = await res.json();

        // ✅ Initialize grid
        if (gridContainer.current) {
          gridInstance.current = new dhx.Grid(gridContainer.current, {
            columns: [
              { id: "id", header: [{ text: "ID" }], width: 80 },
              { id: "name", header: [{ text: "Name" }], fillspace: true },
              { id: "email", header: [{ text: "Email" }], fillspace: true },
              { id: "phone", header: [{ text: "Phone" }], fillspace: true },
            ],
            height: "auto",
            autoWidth: true,
            resizable: true,
            sortable: true,
            selection: "row",
            multiselection: true,
            clipboard: true,
            blockSelection: true,
          });

          gridInstance.current.data.parse(data);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();

    return () => gridInstance.current?.destructor();
  }, []);

  if (loading) return <div className="container mt-4">Loading customers...</div>;
  if (error)
    return (
      <div className="container mt-4 text-danger">
        <h4>Error loading customers</h4>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="container mt-4">
      <h2>Customers</h2>
      <div
        ref={gridContainer}
        style={{
          width: "100%",
          border: "1px solid #ccc",
          overflow: "auto",
        }}
      ></div>
    </div>
  );
};

export default CustomersView;
