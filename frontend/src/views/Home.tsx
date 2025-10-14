import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="container mt-5 text-center">
      <h1>Welcome to JobsPlus</h1>
      <p className="lead mt-3">
        Manage your leads and customers easily.
      </p>
      <div className="mt-4">
        <Link className="btn btn-primary mx-2" to="/newLead">New Lead</Link>
        <Link className="btn btn-secondary mx-2" to="/leads">View Leads</Link>
        <Link className="btn btn-info mx-2" to="/customers">View Customers</Link>
      </div>
    </div>
  );
};

export default Home;
