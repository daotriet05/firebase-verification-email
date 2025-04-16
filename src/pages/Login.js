import React, { useState } from "react";
import { auth } from "../firebase-config";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleCaptcha = (value) => setCaptchaToken(value);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!captchaToken) return setStatus("Please complete the CAPTCHA.");

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      await userCred.user.reload(); // Refresh emailVerified flag

      if (userCred.user.emailVerified) {
        navigate("/");
      } else {
        setStatus("Email not verified. Please check your inbox.");
        await signOut(auth); // Optional: auto sign out unverified
      }
    } catch (err) {
      setStatus("Login failed: " + err.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" required placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} /><br /><br />

        <input type="password" required placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} /><br /><br />

        <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleCaptcha} /><br />
        <button type="submit">Login</button>
      </form>
      <p>{status}</p>
    </div>
  );
}

export default Login;
