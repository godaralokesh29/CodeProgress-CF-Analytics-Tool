import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Award, Calendar, Hash, BarChart3, Activity, Target, Clock, RefreshCw, LogOut, User } from 'lucide-react';
import { Student } from '../types/Student';
import ContestHistorySection from './ContestHistorySection';
import ProblemSolvingSection from './ProblemSolvingSection';
import { updateStudentCodeforcesData } from '../services/codeforcesService';
import * as api from '../utils/api';

const StudentDetailsPage: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'contests' | 'problems'>('overview');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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
        setStudent(existingStudent);
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
        setStudent(newStudent);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
      setUpdateError('Failed to load your data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCodeforcesData = async () => {
    if (!student?._id) return;
    
    try {
      setIsUpdating(true);
      setUpdateError(null);
      const updatedStudent = await updateStudentCodeforcesData(student._id);
      setStudent(updatedStudent);
    } catch (error: any) {
      setUpdateError(error.message || 'Failed to update Codeforces data. Please try again later.');
      console.error('Error updating Codeforces data:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('codeforcesHandle');
    navigate('/');
  };

  const getRatingColor = (rating: number): string => {
    if (rating < 1200) return 'text-gray-600 bg-gray-100';
    if (rating < 1400) return 'text-green-600 bg-green-100';
    if (rating < 1600) return 'text-cyan-600 bg-cyan-100';
    if (rating < 1900) return 'text-blue-600 bg-blue-100';
    if (rating < 2100) return 'text-purple-600 bg-purple-100';
    if (rating < 2300) return 'text-yellow-600 bg-yellow-100';
    if (rating < 2400) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getRatingTitle = (rating: number): string => {
    if (rating < 1200) return 'Newbie';
    if (rating < 1400) return 'Pupil';
    if (rating < 1600) return 'Specialist';
    if (rating < 1900) return 'Expert';
    if (rating < 2100) return 'Candidate Master';
    if (rating < 2300) return 'Master';
    if (rating < 2400) return 'International Master';
    return 'Grandmaster';
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

  if (!student) {
    return null;
  }

  const performanceTrend = (student.codeforces?.contestHistory as any[] | undefined)?.slice(0, 5)?.reduce((sum: number, contest: any) => sum + contest.ratingChange, 0) || 0;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Award },
    { id: 'contests', label: 'Contest History', icon: Calendar },
    { id: 'problems', label: 'Problem Solving', icon: BarChart3 }
  ];

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
                <span className="text-xl font-bold text-white">CodeProgress</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-slate-300">
                <User className="w-4 h-4" />
                <span>{student.codeforcesHandle}</span>
              </div>
              <button
                onClick={handleUpdateCodeforcesData}
                disabled={isUpdating}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-white"
                title="Sync Codeforces Data"
              >
                <RefreshCw size={16} className={isUpdating ? 'animate-spin' : ''} />
                {isUpdating ? 'Updating...' : 'Sync Data'}
              </button>
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

      {updateError && (
        <div className="bg-red-500/10 border border-red-500/20 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-400">{updateError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-slate-700/50 bg-slate-800/30">
        <nav className="flex space-x-8 px-6 max-w-7xl mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Student Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`p-6 rounded-xl ${getRatingColor(student.currentRating)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-80">Current Rating</p>
                    <p className="text-2xl font-bold">{student.currentRating}</p>
                    <p className="text-xs opacity-70">{getRatingTitle(student.currentRating)}</p>
                  </div>
                  <Award size={24} className="opacity-60" />
                </div>
              </div>

              <div className={`p-6 rounded-xl ${getRatingColor(student.maxRating)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-80">Max Rating</p>
                    <p className="text-2xl font-bold">{student.maxRating}</p>
                    <p className="text-xs opacity-70">{getRatingTitle(student.maxRating)}</p>
                  </div>
                  <TrendingUp size={24} className="opacity-60" />
                </div>
              </div>

              <div className="p-6 rounded-xl bg-indigo-100 text-indigo-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-80">Total Contests</p>
                    <p className="text-2xl font-bold">{student.totalContests}</p>
                    <p className="text-xs opacity-70">Participated</p>
                  </div>
                  <Hash size={24} className="opacity-60" />
                </div>
              </div>

              <div className={`p-6 rounded-xl ${performanceTrend >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-80">Recent Trend</p>
                    <p className="text-2xl font-bold">{performanceTrend > 0 ? '+' : ''}{performanceTrend}</p>
                    <p className="text-xs opacity-70">Last 5 contests</p>
                  </div>
                  {performanceTrend >= 0 ? <TrendingUp size={24} className="opacity-60" /> : <TrendingDown size={24} className="opacity-60" />}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="font-medium text-white">{student.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Phone</p>
                  <p className="font-medium text-white">{student.phoneNumber || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Enrollment Date</p>
                  <p className="font-medium text-white">{new Date(student.enrollmentDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Codeforces Handle</p>
                  <p className="font-medium text-white">@{student.codeforcesHandle}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contests' && (
          <div>
            <ContestHistorySection student={student} />
          </div>
        )}

        {activeTab === 'problems' && (
          <div>
            <ProblemSolvingSection student={student} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetailsPage; 