import React, { useState } from 'react';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(email, password);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(180deg,#071025 0%, #081021 100%)'}}>
      <div className="w-full max-w-md glass floating-card">
        <h1 className="text-2xl font-semibold mb-6">Welcome back</h1>

        {error && (
          <div className="bg-red-600 bg-opacity-20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[color:var(--muted)] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-transparent border border-[rgba(255,255,255,0.04)] focus:border-primary-500 outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[color:var(--muted)] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-transparent border border-[rgba(255,255,255,0.04)] focus:border-primary-500 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:opacity-95 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-[color:var(--muted)] text-sm mt-6">
          Don't have an account?{' '}
          <a href="/register" className="text-primary-300 hover:underline font-medium">Create one</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
