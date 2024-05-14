// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from './logo.png'; // Import the logo

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if the username has "@stud.ase.ro" before attempting login
    if (username.endsWith('@stud.ase.ro')) {
      // TODO: Implement authentication logic here

      // For demonstration purposes, assume login is successful
      const isLoginSuccessful = true;

      if (isLoginSuccessful) {
        // Redirect to the dashboard
        navigate('/dashboard');
      }
    } else {
      alert('Invalid email. Please use an institutional email (example@stud.ase.ro).');
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Logo" className="login-logo" /> {/* Add the logo above the login form */}
      <div className="login-form">
        <h2>Chronicle Notes</h2>
        <form onSubmit={handleLogin}>
          <label>
            Email:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <br />
          <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <br />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
