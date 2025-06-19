import React, { useState, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import StudentTable from './components/StudentTable';
import { Student } from './types/Student';
import * as api from './utils/api';

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.fetchStudents()
      .then(setStudents)
      .catch(err => alert(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAddStudent = async (studentData: Omit<Student, '_id'>) => {
    const newStudent = await api.addStudent(studentData);
    setStudents(prev => [...prev, newStudent]);
  };

  const handleEditStudent = async (_id: string, studentData: Omit<Student, '_id'> | Student) => {
    let updated: Student;
  
    if ('_id' in studentData) {
      // Already updated from backend (like from sync)
      updated = studentData as Student;
    } else {
      // Call backend to update
      updated = await api.editStudent(_id, studentData as Omit<Student, '_id'>);
    }
  
    // Update local state
    setStudents(prev => prev.map(s => s._id === _id ? updated : s));
  };
  
  const handleDeleteStudent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      await api.deleteStudent(id);
      setStudents(prev => prev.filter(s => s._id !== id));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                TLE Eliminators
              </h1>
              <p className="text-gray-600 text-sm">
                Track and manage student progress in competitive programming
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StudentTable
          students={students}
          onAddStudent={handleAddStudent}
          onEditStudent={handleEditStudent}
          onDeleteStudent={handleDeleteStudent}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2025 TLE Eliminators. Built for tracking student progress.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;