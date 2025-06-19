import mongoose from 'mongoose';

const CodeforcesDataSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  currentRating: Number,
  maxRating: Number,
  contestHistory: Array, // [{ contestId, contestName, rank, oldRating, newRating, ratingUpdateTimeSeconds }]
  problemStats: Object,  // { totalSolved, avgRating, mostDifficult, ... }
  lastUpdated: Date,
});

const CodeforcesData = mongoose.model('CodeforcesData', CodeforcesDataSchema);
export default CodeforcesData;
