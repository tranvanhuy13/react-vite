import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/auth/logout/", {
          method: "POST",
          credentials: "include",
        });

        if (!response.ok) {
          console.error("Logout failed with status:", response.status);
        }
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        navigate("/login", { replace: true });
      }
    };

    logout();
  }, [navigate]);

  return <p>Logging out...</p>;
};

export default Logout;
