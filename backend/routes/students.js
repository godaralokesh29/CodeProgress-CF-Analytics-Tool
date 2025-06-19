import express from 'express';
import Student from '../models/Student.js';
import CodeforcesData from '../models/CodeforcesData.js';
import { fetchAndStoreCFData } from '../services/codeforcesService.js';

const router = express.Router();

// Get all students with CF data
router.get('/', async (req, res) => {
  const students = await Student.find().lean();
  const data = await Promise.all(
    students.map(async (student) => {
      const cfData = await CodeforcesData.findOne({ student: student._id });
      return {
        ...student,
        codeforces: cfData,
        lastUpdated: cfData?.lastUpdated,
      };
    })
  );
  res.json(data);
});

// Add a student
router.post('/', async (req, res) => {
  const student = await Student.create(req.body);
  await fetchAndStoreCFData(student);
  res.json(student);
});

// Edit student (fetch CF data if handle changed)
router.put('/:id', async (req, res) => {
  const student = await Student.findById(req.params.id);
  const oldHandle = student.codeforcesHandle;
  Object.assign(student, req.body);
  await student.save();
  if (oldHandle !== req.body.codeforcesHandle) {
    await fetchAndStoreCFData(student);
  }
  res.json(student);
});

// Delete student
router.delete('/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  await CodeforcesData.deleteOne({ student: req.params.id });
  res.json({ success: true });
});

// Get student details (profile view)
router.get('/:id', async (req, res) => {
  const student = await Student.findById(req.params.id);
  const cfData = await CodeforcesData.findOne({ student: student._id });
  res.json({ ...student.toObject(), codeforces: cfData });
});

// Get Codeforces data by handle
router.get('/codeforces/:handle', async (req, res) => {
  try {
    const student = await Student.findOne({ codeforcesHandle: req.params.handle });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const cfData = await CodeforcesData.findOne({ student: student._id });
    res.json(cfData);
  } catch (err) {
    console.error('Error fetching Codeforces data:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Sync Codeforces data for a student by ID
router.post('/:id/sync-codeforces', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    await fetchAndStoreCFData(student);
    const cfData = await CodeforcesData.findOne({ student: student._id });

    res.json({ ...student.toObject(), codeforces: cfData });
  } catch (err) {
    console.error('Error syncing Codeforces data:', err);
    res.status(500).json({ error: 'Failed to sync data' });
  }
});


export default router;
