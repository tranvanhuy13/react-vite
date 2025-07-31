import React, { useState } from "react";

type LoginProps = {
  onLogin: (username: string) => void;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Allow session cookies
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          localStorage.setItem('isLogin', 'false');
        }
        setError(data.detail || "Login failed");
      } else {
        localStorage.setItem('isLogin', 'true');
        onLogin(data.username || ""); // Login success
      }
    } catch (err) {
      localStorage.setItem('isLogin', 'false');
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

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
        <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#333', letterSpacing: 1 }}>Sign In</h2>
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
                autoComplete="current-password"
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div style={{ marginTop: 18, textAlign: 'center', fontSize: 15, color: '#666' }}>
          <span>Don't have an account? </span>
          <a href="/register" style={{ color: '#4f8cff', textDecoration: 'none', fontWeight: 500 }}>Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
