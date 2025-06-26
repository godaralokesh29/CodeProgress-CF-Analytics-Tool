import { Student } from '../types/Student';

const API_BASE = 'http://localhost:3001'; // Change if your backend runs elsewhere

export async function fetchStudents(): Promise<Student[]> {
  const res = await fetch(`${API_BASE}/students`);
  if (!res.ok) throw new Error('Failed to fetch students');
  return res.json();
}

export async function addStudent(student: Omit<Student, '_id'>): Promise<Student> {
  const res = await fetch(`${API_BASE}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  });
  if (!res.ok) throw new Error('Failed to add student');
  return res.json();
}

export async function editStudent(_id: string, student: Omit<Student, '_id'>): Promise<Student> {
  const res = await fetch(`${API_BASE}/students/${_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  });
  if (!res.ok) throw new Error('Failed to edit student');
  return res.json();
}

export async function deleteStudent(_id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/students/${_id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete student');
}

// Reminder-related API functions
export async function fetchStudentsWithReminders(): Promise<Student[]> {
  const res = await fetch(`${API_BASE}/reminders/students`);
  if (!res.ok) throw new Error('Failed to fetch students with reminders');
  return res.json();
}

export async function getReminderStats(studentId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/reminders/stats/${studentId}`);
  if (!res.ok) throw new Error('Failed to fetch reminder stats');
  return res.json();
}

export async function toggleEmailReminders(studentId: string, enabled: boolean): Promise<any> {
  const res = await fetch(`${API_BASE}/reminders/toggle/${studentId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled }),
  });
  if (!res.ok) throw new Error('Failed to toggle email reminders');
  return res.json();
}

export async function resetReminderCount(studentId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/reminders/reset-count/${studentId}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to reset reminder count');
  return res.json();
}

export async function checkRemindersNow(): Promise<any> {
  const res = await fetch(`${API_BASE}/reminders/check-now`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to check reminders');
  return res.json();
}

export async function getEmailConfigStatus(): Promise<any> {
  const res = await fetch(`${API_BASE}/reminders/email-config`);
  if (!res.ok) throw new Error('Failed to fetch email config status');
  return res.json();
}
