import React, { useState } from 'react';
import {
  Users,
  KeyRound,
  ShieldCheck,
  UserCheck,
  Laptop,
  Globe,
  LogOut,
  X,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Radio,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Clock,
  AlertCircle,
  Info
} from 'lucide-react';
import { login, logout, switchSession, register } from '../services/api';

export function AuthModal({
  isOpen,
  onClose,
  currentSession,
  activeSessions = [],
  onSessionChange,
  onShowToast
}) {
  const [tab, setTab] = useState('login'); // 'login' | 'sessions' | 'register'
  
  // Login form state
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('student');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleQuickLogin = () => setErrorMsg('Enter your approved account credentials below.');

  const handleCustomLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginUser.trim()) {
      setErrorMsg('Please enter your username or email.');
      return;
    }
    if (!loginPass.trim()) {
      setErrorMsg('Please enter your password.');
      return;
    }

    try {
      setLoading(true);
      const sess = await login({
        usernameOrEmail: loginUser.trim(),
        password: loginPass
      });
      onSessionChange(sess);
      onShowToast?.(`Signed in successfully as ${sess.name}`, 'success');
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Login failed.');
      onShowToast?.(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regUsername.trim()) {
      setErrorMsg('Please choose a username.');
      return;
    }
    if (!regPassword.trim()) {
      setErrorMsg('Please choose a password.');
      return;
    }

    try {
      setLoading(true);
      const res = await register({
        username: regUsername.trim(),
        email: regEmail.trim(),
        password: regPassword,
        name: regName.trim(),
        role: regRole
      });

      if (res?.pendingApproval) {
        setSuccessMsg(
          `Registration submitted for "${regUsername.trim()}"! Your account is pending Administrator approval by Aryanath. Once approved in the Admin Control Center, you will be able to log in.`
        );
        onShowToast?.('Registration submitted! Pending Admin Aryanath approval.', 'info');
        setRegName('');
        setRegUsername('');
        setRegEmail('');
        setRegPassword('');
      } else if (res?.sessionId) {
        onSessionChange(res);
        onShowToast?.(`Account created and session activated for ${res.name}`, 'success');
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
      onShowToast?.(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitch = async (sessionId) => {
    try {
      const sess = await switchSession(sessionId);
      onSessionChange(sess);
      onShowToast?.(`Switched active context to ${sess.name}`, 'info');
      onClose();
    } catch (err) {
      onShowToast?.(err.message, 'error');
    }
  };

  const handleLogoutSession = async (sessionId) => {
    try {
      await logout(sessionId);
      onShowToast?.('Session terminated successfully', 'info');
      if (currentSession?.sessionId === sessionId) {
        window.location.reload();
      }
    } catch (err) {
      onShowToast?.(err.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                SAP Universal Logon &amp; Access
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Concurrent Multi-Session Authentication
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/40 p-1.5 text-xs font-semibold">
          <button
            onClick={() => { setTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === 'login'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => { setTab('sessions'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === 'sessions'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-500" />
            <span>Active Sessions ({activeSessions.length})</span>
          </button>

          <button
            onClick={() => { setTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === 'register'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

        {/* Body Contents */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* Error & Success Alerts */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span className="flex-1">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2.5 leading-relaxed">
              <Clock className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="font-semibold">{successMsg}</p>
                <p className="text-[11px] opacity-90">
                  Please notify administrator Aryanath to approve your access in the Admin Control Center.
                </p>
              </div>
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {tab === 'login' && (
            <div className="space-y-5">
              {/* Quick 1-Click Persona Logins */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
                  Quick 1-Click Persona Logon:
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin')}
                    disabled={loading}
                    className="p-3.5 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/30 hover:border-indigo-400 dark:hover:border-indigo-700 text-left transition group space-y-1 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                        Admin: Aryanath
                      </span>
                      <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Unlocks Admin approvals, sessions &amp; all tracks
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('developer')}
                    disabled={loading}
                    className="p-3.5 rounded-2xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/60 dark:bg-sky-950/30 hover:border-sky-400 dark:hover:border-sky-700 text-left transition group space-y-1 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-900 dark:text-sky-300">
                        Lead Developer
                      </span>
                      <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Standard student &amp; developer workspace profile
                    </p>
                  </button>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono shrink-0">
                  Or Sign In with Credentials
                </span>
              </div>

              <form onSubmit={handleCustomLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Username or Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={loginUser}
                      onChange={(e) => setLoginUser(e.target.value)}
                      placeholder="e.g. Aryanath or developer"
                      className="w-full text-xs font-semibold pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full text-xs font-semibold pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-sky-600 hover:bg-sky-700 text-white transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: CONCURRENT ACTIVE SESSIONS */}
          {tab === 'sessions' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed font-sans flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Concurrent Sessions Supported:</strong> You can open this app across multiple tabs, browsers, or devices. Each session maintains independent progression and active track states.
                </span>
              </div>

              <div className="space-y-2">
                {activeSessions.map((sess) => {
                  const isCurrent = sess.sessionId === currentSession?.sessionId;
                  return (
                    <div
                      key={sess.sessionId}
                      className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'border-sky-300 dark:border-sky-800 bg-sky-50/40 dark:bg-sky-950/30'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {sess.name}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                              Active Context
                            </span>
                          )}
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {sess.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono truncate">
                          {sess.email} • Track: {sess.activeTrack?.toUpperCase() || 'RAP'} • {sess.device || 'Browser'}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {!isCurrent && (
                          <button
                            onClick={() => handleSwitch(sess.sessionId)}
                            className="px-2.5 py-1 rounded-xl text-xs font-bold bg-sky-100 hover:bg-sky-200 text-sky-800 dark:bg-sky-950 dark:text-sky-300 transition"
                          >
                            Switch
                          </button>
                        )}
                        <button
                          onClick={() => handleLogoutSession(sess.sessionId)}
                          className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                          title="Terminate this session"
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: REGISTER NEW USER (WITH ADMIN APPROVAL WORKFLOW) */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Nathan Vance"
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Username <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="e.g. nathan_v"
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. nathan@enterprise.corp"
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Choose password"
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Account Type Requested
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="student">Student / Developer Account</option>
                  <option value="admin">SAP Enterprise Architect (Requires Approval)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  <Info className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Admin Approval Policy</span>
                </div>
                <p>
                  All registrations enter a pending approval state. The administrator (Aryanath) reviews and grants login access from the Admin Control Center.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center justify-center gap-2 shadow-xs"
              >
                <span>{loading ? 'Submitting Request...' : 'Submit Access Request'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
