import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authService.login(email, password);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    /* White canvas page — center the form card */
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-ink">
            Finance<span style={{ color: 'var(--rausch)' }}>.</span>
          </h1>
        </div>

        {/* Card — 14px radius, hairline border, Airbnb shadow */}
        <div className="card-elevated p-8">
          <h2 className="text-xl font-semibold text-ink mb-1">Welcome back</h2>
          <p className="text-sm text-muted mb-6">Sign in to your account</p>

          {error && (
            <div
              className="mb-4 px-4 py-3 rounded-sm text-sm"
              style={{ background: '#fff0f0', border: '1px solid var(--rausch)', color: 'var(--error-text, #c13515)' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="airbnb-input"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="airbnb-input"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-sm text-muted text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-ink font-medium underline hover:no-underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
