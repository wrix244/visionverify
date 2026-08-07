import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const LoginPage = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let res;
      if (isAdminMode) {
        res = await authService.adminLogin({ email, password });
      } else {
        res = await authService.login({ email, password });
      }

      if (res?.data) {
        const account = res.data.user || res.data.admin;
        login(account, res.data.accessToken, res.data.refreshToken);

        if (account.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err?.message || 'Invalid email or password credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/15 blur-[100px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-lg shadow-brand-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
        </Link>
        <h2 className="text-2xl font-extrabold text-surface-50 tracking-tight">
          Sign in to VerifyFlow
        </h2>
        <p className="mt-2 text-sm text-surface-400">
          {isAdminMode ? 'Platform Administration Gateway' : 'Merchant verification dashboard & API credentials'}
        </p>

        {/* Mode Selector Tabs */}
        <div className="mt-6 flex justify-center p-1 bg-surface-900 rounded-xl border border-surface-800 w-fit mx-auto">
          <button
            onClick={() => { setIsAdminMode(false); setError(''); }}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !isAdminMode ? 'bg-brand-600 text-white shadow' : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Merchant Login</span>
          </button>
          <button
            onClick={() => { setIsAdminMode(true); setError(''); }}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isAdminMode ? 'bg-indigo-600 text-white shadow' : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Portal</span>
          </button>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="glass-panel rounded-2xl p-8 border border-surface-800 shadow-2xl space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={isAdminMode ? 'Admin Email' : 'Merchant Email'}
              type="email"
              placeholder={isAdminMode ? 'admin@verifyflow.io' : 'merchant@company.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400">
                  Password
                </label>
                {!isAdminMode && (
                  <Link to="/forgot-password" className="text-xs text-brand-400 hover:underline">
                    Forgot password?
                  </Link>
                )}
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-surface-900/80 border border-surface-800 rounded-lg text-sm text-surface-100 placeholder-surface-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <Button type="submit" isLoading={loading} className="w-full">
              {isAdminMode ? 'Authenticate Admin' : 'Sign In'}
            </Button>
          </form>

          {!isAdminMode && (
            <div className="text-center pt-2 text-xs text-surface-400 border-t border-surface-800">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-400 font-semibold hover:underline">
                Register merchant account
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
