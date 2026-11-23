import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Trash2,
  Key,
  Trophy,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Bot,
  User,
  ShieldAlert
} from 'lucide-react';
import { QUIZ_DATA } from '../data/quizData';
import {
  fetchMentorMessages,
  sendMentorMessage,
  clearMentorChat,
  recordQuizAttempt
} from '../services/api';

export function MentorQuizView({ bestQuizScore, onQuizUpdated, onShowToast }) {
  // Chat State
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('sap_mentor_gemini_key') || '');
  const [chatLoading, setChatLoading] = useState(false);
  const chatScrollRef = useRef(null);

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    loadChatMessages();
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, chatLoading]);

  async function loadChatMessages() {
    try {
      const msgs = await fetchMentorMessages();
      setMessages(Array.isArray(msgs) ? msgs : []);
    } catch (err) {
      console.warn('Failed to fetch mentor messages:', err.message);
      setMessages([]);
    }
  }

  const handleSaveApiKey = (key) => {
    const trimmed = key.trim();
    setApiKey(trimmed);
    localStorage.setItem('sap_mentor_gemini_key', trimmed);
    if (trimmed) {
      onShowToast?.('Gemma / Gemini API key saved for live proxy.');
    } else {
      onShowToast?.('API key cleared. Using server default key / Clean Core engine.');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || chatLoading) return;

    const userText = inputVal.trim();
    setInputVal('');

    // Optimistically show user message
    setMessages(prev => [...(Array.isArray(prev) ? prev : []), { id: Date.now(), role: 'user', content: userText, created_at: new Date().toISOString() }]);

    try {
      setChatLoading(true);
      const updatedMessages = await sendMentorMessage(userText, apiKey);
      const safeList = Array.isArray(updatedMessages) ? updatedMessages : (updatedMessages?.messages || []);
      setMessages(safeList);
    } catch (err) {
      onShowToast?.(`Mentor error: ${err.message}`, 'error');
    } finally {
      setChatLoading(false);
    }
  };

  const handleClearChat = async () => {
    try {
      const cleared = await clearMentorChat();
      setMessages(cleared);
      onShowToast?.('Chat history cleared.');
    } catch (err) {
      onShowToast?.(`Failed to clear chat: ${err.message}`, 'error');
    }
  };

  // Quiz Logic
  const currentQ = QUIZ_DATA[currentQuestionIndex] || null;

  const handleSelectOption = (idx) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.answer;
    const newScore = isCorrect ? quizScore + 1 : quizScore;
    if (isCorrect) setQuizScore(newScore);

    setUserAnswers(prev => ({ ...prev, [currentQ.id]: idx }));

    setTimeout(() => {
      if (currentQuestionIndex + 1 < QUIZ_DATA.length) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        // Quiz complete!
        setIsQuizFinished(true);
        // Record to SQLite
        recordQuizAttempt(newScore, QUIZ_DATA.length, userAnswers)
          .then(res => {
            onQuizUpdated?.(newScore);
            onShowToast?.(`Assessment completed! Score: ${newScore} / ${QUIZ_DATA.length}`);
          })
          .catch(err => console.warn('Could not record quiz:', err));
      }
    }, 1800);
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizScore(0);
    setIsQuizFinished(false);
    setUserAnswers({});
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* LEFT: Persistent AI SAP Architect Chat & Code Reviewer (2 cols) */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col h-[680px] overflow-hidden">
        {/* Chat Header Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>AI SAP Architect &amp; Code Reviewer</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                  Clean Core Live
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Paste ABAP/RAP code for Clean Core static critique or ask any architectural question.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Optional Gemini API Key input */}
            <div className="relative">
              <Key className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => handleSaveApiKey(e.target.value)}
                placeholder="Gemma / Gemini Key..."
                className="text-xs pl-8 pr-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 w-36 sm:w-48 focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
                title="If empty, automatically uses your configured Gemma 4 31B server key (with 5,000/day limit) or built-in SAP Architect engine."
              />
            </div>

            <button
              onClick={handleClearChat}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-red-500 transition"
              title="Clear SQLite Chat History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages Log */}
        <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 thin-scroll bg-slate-50/30 dark:bg-slate-950/30">
          {(Array.isArray(messages) ? messages : []).map((msg, idx) => {
            const isUser = msg.role === 'user';
            const displayContent = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
            return (
              <div
                key={msg.id || idx}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] text-xs sm:text-sm p-4 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-sky-600 text-white rounded-tr-xs shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200 dark:border-slate-700/80 shadow-xs'
                  }`}
                >
                  {displayContent}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {chatLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 text-xs font-bold animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.4s]" />
                <span className="font-medium ml-1">Architect analyzing Clean Core rules...</span>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2 shrink-0">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Paste ABAP/RAP snippet or ask about EML, Draft, strict ( 2 ), React CSRF..."
            className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-sans"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || chatLoading}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-600/20 transition disabled:opacity-40 flex items-center gap-1.5"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* RIGHT: Technical Assessment Quiz Card (1 col) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-[680px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>RAP &amp; Modern ABAP Quiz</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                10-question technical competency assessment
              </p>
            </div>

            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              Q {currentQuestionIndex + 1} / {QUIZ_DATA.length}
            </span>
          </div>

          {!isQuizFinished && currentQ ? (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 font-mono">
                  {currentQ.category}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 leading-snug">
                  {currentQ.question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {currentQ.options.map((opt, idx) => {
                  let btnStyle = 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-800';

                  if (isAnswered) {
                    if (idx === currentQ.answer) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold';
                    } else if (idx === selectedOption) {
                      btnStyle = 'border-red-500 bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full text-left text-xs p-3 rounded-xl border transition flex items-start gap-2.5 ${btnStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Instant Explanation Card */}
              {isAnswered && (
                <div className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1 animate-fade-in ${
                  selectedOption === currentQ.answer
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200'
                }`}>
                  <div className="font-bold flex items-center gap-1.5">
                    {selectedOption === currentQ.answer ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span>{selectedOption === currentQ.answer ? 'Correct!' : 'Incorrect'}</span>
                  </div>
                  <p>{currentQ.explanation}</p>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completed View */
            <div className="py-8 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-500 flex items-center justify-center mx-auto shadow-md">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Assessment Finished!
                </h4>
                <div className="text-3xl font-black text-sky-600 dark:text-sky-400 mt-1">
                  {quizScore} <span className="text-sm font-normal text-slate-400">/ {QUIZ_DATA.length}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Your attempt has been saved to the SQLite database.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quiz Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Best Recorded Score: <strong>{bestQuizScore} / 10</strong></span>
          <button
            onClick={handleRestartQuiz}
            className="flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Quiz</span>
          </button>
        </div>
      </div>
    </div>
  );
}
