import React, { useState } from "react";
import "./Login.css";
import { auth } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        // displayName can be updated later using updateProfile if needed
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // Navigation is handled automatically by onAuthStateChanged in App.jsx
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="card-wrap">
        <div className="card-border">
          <div className="card">
            <div className="brand">
              <div className="logo">SatLab</div>
              <div className="tagline">
                Boost Your SAT Math — Your Calculator is Your Key to Success
              </div>
            </div>

            <form onSubmit={onSubmit} className="login-form" aria-describedby="err">
              {isSignUp && (
                <input
                  type="text"
                  placeholder="Display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button className="primary" type="submit" disabled={loading}>
                {loading
                  ? isSignUp
                    ? "Signing up..."
                    : "Logging in..."
                  : isSignUp
                  ? "Sign up"
                  : "Log in"}
              </button>
            </form>

            {error && (
              <div id="err" className="error" role="alert">
                {error}
              </div>
            )}

            <div className="foot">
              <button
                className="link-btn"
                onClick={() => {
                  setIsSignUp((s) => !s);
                  setError("");
                }}
              >
                {isSignUp
                  ? "Already have an account? Log in"
                  : "No account? Sign up"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="page-footer">
        <span>© SatLab</span>
      </div>
    </div>
  );
}
