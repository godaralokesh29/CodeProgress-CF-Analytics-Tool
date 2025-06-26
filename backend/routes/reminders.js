import express from 'express';
import Student from '../models/Student.js';
import { getReminderStats, checkAndSendReminders } from '../services/reminderService.js';
import { validateEmailConfig } from '../services/emailService.js';

const router = express.Router();

// Get reminder statistics for a specific student
router.get('/stats/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const stats = await getReminderStats(studentId);
    
    if (!stats) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting reminder stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle email reminders for a student
router.patch('/toggle/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { enabled } = req.body;
    
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ error: 'enabled field must be a boolean' });
    }
    
    const student = await Student.findByIdAndUpdate(
      studentId,
      { emailRemindersEnabled: enabled },
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({
      message: `Email reminders ${enabled ? 'enabled' : 'disabled'} for ${student.name}`,
      emailRemindersEnabled: student.emailRemindersEnabled
    });
  } catch (error) {
    console.error('Error toggling email reminders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset reminder count for a student
router.post('/reset-count/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const student = await Student.findByIdAndUpdate(
      studentId,
      { 
        reminderEmailCount: 0,
        lastReminderSent: null
      },
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({
      message: `Reminder count reset for ${student.name}`,
      reminderEmailCount: student.reminderEmailCount,
      lastReminderSent: student.lastReminderSent
    });
  } catch (error) {
    console.error('Error resetting reminder count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Manually trigger reminder check (for testing/admin purposes)
router.post('/check-now', async (req, res) => {
  try {
    // Check if email is configured
    if (!validateEmailConfig()) {
      return res.status(400).json({ 
        error: 'Email configuration not found',
        message: 'Please configure EMAIL_USER and EMAIL_PASS environment variables'
      });
    }
    
    console.log('Manual reminder check triggered');
    const result = await checkAndSendReminders();
    
    res.json({
      message: 'Reminder check completed',
      result
    });
  } catch (error) {
    console.error('Error in manual reminder check:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get email configuration status
router.get('/email-config', (req, res) => {
  const isConfigured = validateEmailConfig();
  res.json({
    emailConfigured: isConfigured,
    message: isConfigured 
      ? 'Email is properly configured' 
      : 'Email configuration missing. Set EMAIL_USER and EMAIL_PASS environment variables.'
  });
});

// Get all students with their reminder settings
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find({}, {
      name: 1,
      email: 1,
      codeforcesHandle: 1,
      emailRemindersEnabled: 1,
      reminderEmailCount: 1,
      lastReminderSent: 1,
      lastSubmissionDate: 1
    });
    
    // Calculate days since last submission for each student
    const studentsWithActivity = students.map(student => {
      const studentObj = student.toObject();
      const now = new Date();
      
      if (student.lastSubmissionDate) {
        const daysSinceSubmission = Math.floor(
          (now - new Date(student.lastSubmissionDate)) / (1000 * 60 * 60 * 24)
        );
        studentObj.daysSinceLastSubmission = daysSinceSubmission;
        studentObj.isInactive = daysSinceSubmission >= 7;
      } else {
        studentObj.daysSinceLastSubmission = null;
        studentObj.isInactive = true;
      }
      
      return studentObj;
    });
    
    res.json(studentsWithActivity);
  } catch (error) {
    console.error('Error getting students with reminder settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 