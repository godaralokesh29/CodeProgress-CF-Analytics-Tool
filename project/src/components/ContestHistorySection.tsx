import React, { useState, useMemo } from 'react';
import { Calendar, TrendingUp, Trophy, Target } from 'lucide-react';
import { Student } from '../types/Student';

interface ContestHistorySectionProps {
  student: Student;
}

const ContestHistorySection: React.FC<ContestHistorySectionProps> = ({ student }) => {
  const [timeFilter, setTimeFilter] = useState<30 | 90 | 365>(90);

  console.log('codeforces:', student.codeforces);

  const filteredContests = useMemo(() => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeFilter);
    return (student.codeforces?.contestHistory as any[] | undefined)
      ?.filter((contest: any) => 
        contest.ratingUpdateTimeSeconds &&
        new Date(contest.ratingUpdateTimeSeconds * 1000) >= cutoffDate
      )
      ?.sort((a: any, b: any) => b.ratingUpdateTimeSeconds - a.ratingUpdateTimeSeconds) || [];
  }, [student.codeforces, timeFilter]);

  const ratingData = useMemo(() => {
    return filteredContests.map(contest => ({
      date: contest.startTime || contest.date,
      rating: contest.newRating,
      change: contest.ratingChange
    })).reverse();
  }, [filteredContests]);

  const stats = useMemo(() => {
    if (filteredContests.length === 0) {
      return {
        totalContests: 0,
        avgRatingChange: 0,
        bestRank: 0,
        problemsSolved: 0,
        totalProblems: 0
      };
    }

    const totalRatingChange = filteredContests.reduce((sum, contest) => sum + contest.ratingChange, 0);
    const bestRank = Math.min(...filteredContests.map(c => c.rank));
    const problemsSolved = filteredContests.reduce((sum, contest) => sum + contest.problemsSolved, 0);
    const totalProblems = filteredContests.reduce((sum, contest) => sum + contest.totalProblems, 0);

    return {
      totalContests: filteredContests.length,
      avgRatingChange: Math.round(totalRatingChange / filteredContests.length),
      bestRank,
      problemsSolved,
      totalProblems
    };
  }, [filteredContests]);

  const getRatingColor = (rating: number): string => {
    if (rating < 1200) return '#6B7280';
    if (rating < 1400) return '#10B981';
    if (rating < 1600) return '#06B6D4';
    if (rating < 1900) return '#3B82F6';
    if (rating < 2100) return '#8B5CF6';
    if (rating < 2300) return '#F59E0B';
    if (rating < 2400) return '#F97316';
    return '#EF4444';
  };

  return (
    <div className="p-6">
      {/* Filter Controls */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Calendar size={20} />
          Contest History
        </h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[30, 90, 365].map((days) => (
            <button
              key={days}
              onClick={() => setTimeFilter(days as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeFilter === days
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {days === 365 ? '1 Year' : `${days} Days`}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Contests</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalContests}</p>
            </div>
            <Calendar size={24} className="text-blue-400" />
          </div>
        </div>

        <div className={`p-4 rounded-lg ${stats.avgRatingChange >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${stats.avgRatingChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Avg Rating Change
              </p>
              <p className={`text-2xl font-bold ${stats.avgRatingChange >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                {stats.avgRatingChange > 0 ? '+' : ''}{stats.avgRatingChange}
              </p>
            </div>
            <TrendingUp size={24} className={stats.avgRatingChange >= 0 ? 'text-green-400' : 'text-red-400'} />
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Best Rank</p>
              <p className="text-2xl font-bold text-yellow-900">#{stats.bestRank || 'N/A'}</p>
            </div>
            <Trophy size={24} className="text-yellow-400" />
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Problems Solved</p>
              <p className="text-2xl font-bold text-purple-900">{stats.problemsSolved}/{stats.totalProblems}</p>
            </div>
            <Target size={24} className="text-purple-400" />
          </div>
        </div>
      </div>

      {/* Rating Graph */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Rating Progress</h4>
        {ratingData.length > 0 ? (
          <div className="h-64 relative">
            <svg className="w-full h-full" viewBox="0 0 800 200">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <g key={`grid-${i}`}>
                  <line
                    x1="50"
                    y1={40 + i * 32}
                    x2="750"
                    y2={40 + i * 32}
                    stroke="#E5E7EB"
                    strokeWidth="1"
                  />
                </g>
              ))}
              
              {/* Rating line */}
              {ratingData.length > 1 && (
                <polyline
                  fill="none"
                  stroke={getRatingColor(student.currentRating)}
                  strokeWidth="3"
                  points={ratingData.map((point, index) => {
                    const x = 50 + (index / (ratingData.length - 1)) * 700;
                    const minRating = Math.min(...ratingData.map(d => d.rating));
                    const maxRating = Math.max(...ratingData.map(d => d.rating));
                    const range = maxRating - minRating || 100;
                    const y = 168 - ((point.rating - minRating) / range) * 128;
                    return `${x},${y}`;
                  }).join(' ')}
                />
              )}
              
              {/* Data points */}
              {ratingData.map((point, index) => {
                const x = 50 + (index / Math.max(ratingData.length - 1, 1)) * 700;
                const minRating = Math.min(...ratingData.map(d => d.rating));
                const maxRating = Math.max(...ratingData.map(d => d.rating));
                const range = maxRating - minRating || 100;
                const y = 168 - ((point.rating - minRating) / range) * 128;
                
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="4"
                    fill={getRatingColor(point.rating)}
                    className="hover:r-6 transition-all cursor-pointer"
                  >
                    <title>{`${point.date}: ${point.rating} (${point.change > 0 ? '+' : ''}${point.change})`}</title>
                  </circle>
                );
              })}
              
              {/* Y-axis labels */}
              {ratingData.length > 0 && [0, 1, 2, 3, 4].map(i => {
                const minRating = Math.min(...ratingData.map(d => d.rating));
                const maxRating = Math.max(...ratingData.map(d => d.rating));
                const range = maxRating - minRating || 100;
                const rating = Math.round(minRating + (range * (4 - i)) / 4);
                
                return (
                  <text
                    key={`label-${i}`}
                    x="40"
                    y={40 + i * 32}
                    textAnchor="end"
                    alignmentBaseline="middle"
                    className="text-xs text-gray-500"
                  >
                    {rating}
                  </text>
                );
              })}
            </svg>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
              <p>No contest data available for the selected period</p>
            </div>
          </div>
        )}
      </div>

      {/* Contest List */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Contest Details</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problems</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unsolved</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating Change</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContests.length > 0 ? (
                filteredContests.map((contest: any) => (
                  <tr key={contest.contestId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{contest.contestName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {contest.ratingUpdateTimeSeconds
                        ? new Date(contest.ratingUpdateTimeSeconds * 1000).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">#{contest.rank}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">N/A</td>
                    <td className="px-6 py-4 text-sm">N/A</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`font-semibold ${(contest.newRating - contest.oldRating) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(contest.newRating - contest.oldRating) > 0 ? '+' : ''}{contest.newRating - contest.oldRating}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="font-semibold" style={{ color: getRatingColor(contest.newRating) }}>{contest.newRating}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No contests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContestHistorySection;