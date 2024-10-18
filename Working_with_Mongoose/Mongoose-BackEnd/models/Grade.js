import mongoose from 'mongoose';

const GradeSchema = new mongoose.Schema({
  learner_id: { type: Number, required: true },
  class_id: { type: Number, required: true },
  scores: [
    {
      type: { type: String, enum: ['quiz', 'exam', 'homework'], required: true },
      score: { type: Number, required: true },
    },
  ],
});

const Grade = mongoose.model('Grade', GradeSchema);
export default Grade;
