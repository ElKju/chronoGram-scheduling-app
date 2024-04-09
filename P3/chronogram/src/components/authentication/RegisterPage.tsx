import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField } from "@mui/material";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [repeatPasswordError, setRepeatPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');

  

  const handleRegister = async () => {

    // Clear previous validation errors
    setUsernameError('');
    setPasswordError('');
    setEmailError('');

    // Check for validation errors
    let isValid = true;
    if (!username) {
      setUsernameError('Username is required');
      isValid = false;
    }
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    }

    if (password!==repeatPassword) {
      setRepeatPasswordError('Passwords do not match');
      isValid = false;
    }

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

    if (!isValidEmail(email)){
        setEmailError('Invalid email format');
        isValid = false;
    }
    
    // If validation fails, prevent form submission
    if (!isValid) {
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/register/", {
        username,
        password,
        email,
        firstName,
        lastName,
      });
      console.log("Registration successful:", response.data);
      // Handle successful registration (e.g., navigate to login page)
      navigate("/"); // Redirect to the login page
    } catch (error) {
      console.error("Registration error:", error);
      // Handle registration error (e.g., display error message)
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
      }}
    >
      <h2 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>Register</h2>
      <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
          error={!!usernameError}
          helperText={usernameError}
          style={{ width: '300px', fontSize: '1.3rem' }}
      />
      <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
          margin="normal"
          style={{ width: '300px', fontSize: '1.3rem' }}
      />
      <TextField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
          margin="normal"
          style={{ width: '300px', fontSize: '1.3rem' }}
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
          style={{ width: '300px', fontSize: '1.3rem' }}
      />
      <TextField
          label="Repeat Password"
          type="password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          fullWidth
          margin="normal"
          error={!!repeatPasswordError}
          helperText={repeatPasswordError}
          style={{ width: '300px', fontSize: '1.3rem' }}
      />
      <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          error={!!emailError}
          helperText={emailError}
          style={{ width: '300px', fontSize: '1.3rem' }}
      />
      
      <button
        onClick={handleRegister}
        style={{
          width: "320px",
          padding: "12px",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          fontSize: "1.3rem",
          cursor: "pointer",
        }}
      >
        Register
      </button>
      <p style={{ marginTop: "20px", fontSize: "1.3rem", padding: "20px" }}>
        Already have an account?{" "}
        <Link to="/" style={{ textDecoration: "underline", color: "blue" }}>
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
