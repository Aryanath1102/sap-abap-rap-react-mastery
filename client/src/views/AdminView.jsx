import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Radio,
  Server,
  Database,
  Megaphone,
  Laptop,
  LogOut,
  UserPlus,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  KeyRound,
  UserCheck,
  UserX,
  Trash2,
  Clock
} from 'lucide-react';
import {
  fetchAllUsers,
  fetchPendingUsers,
  approveRegistration,
  rejectRegistration,
  deleteUserAccount,
  fetchActiveSessions,
  kickSession,
  promoteUser,
  fetchBroadcast,
  updateBroadcast,
  fetchVercelDbDiagnostics,
  getExportUrl
} from '../services/api';

export function AdminView({ currentSession, onShowToast, onSessionChange }) {
  const [activeTab, setActiveTab] = useState('approvals'); // 'approvals' | 'sessions' | 'users' | 'broadcast' | 'database'
  const [users, setUsers] = useState([]);
  const [approvalRoles, setApprovalRoles] = useState({});
  const [pendingUsers, setPendingUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [broadcast, setBroadcast] = useState({ active: true, message: '' });
  const [dbDiag, setDbDiag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newBroadcastMsg, setNewBroadcastMsg] = useState('');

  const isAdmin = currentSession?.role === 'admin';

  const loadData = async () => {
    try {
      setLoading(true);
      const [uList, pList, sList, bCast, diag] = await Promise.all([
        fetchAllUsers(),
        fetchPendingUsers(),
        fetchActiveSessions(),
        fetchBroadcast(),
        fetchVercelDbDiagnostics()
      ]);
      setUsers(uList);
      setPendingUsers(pList);
      setSessions(sList);
      setBroadcast(bCast);
      setNewBroadcastMsg(bCast.message || '');
      setDbDiag(diag);
    } catch (err) {
      console.warn('Admin load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 8000); // Poll active sessions & pending registrations
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (userId, username) => {
    try {
      await approveRegistration(userId, approvalRoles[userId] || 'student');
      onShowToast?.(`User @${username} has been APPROVED! They can now log in.`, 'success');
      loadData();
    } catch (err) {
      onShowToast?.(err.message, 'error');
    }
  };

  const handleReject = async (userId, username) => {
    try {
      await rejectRegistration(userId);
      onShowToast?.(`Registration for @${username} was rejected.`, 'info');
      loadData();
    } catch (err) {
      onShowToast?.(err.message, 'error');
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (username.toLowerCase() === 'aryanath') {
      onShowToast?.('Primary SuperAdmin Aryanath cannot be deleted.', 'error');
      return;
    }
    if (!window.confirm(`Are you sure you want to permanently delete user @${username}?`)) {
      return;
    }
    try {
      await deleteUserAccount(userId);
      onShowToast?.(`User @${username} deleted.`, 'info');
      loadData();
    } catch (err) {
      onShowToast?.(err.message, 'error');
    }
  };

  const handleKick = async (sessionId) => {
    try {
      await kickSession(sessionId);
      onShowToast?.('Session terminated remotely', 'info');
      loadData();
    } catch (err) {
      onShowToast?.(err.message, 'error');
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    try {
      const targetRole = currentRole === 'admin' ? 'student' : 'admin';
      await promoteUser(userId, targetRole);
      onShowToast?.(`User role updated to ${targetRole.toUpperCase()}`, 'success');
      loadData();
    } catch (err) {
      onShowToast?.(err.message, 'error');
    }
  };

  const handleSaveBroadcast = async (e) => {
    e.preventDefault();
    try {
      const res = await updateBroadcast(newBroadcastMsg);
      setBroadcast(res);
      onShowToast?.('Broadcast alert updated for all concurrent users!', 'success');
    } catch (err) {
      onShowToast?.(err.message, 'error');
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Administrator Privilege Required
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          You are currently signed in as <strong>{currentSession?.name || 'Student'}</strong> with role <code>{currentSession?.role || 'student'}</code>. Sign in with an approved administrator account to manage registration approvals, live concurrent sessions, and system security.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Admin Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>ENTERPRISE CONTROL CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Administrator &amp; Approval Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Welcome, <strong>Aryanath</strong>. Approve pending user registrations, manage active concurrent logins, control role privileges, and inspect Vercel Database telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold flex items-center gap-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <a
            href={getExportUrl()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export DB Snapshot</span>
          </a>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          {
            id: 'approvals',
            label: `🔔 Pending Approvals (${pendingUsers.length})`,
            icon: UserPlus,
            badge: pendingUsers.length > 0
          },
          { id: 'sessions', label: `🟢 Live Sessions (${sessions.length})`, icon: Radio },
          { id: 'users', label: `👥 User Directory (${users.length})`, icon: Users },
          { id: 'broadcast', label: '📢 Global Announcement', icon: Megaphone },
          { id: 'database', label: '🗄️ Vercel Database', icon: Database }
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                active
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 0: PENDING APPROVALS */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-500" />
                <span>Pending User Registration Requests</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                New accounts require administrator authorization before they can log in to the learning portal
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              {pendingUsers.length} Pending
            </span>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                All Registration Requests Processed
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                There are no pending accounts waiting for authorization. When new users register, they will appear here for your approval.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingUsers.map((u) => (
                <div
                  key={u.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center text-sm">
                        {u.name ? u.name.charAt(0).toUpperCase() : u.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {u.name || u.username}
                        </h4>
                        <p className="text-xs text-slate-500 font-mono">@{u.username}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      Pending Approval
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div><strong>Email:</strong> {u.email}</div>
                    <div><strong>Requested Role:</strong> <span className="uppercase font-mono font-semibold">{u.requestedRole || u.role}</span></div>
                    <label>Grant role: <select value={approvalRoles[u.id] || 'student'} onChange={e => setApprovalRoles({...approvalRoles, [u.id]:e.target.value})}><option value="student">Student</option><option value="admin">Administrator</option></select></label>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleApprove(u.id, u.username)}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Approve Access</span>
                    </button>
                    <button
                      onClick={() => handleReject(u.id, u.username)}
                      className="py-2 px-3 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 text-xs font-semibold transition flex items-center justify-center gap-1"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 1: LIVE CONCURRENT SESSIONS */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Active Concurrent Logins
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live sessions currently connected to the enterprise learning platform
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{sessions.length} Active Sessions</span>
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="p-4">User &amp; Identity</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Current Track</th>
                    <th className="p-4">Device &amp; IP</th>
                    <th className="p-4">Logon Timestamp</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {sessions.map((sess) => {
                    const isSelf = sess.sessionId === currentSession?.sessionId;
                    return (
                      <tr key={sess.sessionId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-4">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{sess.name}</span>
                            {isSelf && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-mono">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            {sess.email}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            sess.role === 'admin'
                              ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800'
                              : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}>
                            {sess.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-mono font-semibold text-sky-600 dark:text-sky-400 uppercase">
                            {sess.activeTrack || 'RAP'}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                          <div>{sess.device || 'Desktop Browser'}</div>
                          <div className="text-slate-400 text-[10px]">{sess.ip}</div>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-slate-500">
                          {new Date(sess.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleKick(sess.sessionId)}
                            className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold transition"
                            title="Terminate this session immediately"
                          >
                            Terminate
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER DIRECTORY & MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Registered User Directory
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage accounts, authorization statuses, roles, and access credentials
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="p-4">User Name</th>
                    <th className="p-4">Username</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Approval Status</th>
                    <th className="p-4">Role Privileges</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {users.map((u) => {
                    const isSuper = u.username.toLowerCase() === 'aryanath';
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-4 font-bold text-slate-900 dark:text-white">
                          {u.name || u.username}
                        </td>
                        <td className="p-4 font-mono text-slate-600 dark:text-slate-300">
                          @{u.username}
                        </td>
                        <td className="p-4 font-mono text-slate-500">
                          {u.email}
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            u.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300'
                              : u.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300'
                          }`}>
                            {u.status || 'approved'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            u.role === 'admin'
                              ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300'
                              : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-right flex items-center justify-end gap-2">
                          {u.status === 'pending_approval' && (
                            <button
                              onClick={() => handleApprove(u.id, u.username)}
                              className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition"
                            >
                              Approve
                            </button>
                          )}

                          {!isSuper && (
                            <>
                              <button
                                onClick={() => handleToggleRole(u.id, u.role)}
                                className="px-2.5 py-1 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition"
                              >
                                {u.role === 'admin' ? 'Set Student' : 'Set Admin'}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id, u.username)}
                                className="p-1.5 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                                title="Delete user account"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM BROADCAST */}
      {activeTab === 'broadcast' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Global Announcement Banner</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Broadcast high-priority notifications, course release news, or maintenance warnings to all active concurrent sessions.
            </p>
          </div>

          <form onSubmit={handleSaveBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Announcement Message
              </label>
              <textarea
                rows={3}
                value={newBroadcastMsg}
                onChange={(e) => setNewBroadcastMsg(e.target.value)}
                placeholder="Enter alert message to display to all students and architects..."
                className="w-full text-xs font-semibold p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Broadcast to All Sessions</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: VERCEL DATABASE DIAGNOSTICS */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-900 dark:text-indigo-300">
              <Database className="w-4 h-4 text-indigo-600" />
              <span>Vercel Database Integration (Vercel Postgres / Storage Architecture)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              Users, sessions, approvals, progress, assignments, quizzes, mentor conversations, and announcements are stored in the connected PostgreSQL database.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Database availability is required for sign-in and saved work. Browser storage is not used as a database fallback.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Engine Status
              </span>
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{dbDiag?.connected ? 'Connected' : 'Unavailable'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Registered Users
              </span>
              <div className="text-xl font-black text-slate-900 dark:text-white">
                {users.length} Accounts
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Pending Approvals
              </span>
              <div className="text-xl font-black text-amber-600 dark:text-amber-400">
                {pendingUsers.length} Requests
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Concurrent Sessions
              </span>
              <div className="text-xl font-black text-sky-600 dark:text-sky-400">
                {sessions.length} Live
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
