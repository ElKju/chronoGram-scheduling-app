import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // State variables for validation errors
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    // Clear previous validation errors
    setUsernameError("");
    setPasswordError("");

    let isValid = true;
    if (!username) {
      setUsernameError("Username required");
      isValid = false;
    }
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/login/", {
        username,
        password,
      });
      console.log("Login successful:", response.data);

      // Extract the access token from the response data
      const accessToken = response.data.access;

      // Store the access token in localStorage
      localStorage.setItem("accessToken", accessToken);

      // Redirect to the main page
      navigate("/main");
    } catch (error) {
      console.error("Login error:", error);
      setPasswordError("Username or Password is invalid. Please try again.");

      // Handle login error (e.g., display error message)
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
        paddingBottom: "90px",
      }}
    >
      <h2 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>Login</h2>
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        margin="normal"
        error={!!usernameError}
        helperText={usernameError}
        style={{
          width: "300px",
          marginBottom: "20px",
          padding: "12px",
          fontSize: "1.3rem",
        }}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        error={!!passwordError}
        helperText={passwordError}
        style={{
          width: "300px",
          marginBottom: "20px",
          padding: "12px",
          fontSize: "1.3rem",
        }}
      />
      <br />
      <button
        onClick={handleLogin}
        style={{
          width: "320px",
          padding: "12px",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          fontSize: "1.3rem",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Login
      </button>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
      <p style={{ marginTop: "20px", fontSize: "1.3rem", padding: "20px" }}>
        Don't have an account?{" "}
        <Link
          to="/register"
          style={{ textDecoration: "underline", color: "blue" }}
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
