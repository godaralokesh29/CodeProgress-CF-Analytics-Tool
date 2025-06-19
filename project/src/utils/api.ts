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
