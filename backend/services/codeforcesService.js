import axios from 'axios';
import CodeforcesData from '../models/CodeforcesData.js';
import { updateLastSubmissionDate } from './reminderService.js';

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

    // Calculate problem stats and detailed solving data
    const solvedProblemsSet = new Set(); 
    let maxRating = 0; 
    let mostDifficult = null; 
    let latestSubmissionDate = null;

    const problemsSolvedInContest = {}; 
    const problemsAttemptedInContest = {};
    
    const uniqueSolvedProblems = {}; 
    const dailyActivity = {}; 

    submissions.forEach(sub => {
      const submissionTime = new Date(sub.creationTimeSeconds * 1000);
      const dateStr = submissionTime.toISOString().split('T')[0];
      const key = `${sub.problem.contestId}-${sub.problem.index}`;

      // Track the latest submission date
      if (!latestSubmissionDate || submissionTime > latestSubmissionDate) {
        latestSubmissionDate = submissionTime;
      }

      if (sub.contestId && sub.author.participantType === 'CONTESTANT') {
        const contestIdStr = String(sub.contestId);
        if (!problemsAttemptedInContest[contestIdStr]) {
          problemsAttemptedInContest[contestIdStr] = new Set();
        }
        problemsAttemptedInContest[contestIdStr].add(sub.problem.index);
      }

      if (!dailyActivity[dateStr]) {
        dailyActivity[dateStr] = { date: dateStr, submissions: 0, problemsSolved: 0 };
      }
      dailyActivity[dateStr].submissions++;

      if (sub.verdict === 'OK') {
        
        if (!solvedProblemsSet.has(key)) {
            dailyActivity[dateStr].problemsSolved++;
        }
        
        if (!uniqueSolvedProblems[key] || new Date(uniqueSolvedProblems[key].solvedAt) > submissionTime) {
          uniqueSolvedProblems[key] = {
            rating: sub.problem.rating,
            name: sub.problem.name,
            solvedAt: submissionTime,
            tags: sub.problem.tags,
            contestId: sub.problem.contestId,
            index: sub.problem.index,
          };
        }
        
        solvedProblemsSet.add(key);
        
        if (sub.problem.rating && (!mostDifficult || sub.problem.rating > mostDifficult.rating)) {
          mostDifficult = sub.problem;
        }

        if (sub.author.participantType === 'CONTESTANT') {
            const contestIdStr = String(sub.contestId);
            if (!problemsSolvedInContest[contestIdStr]) {
              problemsSolvedInContest[contestIdStr] = new Set();
            }
            problemsSolvedInContest[contestIdStr].add(sub.problem.index);
        }
      }
    });

    // Update the student's last submission date
    if (latestSubmissionDate) {
      await updateLastSubmissionDate(student._id, latestSubmissionDate);
    }

    const problemSolvingData = {
        solvedProblems: Object.values(uniqueSolvedProblems),
        dailyActivity: Object.values(dailyActivity),
        totalSubmissions: submissions.length,
    };
    
    const solvedWithRating = Object.values(uniqueSolvedProblems).filter(p => p.rating);
    const avgProblemRating = solvedWithRating.length 
      ? Math.round(solvedWithRating.reduce((sum, p) => sum + p.rating, 0) / solvedWithRating.length)
      : 0;

    contestHistory.forEach(c => {
      if (c.newRating > maxRating) maxRating = c.newRating;
    });

    // Enhance contest history with solved problems data
    const enhancedContestHistory = contestHistory.map(contest => {
      const contestIdStr = String(contest.contestId);
      const problemsSolved = problemsSolvedInContest[contestIdStr]?.size || 0;
      const totalProblems = problemsAttemptedInContest[contestIdStr]?.size || 0;

      return {
        ...contest,
        problemsSolved,
        totalProblems,
      };
    });

    // Calculate avgRatingChange
    let totalRatingChange = 0;
    let ratingChangeCount = 0;
    let problemsSolvedInContests = 0;
    enhancedContestHistory.forEach(c => {
      if (typeof c.oldRating === 'number' && typeof c.newRating === 'number') {
        totalRatingChange += (c.newRating - c.oldRating);
        ratingChangeCount++;
      }
      if (typeof c.problemsSolved === 'number') {
        problemsSolvedInContests += c.problemsSolved;
      }
    });
    const avgRatingChange = ratingChangeCount > 0 ? Math.round(totalRatingChange / ratingChangeCount) : 0;
    // Fallback for problemsSolved if not present in contestHistory
    const problemsSolved = problemsSolvedInContests > 0 ? problemsSolvedInContests : solvedProblemsSet.size;

    await CodeforcesData.findOneAndUpdate(
      { student: student._id },
      {
        currentRating: user.rating,
        maxRating,
        contestHistory: enhancedContestHistory,
        problemStats: {
          totalSolved: solvedProblemsSet.size,
          avgRating: avgProblemRating,
          mostDifficult,
        },
        problemSolvingData,
        avgRatingChange: isNaN(avgRatingChange) ? 0 : avgRatingChange,
        problemsSolved: isNaN(problemsSolved) ? 0 : problemsSolved,
        lastUpdated: new Date(),
      },
      { upsert: true }
    );

  } catch (err) {
    console.error(`Failed to fetch CF data for ${student.codeforcesHandle}:`, err.message);
  }
}
