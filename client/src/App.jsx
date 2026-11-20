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
import { LESSONS } from './data/lessons';
import {
  fetchProgress,
  updateProgress,
  resetProgress,
  fetchProjectChecklists,
  updateProjectStep
} from './services/api';

// Progression Locking Rule:
// Day 1 is always unlocked.
// Day N is unlocked ONLY if Day N - 1 is completed or its exercise is solved.
export function isDayUnlocked(dayNumber, completedDays = [], solvedExercises = []) {
  if (dayNumber <= 1) return true;
  const prevLesson = LESSONS.find(l => l.day === dayNumber - 1);
  const prevDayCompleted = completedDays.includes(dayNumber - 1);
  const prevExerciseSolved = prevLesson && solvedExercises.includes(prevLesson.id);
  return Boolean(prevDayCompleted || prevExerciseSolved);
}

export function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeLessonId, setActiveLessonId] = useState('day-1-modern-abap');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

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

  // Full Browser History (PushState & PopState) Integration
  useEffect(() => {
    // Read initial URL params on first mount
    const params = new URLSearchParams(window.location.search);
    const initialView = params.get('view');
    const initialLesson = params.get('lesson');
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
      const lesson = searchParams.get('lesson') || event.state?.lessonId || 'day-1-modern-abap';

      setCurrentView(view);
      setActiveLessonId(lesson);

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
      const query = `?view=${view}${view === 'lessons' ? `&lesson=${lessonId}` : ''}${hash ? `#${hash}` : ''}`;
      window.history.pushState({ view, lessonId, hash }, '', query);
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
    const target = LESSONS.find(l => l.id === lessonId);
    if (target && !isDayUnlocked(target.day, progress.completed_days, progress.solved_exercises)) {
      showToast(`🔒 Day ${target.day} is locked! Complete Day ${target.day - 1} and its final assignment to unlock this chapter.`, 'error');
      return;
    }
    setActiveLessonId(lessonId);
    handleNavigate('lessons', lessonId, '', pushHistory);
  };

  // Load initial state from SQLite backend
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [progData, checklistsData] = await Promise.all([
          fetchProgress(),
          fetchProjectChecklists()
        ]);

        setProgress(progData);
        setProjectChecklists(checklistsData);
        applyThemeClass(progData.active_theme || 'light');
      } catch (err) {
        console.warn('Backend loading warning:', err.message);
        showToast('Connected in offline mode or initial sync pending.', 'info');
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
      await updateProgress({ active_theme: newTheme });
      showToast(`Switched to ${newTheme} theme.`);
    } catch (err) {
      console.warn('Could not persist theme:', err);
    }
  };

  const handleToggleDay = async (dayNumber) => {
    // Cannot mark Day N done unless Day N is unlocked
    if (!isDayUnlocked(dayNumber, progress.completed_days, progress.solved_exercises)) {
      showToast(`🔒 Cannot complete Day ${dayNumber} yet! Complete Day ${dayNumber - 1} first.`, 'error');
      return;
    }

    const current = progress.completed_days || [];
    let updated;
    if (current.includes(dayNumber)) {
      updated = current.filter(d => d !== dayNumber);
      showToast(`Day ${dayNumber} unmarked.`);
    } else {
      updated = [...current, dayNumber];
      showToast(`Day ${dayNumber} completed! Great work!`, 'success');
    }

    setProgress(prev => ({ ...prev, completed_days: updated }));
    try {
      await updateProgress({ completed_days: updated });
    } catch (err) {
      showToast(`Sync error: ${err.message}`, 'error');
    }
  };

  const handleToggleProjectStep = async (projectId, stepIndex, completed) => {
    const currentList = projectChecklists[projectId] || [];
    let updatedList;
    if (completed) {
      updatedList = currentList.includes(stepIndex) ? currentList : [...currentList, stepIndex];
    } else {
      updatedList = currentList.filter(s => s !== stepIndex);
    }

    setProjectChecklists(prev => ({ ...prev, [projectId]: updatedList }));

    try {
      await updateProjectStep(projectId, stepIndex, completed);
      showToast(completed ? 'Step checked and saved.' : 'Step unchecked.');
    } catch (err) {
      showToast(`Checklist error: ${err.message}`, 'error');
    }
  };

  const handleResetProgress = async () => {
    try {
      const reset = await resetProgress();
      setProgress(reset);
      setProjectChecklists({});
      showToast('All learning progress reset to zero.', 'info');
    } catch (err) {
      showToast(`Reset error: ${err.message}`, 'error');
    }
  };

  const reloadProgress = async () => {
    try {
      const data = await fetchProgress();
      setProgress(data);
    } catch (err) {
      console.warn('Could not reload progress:', err);
    }
  };

  // Readiness calculation
  const daysCount = progress.completed_days?.length || 0;
  const exCount = progress.solved_exercises?.length || 0;
  const quizBest = progress.best_quiz_score || 0;
  const readinessPct = Math.min(
    100,
    Math.round(((daysCount / 14) * 45) + ((exCount / 14) * 35) + ((quizBest / 10) * 20))
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        streak={progress.streak || 0}
        theme={progress.active_theme}
        onToggleTheme={handleToggleTheme}
        onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)}
        onShowToast={showToast}
      />

      {/* Main Workspace Frame - allows sticky sidebar to track natural document flow */}
      <div className="flex-1 flex max-w-[1536px] w-full mx-auto relative items-start">
        {/* Sticky Left Sidebar */}
        <Sidebar
          currentView={currentView}
          onChangeView={(view) => handleNavigate(view, activeLessonId, '', true)}
          progressStats={{ readinessPct }}
          isOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
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

      {/* Floating SaaS Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
