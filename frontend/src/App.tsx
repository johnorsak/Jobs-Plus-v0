import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import AuthPage from "./AuthPage";
import Home from "./views/Home";
import NewLead from "./views/NewLead";
import LeadsView from "./views/LeadsView";
import CustomersView from "./views/CustomersView";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchAuthSession, getCurrentUser, signOut } from "aws-amplify/auth";
import { Authenticator } from "@aws-amplify/ui-react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";

const AppContent = () => {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  if (!user) return <AuthPage onAuthSuccess={() => window.location.reload()} />;

  const LeadsViewWrapper = () => {
    const location = useLocation();
    const openModal = location.state?.openModal || false;
    return <LeadsView openModalOnLoad={openModal} />;
  };

  return (
    <Authenticator>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Redirect /newLead → /leads with state to open modal */}
        <Route
          path="/newLead"
          element={<Navigate to="/leads" state={{ openModal: true }} replace />}
        />

        <Route path="/leads" element={<LeadsViewWrapper />} />
        <Route path="/customers" element={<CustomersView />} />
      </Routes>
    </Authenticator>
  );
};

export default function App() {
  return (
    <Router>
      <Navbar />
      <AppContent />
    </Router>
  );
}
