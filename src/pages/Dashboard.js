import React, { useEffect, useState } from "react";
import { auth } from "../firebase-config";
import { useNavigate, Link } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      await currentUser?.reload(); // Refresh emailVerified status
      if (currentUser?.emailVerified) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dashboard</h2>

      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={handleLogout}>Log Out</button>
        </>
      ) : (
        <>
          <p>You are not logged in.</p>
          <Link to="/login">
            <button style={{ marginRight: "1rem" }}>Log In</button>
          </Link>
          <Link to="/signup">
            <button>Sign Up</button>
          </Link>
        </>
      )}
    </div>
  );
}

export default Dashboard;
