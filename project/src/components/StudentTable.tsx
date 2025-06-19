import React, { useState } from 'react';
import { Edit, Trash2, Eye, Plus, Download, Search, Filter } from 'lucide-react';
import { Student } from '../types/Student';
import StudentModal from './StudentModal';
import StudentDetailsModal from './StudentDetailsModal';
import { exportToCSV } from '../utils/csvExport';

interface StudentTableProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, '_id'>) => void;
  onEditStudent: (_id: string, student: Omit<Student, '_id'>) => void;
  onDeleteStudent: (_id: string) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'all' | 'beginner' | 'pupil' | 'specialist' | 'expert'>('all');

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailsModalOpen(true);
  };

  const handleStudentUpdate = (updatedStudent: Student) => {
    // Update the student in the local state
    // const updatedStudents = students.map(s => 
    //   s._id === updatedStudent._id ? updatedStudent : s
    // );
    console.log(updatedStudent);
    // Notify parent component
    onEditStudent(updatedStudent._id, updatedStudent);
    setSelectedStudent(updatedStudent);

    //-----
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleDownloadCSV = () => {
    exportToCSV(filteredStudents, 'students-data.csv');
  };

  const getRatingColor = (rating?: number): string => {
    if (!rating || rating < 1200) return 'text-gray-600';
    if (rating < 1400) return 'text-green-600';
    if (rating < 1600) return 'text-cyan-600';
    if (rating < 1900) return 'text-blue-600';
    if (rating < 2100) return 'text-purple-600';
    if (rating < 2300) return 'text-yellow-600';
    if (rating < 2400) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRatingTitle = (rating?: number): string => {
    if (!rating || rating < 1200) return 'Newbie';
    if (rating < 1400) return 'Pupil';
    if (rating < 1600) return 'Specialist';
    if (rating < 1900) return 'Expert';
    if (rating < 2100) return 'Candidate Master';
    if (rating < 2300) return 'Master';
    if (rating < 2400) return 'International Master';
    return 'Grandmaster';
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      (student.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.codeforcesHandle || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const rating = student.currentRating || 0;
    const matchesRating = ratingFilter === 'all' || 
                         (ratingFilter === 'beginner' && rating < 1200) ||
                         (ratingFilter === 'pupil' && rating >= 1200 && rating < 1400) ||
                         (ratingFilter === 'specialist' && rating >= 1400 && rating < 1600) ||
                         (ratingFilter === 'expert' && rating >= 1600);

    return matchesSearch && matchesRating;
  });

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold text-white">Student Enrollment</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              <Plus size={20} />
              Add Student
            </button>
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 bg-blue-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-900 transition-colors"
            >
              <Download size={20} />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or handle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Ratings</option>
              <option value="beginner">Newbie (&lt;1200)</option>
              <option value="pupil">Pupil (1200-1399)</option>
              <option value="specialist">Specialist (1400-1599)</option>
              <option value="expert">Expert (1600+)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">CF Handle</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Current Rating</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Max Rating</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{student.name || 'N/A'}</div>
                  <div className="text-sm text-gray-500">
                    Enrolled: {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{student.email || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{student.phoneNumber || 'N/A'}</td>
                <td className="px-6 py-4">
                  <span className="font-mono text-sm font-medium text-blue-600">
                    {student.codeforcesHandle || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className={`font-semibold ${getRatingColor(student.currentRating)}`}>
                    {student.currentRating || 'Unrated'}
                  </div>
                  <div className="text-xs text-gray-500">{getRatingTitle(student.currentRating)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className={`font-semibold ${getRatingColor(student.maxRating)}`}>
                    {student.maxRating || 'Unrated'}
                  </div>
                  <div className="text-xs text-gray-500">{getRatingTitle(student.maxRating)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetails(student)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(student)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                      title="Edit Student"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteStudent(student._id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete Student"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No students found</div>
            <div className="text-gray-400 text-sm mt-1">
              {searchTerm || ratingFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Add your first student to get started'}
            </div>
          </div>
        )}
      </div>

      {/* Statistics Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          <span>Total Students: <strong className="text-gray-900">{students.length}</strong></span>
          <span>Showing: <strong className="text-gray-900">{filteredStudents.length}</strong></span>
          <span>Average Rating: <strong className="text-gray-900">
            {students.length > 0 ? Math.round(students.reduce((sum, s) => sum + (s.currentRating || 0), 0) / students.length) : 0}
          </strong></span>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <StudentModal
          student={editingStudent}
          onSave={editingStudent ? 
            (data) => onEditStudent(editingStudent._id, data) : 
            onAddStudent}
          onClose={handleModalClose}
        />
      )}

      {isDetailsModalOpen && selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={handleDetailsModalClose}
          onUpdate={handleStudentUpdate}
        />
      )}
    </div>
  );
};

export default StudentTable;