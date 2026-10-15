import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  GraduationCap,
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
  BookOpen,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Building2,
  CheckCircle2,
} from 'lucide-react';

interface LoginPageProps {
  onOpenFirebaseModal: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onOpenFirebaseModal }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);

    const res = await login(email, password);
    setLoading(false);
    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickDemoLogin = async (role: UserRole) => {
    setLoading(true);
    setErrorMessage(null);
    let demoEmail = '';
    if (role === 'hod') demoEmail = 'hod.cse@infoengg.edu.in';
    else if (role === 'adviser') demoEmail = 'meenakshi.cse@infoengg.edu.in';
    else demoEmail = 'harish.22cs042@infoengg.edu.in';

    setEmail(demoEmail);
    setPassword('DemoPass2026!');

    const res = await login(demoEmail, 'DemoPass2026!', role);
    setLoading(false);
    if (!res.success) {
      setErrorMessage(res.error || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[300px] bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />

      {/* College Emblem & Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-950 border border-blue-400/40 shadow-xl shadow-blue-900/30 mb-2">
          <GraduationCap className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
          INFO INSTITUTE OF ENGINEERING
        </h1>
        <p className="text-xs sm:text-sm text-blue-400 font-semibold tracking-wide">
          COIMBATORE • TAMIL NADU
        </p>
        <p className="text-xs text-slate-400 font-medium">
          Approved by AICTE, New Delhi • Affiliated to Anna University, Chennai
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-2xl relative">
          {/* Subtle top highlight */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 rounded-t-2xl" />

          <div className="mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight">Academic Portal Sign In</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Role-based access for HOD, Class Advisers, and Students
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Institutional Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="rollno@infoengg.edu.in or faculty@..."
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.99] transition-all shadow-lg shadow-blue-900/40 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Options */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant Demo Mode Access</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              Click below to explore each authorized portal using fictional sample data for INFO Institute of Engineering:
            </p>

            <div className="space-y-2">
              {/* HOD Button */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('hod')}
                className="w-full text-left p-2.5 rounded-xl bg-purple-950/30 hover:bg-purple-950/60 border border-purple-500/30 hover:border-purple-500/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-purple-900/60 text-purple-300">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-purple-200 group-hover:text-white transition-colors">
                      1. Head of Department (HOD)
                    </p>
                    <p className="text-[10px] text-slate-400">Dr. K. Radhakrishnan • All Students & Classes</p>
                  </div>
                </div>
                <span className="text-[10px] text-purple-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  Launch &rarr;
                </span>
              </button>

              {/* Class Adviser Button */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('adviser')}
                className="w-full text-left p-2.5 rounded-xl bg-emerald-950/30 hover:bg-emerald-950/60 border border-emerald-500/30 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-900/60 text-emerald-300">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-200 group-hover:text-white transition-colors">
                      2. Class Adviser Portal
                    </p>
                    <p className="text-[10px] text-slate-400">Prof. S. Meenakshi • III CSE A (Marks & Attendance)</p>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  Launch &rarr;
                </span>
              </button>

              {/* Student Button */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('student')}
                className="w-full text-left p-2.5 rounded-xl bg-blue-950/30 hover:bg-blue-950/60 border border-blue-500/30 hover:border-blue-500/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-blue-900/60 text-blue-300">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-200 group-hover:text-white transition-colors">
                      3. Student Portal
                    </p>
                    <p className="text-[10px] text-slate-400">Harish V (22CS042) • Hall Ticket, Leaves & Marks</p>
                  </div>
                </div>
                <span className="text-[10px] text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  Launch &rarr;
                </span>
              </button>
            </div>
          </div>

          {/* Real Firebase Note */}
          <div className="mt-6 text-center">
            <button
              onClick={onOpenFirebaseModal}
              className="text-[11px] text-slate-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
            >
              <span>Connect or configure Live Firebase credentials</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>

        {/* Fictional Data Disclaimer Requirement */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-400 leading-relaxed max-w-sm mx-auto">
            <span className="font-semibold text-slate-400">Demo Mode Notice:</span> All names, roll numbers, marks, and records presented in demo mode are fictional sample data for testing and demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  );
};
