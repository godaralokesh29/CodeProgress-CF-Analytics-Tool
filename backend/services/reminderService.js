import Student from '../models/Student.js';
import { sendReminderEmail, validateEmailConfig } from './emailService.js';

// Check for inactive students and send reminders
export const checkAndSendReminders = async () => {
  try {
    // Check if email is configured
    if (!validateEmailConfig()) {
      console.log('Email configuration not found. Skipping reminder emails.');
      return { sent: 0, errors: 0, skipped: 0 };
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Find students who haven't submitted in 7 days and have email reminders enabled
    const inactiveStudents = await Student.find({
      emailRemindersEnabled: true,
      email: { $exists: true, $ne: '' },
      $or: [
        { lastSubmissionDate: { $lt: sevenDaysAgo } },
        { lastSubmissionDate: null }
      ]
    });

    console.log(`Found ${inactiveStudents.length} inactive students eligible for reminders`);

    let sentCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const student of inactiveStudents) {
      try {
        // Check if we should send a reminder (avoid sending too frequently)
        const lastReminder = student.lastReminderSent;
        const shouldSend = !lastReminder || 
          (new Date() - new Date(lastReminder)) > (24 * 60 * 60 * 1000); // 24 hours

        if (shouldSend) {
          const emailSent = await sendReminderEmail(student);
          
          if (emailSent) {
            // Update student record
            await Student.findByIdAndUpdate(student._id, {
              $inc: { reminderEmailCount: 1 },
              lastReminderSent: new Date()
            });
            sentCount++;
            console.log(`Reminder sent to ${student.name} (${student.email})`);
          } else {
            errorCount++;
            console.log(`Failed to send reminder to ${student.name} (${student.email})`);
          }
        } else {
          skippedCount++;
          console.log(`Skipping reminder for ${student.name} - last reminder sent recently`);
        }
      } catch (error) {
        errorCount++;
        console.error(`Error processing reminder for ${student.name}:`, error.message);
      }
    }

    console.log(`Reminder summary: ${sentCount} sent, ${errorCount} errors, ${skippedCount} skipped`);
    return { sent: sentCount, errors: errorCount, skipped: skippedCount };

  } catch (error) {
    console.error('Error in checkAndSendReminders:', error.message);
    return { sent: 0, errors: 0, skipped: 0 };
  }
};

// Update last submission date for a student
export const updateLastSubmissionDate = async (studentId, submissionDate) => {
  try {
    await Student.findByIdAndUpdate(studentId, {
      lastSubmissionDate: submissionDate
    });
  } catch (error) {
    console.error(`Error updating last submission date for student ${studentId}:`, error.message);
  }
};

// Get reminder statistics for a student
export const getReminderStats = async (studentId) => {
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return null;
    }

    return {
      emailRemindersEnabled: student.emailRemindersEnabled,
      reminderEmailCount: student.reminderEmailCount,
      lastReminderSent: student.lastReminderSent,
      lastSubmissionDate: student.lastSubmissionDate
    };
  } catch (error) {
    console.error(`Error getting reminder stats for student ${studentId}:`, error.message);
    return null;
  }
}; 