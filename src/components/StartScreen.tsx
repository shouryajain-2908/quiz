import { useState } from 'react';
import { Brain, ChevronRight } from 'lucide-react';
import { categories, type Category } from '@/data/questions';

interface StartScreenProps {
  onStart: (name: string, category: Category) => void;
  highScores: { name: string; percent: number }[];
}

export function StartScreen({ onStart, highScores }: StartScreenProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>(categories[0]);
  const [error, setError] = useState('');

  const start = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter your name to begin.');
      return;
    }
    setError('');
    onStart(trimmed.slice(0, 24), category);
  };

  return (
    <div className="w-full max-w-lg mx-auto animate-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/15 border border-teal-400/30 mb-5">
          <Brain className="w-8 h-8 text-teal-400" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-3">
          QuizMaster
        </h1>
        <p className="text-slate-400 text-lg">
          10 questions. One shot at the top of the leaderboard.
        </p>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/20">
        <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="player-name">
          Your name
        </label>
        <input
          id="player-name"
          type="text"
          value={name}
          maxLength={24}
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value.trim()) setError('');
          }}
          onKeyDown={(e) => e.key === 'Enter' && start()}
          placeholder="e.g. Alex"
          className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-white placeholder:text-slate-600 outline-none transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
        />
        {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}

        <p className="block text-sm font-medium text-slate-300 mt-6 mb-2">Choose a category</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-xl border px-4 py-4 text-sm font-medium transition-all duration-200 ${
                category === c
                  ? 'bg-teal-500/15 border-teal-400 text-teal-300 shadow-lg shadow-teal-500/10'
                  : 'bg-slate-950/70 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <button
          onClick={start}
          className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-6 py-3.5 font-semibold text-slate-950 transition-all duration-200 hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/25 active:scale-[0.98] cursor-pointer"
        >
          Start Quiz
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {highScores.length > 0 && (
        <div className="mt-6 bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
            Recent top scores
          </h2>
          <ul className="space-y-2">
            {highScores.map((s, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{s.name}</span>
                <span className="font-semibold text-teal-400">{s.percent}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
