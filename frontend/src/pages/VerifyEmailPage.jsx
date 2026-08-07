import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { authService } from '../services/auth.service';
import { Button } from '../components/common/Button';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('VERIFYING'); // VERIFYING, SUCCESS, ERROR
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('ERROR');
        setMessage('Verification token missing from link');
        return;
      }

      try {
        const res = await authService.verifyEmail(token);
        setStatus('SUCCESS');
        setMessage(res?.message || 'Your email address has been verified successfully!');
      } catch (err) {
        setStatus('ERROR');
        setMessage(err?.message || 'Invalid or expired email verification link');
      }
    };

    verifyToken();
  }, [token]);

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
          Email Verification
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="glass-panel rounded-2xl p-8 border border-surface-800 shadow-2xl text-center space-y-6">
          {status === 'VERIFYING' && (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500 mx-auto"></div>
              <p className="text-sm text-surface-300">Verifying your email token with server...</p>
            </div>
          )}

          {status === 'SUCCESS' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-surface-100">Verification Complete</h3>
              <p className="text-sm text-surface-300">{message}</p>
              <Link to="/login" className="inline-block pt-2">
                <Button className="w-full">
                  Proceed to Login <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}

          {status === 'ERROR' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-400 w-fit mx-auto">
                <XCircle className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-surface-100">Verification Failed</h3>
              <p className="text-sm text-rose-400">{message}</p>
              <Link to="/login" className="inline-block pt-2">
                <Button variant="secondary" className="w-full">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
