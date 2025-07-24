import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import Quiz from "../features/quiz/Quiz";

const AppRoutes = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !token ? <Login onLogin={() => setToken("session")} /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/register"
        element={
          !token ? <Register /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/"
        element={
          token ? <Quiz token={token} /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
