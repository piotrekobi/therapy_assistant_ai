// src/components/Login.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext'; // Import AppContext to use the login function

const Login = () => {
  const { login } = useContext(AppContext); // Use the login function from AppContext
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', { username, password }, { withCredentials: true });
      if (response.data && response.status === 200) {
        login({ username }); // Call login function with user data
        alert(response.data.message); // Display success message
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed'); // Display error message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
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
  );
};

export default Login;
