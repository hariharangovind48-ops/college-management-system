import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  BookOpen,
  LogOut,
  Sparkles,
  Database,
  ChevronDown,
  Bell,
  Menu,
  X,
  Building2,
} from 'lucide-react';

interface NavbarProps {
  onOpenFirebaseModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenFirebaseModal }) => {
  const { currentUser, role, logout, switchDemoRole, isDemoMode, isFirebaseActive } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleBadge = (r: UserRole | null) => {
    switch (r) {
      case 'hod':
        return {
          label: 'Head of Department (HOD)',
          color: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
          icon: ShieldCheck,
        };
      case 'adviser':
        return {
          label: 'Class Adviser',
          color: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
          icon: UserCheck,
        };
      case 'student':
        return {
          label: 'Student',
          color: 'bg-blue-950/80 text-blue-300 border-blue-500/40',
          icon: BookOpen,
        };
      default:
        return {
          label: 'Guest',
          color: 'bg-slate-800 text-slate-300 border-slate-700',
          icon: GraduationCap,
        };
    }
  };

  const badge = getRoleBadge(role);
  const BadgeIcon = badge.icon;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/40">
      {/* Top institution sub-bar */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-4 py-1 text-xs border-b border-blue-900/30 flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold tracking-wide text-blue-200">
            INFO INSTITUTE OF ENGINEERING
          </span>
          <span className="hidden sm:inline text-slate-400">
            • Approved by AICTE, Affiliated to Anna University, Coimbatore
          </span>
        </div>
        <div className="flex items-center gap-3">
          {isDemoMode && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
              Demo Mode (Fictional Sample Data)
            </span>
          )}
          <button
            onClick={onOpenFirebaseModal}
            className="flex items-center gap-1 hover:text-blue-300 transition-colors text-[11px] px-1.5 py-0.5 rounded bg-slate-800/60 border border-slate-700"
            title="Configure or View Firebase Details"
          >
            <Database className={`w-3 h-3 ${isFirebaseActive ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{isFirebaseActive ? 'Firebase Active' : 'Firebase Setup'}</span>
          </button>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 shadow-md shadow-blue-900/40 border border-blue-400/30">
              <GraduationCap className="w-6 h-6 text-white" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white">
                  INFO <span className="text-blue-400">ENGINEERING</span>
                </span>
                <span className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono uppercase bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded">
                  CMS v2.6
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                College Management & Academic Information System
              </p>
            </div>
          </div>

          {/* Center Role Switcher (in demo mode) */}
          {isDemoMode && currentUser && (
            <div className="hidden lg:flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-1 gap-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-2">
                Switch Role:
              </span>
              <button
                onClick={() => switchDemoRole('hod')}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                  role === 'hod'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                HOD Portal
              </button>
              <button
                onClick={() => switchDemoRole('adviser')}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                  role === 'adviser'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Adviser Portal
              </button>
              <button
                onClick={() => switchDemoRole('student')}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                  role === 'student'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Student Portal
              </button>
            </div>
          )}

          {/* User Profile & Actions */}
          {currentUser ? (
            <div className="flex items-center gap-3">
              {/* Role badge */}
              <div
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.color}`}
              >
                <BadgeIcon className="w-3.5 h-3.5" />
                <span>{badge.label}</span>
              </div>

              {/* User Avatar & Name */}
              <div className="relative">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-900/90 border border-transparent hover:border-slate-800 transition-all text-left"
                >
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={currentUser.displayName}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/40"
                  />
                  <div className="hidden md:block text-xs">
                    <p className="font-semibold text-slate-100 leading-tight">
                      {currentUser.displayName}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate max-w-[130px]">
                      {currentUser.email}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {roleMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-xs"
                    onClick={() => setRoleMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-800/80">
                      <p className="font-semibold text-white">{currentUser.displayName}</p>
                      <p className="text-slate-400 truncate">{currentUser.email}</p>
                      <div className="mt-1.5 flex items-center gap-1 text-[11px] text-blue-400">
                        <span className="capitalize">{currentUser.role}</span>
                        <span>•</span>
                        <span className="truncate">{currentUser.department}</span>
                      </div>
                    </div>

                    {isDemoMode && (
                      <div className="px-3 py-2 border-b border-slate-800/80">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                          Switch Demo Role:
                        </p>
                        <button
                          onClick={() => switchDemoRole('hod')}
                          className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between"
                        >
                          <span>HOD Portal (Dr. Radhakrishnan)</span>
                          {role === 'hod' && <span className="text-purple-400 text-[10px]">Active</span>}
                        </button>
                        <button
                          onClick={() => switchDemoRole('adviser')}
                          className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between"
                        >
                          <span>Adviser (Prof. S. Meenakshi)</span>
                          {role === 'adviser' && <span className="text-emerald-400 text-[10px]">Active</span>}
                        </button>
                        <button
                          onClick={() => switchDemoRole('student')}
                          className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between"
                        >
                          <span>Student (Harish V - 22CS042)</span>
                          {role === 'student' && <span className="text-blue-400 text-[10px]">Active</span>}
                        </button>
                      </div>
                    )}

                    <div className="px-2 pt-1">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg font-medium transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out / Lock Session</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenFirebaseModal}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700"
              >
                Firebase Guide
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 space-y-3">
          {currentUser && isDemoMode && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase">Switch Demo Role:</p>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => {
                    switchDemoRole('hod');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-1.5 text-xs text-center rounded font-medium ${
                    role === 'hod' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  HOD
                </button>
                <button
                  onClick={() => {
                    switchDemoRole('adviser');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-1.5 text-xs text-center rounded font-medium ${
                    role === 'adviser' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Adviser
                </button>
                <button
                  onClick={() => {
                    switchDemoRole('student');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-1.5 text-xs text-center rounded font-medium ${
                    role === 'student' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Student
                </button>
              </div>
            </div>
          )}
          {currentUser && (
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2 text-rose-400 bg-rose-500/10 rounded-lg text-xs font-medium"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          )}
        </div>
      )}
    </header>
  );
};
