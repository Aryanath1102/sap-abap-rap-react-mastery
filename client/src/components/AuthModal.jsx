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
  CheckCircle2
} from 'lucide-react';
import { login, logout, switchSession, registerUser } from '../services/api';

export function AuthModal({
  isOpen,
  onClose,
  currentSession,
  activeSessions = [],
  onSessionChange,
  onShowToast
}) {
  const [tab, setTab] = useState('login'); // 'login' | 'sessions' | 'register'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickLogin = async (userType) => {
    try {
      setLoading(true);
      const creds = userType === 'admin'
        ? { usernameOrEmail: 'admin', role: 'admin' }
        : { usernameOrEmail: 'developer', role: 'student' };
      const sess = await login(creds);
      onSessionChange(sess);
      onShowToast?.(`Logged in concurrently as ${sess.name} (${sess.role.toUpperCase()})`, 'success');
      onClose();
    } catch (err) {
      onShowToast?.(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomLogin = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      onShowToast?.('Please enter a username or email', 'error');
      return;
    }

    try {
      setLoading(true);
      const sess = await login({ usernameOrEmail: username, role });
      onSessionChange(sess);
      onShowToast?.(`Logged in concurrently as ${sess.name}`, 'success');
      onClose();
    } catch (err) {
      onShowToast?.(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) {
      onShowToast?.('Please provide both username and email', 'error');
      return;
    }

    try {
      setLoading(true);
      const sess = registerUser({ username, email, name, role });
      onSessionChange(sess);
      onShowToast?.(`Registered & active session created for ${sess.name}`, 'success');
      onClose();
    } catch (err) {
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
      // If closing current session, reload or trigger session change
      if (currentSession?.sessionId === sessionId) {
        window.location.reload();
      }
    } catch (err) {
      onShowToast?.(err.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
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
            onClick={() => setTab('login')}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === 'login'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => setTab('sessions')}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === 'sessions'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Active Sessions ({activeSessions.length})</span>
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === 'register'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

        {/* Body Contents */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
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
                        Admin Architect
                      </span>
                      <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Unlocks Admin panel, session monitor &amp; audit controls
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
                  Or Sign In by Name / Email
                </span>
              </div>

              <form onSubmit={handleCustomLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Username or Email
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. nathan or admin@corp.com"
                    className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Role Privileges
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="student">Student / Full-Stack Developer</option>
                    <option value="admin">Enterprise Administrator (Full Privileges)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-sky-600 hover:bg-sky-700 text-white transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In Concurrently'}</span>
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

              <div className="space-y-2.5">
                {activeSessions.map((sess) => {
                  const isCurrent = sess.sessionId === currentSession?.sessionId;
                  return (
                    <div
                      key={sess.sessionId}
                      className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-sky-50/80 dark:bg-sky-950/50 border-sky-300 dark:border-sky-800'
                          : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {sess.name}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            sess.role === 'admin'
                              ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300'
                              : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-sky-300'
                          }`}>
                            {sess.role}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                              ● This Tab
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          <span className="flex items-center gap-1">
                            <Laptop className="w-3 h-3" />
                            <span>{sess.device || 'Web Browser'}</span>
                          </span>
                          <span>•</span>
                          <span>Track: {sess.activeTrack?.toUpperCase() || 'RAP'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!isCurrent && (
                          <button
                            onClick={() => handleSwitch(sess.sessionId)}
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
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

          {/* TAB 3: REGISTER NEW USER */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nathan Vance"
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. nathan_v"
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. nathan@enterprise.corp"
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Account Type
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="student">Student / Developer Account</option>
                  <option value="admin">Administrator (Full Access)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-sky-600 hover:bg-sky-700 text-white transition flex items-center justify-center gap-2 shadow-xs"
              >
                <span>{loading ? 'Creating Account...' : 'Register & Log In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
