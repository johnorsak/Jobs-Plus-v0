import React, { useEffect, useRef, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import NewLead, { NewLeadRef } from "./NewLead";
import { Grid } from "dhx-suite";
import "dhx-suite/codebase/suite.min.css";
import "../styles.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

interface LeadsViewProps {
  openModalOnLoad?: boolean;
}

const LeadsView: React.FC<LeadsViewProps> = ({ openModalOnLoad = false }) => {
  const [showModal, setShowModal] = useState(openModalOnLoad);
  const gridContainer = useRef<HTMLDivElement>(null);
  const gridInstance = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<{ handleSubmit: () => void }>(null);

  const loadLeads = async () => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      if (!token) throw new Error("Missing token");

      const res = await fetch(`${API_BASE}/api/leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to fetch leads (${res.status})`);

      const data = await res.json();
      const gridData = data.map((lead: any) => ({
        id: lead.id,
        title: lead.title,
        status: lead.status,
        customerName: lead.customer?.name || "",
      }));

      if (gridInstance.current) {
        gridInstance.current.data.parse(gridData);
      } else if (gridContainer.current) {
        gridInstance.current = new Grid(gridContainer.current, {
          columns: [
            { id: "id", header: [{ text: "ID" }], width: 80 },
            { id: "title", header: [{ text: "Title" }] },
            { id: "status", header: [{ text: "Status" }], width: 120 },
            {
              id: "customerName",
              header: [{ text: "Customer" }],
            },
          ],
          autoWidth: true,
          resizable: true,
          sortable: true,
          selection: "row",
          height: "auto",
          editable: true,
        });
        gridInstance.current.data.parse(gridData);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
    return () => gridInstance.current?.destructor();
  }, []);

  if (loading) return <div className="container mt-4">Loading leads...</div>;
  if (error) return <div className="container mt-4 text-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Leads</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Lead
        </button>
      </div>

      <div
        ref={gridContainer}
        style={{
          width: "100%",
          height: "calc(80vh)",
          border: "1px solid #ccc",
          overflow: "auto",
        }}
      ></div>

      {showModal && (
        <div
          className="modal fade show"
          tabIndex={-1}
          role="dialog"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-dialog modal-xl modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Lead</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <NewLead
                  ref={formRef}
                  onSuccess={() => {
                    setShowModal(false); // ✅ close modal
                    loadLeads(); // ✅ refresh grid
                  }}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => formRef.current?.handleSubmit()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsView;
