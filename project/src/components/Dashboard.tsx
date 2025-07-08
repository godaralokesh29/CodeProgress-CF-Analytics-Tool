import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, LogOut, User, Trophy, Target, TrendingUp } from 'lucide-react';
import ContestHistorySection from './ContestHistorySection';
import ProblemSolvingSection from './ProblemSolvingSection';
import { Student } from '../types/Student';
import * as api from '../utils/api';

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const codeforcesHandle = localStorage.getItem('codeforcesHandle');
    if (!codeforcesHandle) {
      navigate('/signin');
      return;
    }

    loadUserData(codeforcesHandle);
  }, [navigate]);

  const loadUserData = async (handle: string) => {
    try {
      setLoading(true);
      // Try to find existing student data first
      const students = await api.fetchStudents();
      const existingStudent = students.find(s => s.codeforcesHandle === handle);
      
      if (existingStudent) {
        setUserData(existingStudent);
      } else {
        // Create a new student entry with the handle
        const newStudentData: Omit<Student, '_id'> = {
          name: handle, // Use handle as name for now
          email: `${handle}@codeforces.com`, // Placeholder email
          phoneNumber: '',
          codeforcesHandle: handle,
          currentRating: 0,
          maxRating: 0,
          enrollmentDate: new Date().toISOString().split('T')[0],
          totalContests: 0,
          recentContests: [],
          problemSolvingData: {
            submissions: [],
            solvedProblems: [],
            dailyActivity: []
          }
        };
        
        const newStudent = await api.addStudent(newStudentData);
        setUserData(newStudent);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load your data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('codeforcesHandle');
    navigate('/');
  };

  const handleStudentUpdate = (updatedStudent: Student) => {
    setUserData(updatedStudent);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-xl font-bold text-white">CFAnalytics</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-slate-300">
                <User className="w-4 h-4" />
                <span>{userData.codeforcesHandle}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* User Stats */}
      <div className="bg-slate-800/30 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Trophy className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Current Rating</p>
                  <p className="text-2xl font-bold text-white">{userData.currentRating}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Max Rating</p>
                  <p className="text-2xl font-bold text-white">{userData.maxRating}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Target className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total Contests</p>
                  <p className="text-2xl font-bold text-white">{userData.totalContests}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Problems Solved</p>
                  <p className="text-2xl font-bold text-white">
                    {userData.problemSolvingData.solvedProblems.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Contest History Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Contest History</h2>
            <ContestHistorySection student={userData} />
          </div>

          {/* Problem Solving Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Problem Solving Analytics</h2>
            <ProblemSolvingSection student={userData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 