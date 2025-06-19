import express from 'express';

const router = express.Router();

let currentCronJob = null;
let cronUpdateHandler = null;

router.post('/set', (req, res) => {
  const { schedule } = req.body;
  if (!schedule) {
    return res.status(400).json({ error: 'Schedule is required' });
  }

  try {
    if (cronUpdateHandler) {
      cronUpdateHandler(schedule);
    }
    res.json({ message: 'Cron schedule updated', schedule });
  } catch (err) {
    res.status(400).json({ error: 'Invalid schedule format' });
  }
});

router.get('/current', (req, res) => {
  res.json({ schedule: currentCronJob?.options?.schedule || '0 2 * * *' });
});

// ✅ ES module exports
export { router, setCronHandlers };

function setCronHandlers(updateFn, cronInstance) {
  cronUpdateHandler = updateFn;
  currentCronJob = cronInstance;
}
