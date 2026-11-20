import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { DashboardView } from './views/DashboardView';
import { RoadmapView } from './views/RoadmapView';
import { LessonsView } from './views/LessonsView';
import { ProjectsView } from './views/ProjectsView';
import { ArchitectureView } from './views/ArchitectureView';
import { MentorQuizView } from './views/MentorQuizView';
import { TrackSelectorView } from './views/TrackSelectorView';
import { AdminView } from './views/AdminView';
import { AuthModal } from './components/AuthModal';
import { LoginScreen } from './components/LoginScreen';
import { LESSONS } from './data/lessons';
import { FIORI_LESSONS } from './data/fioriLessons';
import {
  fetchProgress,
  updateProgress,
  resetProgress,
  fetchProjectChecklists,
  updateProjectStep,
  fetchCurrentSession,
  fetchActiveSessions,
  fetchBroadcast,
  logout
} from './services/api';
import { Megaphone, X, Sparkles } from 'lucide-react';

// Progression Locking Rule:
// Day 0 & Day 1 are always unlocked.
// Day N is unlocked ONLY if Day N - 1 is completed or its exercise is solved.
export function isDayUnlocked(dayNumber, completedDays = [], solvedExercises = []) {
  if (dayNumber <= 1) return true;
  const prevLesson = LESSONS.find(l => l.day === dayNumber - 1) || FIORI_LESSONS.find(l => l.day === dayNumber - 1);
  const prevDayCompleted = completedDays.includes(dayNumber - 1);
  const prevExerciseSolved = prevLesson && solvedExercises.includes(prevLesson.id);
  return Boolean(prevDayCompleted || prevExerciseSolved);
}

export function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeTrack, setActiveTrack] = useState(() => localStorage.getItem('sap_mastery_active_track') || 'rap');
  const [activeLessonId, setActiveLessonId] = useState(() => {
    const track = localStorage.getItem('sap_mastery_active_track') || 'rap';
    return track === 'fiori' ? 'fiori-mod-1-fundamentals' : 'day-1-modern-abap';
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Authentication & Concurrent Sessions State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [activeSessions, setActiveSessions] = useState([]);
  const [broadcast, setBroadcast] = useState(null);
  const [broadcastDismissed, setBroadcastDismissed] = useState(false);

  // App state loaded from SQLite - default streak is 0 until user earns it
  const [progress, setProgress] = useState({
    completed_days: [],
    solved_exercises: [],
    best_quiz_score: 0,
    streak: 0,
    active_theme: 'light'
  });

  const [projectChecklists, setProjectChecklists] = useState({});
  const [loading, setLoading] = useState(true);

  // Active dataset based on track
  const activeLessons = activeTrack === 'fiori' ? FIORI_LESSONS : LESSONS;

  // Track switcher handler
  const handleSelectTrack = (trackId) => {
    setActiveTrack(trackId);
    localStorage.setItem('sap_mastery_active_track', trackId);
    if (trackId === 'fiori') {
      setActiveLessonId('fiori-mod-1-fundamentals');
      showToast('Switched to SAP Fiori Track: Elements, Freestyle SAPUI5 & Cloud Launchpad', 'success');
    } else {
      setActiveLessonId('day-1-modern-abap');
      showToast('Switched to SAP ABAP RAP Track: Clean Core & RESTful Application Programming', 'info');
    }
  };

  // Full Browser History (PushState & PopState) Integration
  useEffect(() => {
    // Read initial URL params on first mount
    const params = new URLSearchParams(window.location.search);
    const initialView = params.get('view');
    const initialLesson = params.get('lesson');
    const initialTrack = params.get('track');

    if (initialTrack && (initialTrack === 'fiori' || initialTrack === 'rap')) {
      setActiveTrack(initialTrack);
      localStorage.setItem('sap_mastery_active_track', initialTrack);
    }
    if (initialView) setCurrentView(initialView);
    if (initialLesson) setActiveLessonId(initialLesson);

    // If initial URL has hash, scroll after mount
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }

    // PopState listener: triggered when user presses browser's Back or Forward buttons
    const handlePopState = (event) => {
      const searchParams = new URLSearchParams(window.location.search);
      const view = searchParams.get('view') || event.state?.view || 'dashboard';
      const lesson = searchParams.get('lesson') || event.state?.lessonId || (activeTrack === 'fiori' ? 'fiori-mod-1-fundamentals' : 'day-1-modern-abap');
      const track = searchParams.get('track') || event.state?.track || activeTrack;

      setCurrentView(view);
      setActiveLessonId(lesson);
      setActiveTrack(track);

      if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Programmatic navigation that keeps browser history in sync
  const handleNavigate = (view, lessonId = activeLessonId, hash = '', pushHistory = true) => {
    setCurrentView(view);
    if (lessonId) setActiveLessonId(lessonId);

    if (pushHistory) {
      const query = `?view=${view}&track=${activeTrack}${view === 'lessons' ? `&lesson=${lessonId}` : ''}${hash ? `#${hash}` : ''}`;
      window.history.pushState({ view, lessonId, track: activeTrack, hash }, '', query);
    }

    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  };

  // Safe chapter selection enforcing progression lock
  const handleSelectLesson = (lessonId, pushHistory = true) => {
    const target = activeLessons.find(l => l.id === lessonId);
    if (target && !isDayUnlocked(target.day, progress.completed_days, progress.solved_exercises)) {
      showToast(`🔒 ${target.title} is locked! Complete the previous assignment first to unlock.`, 'error');
      return;
    }
    setActiveLessonId(lessonId);
    handleNavigate('lessons', lessonId, '', pushHistory);
  };

  // Load initial state & active sessions from backend / local DB
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [progData, checklistsData, currentSess, sessionsList, bCast] = await Promise.all([
          fetchProgress(),
          fetchProjectChecklists(),
          fetchCurrentSession(),
          fetchActiveSessions(),
          fetchBroadcast()
        ]);

        setProgress(progData);
        setProjectChecklists(checklistsData);
        setCurrentSession(currentSess);
        setActiveSessions(sessionsList);
        setBroadcast(bCast);
        applyThemeClass(progData.active_theme || 'light');
      } catch (err) {
        console.warn('Backend loading warning:', err.message);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  function applyThemeClass(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const handleToggleTheme = async () => {
    const newTheme = progress.active_theme === 'dark' ? 'light' : 'dark';
    applyThemeClass(newTheme);
    setProgress(prev => ({ ...prev, active_theme: newTheme }));
    try {
      await updateProgress({ ...progress, active_theme: newTheme });
    } catch (err) {
      console.warn('Could not save theme:', err);
    }
  };

  const handleToggleDay = async (dayNumber) => {
    const currentCompleted = progress.completed_days || [];
    const isCompleted = currentCompleted.includes(dayNumber);
    const updatedDays = isCompleted
      ? currentCompleted.filter(d => d !== dayNumber)
      : [...currentCompleted, dayNumber].sort((a, b) => a - b);

    const newStreak = updatedDays.length;
    const updatedState = { ...progress, completed_days: updatedDays, streak: newStreak };
    setProgress(updatedState);

    try {
      await updateProgress(updatedState);
      showToast(isCompleted ? `Day ${dayNumber} unmarked` : `🎉 Day ${dayNumber} completed! Streak: ${newStreak} day(s)`);
    } catch (err) {
      showToast('Progress saved locally', 'info');
    }
  };

  const handleResetProgress = async () => {
    try {
      const reset = await resetProgress();
      setProgress(reset);
      showToast('All progress reset to Day 1 baseline.', 'info');
    } catch (err) {
      showToast('Error resetting progress', 'error');
    }
  };

  const handleToggleProjectStep = async (projectId, stepIndex) => {
    const current = projectChecklists[projectId] || [];
    const updated = current.includes(stepIndex)
      ? current.filter(i => i !== stepIndex)
      : [...current, stepIndex];

    setProjectChecklists(prev => ({ ...prev, [projectId]: updated }));

    try {
      await updateProjectStep(projectId, updated);
    } catch (err) {
      console.warn('Could not save project step:', err);
    }
  };

  const reloadProgress = async () => {
    try {
      const refreshed = await fetchProgress();
      setProgress(refreshed);
    } catch (err) {
      console.warn('Could not reload progress:', err);
    }
  };

  const handleLogout = async () => {
    if (currentSession?.sessionId) {
      try {
        await logout(currentSession.sessionId);
      } catch (err) {
        console.warn('Logout error:', err);
      }
    }
    setCurrentSession(null);
    showToast('Signed out successfully. Session terminated.', 'info');
  };

  // Readiness calculation
  const daysCount = progress.completed_days?.length || 0;
  const exCount = progress.solved_exercises?.length || 0;
  const quizBest = progress.best_quiz_score || 0;
  const totalDays = activeTrack === 'fiori' ? 6 : 15;
  const readinessPct = Math.min(
    100,
    Math.round(((daysCount / totalDays) * 45) + ((exCount / totalDays) * 35) + ((quizBest / 10) * 20))
  );

  // 1. Initial State Loading Spinner
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-600 flex items-center justify-center animate-spin mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold">Connecting to SAP Mastery Hub...</p>
        <p className="text-xs text-slate-500 mt-1">Verifying Clean Core Security &amp; Session Tokens</p>
      </div>
    );
  }

  // 2. Strict Authentication Gate: Without login, NOTHING can be accessed
  if (!currentSession) {
    return (
      <>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <LoginScreen
          onLoginSuccess={(sess) => {
            setCurrentSession(sess);
            fetchActiveSessions().then(setActiveSessions);
            showToast(`Welcome to SAP Studio, ${sess.name}!`, 'success');
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        streak={progress.streak || 0}
        theme={progress.active_theme}
        onToggleTheme={handleToggleTheme}
        onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)}
        onShowToast={showToast}
        activeTrack={activeTrack}
        onSelectTrack={handleSelectTrack}
        currentSession={currentSession}
        activeSessionsCount={activeSessions.length || 1}
        onOpenAuth={() => setAuthModalOpen(true)}
        onNavigate={(view) => handleNavigate(view, activeLessonId, '', true)}
        onLogout={handleLogout}
      />

      {/* Global Broadcast Announcement Banner (from Admin) */}
      {broadcast?.active && broadcast?.message && !broadcastDismissed && (
        <div className="bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-700 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2 min-w-0 mx-auto max-w-5xl">
            <Megaphone className="w-4 h-4 shrink-0 text-amber-300 animate-bounce" />
            <span className="truncate">{broadcast.message}</span>
          </div>
          <button
            onClick={() => setBroadcastDismissed(true)}
            className="p-1 rounded-lg hover:bg-white/20 transition shrink-0"
            aria-label="Dismiss Alert"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Workspace Frame */}
      <div className="flex-1 flex max-w-[1536px] w-full mx-auto relative items-start">
        {/* Sticky Left Sidebar */}
        <Sidebar
          currentView={currentView}
          onChangeView={(view) => handleNavigate(view, activeLessonId, '', true)}
          progressStats={{ readinessPct }}
          isOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          activeTrack={activeTrack}
          currentSession={currentSession}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {/* TRACKS / LEARNING PATHS PARENT MODULE */}
          {currentView === 'tracks' && (
            <TrackSelectorView
              activeTrack={activeTrack}
              onSelectTrack={handleSelectTrack}
              onNavigate={(view) => handleNavigate(view, activeLessonId, '', true)}
            />
          )}

          {/* ADMIN CONTROL CENTER */}
          {currentView === 'admin' && (
            <AdminView
              currentSession={currentSession}
              onShowToast={showToast}
              onSessionChange={setCurrentSession}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardView
              progress={progress}
              onResetProgress={handleResetProgress}
              onNavigate={(view) => handleNavigate(view, activeLessonId, '', true)}
              onShowToast={showToast}
            />
          )}

          {currentView === 'roadmap' && (
            <RoadmapView
              completedDays={progress.completed_days || []}
              solvedExercises={progress.solved_exercises || []}
              onToggleDay={handleToggleDay}
              onSelectLesson={(lessonId) => handleSelectLesson(lessonId, true)}
              onNavigate={(view) => handleNavigate(view, activeLessonId, '', true)}
              onShowToast={showToast}
            />
          )}

          {currentView === 'lessons' && (
            <LessonsView
              activeLessonId={activeLessonId}
              onSelectLesson={(lessonId) => handleSelectLesson(lessonId, true)}
              completedDays={progress.completed_days || []}
              solvedExercises={progress.solved_exercises || []}
              onNavigate={(view) => handleNavigate(view, activeLessonId, '', true)}
              onShowToast={showToast}
              onRefreshProgress={reloadProgress}
              lessons={activeLessons}
            />
          )}

          {currentView === 'projects' && (
            <ProjectsView
              projectChecklists={projectChecklists}
              onToggleStep={handleToggleProjectStep}
              onShowToast={showToast}
            />
          )}

          {currentView === 'architecture' && (
            <ArchitectureView onShowToast={showToast} />
          )}

          {currentView === 'mentor' && (
            <MentorQuizView
              bestQuizScore={progress.best_quiz_score || 0}
              onQuizUpdated={(newScore) => {
                setProgress(prev => ({ ...prev, best_quiz_score: Math.max(prev.best_quiz_score, newScore) }));
              }}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Concurrent Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentSession={currentSession}
        activeSessions={activeSessions}
        onSessionChange={(sess) => {
          setCurrentSession(sess);
          fetchActiveSessions().then(setActiveSessions);
        }}
        onShowToast={showToast}
      />

      {/* Floating SaaS Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
