import { Student } from '../types/Student';

// Helper function to generate random dates
const getRandomDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString().split('T')[0];
};

// Helper function to generate random time
const getRandomDateTime = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  return date.toISOString();
};

export const mockStudents: Student[] = [
  {
    _id: '1',
    name: 'Alice Chen',
    email: 'alice.chen@email.com',
    phoneNumber: '+1 (555) 123-4567',
    codeforcesHandle: 'alice_codes',
    currentRating: 1847,
    maxRating: 1903,
    enrollmentDate: '2024-01-15',
    totalContests: 42,
    recentContests: [
      {
        id: 1901,
        name: 'Codeforces Round 920 (Div. 2)',
        date: '2024-01-20',
        rank: 234,
        ratingChange: -23,
        newRating: 1847,
        problemsSolved: 3,
        totalProblems: 6
      },
      {
        id: 1900,
        name: 'Educational Codeforces Round 162',
        date: '2024-01-15',
        rank: 187,
        ratingChange: +34,
        newRating: 1870,
        problemsSolved: 4,
        totalProblems: 7
      },
      {
        id: 1899,
        name: 'Codeforces Round 919 (Div. 2)',
        date: '2024-01-10',
        rank: 156,
        ratingChange: +45,
        newRating: 1836,
        problemsSolved: 4,
        totalProblems: 6
      },
      {
        id: 1898,
        name: 'Codeforces Round 918 (Div. 2)',
        date: '2024-01-05',
        rank: 298,
        ratingChange: -12,
        newRating: 1791,
        problemsSolved: 2,
        totalProblems: 6
      },
      {
        id: 1897,
        name: 'Educational Codeforces Round 161',
        date: '2023-12-28',
        rank: 145,
        ratingChange: +56,
        newRating: 1803,
        problemsSolved: 5,
        totalProblems: 7
      }
    ],
    problemSolvingData: {
      submissions: Array.from({ length: 150 }, (_, i) => ({
        id: i + 1,
        problemName: `Problem ${String.fromCharCode(65 + (i % 26))}`,
        problemRating: 800 + Math.floor(Math.random() * 1600),
        verdict: Math.random() > 0.3 ? 'OK' : ['WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'COMPILATION_ERROR'][Math.floor(Math.random() * 3)] as any,
        submissionTime: getRandomDateTime(90),
        language: ['C++', 'Python', 'Java'][Math.floor(Math.random() * 3)]
      })),
      solvedProblems: Array.from({ length: 85 }, (_, i) => ({
        name: `Problem ${String.fromCharCode(65 + (i % 26))} - ${['Two Pointers', 'Dynamic Programming', 'Graph Theory', 'Number Theory'][Math.floor(Math.random() * 4)]}`,
        rating: 800 + Math.floor(Math.random() * 1200),
        tags: ['implementation', 'math', 'greedy', 'dp', 'graphs'].slice(0, Math.floor(Math.random() * 3) + 1),
        solvedAt: getRandomDate(90)
      })),
      dailyActivity: Array.from({ length: 90 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          date: date.toISOString().split('T')[0],
          submissions: Math.floor(Math.random() * 15),
          problemsSolved: Math.floor(Math.random() * 8)
        };
      })
    }
  },
  {
    _id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@email.com',
    phoneNumber: '+1 (555) 234-5678',
    codeforcesHandle: 'bob_solver',
    currentRating: 1234,
    maxRating: 1456,
    enrollmentDate: '2024-01-10',
    totalContests: 28,
    recentContests: [
      {
        id: 1901,
        name: 'Codeforces Round 920 (Div. 2)',
        date: '2024-01-20',
        rank: 456,
        ratingChange: +67,
        newRating: 1234,
        problemsSolved: 2,
        totalProblems: 6
      },
      {
        id: 1900,
        name: 'Educational Codeforces Round 162',
        date: '2024-01-15',
        rank: 523,
        ratingChange: -12,
        newRating: 1167,
        problemsSolved: 1,
        totalProblems: 7
      },
      {
        id: 1899,
        name: 'Codeforces Round 919 (Div. 2)',
        date: '2024-01-08',
        rank: 389,
        ratingChange: +23,
        newRating: 1179,
        problemsSolved: 3,
        totalProblems: 6
      }
    ],
    problemSolvingData: {
      submissions: Array.from({ length: 95 }, (_, i) => ({
        id: i + 1,
        problemName: `Problem ${String.fromCharCode(65 + (i % 26))}`,
        problemRating: 800 + Math.floor(Math.random() * 1000),
        verdict: Math.random() > 0.4 ? 'OK' : ['WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED'][Math.floor(Math.random() * 2)] as any,
        submissionTime: getRandomDateTime(90),
        language: ['C++', 'Python'][Math.floor(Math.random() * 2)]
      })),
      solvedProblems: Array.from({ length: 45 }, (_, i) => ({
        name: `Problem ${String.fromCharCode(65 + (i % 26))} - ${['Implementation', 'Math', 'Greedy'][Math.floor(Math.random() * 3)]}`,
        rating: 800 + Math.floor(Math.random() * 800),
        tags: ['implementation', 'math', 'greedy', 'brute force'].slice(0, Math.floor(Math.random() * 2) + 1),
        solvedAt: getRandomDate(90)
      })),
      dailyActivity: Array.from({ length: 90 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          date: date.toISOString().split('T')[0],
          submissions: Math.floor(Math.random() * 10),
          problemsSolved: Math.floor(Math.random() * 5)
        };
      })
    }
  },
  {
    _id: '3',
    name: 'Carol Davis',
    email: 'carol.davis@email.com',
    phoneNumber: '+1 (555) 345-6789',
    codeforcesHandle: 'carol_competitive',
    currentRating: 2134,
    maxRating: 2267,
    enrollmentDate: '2023-12-20',
    totalContests: 67,
    recentContests: [
      {
        id: 1901,
        name: 'Codeforces Round 920 (Div. 1)',
        date: '2024-01-20',
        rank: 89,
        ratingChange: +43,
        newRating: 2134,
        problemsSolved: 4,
        totalProblems: 6
      },
      {
        id: 1900,
        name: 'Educational Codeforces Round 162',
        date: '2024-01-15',
        rank: 67,
        ratingChange: +56,
        newRating: 2091,
        problemsSolved: 5,
        totalProblems: 7
      },
      {
        id: 1899,
        name: 'Codeforces Round 919 (Div. 1)',
        date: '2024-01-10',
        rank: 78,
        ratingChange: -34,
        newRating: 2035,
        problemsSolved: 3,
        totalProblems: 6
      },
      {
        id: 1898,
        name: 'Codeforces Round 918 (Div. 1)',
        date: '2024-01-03',
        rank: 45,
        ratingChange: +78,
        newRating: 2069,
        problemsSolved: 5,
        totalProblems: 6
      }
    ],
    problemSolvingData: {
      submissions: Array.from({ length: 280 }, (_, i) => ({
        id: i + 1,
        problemName: `Problem ${String.fromCharCode(65 + (i % 26))}`,
        problemRating: 1200 + Math.floor(Math.random() * 1800),
        verdict: Math.random() > 0.2 ? 'OK' : ['WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'RUNTIME_ERROR'][Math.floor(Math.random() * 3)] as any,
        submissionTime: getRandomDateTime(90),
        language: ['C++', 'Python', 'Java'][Math.floor(Math.random() * 3)]
      })),
      solvedProblems: Array.from({ length: 165 }, (_, i) => ({
        name: `Problem ${String.fromCharCode(65 + (i % 26))} - ${['Advanced DP', 'Graph Algorithms', 'Number Theory', 'Geometry'][Math.floor(Math.random() * 4)]}`,
        rating: 1200 + Math.floor(Math.random() * 1500),
        tags: ['dp', 'graphs', 'math', 'geometry', 'data structures'].slice(0, Math.floor(Math.random() * 3) + 1),
        solvedAt: getRandomDate(90)
      })),
      dailyActivity: Array.from({ length: 90 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          date: date.toISOString().split('T')[0],
          submissions: Math.floor(Math.random() * 20),
          problemsSolved: Math.floor(Math.random() * 12)
        };
      })
    }
  },
  {
    _id: '4',
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    phoneNumber: '+1 (555) 456-7890',
    codeforcesHandle: 'david_algorithms',
    currentRating: 1567,
    maxRating: 1678,
    enrollmentDate: '2024-01-05',
    totalContests: 35,
    recentContests: [
      {
        id: 1901,
        name: 'Codeforces Round 920 (Div. 2)',
        date: '2024-01-20',
        rank: 298,
        ratingChange: +12,
        newRating: 1567,
        problemsSolved: 3,
        totalProblems: 6
      },
      {
        id: 1900,
        name: 'Educational Codeforces Round 162',
        date: '2024-01-15',
        rank: 267,
        ratingChange: +23,
        newRating: 1555,
        problemsSolved: 4,
        totalProblems: 7
      },
      {
        id: 1899,
        name: 'Codeforces Round 919 (Div. 2)',
        date: '2024-01-12',
        rank: 234,
        ratingChange: -18,
        newRating: 1532,
        problemsSolved: 2,
        totalProblems: 6
      }
    ],
    problemSolvingData: {
      submissions: Array.from({ length: 120 }, (_, i) => ({
        id: i + 1,
        problemName: `Problem ${String.fromCharCode(65 + (i % 26))}`,
        problemRating: 900 + Math.floor(Math.random() * 1300),
        verdict: Math.random() > 0.35 ? 'OK' : ['WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED'][Math.floor(Math.random() * 2)] as any,
        submissionTime: getRandomDateTime(90),
        language: ['C++', 'Python'][Math.floor(Math.random() * 2)]
      })),
      solvedProblems: Array.from({ length: 68 }, (_, i) => ({
        name: `Problem ${String.fromCharCode(65 + (i % 26))} - ${['Data Structures', 'Algorithms', 'Math', 'Implementation'][Math.floor(Math.random() * 4)]}`,
        rating: 900 + Math.floor(Math.random() * 1000),
        tags: ['implementation', 'data structures', 'algorithms', 'math'].slice(0, Math.floor(Math.random() * 2) + 1),
        solvedAt: getRandomDate(90)
      })),
      dailyActivity: Array.from({ length: 90 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          date: date.toISOString().split('T')[0],
          submissions: Math.floor(Math.random() * 12),
          problemsSolved: Math.floor(Math.random() * 7)
        };
      })
    }
  },
  {
    _id: '5',
    name: 'Eva Martinez',
    email: 'eva.martinez@email.com',
    phoneNumber: '+1 (555) 567-8901',
    codeforcesHandle: 'eva_coder',
    currentRating: 967,
    maxRating: 1123,
    enrollmentDate: '2024-01-12',
    totalContests: 15,
    recentContests: [
      {
        id: 1901,
        name: 'Codeforces Round 920 (Div. 3)',
        date: '2024-01-20',
        rank: 678,
        ratingChange: -45,
        newRating: 967,
        problemsSolved: 2,
        totalProblems: 7
      },
      {
        id: 1900,
        name: 'Educational Codeforces Round 162',
        date: '2024-01-15',
        rank: 789,
        ratingChange: +34,
        newRating: 1012,
        problemsSolved: 3,
        totalProblems: 7
      },
      {
        id: 1899,
        name: 'Codeforces Round 919 (Div. 3)',
        date: '2024-01-13',
        rank: 567,
        ratingChange: +67,
        newRating: 978,
        problemsSolved: 4,
        totalProblems: 7
      }
    ],
    problemSolvingData: {
      submissions: Array.from({ length: 65 }, (_, i) => ({
        id: i + 1,
        problemName: `Problem ${String.fromCharCode(65 + (i % 26))}`,
        problemRating: 800 + Math.floor(Math.random() * 600),
        verdict: Math.random() > 0.5 ? 'OK' : ['WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED'][Math.floor(Math.random() * 2)] as any,
        submissionTime: getRandomDateTime(90),
        language: ['C++', 'Python'][Math.floor(Math.random() * 2)]
      })),
      solvedProblems: Array.from({ length: 28 }, (_, i) => ({
        name: `Problem ${String.fromCharCode(65 + (i % 26))} - ${['Basic Math', 'Implementation', 'Greedy'][Math.floor(Math.random() * 3)]}`,
        rating: 800 + Math.floor(Math.random() * 500),
        tags: ['implementation', 'math', 'greedy', 'brute force'].slice(0, Math.floor(Math.random() * 2) + 1),
        solvedAt: getRandomDate(90)
      })),
      dailyActivity: Array.from({ length: 90 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          date: date.toISOString().split('T')[0],
          submissions: Math.floor(Math.random() * 8),
          problemsSolved: Math.floor(Math.random() * 4)
        };
      })
    }
  }
];

console.log('First contest:', mockStudents[0].codeforces?.contestHistory?.[0]);