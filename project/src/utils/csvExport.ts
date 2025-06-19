import { Student } from '../types/Student';

export const exportToCSV = (data: Student[], filename: string): void => {
  const headers = [
    'Name',
    'Email',
    'Phone Number',
    'Codeforces Handle',
    'Current Rating',
    'Max Rating',
    'Enrollment Date',
    'Total Contests'
  ];

  const csvContent = [
    headers.join(','),
    ...data.map(student => [
      `"${student.name}"`,
      `"${student.email}"`,
      `"${student.phoneNumber}"`,
      `"${student.codeforcesHandle}"`,
      student.currentRating,
      student.maxRating,
      `"${student.enrollmentDate}"`,
      student.totalContests
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};