import React, { useState, useEffect } from 'react';
import { 
  fetchStudentsWithReminders, 
  toggleEmailReminders, 
  resetReminderCount, 
  checkRemindersNow, 
  getEmailConfigStatus 
} from '../utils/api';
import { Student } from '../types/Student';

interface ReminderStats {
  emailRemindersEnabled: boolean;
  reminderEmailCount: number;
  lastReminderSent: string | null;
  lastSubmissionDate: string | null;
}

const ReminderManagementSection: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailConfigStatus, setEmailConfigStatus] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [reminderStats, setReminderStats] = useState<ReminderStats | null>(null);
  const [checkingReminders, setCheckingReminders] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsData, configStatus] = await Promise.all([
        fetchStudentsWithReminders(),
        getEmailConfigStatus()
      ]);
      setStudents(studentsData);
      setEmailConfigStatus(configStatus);
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage({ type: 'error', text: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleReminders = async (studentId: string, enabled: boolean) => {
    try {
      await toggleEmailReminders(studentId, enabled);
      setMessage({ 
        type: 'success', 
        text: `Email reminders ${enabled ? 'enabled' : 'disabled'} successfully` 
      });
      loadData(); // Refresh data
    } catch (error) {
      console.error('Error toggling reminders:', error);
      setMessage({ type: 'error', text: 'Failed to toggle email reminders' });
    }
  };

  const handleResetCount = async (studentId: string) => {
    try {
      await resetReminderCount(studentId);
      setMessage({ type: 'success', text: 'Reminder count reset successfully' });
      loadData(); // Refresh data
    } catch (error) {
      console.error('Error resetting count:', error);
      setMessage({ type: 'error', text: 'Failed to reset reminder count' });
    }
  };

  const handleCheckRemindersNow = async () => {
    try {
      setCheckingReminders(true);
      const result = await checkRemindersNow();
      setMessage({ 
        type: 'success', 
        text: `Reminder check completed: ${result.result.sent} sent, ${result.result.errors} errors` 
      });
      loadData(); // Refresh data
    } catch (error) {
      console.error('Error checking reminders:', error);
      setMessage({ type: 'error', text: 'Failed to check reminders' });
    } finally {
      setCheckingReminders(false);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (isInactive: boolean, remindersEnabled: boolean) => {
    if (!remindersEnabled) return 'text-gray-500';
    return isInactive ? 'text-red-600' : 'text-green-600';
  };

  const getStatusText = (isInactive: boolean, remindersEnabled: boolean) => {
    if (!remindersEnabled) return 'Reminders Disabled';
    return isInactive ? 'Inactive (7+ days)' : 'Active';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Email Reminder Management</h2>
        <button
          onClick={handleCheckRemindersNow}
          disabled={checkingReminders || !emailConfigStatus?.emailConfigured}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          {checkingReminders ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Checking...
            </>
          ) : (
            'Check Reminders Now'
          )}
        </button>
      </div>

      {/* Email Configuration Status */}
      <div className={`p-4 rounded-lg mb-6 ${
        emailConfigStatus?.emailConfigured 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            emailConfigStatus?.emailConfigured ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="font-medium">
            {emailConfigStatus?.emailConfigured ? 'Email Configured' : 'Email Not Configured'}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{emailConfigStatus?.message}</p>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </p>
        </div>
      )}

      {/* Students Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Submission
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reminders Sent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Reminder
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">{student.email}</div>
                    <div className="text-sm text-gray-500">@{student.codeforcesHandle}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getStatusColor(student.isInactive || false, student.emailRemindersEnabled || true)}`}>
                    {getStatusText(student.isInactive || false, student.emailRemindersEnabled || true)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.daysSinceLastSubmission !== null 
                    ? `${student.daysSinceLastSubmission} days ago`
                    : 'No submissions'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.reminderEmailCount || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(student.lastReminderSent)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleReminders(student._id, !(student.emailRemindersEnabled ?? true))}
                      className={`px-3 py-1 rounded text-xs ${
                        student.emailRemindersEnabled 
                          ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {student.emailRemindersEnabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleResetCount(student._id)}
                      className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-3 py-1 rounded text-xs"
                    >
                      Reset Count
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {students.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No students found
        </div>
      )}
    </div>
  );
};

export default ReminderManagementSection; 