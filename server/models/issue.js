import mongoose from 'mongoose';

const issueSchema = mongoose.Schema({
  id: String,
  project: String,
  title: String,
  description: String,
  creator: String,
  comments: [String],
  selectedFile: String,
  assignedTo: String,
  status: String,
  priority: String,
  xpos: Number,
  ypos: Number,
  zpos: Number,
  tags: [String],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model('Issue', issueSchema);
