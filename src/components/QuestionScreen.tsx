import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Timer, X } from 'lucide-react';
import type { AnsweredQuestion, Question } from '@/types';
import { useCountdown } from '@/hooks/useCountdown';

const SECONDS_PER_QUESTION = 20;

interface QuestionScreenProps {
  questions: Question[];
  questionNumber: number;
  onAnswered: (result: AnsweredQuestion, secondsUsed: number) => void;
}

export function QuestionScreen({ questions, questionNumber, onAnswered }: QuestionScreenProps) {
  const question = questions[questionNumber];
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  const [remainingRef, setRemainingRef] = useState(SECONDS_PER_QUESTION);

  const handleAnswer = useCallback(
    (index: number | null) => {
      if (locked) return;
      setLocked(true);
      setSelected(index);
      onAnswered({ question, selectedIndex: index }, SECONDS_PER_QUESTION - remainingRef);
    },
    [question, onAnswered, locked, remainingRef]
  );

  const remaining = useCountdown(!locked, SECONDS_PER_QUESTION, () => handleAnswer(null));

  useEffect(() => {
    setRemainingRef(remaining);
  }, [remaining]);

  useEffect(() => {
    setSelected(null);
    setLocked(false);
    setRemainingRef(SECONDS_PER_QUESTION);
  }, [questionNumber]);

  const correct = selected !== null && selected === question.correctAnswer;
  const progressPercent = ((questionNumber + (locked ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto animate-in">
      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
          <span>
            Question <span className="text-white font-semibold">{questionNumber + 1}</span>
            <span className="text-slate-500"> / {questions.length}</span>
          </span>
          <span
            className={`inline-flex items-center gap-1.5 font-medium tabular-nums transition-colors ${
              remaining <= 5 ? 'text-rose-400' : 'text-slate-400'
            }`}
          >
            <Timer className="w-4 h-4" />
            {remaining}s
          </span>
        </div>
        <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="mt-6 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/20">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-3">
          {question.category}
        </p>
        <h2 className="text-xl sm:text-2xl font-semibold text-white leading-snug mb-6">
          {question.question}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, i) => {
            const isSelected = selected === i;
            const isCorrect = i === question.correctAnswer;
            let cls =
              'border-slate-700 bg-slate-950/70 hover:border-slate-500 hover:bg-slate-800 text-slate-200';
            if (locked) {
              if (isCorrect) cls = 'border-emerald-500 bg-emerald-500/10 text-emerald-300';
              else if (isSelected) cls = 'border-rose-500 bg-rose-500/10 text-rose-300';
              else cls = 'border-slate-800 bg-slate-950/50 text-slate-500';
            }
            return (
              <button
                key={i}
                disabled={locked}
                onClick={() => handleAnswer(i)}
                className={`w-full flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left font-medium transition-all duration-200 cursor-pointer disabled:cursor-default ${cls}`}
              >
                <span>{option}</span>
                {locked && isCorrect && <Check className="w-5 h-5 shrink-0" />}
                {locked && isSelected && !isCorrect && <X className="w-5 h-5 shrink-0" />}
              </button>
            );
          })}
        </div>

        {locked && (
          <div
            className={`mt-6 rounded-xl border p-4 text-sm animate-in ${
              correct
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-amber-500/40 bg-amber-500/10 text-amber-300'
            }`}
          >
            <span className="font-semibold">{correct ? 'Correct! ' : selected === null ? 'Time\u2019s up. ' : 'Not quite. '}</span>
            {question.explanation}
            <span className="block mt-2 text-slate-400 text-xs">
              Moving on in a moment…
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
