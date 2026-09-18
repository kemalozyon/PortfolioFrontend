// frontend/src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clearNotes } from '../lib/notesApi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Bekleme durumu için eklendi

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Yeni denemede eski hatayı temizle

    try {
      const response = await axios.post('/api/auth/login', { email, password });

      clearNotes();
      localStorage.setItem('adminToken', response.data.token);
      navigate('/admin');
    } catch {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100svh-96px)] bg-slate-950 flex items-center justify-center px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full bg-slate-900 rounded-2xl p-8 border border-slate-800 transform transition-all">

        {/* Üst Kısım / Başlık */}
        <div className="mb-8">
          <p className="font-mono text-xs tracking-widest text-emerald-400 mb-3">PORTFOLIO / ADMIN</p>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">Admin Login</h2>
          <p className="text-slate-400 mt-2 text-sm">Welcome to the portfolio management panel.</p>
        </div>

        {/* Hata Mesajı */}
        {error && (
          <div role="alert" className="bg-red-400/5 border border-red-400/20 p-4 mb-6 rounded-md">
            <p className="text-red-300 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
            <input
              id="admin-email" autoComplete="username" type="email"
              placeholder="admin@example.com"
              className="w-full px-4 py-3 rounded-lg border border-slate-700 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all outline-none bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:bg-slate-950"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
            <input
              id="admin-password" autoComplete="current-password" type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-slate-700 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all outline-none bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:bg-slate-950"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;
