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
} from "react-router-dom";

const AppContent = () => {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  if (!user) return <AuthPage onAuthSuccess={() => window.location.reload()} />;

  return (
    <Authenticator>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/newLead" element={<NewLead />} />
        <Route path="/leads" element={<LeadsView />} />
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
