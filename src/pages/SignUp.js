import React, { useState } from "react";
import { auth, db } from "../firebase-config";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleCaptcha = (value) => setCaptchaToken(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) return setStatus("Please complete the CAPTCHA.");
    if (password.length < 6) return setStatus("Password too short.");

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCred.user);
      await setDoc(doc(db, "users", userCred.user.uid), {
        email,
        displayName,
        createdAt: serverTimestamp()
      });
      await signOut(auth); // Force user to verify before using app
      setStatus("Verification email sent. Please log in after verifying.");
      navigate("/login");
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" required placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} /><br /><br />

        <input type="password" required placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} /><br /><br />

        <input type="text" required placeholder="Display Name"
          value={displayName} onChange={(e) => setDisplayName(e.target.value)} /><br /><br />

        <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleCaptcha} /><br />
        <button type="submit">Register</button>
      </form>
      <p>{status}</p>
    </div>
  );
}

export default SignUp;
