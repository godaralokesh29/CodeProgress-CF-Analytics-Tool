import React, { useState, useMemo } from 'react';
import { BarChart3, Target, TrendingUp, Activity, Award, Clock } from 'lucide-react';
import { Student } from '../types/Student';

interface ProblemSolvingSectionProps {
  student: Student;
}

const ProblemSolvingSection: React.FC<ProblemSolvingSectionProps> = ({ student }) => {
  const [timeFilter, setTimeFilter] = useState<7 | 30 | 90>(30);

  console.log('problemSolvingData:', student.codeforces?.problemSolvingData);

  const filteredData = useMemo(() => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeFilter);
    
    const submissions = (student.codeforces?.problemSolvingData?.submissions as any[] | undefined)?.filter((sub: any) => 
      new Date(sub.submissionTime) >= cutoffDate
    ) || [];
    
    const solvedProblems = (student.codeforces?.problemSolvingData?.solvedProblems as any[] | undefined)?.filter((prob: any) => 
      new Date(prob.solvedAt) >= cutoffDate
    ) || [];
    
    const dailyActivity = (student.codeforces?.problemSolvingData?.dailyActivity as any[] | undefined)?.filter((day: any) => 
      new Date(day.date) >= cutoffDate
    ) || [];

    return { submissions, solvedProblems, dailyActivity };
  }, [student.codeforces, timeFilter]);

  const stats = student.codeforces?.problemStats || {};

  const ratingBuckets = useMemo(() => {
    const buckets = [
      { range: '800-999', min: 800, max: 999, count: 0, color: '#6B7280' },
      { range: '1000-1199', min: 1000, max: 1199, count: 0, color: '#6B7280' },
      { range: '1200-1399', min: 1200, max: 1399, count: 0, color: '#10B981' },
      { range: '1400-1599', min: 1400, max: 1599, count: 0, color: '#06B6D4' },
      { range: '1600-1899', min: 1600, max: 1899, count: 0, color: '#3B82F6' },
      { range: '1900-2099', min: 1900, max: 2099, count: 0, color: '#8B5CF6' },
      { range: '2100-2299', min: 2100, max: 2299, count: 0, color: '#F59E0B' },
      { range: '2300+', min: 2300, max: 9999, count: 0, color: '#EF4444' }
    ];

    filteredData.solvedProblems.forEach(problem => {
      const bucket = buckets.find(b => problem.rating >= b.min && problem.rating <= b.max);
      if (bucket) bucket.count++;
    });

    return buckets;
  }, [filteredData.solvedProblems]);

  const heatmapData = useMemo(() => {
    const days = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeFilter);
    
    for (let i = 0; i < timeFilter; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayData = filteredData.dailyActivity.find(d => d.date === dateStr);
      days.push({
        date: dateStr,
        submissions: dayData?.submissions || 0,
        problems: dayData?.problemsSolved || 0
      });
    }
    
    return days;
  }, [filteredData.dailyActivity, timeFilter]);

  const getHeatmapColor = (submissions: number): string => {
    if (submissions === 0) return '#F3F4F6';
    if (submissions <= 2) return '#DBEAFE';
    if (submissions <= 5) return '#93C5FD';
    if (submissions <= 10) return '#3B82F6';
    return '#1D4ED8';
  };

  const maxBucketCount = Math.max(...ratingBuckets.map(b => b.count));

  return (
    <div className="p-6">
      {/* Filter Controls */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <BarChart3 size={20} />
          Problem Solving Analytics
        </h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setTimeFilter(days as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeFilter === days
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Most Difficult</p>
              <p className="text-2xl font-bold text-purple-900">
                {stats.mostDifficult?.rating || 'N/A'}
              </p>
              {stats.mostDifficult && (
                <p className="text-xs text-purple-700 truncate">{stats.mostDifficult.name}</p>
              )}
            </div>
            <Award size={24} className="text-purple-400" />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Solved</p>
              <p className="text-2xl font-bold text-green-900">{stats.totalSolved}</p>
              <p className="text-xs text-green-700">{stats.totalSubmissions} submissions</p>
            </div>
            <Target size={24} className="text-green-400" />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Average Rating</p>
              <p className="text-2xl font-bold text-blue-900">{stats.avgRating}</p>
              <p className="text-xs text-blue-700">of solved problems</p>
            </div>
            <TrendingUp size={24} className="text-blue-400" />
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Avg Per Day</p>
              <p className="text-2xl font-bold text-orange-900">{stats.avgPerDay}</p>
              <p className="text-xs text-orange-700">problems solved</p>
            </div>
            <Clock size={24} className="text-orange-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rating Distribution Bar Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Problems by Rating</h4>
          <div className="space-y-3">
            {ratingBuckets.map((bucket) => (
              <div key={`rating-${bucket.range}`} className="flex items-center gap-3">
                <div className="w-20 text-sm text-gray-600 font-mono">{bucket.range}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div
                    className="h-6 rounded-full transition-all duration-300"
                    style={{
                      width: maxBucketCount > 0 ? `${(bucket.count / maxBucketCount) * 100}%` : '0%',
                      backgroundColor: bucket.color
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    {bucket.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submission Heatmap */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity size={20} />
            Submission Heatmap
          </h4>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-xs text-gray-500 text-center p-1">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {heatmapData.map((day, index) => {
              const date = new Date(day.date);
              const dayOfWeek = date.getDay();
              
              // Add empty cells for proper alignment
              if (index === 0) {
                const emptyCells = [];
                for (let i = 0; i < dayOfWeek; i++) {
                  emptyCells.push(
                    <div key={`empty-${i}`} className="w-4 h-4"></div>
                  );
                }
                return (
                  <React.Fragment key={day.date}>
                    {emptyCells}
                    <div
                      className="w-4 h-4 rounded-sm cursor-pointer hover:ring-2 hover:ring-blue-300"
                      style={{ backgroundColor: getHeatmapColor(day.submissions) }}
                      title={`${day.date}: ${day.submissions} submissions, ${day.problems} problems`}
                    />
                  </React.Fragment>
                );
              }
              
              return (
                <div
                  key={day.date}
                  className="w-4 h-4 rounded-sm cursor-pointer hover:ring-2 hover:ring-blue-300"
                  style={{ backgroundColor: getHeatmapColor(day.submissions) }}
                  title={`${day.date}: ${day.submissions} submissions, ${day.problems} problems`}
                />
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 2, 5, 10, 15].map(level => (
                <div
                  key={level}
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: getHeatmapColor(level) }}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Recent Problems */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Recent Problems Solved</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solved At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.solvedProblems.length > 0 ? (
                filteredData.solvedProblems.slice(0, 10).map((problem, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{problem.name}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="font-semibold text-blue-600">{problem.rating}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {problem.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {problem.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                            +{problem.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(problem.solvedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No problems solved in the selected time period
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolvingSection;