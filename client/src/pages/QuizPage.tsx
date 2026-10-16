import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  Sparkles,
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { ActiveTab } from '../components/Navbar';

interface QuizPageProps {
  setActiveTab?: (tab: ActiveTab) => void;
}

export const QuizPage: React.FC<QuizPageProps> = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('dns_quiz_answers');
    return saved ? JSON.parse(saved) : {};
  });

  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    localStorage.setItem('dns_quiz_answers', JSON.stringify(selectedAnswers));
  }, [selectedAnswers]);

  const categories = ['All', ...Array.from(new Set(QUIZ_QUESTIONS.map((q) => q.category)))];

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    localStorage.removeItem('dns_quiz_answers');
  };

  const totalAnswered = Object.keys(selectedAnswers).length;
  const correctCount = QUIZ_QUESTIONS.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;

  const scorePercentage = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);

  const filteredQuestions = QUIZ_QUESTIONS.filter(
    (q) => activeCategory === 'All' || q.category === activeCategory
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300 border border-pink-200 dark:border-pink-800">
            Interactive DNS Assessment
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          DNS Knowledge Check & Certification Quiz
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Test your mastery of DNS recursion, hierarchical architecture, record syntax, and negative caching. Progress is saved locally in your browser.
        </p>
      </div>

      {/* Score Dashboard Card */}
      <div className="bg-gradient-to-r from-sky-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-sky-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Your Assessment Progress
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              {correctCount} / {QUIZ_QUESTIONS.length} Questions Correct ({scorePercentage}%)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetQuiz}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Quiz</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden p-0.5">
          <div
            className="bg-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(totalAnswered / QUIZ_QUESTIONS.length) * 100}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between text-xs text-sky-100">
          <span>{totalAnswered} of {QUIZ_QUESTIONS.length} answered</span>
          {totalAnswered === QUIZ_QUESTIONS.length && (
            <span className="font-bold flex items-center gap-1 text-emerald-300">
              <Award className="w-4 h-4" />
              All Questions Completed!
            </span>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {filteredQuestions.map((q, index) => {
          const selectedOpt = selectedAnswers[q.id];
          const hasAnswered = selectedOpt !== undefined;

          return (
            <div
              key={q.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                  Question {index + 1} &bull; {q.category}
                </span>

                {hasAnswered && (
                  <span
                    className={`text-xs font-bold flex items-center gap-1 ${
                      selectedOpt === q.correctIndex
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-500'
                    }`}
                  >
                    {selectedOpt === q.correctIndex ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Correct</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        <span>Incorrect</span>
                      </>
                    )}
                  </span>
                )}
              </div>

              <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
                {q.question}
              </h3>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt, optIndex) => {
                  const isSelected = selectedOpt === optIndex;
                  const isCorrect = optIndex === q.correctIndex;

                  let optionStyle =
                    'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-sky-400';

                  if (hasAnswered) {
                    if (isCorrect) {
                      optionStyle =
                        'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optionStyle =
                        'bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-900 dark:text-rose-200';
                    } else {
                      optionStyle =
                        'bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800/80 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed flex items-center justify-between gap-3 transition-colors ${optionStyle}`}
                    >
                      <span>{opt}</span>
                      {hasAnswered && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                      {hasAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Instant Explanation Feedback */}
              {hasAnswered && (
                <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60 text-xs text-sky-900 dark:text-sky-300 leading-relaxed space-y-1">
                  <span className="font-bold block">Explanation:</span>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
