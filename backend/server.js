import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cron from 'node-cron';
import cors from 'cors';

import Student from './models/Student.js';
import { fetchAndStoreCFData } from './services/codeforcesService.js';
import { checkAndSendReminders } from './services/reminderService.js';
import { router as cronRouter, setCronHandlers } from './routes/cron.js';
import studentsRouter from './routes/students.js';
import reminderRouter from './routes/reminders.js';

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://codesources.vercel.app'], // add your frontend's URL here
  credentials: true // if you use cookies or authentication
}));

// MongoDB connection with error handling
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tle', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

// Cron job setup
let cronSchedule = '0 2 * * *'; // Default: 2 AM
let cfCron = cron.schedule(cronSchedule, async () => {
  console.log(`Running Codeforces data sync at ${new Date().toISOString()}`);
  try {
    const students = await Student.find();
    console.log(`Found ${students.length} students to update`);
    for (const student of students) {
      try {
        await fetchAndStoreCFData(student);
        console.log(`Updated data for ${student.codeforcesHandle}`);
      } catch (err) {
        console.error(`Failed to update data for ${student.codeforcesHandle}:`, err.message);
      }
    }
    console.log('Codeforces data sync completed');
    
    // Check and send reminders after data sync
    console.log('Checking for inactive students and sending reminders...');
    const reminderResult = await checkAndSendReminders();
    console.log('Reminder check completed:', reminderResult);
    
  } catch (err) {
    console.error('Error in cron job:', err.message);
  }
});

// Cron job updater
const updateCronJob = (schedule) => {
  if (cfCron) cfCron.stop();
  cfCron = cron.schedule(schedule, async () => {
    console.log(`Running Codeforces data sync with new schedule: ${schedule}`);
    try {
      const students = await Student.find();
      for (const student of students) {
        await fetchAndStoreCFData(student);
      }
      console.log('Codeforces data sync completed');
      
      // Check and send reminders after data sync
      console.log('Checking for inactive students and sending reminders...');
      const reminderResult = await checkAndSendReminders();
      console.log('Reminder check completed:', reminderResult);
      
    } catch (err) {
      console.error('Error in cron job:', err.message);
    }
  });
};

// Register cron handlers
setCronHandlers(updateCronJob, cfCron);

// Routes
app.use('/settings/cron', cronRouter);
app.use('/students', studentsRouter);
app.use('/reminders', reminderRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  try {
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  } catch {
    res.status(500).end();
  }
});

// Uncaught exceptions and rejections
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Codeforces data sync scheduled for: ${cronSchedule}`);
});
