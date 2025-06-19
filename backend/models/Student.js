import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: String,
  codeforcesHandle: String,
});

const Student = mongoose.model('Student', StudentSchema);
export default Student;
