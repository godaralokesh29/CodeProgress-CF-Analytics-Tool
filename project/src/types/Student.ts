export interface Student {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  codeforcesHandle: string;
  currentRating: number;
  maxRating: number;
  enrollmentDate: string;
  totalContests: number;
  recentContests: Contest[];
  problemSolvingData: ProblemSolvingData;
  codeforces?: any;
  // Email reminder fields
  emailRemindersEnabled?: boolean;
  reminderEmailCount?: number;
  lastReminderSent?: string | null;
  lastSubmissionDate?: string | null;
  daysSinceLastSubmission?: number | null;
  isInactive?: boolean;
}

export interface Contest {
  id: number;
  name: string;
  date: string;
  rank: number;
  ratingChange: number;
  newRating: number;
  problemsSolved: number;
  totalProblems: number;
}

export interface ProblemSolvingData {
  submissions: Submission[];
  solvedProblems: SolvedProblem[];
  dailyActivity: DailyActivity[];
}

export interface Submission {
  id: number;
  problemName: string;
  problemRating: number;
  verdict: 'OK' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'COMPILATION_ERROR' | 'RUNTIME_ERROR';
  submissionTime: string;
  language: string;
}

export interface SolvedProblem {
  name: string;
  rating: number;
  tags: string[];
  solvedAt: string;
}

export interface DailyActivity {
  date: string;
  submissions: number;
  problemsSolved: number;
}