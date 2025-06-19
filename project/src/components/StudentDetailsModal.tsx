import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Award, Calendar, Hash, BarChart3, Activity, Target, Clock, RefreshCw } from 'lucide-react';
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
            <div className="p-6">
              {/* Student Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className={`p-4 rounded-lg ${getRatingColor(student.currentRating)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-80">Current Rating</p>
                      <p className="text-2xl font-bold">{student.currentRating}</p>
                      <p className="text-xs opacity-70">{getRatingTitle(student.currentRating)}</p>
                    </div>
                    <Award size={24} className="opacity-60" />
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${getRatingColor(student.maxRating)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-80">Max Rating</p>
                      <p className="text-2xl font-bold">{student.maxRating}</p>
                      <p className="text-xs opacity-70">{getRatingTitle(student.maxRating)}</p>
                    </div>
                    <TrendingUp size={24} className="opacity-60" />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-indigo-100 text-indigo-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-80">Total Contests</p>
                      <p className="text-2xl font-bold">{student.totalContests}</p>
                      <p className="text-xs opacity-70">Participated</p>
                    </div>
                    <Hash size={24} className="opacity-60" />
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${performanceTrend >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
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
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{student.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{student.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Enrollment Date</p>
                    <p className="font-medium text-gray-900">{new Date(student.enrollmentDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Codeforces Profile</p>
                    <a 
                      href={`https://codeforces.com/profile/${student.codeforcesHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-800 font-mono"
                    >
                      {student.codeforcesHandle} ↗
                    </a>
                  </div>
                </div>
              </div>

              {/* Recent Contest Performance */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar size={20} />
                    Recent Contest Performance
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contest</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problems</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating Change</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {student.codeforces?.contestHistory && student.codeforces.contestHistory.length > 0 ? (
                        (student.codeforces.contestHistory as any[]).slice(0, 5).map((contest: any) => (
                          <tr key={`${contest.id}-${contest.date}`} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{contest.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{contest.date}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">#{contest.rank}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{contest.problemsSolved}/{contest.totalProblems}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`font-semibold ${contest.ratingChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {contest.ratingChange > 0 ? '+' : ''}{contest.ratingChange}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`font-semibold ${getRatingColor(contest.newRating).split(' ')[0]}`}>
                                {contest.newRating}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            No recent contest data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
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