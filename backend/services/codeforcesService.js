import axios from 'axios';
import CodeforcesData from '../models/CodeforcesData.js';

export async function fetchAndStoreCFData(student) {
  try {
    const handle = student.codeforcesHandle;

    // Fetch user info
    const userRes = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
    const user = userRes.data.result[0];

    // Fetch rating history
    const ratingRes = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
    const contestHistory = ratingRes.data.result;

    // Fetch submissions
    const subRes = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`);
    const submissions = subRes.data.result;

    // Calculate problem stats
    const solvedProblems = new Set();
    let maxRating = 0, totalRating = 0, ratedCount = 0;
    let mostDifficult = null;

    submissions.forEach(sub => {
      if (sub.verdict === 'OK') {
        const key = `${sub.problem.contestId}-${sub.problem.index}`;
        solvedProblems.add(key);
        if (sub.problem.rating && (!mostDifficult || sub.problem.rating > mostDifficult.rating)) {
          mostDifficult = sub.problem;
        }
      }
    });

    contestHistory.forEach(c => {
      if (c.newRating > maxRating) maxRating = c.newRating;
      totalRating += c.newRating;
      ratedCount++;
    });

    await CodeforcesData.findOneAndUpdate(
      { student: student._id },
      {
        currentRating: user.rating,
        maxRating,
        contestHistory,
        problemStats: {
          totalSolved: solvedProblems.size,
          avgRating: ratedCount ? Math.round(totalRating / ratedCount) : 0,
          mostDifficult,
        },
        lastUpdated: new Date(),
      },
      { upsert: true }
    );

  } catch (err) {
    console.error(`Failed to fetch CF data for ${student.codeforcesHandle}:`, err.message);
  }
}
