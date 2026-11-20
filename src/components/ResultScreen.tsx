import { useEffect, useState } from 'react';
import { Award, RotateCcw, Trophy } from 'lucide-react';
import type { AnsweredQuestion } from '@/types';
import { supabase } from '@/lib/supabase';

interface ResultScreenProps {
  playerName: string;
  category: string;
  answers: AnsweredQuestion[];
  totalTimeSeconds: number;
  onRestart: () => void;
}

function medal(percent: number) {
  if (percent >= 90) return { label: 'Quiz Champion', tone: 'text-amber-300' };
  if (percent >= 70) return { label: 'Impressive work', tone: 'text-teal-300' };
  if (percent >= 50) return { label: 'Solid effort', tone: 'text-sky-300' };
  return { label: 'Room to grow', tone: 'text-slate-300' };
}

export function ResultScreen({
  playerName,
  category,
  answers,
  totalTimeSeconds,
  onRestart,
}: ResultScreenProps) {
  const correct = answers.filter((a) => a.selectedIndex === a.question.correctAnswer).length;
  const total = answers.length;
  const percent = Math.round((correct / total) * 100);
  const [saving, setSaving] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase
      .from('quiz_scores')
      .insert({
        player_name: playerName,
        score: correct,
        total_questions: total,
        category,
        time_seconds: totalTimeSeconds,
      })
      .then(({ error }) => {
        setSaved(!error);
        setSaving(false);
      });
  }, []);

  const m = medal(percent);
  const minutes = Math.floor(totalTimeSeconds / 60);
  const seconds = totalTimeSeconds % 60;

  return (
    <div className="w-full max-w-2xl mx-auto animate-in">
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl shadow-black/20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/15 border border-teal-400/30 mb-5">
          <Trophy className="w-8 h-8 text-teal-400" />
        </div>
        <p className="text-slate-400">Well played, {playerName}</p>
        <div className="my-4">
          <span className="text-6xl sm:text-7xl font-bold text-white tabular-nums">{correct}</span>
          <span className="text-2xl text-slate-500"> / {total}</span>
        </div>
        <p className={`text-lg font-semibold ${m.tone}`}>{m.label}</p>

        <div className="grid grid-cols-3 gap-3 mt-8 text-center">
          <div className="rounded-xl bg-slate-950/70 border border-slate-800 px-3 py-4">
            <p className="text-2xl font-bold text-white tabular-nums">{percent}%</p>
            <p className="text-xs text-slate-500 mt-1">Accuracy</p>
          </div>
          <div className="rounded-xl bg-slate-950/70 border border-slate-800 px-3 py-4">
            <p className="text-2xl font-bold text-white tabular-nums">
              {minutes}:{String(seconds).padStart(2, '0')}
            </p>
            <p className="text-xs text-slate-500 mt-1">Total time</p>
          </div>
          <div className="rounded-xl bg-slate-950/70 border border-slate-800 px-3 py-4">
            <p className="text-2xl font-bold text-white tabular-nums">{category.split(' ')[0]}</p>
            <p className="text-xs text-slate-500 mt-1">Category</p>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-8 py-3.5 font-semibold text-slate-950 transition-all duration-200 hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/25 active:scale-[0.98] cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          Play Again
        </button>

        <p className="mt-4 text-xs text-slate-500">
          {saving
            ? 'Saving your score to the leaderboard…'
            : saved
              ? 'Your score was saved to the leaderboard.'
              : 'Your score could not be saved this time.'}
        </p>
      </div>

      <div className="mt-6 bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
          <Award className="w-4 h-4" />
          Answer review
        </h3>
        <ol className="space-y-4">
          {answers.map((a, i) => {
            const ok = a.selectedIndex === a.question.correctAnswer;
            return (
              <li key={a.question.id} className="text-sm">
                <p className="font-medium text-slate-200">
                  <span className={ok ? 'text-emerald-400 mr-2' : 'text-rose-400 mr-2'}>
                    {i + 1}.
                  </span>
                  {a.question.question}
                </p>
                <p className="mt-1 text-slate-400">
                  Your answer:{' '}
                  <span className={ok ? 'text-emerald-300' : 'text-rose-300'}>
                    {a.selectedIndex === null ? 'No answer' : a.question.options[a.selectedIndex]}
                  </span>
                  {!ok && (
                    <>
                      {' '}· Correct:{' '}
                      <span className="text-emerald-300">
                        {a.question.options[a.question.correctAnswer]}
                      </span>
                    </>
                  )}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
