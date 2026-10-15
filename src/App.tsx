import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { HODDashboard } from './components/hod/HODDashboard';
import { AdviserDashboard } from './components/adviser/AdviserDashboard';
import { StudentDashboard } from './components/student/StudentDashboard';
import { FirebaseModal } from './components/FirebaseModal';
import { Sparkles, Building2, ShieldCheck, Info } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, role, isDemoMode } = useAuth();
  const [firebaseModalOpen, setFirebaseModalOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onOpenFirebaseModal={() => setFirebaseModalOpen(true)} />
        <FirebaseModal
          isOpen={firebaseModalOpen}
          onClose={() => setFirebaseModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar onOpenFirebaseModal={() => setFirebaseModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Dynamic Role Dashboard */}
        {role === 'hod' && <HODDashboard />}
        {role === 'adviser' && <AdviserDashboard />}
        {role === 'student' && <StudentDashboard />}
      </main>

      {/* Demo Mode & Institution Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/90 text-xs py-5 px-4 text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-slate-300">
              INFO Institute of Engineering, Coimbatore
            </span>
            <span className="hidden sm:inline text-slate-500">• Approved by AICTE, Affiliated to Anna University</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            {isDemoMode && (
              <span className="inline-flex items-center gap-1.5 text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Fictional sample data for testing purposes
              </span>
            )}
            <button
              onClick={() => setFirebaseModalOpen(true)}
              className="text-blue-400 hover:text-blue-300 transition-colors underline"
            >
              Firebase & Security Rules Guide
            </button>
          </div>
        </div>
      </footer>

      {/* Firebase Modal */}
      <FirebaseModal
        isOpen={firebaseModalOpen}
        onClose={() => setFirebaseModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainAppContent />
      </DataProvider>
    </AuthProvider>
  );
}
