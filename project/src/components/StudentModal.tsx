import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Phone, Code } from 'lucide-react';
import { Student, Contest, ProblemSolvingData } from '../types/Student';

interface StudentModalProps {
  student: Student | null;
  onSave: (student: Omit<Student, '_id'>) => void;
  onClose: () => void;
}

const StudentModal: React.FC<StudentModalProps> = ({ student, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Student, '_id'>>({
    name: '',
    email: '',
    phoneNumber: '',
    codeforcesHandle: '',
    currentRating: 0,
    maxRating: 0,
    enrollmentDate: new Date().toISOString().split('T')[0],
    totalContests: 0,
    recentContests: [] as Contest[],
    problemSolvingData: {
      submissions: [],
      solvedProblems: [],
      dailyActivity: []
    } as ProblemSolvingData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        phoneNumber: student.phoneNumber,
        codeforcesHandle: student.codeforcesHandle,
        currentRating: student.currentRating,
        maxRating: student.maxRating,
        enrollmentDate: student.enrollmentDate,
        totalContests: student.totalContests,
        recentContests: student.recentContests,
        problemSolvingData: student.problemSolvingData
      });
    }
  }, [student]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (!formData.codeforcesHandle.trim()) {
      newErrors.codeforcesHandle = 'Codeforces handle is required';
    }

    if (formData.currentRating < 0) {
      newErrors.currentRating = 'Current rating cannot be negative';
    }

    if (formData.maxRating < formData.currentRating) {
      newErrors.maxRating = 'Max rating cannot be less than current rating';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSave(formData);
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between text-white">
          <h3 className="text-xl font-semibold">
            {student ? 'Edit Student' : 'Add New Student'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter full name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} className="inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone size={10} className="inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter phone number"
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
            </div>

            {/* Codeforces Handle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Code size={16} className="inline mr-2" />
                Codeforces Handle
              </label>
              <input
                type="text"
                value={formData.codeforcesHandle}
                onChange={(e) => handleInputChange('codeforcesHandle', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono ${
                  errors.codeforcesHandle ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="CF username"
              />
              {errors.codeforcesHandle && <p className="text-red-500 text-sm mt-1">{errors.codeforcesHandle}</p>}
            </div>

            {/* Current Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Rating
              </label>
              <input
                type="number"
                value={formData.currentRating}
                onChange={(e) => handleInputChange('currentRating', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.currentRating ? 'border-red-500' : 'border-gray-300'
                }`}
                min="0"
                max="4000"
              />
              {errors.currentRating && <p className="text-red-500 text-sm mt-1">{errors.currentRating}</p>}
            </div>

            {/* Max Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Rating
              </label>
              <input
                type="number"
                value={formData.maxRating}
                onChange={(e) => handleInputChange('maxRating', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.maxRating ? 'border-red-500' : 'border-gray-300'
                }`}
                min="0"
                max="4000"
              />
              {errors.maxRating && <p className="text-red-500 text-sm mt-1">{errors.maxRating}</p>}
            </div>
          </div>

          {/* Enrollment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enrollment Date
            </label>
            <input
              type="date"
              value={formData.enrollmentDate}
              onChange={(e) => handleInputChange('enrollmentDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {isLoading ? 'Saving...' : (student ? 'Update Student' : 'Add Student')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;