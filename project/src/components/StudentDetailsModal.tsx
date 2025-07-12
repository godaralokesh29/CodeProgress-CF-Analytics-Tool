import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Award, Calendar, Hash, BarChart3, Activity, Target, Clock, RefreshCw, User } from 'lucide-react';
import { Student } from '../types/Student';
import ContestHistorySection from './ContestHistorySection';
import ProblemSolvingSection from './ProblemSolvingSection';
import { updateStudentCodeforcesData } from '../services/codeforcesService';

interface StudentDetailsModalProps {
  student: Student;
  onClose: () => void;
  onUpdate: (updatedStudent: Student) => void;
}

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({ student, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'contests' | 'problems'>('overview');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [cfStats, setCfStats] = useState<any>(null);
  const [cfContests, setCfContests] = useState<any[]>([]);

  useEffect(() => {
    if (student && student.codeforcesHandle) {
      fetch(`https://codeforces.com/api/user.info?handles=${student.codeforcesHandle}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'OK' && data.result[0].titlePhoto) {
            setProfilePic(data.result[0].titlePhoto);
            setCfStats(data.result[0]);
          }
        });
      fetch(`https://codeforces.com/api/user.rating?handle=${student.codeforcesHandle}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'OK') {
            setCfContests(data.result);
          }
        });
    }
  }, [student]);

  const handleUpdateCodeforcesData = async () => {
    try {
      setIsUpdating(true);
      setUpdateError(null);
      if (!student._id) {
        throw new Error('Student ID is missing');
      }
      const updatedStudent = await updateStudentCodeforcesData(student._id);
      onUpdate(updatedStudent);
    } catch (error: any) {
      setUpdateError(error.message || 'Failed to update Codeforces data. Please try again later.');
      console.error('Error updating Codeforces data:', error);
    } finally {
      setIsUpdating(false);
    }
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

  const getMaxRating = () => {
    if (!cfContests.length) return cfStats?.rating || 0;
    return Math.max(...cfContests.map(c => c.newRating));
  };
  const getRecentTrend = () => {
    if (!cfContests.length) return 0;
    return cfContests.slice(-5).reduce((sum, c) => sum + (c.newRating - c.oldRating), 0);
  };

  const performanceTrend = (student.codeforces?.contestHistory as any[] | undefined)?.slice(0, 5)?.reduce((sum: number, contest: any) => sum + contest.ratingChange, 0) || 0;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Award },
    { id: 'contests', label: 'Contest History', icon: Calendar },
    { id: 'problems', label: 'Problem Solving', icon: BarChart3 }
  ];

  console.log('codeforces:', student.codeforces);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between text-white">
          <div>
            <h3 className="text-xl font-semibold">{student.name}</h3>
            <p className="text-blue-100 text-sm">@{student.codeforcesHandle}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleUpdateCodeforcesData}
              disabled={isUpdating}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-800 rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50"
              title="Sync Codeforces Data"
            >
              <RefreshCw size={16} className={isUpdating ? 'animate-spin' : ''} />
              {isUpdating ? 'Updating...' : 'Sync Data'}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {updateError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{updateError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-white">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start p-6">
              {/* Profile Picture and Handle */}
              <div className="flex flex-col items-center bg-gray-100 rounded-lg p-6 min-w-[220px]">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-28 h-28 rounded-full border-4 border-blue-500 mb-4" />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center mb-4">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{student.name}</div>
                  <div className="text-blue-600 font-mono">@{student.codeforcesHandle}</div>
                  <a href={`https://codeforces.com/profile/${student.codeforcesHandle}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">View Codeforces Profile</a>
                </div>
              </div>
              {/* Stats Cards */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className={`p-6 rounded-xl ${getRatingColor(cfStats?.rating || 0)}`}> {/* Current Rating */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-80">Current Rating</p>
                      <p className="text-2xl font-bold">{cfStats?.rating ?? 'N/A'}</p>
                      <p className="text-xs opacity-70">{getRatingTitle(cfStats?.rating || 0)}</p>
                    </div>
                    <Award size={24} className="opacity-60" />
                  </div>
                </div>
                <div className={`p-6 rounded-xl ${getRatingColor(getMaxRating())}`}> {/* Max Rating */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-80">Max Rating</p>
                      <p className="text-2xl font-bold">{getMaxRating()}</p>
                      <p className="text-xs opacity-70">{getRatingTitle(getMaxRating())}</p>
                    </div>
                    <TrendingUp size={24} className="opacity-60" />
                  </div>
                </div>
                <div className="p-6 rounded-xl bg-indigo-100 text-indigo-600"> {/* Total Contests */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-80">Total Contests</p>
                      <p className="text-2xl font-bold">{cfContests.length}</p>
                      <p className="text-xs opacity-70">Participated</p>
                    </div>
                    <Hash size={24} className="opacity-60" />
                  </div>
                </div>
                <div className={`p-6 rounded-xl ${getRecentTrend() >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}> {/* Recent Trend */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-80">Recent Trend</p>
                      <p className="text-2xl font-bold">{getRecentTrend() > 0 ? '+' : ''}{getRecentTrend()}</p>
                      <p className="text-xs opacity-70">Last 5 contests</p>
                    </div>
                    {getRecentTrend() >= 0 ? <TrendingUp size={24} className="opacity-60" /> : <TrendingDown size={24} className="opacity-60" />}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contests' && (
            <ContestHistorySection student={student} />
          )}

          {activeTab === 'problems' && (
            <ProblemSolvingSection student={student} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;