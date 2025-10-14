import React, { useEffect, useState } from "react";
import { signInWithRedirect, signOut, fetchAuthSession } from "aws-amplify/auth";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkUser() {
      try {
        const session = await fetchAuthSession();
        if (session?.tokens?.idToken) {
          setUser(session.tokens.idToken.payload);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }
    checkUser();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          JobsPlus
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/leads">
                Leads
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/customers">
                Customers
              </a>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            {user ? (
              <>
                <span className="text-light me-3">{user.email}</span>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={() => signOut()}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => signInWithRedirect()}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
