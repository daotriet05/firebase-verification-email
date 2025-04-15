// src/App.js
import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase-config";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setStatus("Password must be at least 6 characters.");
      return;
    }

    setStatus("Creating account...");

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCred.user);
      setStatus("Verification email sent. Please check your inbox.");

      // Save displayName to localStorage
      localStorage.setItem("userDisplayName", displayName);
    } catch (err) {
      console.error("Error:", err);
      setStatus("Error: " + err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user);
      if (user) {
        // Always reload the user to update emailVerified flag
        await user.reload();
  
        if (user.emailVerified) {
          const storedDisplayName = localStorage.getItem("userDisplayName");
          if (!storedDisplayName) {
            setStatus("No display name found.");
            return;
          }
  
          try {
            await setDoc(doc(db, "users", user.uid), {
              email: user.email,
              displayName: storedDisplayName,
              createdAt: serverTimestamp()
            });
            setStatus("Email verified. Profile saved to Firestore.");
            localStorage.removeItem("userDisplayName");
          } catch (err) {
            console.error("Firestore write error:", err);
            setStatus("Failed to save profile: " + err.message);
          }
          unsubscribe(); // optional: avoid repeating
        } else {
          setStatus("Please verify your email and reload the page.");
        }
      } else {
        setStatus("User is not signed in.");
      }
    });
  
    return () => unsubscribe(); // Clean up listener on unmount
  }, []);
  

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />

        <input
          type="password"
          placeholder="Password (min 6 chars)"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />

        <input
          type="text"
          placeholder="Display Name"
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        /><br /><br />

        <button type="submit">Sign Up</button>
      </form>
      <p>{status}</p>
    </div>
  );
}

export default App;
