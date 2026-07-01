import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName]                     = useState('');
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError]                   = useState('');
  const [loading, setLoading]               = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.register(name, email, password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-ink">
            Finance<span style={{ color: 'var(--rausch)' }}>.</span>
          </h1>
        </div>

        {/* Card */}
        <div className="card-elevated p-8">
          <h2 className="text-xl font-semibold text-ink mb-1">Create your account</h2>
          <p className="text-sm text-muted mb-6">Track your finances in minutes</p>

          {error && (
            <div
              className="mb-4 px-4 py-3 rounded-sm text-sm"
              style={{ background: '#fff0f0', border: '1px solid var(--rausch)', color: '#c13515' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wide">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="airbnb-input"
                required
              />
            </div>

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

            <div className="mb-4">
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

            <div className="mb-6">
              <label className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wide">
                Confirm password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="airbnb-input"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-muted text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-ink font-medium underline hover:no-underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
