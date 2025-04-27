import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = e => {
    e.preventDefault();

    // Load users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Find matching user
    const found = users.find(
      u => u.email === form.email && u.password === form.password
    );

    if (found) {
      // Mock token and store user (without password)
      localStorage.setItem('token', 'mock-jwt-token');
      const { password, ...userSafe } = found;
      localStorage.setItem('user', JSON.stringify(userSafe));

      navigate('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <input
          name="email"
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
};

export default Login;
