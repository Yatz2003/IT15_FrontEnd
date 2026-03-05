import React, { useState } from 'react';
import './login.css';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      
      console.log('Login response status:', response.status);
      console.log('Login response data:', data);

      if (!response.ok) {
        console.error('Login failed:', data);
        setError(data.message || data.error || 'Invalid credentials. Please try again.');
        return;
      }

      // Login successful
      console.log('Login successful, token:', data.token);
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      setSuccess('Login successful! Redirecting...');

      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess();
          return;
        }

        window.location.href = '/dashboard';
      }, 1000);
    } catch (err) {
      setError('Unable to connect to the server. Please check your connection and try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordPlaceholder = () => {
    return password ? '*'.repeat(password.length) : '••••••••••••••••';
  };

  return (
    <div className="login-dashboard">
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p className="subtitle">Sign in to your account</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={getPasswordPlaceholder()}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <a href="#forgot">Forgot password?</a>
            <span> | </span>
            <a href="#signup">Create account</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
