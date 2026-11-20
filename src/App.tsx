import { useEffect, useState } from 'react';
import { StartScreen } from '@/components/StartScreen';
import { QuestionScreen } from '@/components/QuestionScreen';
import { ResultScreen } from '@/components/ResultScreen';
import { getShuffledQuestions, type Category } from '@/data/questions';
import type { AnsweredQuestion, Question, QuizScore } from '@/types';
import { supabase } from '@/lib/supabase';

type Stage = 'start' | 'quiz' | 'result';

export default function App() {
  const [stage, setStage] = useState<Stage>('start');
  const [playerName, setPlayerName] = useState('');
  const [category, setCategory] = useState<Category>('General Knowledge');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnsweredQuestion[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [highScores, setHighScores] = useState<QuizScore[]>([]);

  const loadHighScores = () => {
    supabase
      .from('quiz_scores')
      .select('id, player_name, score, total_questions, category, time_seconds, created_at')
      .order('score', { ascending: false })
      .order('time_seconds', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setHighScores(data);
      });
  };

  useEffect(() => {
    loadHighScores();
  }, []);

  const startQuiz = (name: string, chosenCategory: Category) => {
    setPlayerName(name);
    setCategory(chosenCategory);
    setQuestions(getShuffledQuestions(chosenCategory));
    setAnswers([]);
    setElapsed(0);
    setStage('quiz');
  };

  const handleAnswered = (result: AnsweredQuestion, secondsUsed: number) => {
    const isLast = answers.length + 1 >= questions.length;
    setAnswers((prev) => [...prev, result]);
    setElapsed((prev) => prev + secondsUsed);
    if (isLast) {
      setTimeout(() => setStage('result'), 1600);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_rgba(45,212,191,0.08),_transparent_60%)] text-white flex flex-col items-center justify-center px-4 py-10">
      {stage === 'start' && (
        <StartScreen
          onStart={startQuiz}
          highScores={highScores.map((s) => ({
            name: s.player_name,
            percent: Math.round((s.score / s.total_questions) * 100),
          }))}
        />
      )}

      {stage === 'quiz' && (
        <QuestionScreen
          key={answers.length}
          questions={questions}
          questionNumber={answers.length}
          onAnswered={handleAnswered}
        />
      )}

      {stage === 'result' && (
        <ResultScreen
          playerName={playerName}
          category={category}
          answers={answers}
          totalTimeSeconds={elapsed}
          onRestart={() => {
            setStage('start');
            loadHighScores();
          }}
        />
      )}
    </div>
  );
}
