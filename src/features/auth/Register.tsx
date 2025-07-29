import React, { useState } from "react";

type RegisterProps = {
  onRegister?: () => void;
};

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/auth/register/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, password2 }),
    });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Registration failed");
        setLoading(false);
        return;
      }
      setSuccess(true);
      if (onRegister) onRegister();
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          minHeight: '100vh',
          minWidth: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          zIndex: 1000,
          overflow: 'hidden',
        }}
      >
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: 32, width: 360, maxWidth: '90%', textAlign: 'center' }}>
          <h2 style={{ color: '#333', letterSpacing: 1, marginBottom: 16 }}>Registration Successful</h2>
          <p style={{ fontSize: 16, color: '#555' }}>
            You can now <a href="/login" style={{ color: '#4f8cff', textDecoration: 'none', fontWeight: 500 }}>login</a>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        minHeight: '100vh',
        minWidth: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: 32, width: 360, maxWidth: '90%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#333', letterSpacing: 1 }}>Register</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#555', fontWeight: 500 }}>
              Username
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ccc',
                  borderRadius: 8,
                  marginTop: 4,
                  fontSize: 16,
                  outline: 'none',
                  transition: 'border 0.2s',
                }}
              />
            </label>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#555', fontWeight: 500 }}>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ccc',
                  borderRadius: 8,
                  marginTop: 4,
                  fontSize: 16,
                  outline: 'none',
                  transition: 'border 0.2s',
                }}
              />
            </label>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#555', fontWeight: 500 }}>
              Confirm Password
              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
                autoComplete="new-password"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ccc',
                  borderRadius: 8,
                  marginTop: 4,
                  fontSize: 16,
                  outline: 'none',
                  transition: 'border 0.2s',
                }}
              />
            </label>
          </div>
          {error && (
            <div style={{ color: '#e74c3c', marginBottom: 14, textAlign: 'center', fontWeight: 500 }}>{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 0',
              background: '#4f8cff',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 17,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 8px rgba(79,140,255,0.08)',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div style={{ marginTop: 18, textAlign: 'center', fontSize: 15, color: '#666' }}>
          <span>Already have an account? </span>
          <a href="/login" style={{ color: '#4f8cff', textDecoration: 'none', fontWeight: 500 }}>Login</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
