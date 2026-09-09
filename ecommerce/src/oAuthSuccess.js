import React, { useEffect } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

function OAuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(
      location.search
    );

    const token = params.get("token");

    // No token
    if (!token) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    // Save JWT
    localStorage.setItem(
      "token",
      token
    );

    // Go to products
    navigate("/products", {
      replace: true,
    });

  }, [location, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <h2>Login successful</h2>

      <p>
        Redirecting to products...
      </p>
    </div>
  );
}

export default OAuthSuccess;