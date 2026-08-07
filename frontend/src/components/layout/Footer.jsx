import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-surface-800 bg-surface-950 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-surface-400 text-xs">
          <ShieldCheck className="w-4 h-4 text-brand-500" />
          <span className="font-bold text-surface-200">VerifyFlow Platform</span>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </div>
        <div className="flex items-center space-x-6 text-xs text-surface-400 font-medium">
          <a href="#" className="hover:text-surface-200 transition-colors">API Docs</a>
          <a href="#" className="hover:text-surface-200 transition-colors">Privacy</a>
          <a href="#" className="hover:text-surface-200 transition-colors">Terms</a>
          <a href="#" className="hover:text-surface-200 transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
};
