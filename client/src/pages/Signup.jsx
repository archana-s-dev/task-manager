import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckSquare, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import api from "../services/api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      navigate("/login", {
        state: {
          message: "Account created successfully! Please log in.",
        },
      });
        } catch (err) {
          setError(err.response?.data?.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-banner">
        <div className="brand">
          <CheckSquare size={28} />
          <span>TaskManager</span>
        </div>

        <div className="banner-content">
          <h1>Create Your Account</h1>
          <p>Start managing your tasks and building better habits today.</p>
        </div>
      </section>

      <section className="auth-form-section">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
          <p className="form-subtitle">Create a new account</p>

          {error && <div className="form-error">{error}</div>}

          <label htmlFor="name">Full Name</label>
          <div className="input-wrapper">
            <User size={18} />
            <input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <label htmlFor="email">Email Address</label>
          <div className="input-wrapper">
            <Mail size={18} />
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label htmlFor="password">Password</label>
          <div className="input-wrapper">
            <Lock size={18} />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password (8+ characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button className="primary-button" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
