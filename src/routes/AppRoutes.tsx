import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import Quiz from "../features/quiz/Quiz";


function hasSessionCookie() {
  return document.cookie.split(';').some(c => c.trim().startsWith('sessionid='));
}


const AppRoutes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => hasSessionCookie());

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !isLoggedIn ? <Login onLogin={() => setIsLoggedIn(true)} /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/register"
        element={
          !isLoggedIn ? <Register /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/"
        element={
          isLoggedIn ? <Quiz /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
