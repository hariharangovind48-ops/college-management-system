import React, { useState } from 'react';
import {
  Database,
  ShieldCheck,
  Key,
  Server,
  X,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Code2,
} from 'lucide-react';
import {
  getStoredFirebaseConfig,
  saveStoredFirebaseConfig,
  testFirestoreConnection,
  getIsFirebaseConfigured,
} from '../lib/firebase';

interface FirebaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseModal: React.FC<FirebaseModalProps> = ({ isOpen, onClose }) => {
  const isConfigured = getIsFirebaseConfigured();
  const currentConfig = getStoredFirebaseConfig() || {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    firestoreDatabaseId: '(default)',
  };

  const [formData, setFormData] = useState(currentConfig);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'config' | 'instructions' | 'rules'>('status');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    saveStoredFirebaseConfig(formData);
    setTestResult({
      success: true,
      message: 'Firebase configuration saved locally. Reloading connection...',
    });
  };

  const handleClear = () => {
    saveStoredFirebaseConfig(null);
    setFormData({
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
      firestoreDatabaseId: '(default)',
    });
    setTestResult({
      success: true,
      message: 'Switched back to default Demo Mode environment.',
    });
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testFirestoreConnection();
    setTesting(false);
    setTestResult(res);
  };

  const copyRulesToClipboard = () => {
    const rulesText = `rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /{document=**} {\n      allow read, write: if false;\n    }\n    // See firestore.rules in workspace for full role-based rules\n  }\n}`;
    navigator.clipboard.writeText(rulesText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Firebase Integration & Database Setup</h3>
              <p className="text-xs text-slate-400">
                Cloud Firestore & Firebase Authentication Management
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 px-6 pt-3 bg-slate-950/50 border-b border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-3 py-2 font-medium border-b-2 transition-all ${
              activeTab === 'status'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Connection Status
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-2 font-medium border-b-2 transition-all ${
              activeTab === 'config'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Config Credentials
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`px-3 py-2 font-medium border-b-2 transition-all ${
              activeTab === 'instructions'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Setup Guide
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-2 font-medium border-b-2 transition-all ${
              activeTab === 'rules'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Security Rules
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'status' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200 text-sm">Current Backend Mode:</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isConfigured
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {isConfigured ? 'Live Firebase Connected' : 'Demo Mode (Local Persistence)'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    {isConfigured
                      ? 'The app is configured to communicate with your live Firebase Authentication and Cloud Firestore instance.'
                      : 'The app is running in offline demo mode using authentic mock data for INFO Institute of Engineering. All student updates, marks, attendance, and leave requests persist in browser storage.'}
                  </p>
                </div>
              </div>

              {/* Collections Blueprint Overview */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <p className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                  Configured Firestore Collections:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                  {[
                    'users',
                    'students',
                    'advisers',
                    'attendance',
                    'internalMarks',
                    'leaveRequests',
                    'announcements',
                    'assignments',
                    'messages',
                    'specialEvents',
                    'certificates',
                    'placements',
                  ].map(c => (
                    <div key={c} className="p-2 bg-slate-900 border border-slate-800 rounded flex items-center gap-1.5 text-blue-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span>/{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Connection Button */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-xs transition-colors flex items-center gap-2"
                >
                  <Server className="w-4 h-4" />
                  <span>{testing ? 'Testing Connection...' : 'Test Firestore Connection'}</span>
                </button>
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                    testResult.success
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-4">
              <p className="text-slate-400">
                To connect to your own Firebase project, enter your web credentials below. They will be stored in your local browser session.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 text-[11px] font-semibold mb-1">API Key</label>
                  <input
                    type="text"
                    value={formData.apiKey}
                    onChange={e => setFormData({ ...formData, apiKey: e.target.value })}
                    placeholder="AIzaSy..."
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 font-mono text-xs focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-[11px] font-semibold mb-1">Project ID</label>
                  <input
                    type="text"
                    value={formData.projectId}
                    onChange={e => setFormData({ ...formData, projectId: e.target.value })}
                    placeholder="info-college-cms"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 font-mono text-xs focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-[11px] font-semibold mb-1">Auth Domain</label>
                  <input
                    type="text"
                    value={formData.authDomain}
                    onChange={e => setFormData({ ...formData, authDomain: e.target.value })}
                    placeholder="info-college-cms.firebaseapp.com"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 font-mono text-xs focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-[11px] font-semibold mb-1">Firestore Database ID</label>
                  <input
                    type="text"
                    value={formData.firestoreDatabaseId}
                    onChange={e => setFormData({ ...formData, firestoreDatabaseId: e.target.value })}
                    placeholder="(default)"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 font-mono text-xs focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-xs transition-colors"
                >
                  Save & Apply Config
                </button>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium text-xs transition-colors"
                >
                  Reset to Demo Mode
                </button>
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-sm">Step-by-Step Firebase Setup Instructions:</h4>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed">
                  <li>
                    <span className="font-semibold text-white">Create a Firebase Project:</span> Go to the{' '}
                    <a
                      href="https://console.firebase.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      Firebase Console <ExternalLink className="w-3 h-3" />
                    </a>{' '}
                    and click "Add Project".
                  </li>
                  <li>
                    <span className="font-semibold text-white">Enable Authentication:</span> Navigate to{' '}
                    <span className="text-blue-300">Build &gt; Authentication</span>, click "Get Started", and enable the{' '}
                    <span className="text-white">Email/Password</span> sign-in method.
                  </li>
                  <li>
                    <span className="font-semibold text-white">Create Cloud Firestore:</span> Go to{' '}
                    <span className="text-blue-300">Build &gt; Firestore Database</span> and click "Create Database".
                  </li>
                  <li>
                    <span className="font-semibold text-white">Deploy Security Rules:</span> Copy the hardened rules from the{' '}
                    <span className="text-blue-300">Security Rules</span> tab and paste them into the Firestore Rules tab in your console.
                  </li>
                  <li>
                    <span className="font-semibold text-white">Register Web App:</span> In Project Settings, click the web icon{' '}
                    <code className="text-blue-300 font-mono">&lt;/&gt;</code>, register the app, and paste your config credentials.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-slate-400">
                  Role-based security rules generated for INFO Institute of Engineering (located at <code className="text-blue-300 font-mono">/firestore.rules</code>):
                </p>
                <button
                  onClick={copyRulesToClipboard}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Copied!' : 'Copy Rules'}</span>
                </button>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 max-h-60 overflow-y-auto leading-relaxed">
                <pre>{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false; // Default-deny catch-all
    }
    // HOD has administrative read/write
    // Advisers manage assigned class attendance, marks, and leave requests
    // Students can read private records and apply for leave/assignments
  }
}`}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
