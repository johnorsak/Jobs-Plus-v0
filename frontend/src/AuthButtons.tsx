import React, { useEffect, useState } from "react";
import { signInWithRedirect, signOut, fetchAuthSession } from "aws-amplify/auth";

const AuthButtons: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  // On mount, check if there's an authenticated user
  useEffect(() => {
    async function checkSession() {
      try {
        const session = await fetchAuthSession();
        if (session?.tokens?.idToken) {
          const claims = session.tokens.idToken?.payload;
          setUser(claims);
        }
      } catch {
        setUser(null);
      }
    }
    checkSession();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      ) : (
        <button onClick={() => signInWithRedirect()}>Sign In</button>
      )}
    </div>
  );
};

export default AuthButtons;
