export interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface AnsweredQuestion {
  question: Question;
  selectedIndex: number | null;
}

export interface QuizScore {
  id: string;
  player_name: string;
  score: number;
  total_questions: number;
  category: string;
  time_seconds: number;
  created_at: string;
}
