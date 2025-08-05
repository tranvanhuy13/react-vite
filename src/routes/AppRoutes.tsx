import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";


import Quiz from "../features/quiz/Quiz";
import Logout from "../features/auth/Logout";



function getIsLogin() {
  return localStorage.getItem('isLogin') === 'true';
}





const AppRoutes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => getIsLogin());
  // Sync isLoggedIn with localStorage changes (including from Logout)
  useEffect(() => {
    const syncLogin = () => setIsLoggedIn(getIsLogin());
    window.addEventListener('storage', syncLogin);
    // Also check on mount in case of direct navigation
    syncLogin();
    return () => window.removeEventListener('storage', syncLogin);
  }, []);
  console.log('localStorage.isLogin:', localStorage.getItem('isLogin'));

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !isLoggedIn ? <Login onLogin={() => {
            localStorage.setItem('isLogin', 'true');
            setIsLoggedIn(true);
          }} /> : <Navigate to="/" replace />
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
      <Route
        path="/logout"
        element={<Logout />}
      />
    </Routes>
  );
};

export default AppRoutes;
