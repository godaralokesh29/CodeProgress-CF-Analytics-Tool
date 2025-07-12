import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  name: String,
  codeforcesHandle: String,
  // Email reminder settings
  emailRemindersEnabled: {
    type: Boolean,
    default: true
  },
  reminderEmailCount: {
    type: Number,
    default: 0
  },
  lastReminderSent: {
    type: Date,
    default: null
  },
  lastSubmissionDate: {
    type: Date,
    default: null
  }
});

const Student = mongoose.model('Student', StudentSchema);
export default Student;
