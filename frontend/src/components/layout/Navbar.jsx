import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, LogOut, Search, Bell, HelpCircle, ArrowRight, Zap, BookOpen, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const isDashboardRoute = ['/dashboard', '/api-keys', '/logs', '/billing', '/settings', '/admin/dashboard'].includes(location.pathname);

  return (
    <nav className="sticky top-0 z-40 w-full bg-[#0b1329] border-b border-surface-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left: Brand Logo & Razorpay Mode Toggle */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-1 rounded bg-[#0c6efd] text-white shadow-sm flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-base font-extrabold tracking-tight text-white">
                Verify<span className="text-[#0c6efd]">Flow</span>
              </span>
            </Link>

            {/* Razorpay Signature LIVE / TEST Mode Toggle Pill */}
            {user && isDashboardRoute && (
              <div className="flex items-center space-x-2 pl-3 border-l border-surface-800">
                <button
                  onClick={() => setIsLiveMode(!isLiveMode)}
                  className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all border ${
                    isLiveMode
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isLiveMode ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span>{isLiveMode ? 'Live Mode' : 'Test Mode'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Center: Search Bar (Dashboard) OR Nav Links (Public) */}
          {user && isDashboardRoute ? (
            <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-500">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  placeholder="Search payments, UTRs, API keys... (Ctrl + K)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-12 py-1.5 bg-[#080e1f] border border-surface-800 rounded-md text-xs text-surface-100 placeholder-surface-500 focus:outline-none focus:border-[#0c6efd] transition-colors"
                />
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                  <kbd className="px-1.5 py-0.5 text-[9px] font-mono text-surface-400 bg-surface-800 rounded border border-surface-700">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-6 text-xs font-semibold text-surface-300">
              <Link to="/#payments" className="hover:text-white transition-colors flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-[#0c6efd]" />
                <span>Payments API</span>
              </Link>
              <Link to="/#fraud" className="hover:text-white transition-colors flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-[#0c6efd]" />
                <span>Fraud Engine</span>
              </Link>
              <Link to="/#docs" className="hover:text-white transition-colors flex items-center space-x-1">
                <BookOpen className="w-3.5 h-3.5 text-[#0c6efd]" />
                <span>Developers</span>
              </Link>
              <Link to="/billing" className="hover:text-white transition-colors">
                Pricing
              </Link>
            </div>
          )}

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-2">
                <a
                  href="#docs"
                  className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold text-surface-300 hover:text-white hover:bg-surface-800 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Docs</span>
                </a>
                <button
                  className="p-1.5 rounded text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                </button>
                <button
                  className="p-1.5 rounded text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
                  title="Help & Support"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>

                <div className="h-4 w-[1px] bg-surface-800"></div>

                {/* Merchant Account Dropdown Badge */}
                <div className="flex items-center space-x-2 px-2 py-1 rounded bg-[#080e1f] border border-surface-800">
                  <div className="w-5 h-5 rounded bg-[#0c6efd] text-white flex items-center justify-center font-bold text-[10px]">
                    {user.name ? user.name[0].toUpperCase() : 'M'}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold text-surface-200 max-w-[100px] truncate">
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 rounded text-surface-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded text-xs font-semibold text-surface-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded bg-[#0c6efd] hover:bg-blue-600 text-white text-xs font-bold shadow-sm inline-flex items-center space-x-1 transition-colors"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
