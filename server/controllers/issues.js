import mongoose from 'mongoose';
import Issue from '../models/issue.js';

export const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find();

    res.status(200).json(issues);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createIssue = async (req, res) => {
  const issue = req.body;
  console.log(issue);
  const newIssue = new Issue({
    ...issue,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newIssue.save();

    res.status(201).json(newIssue);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const deleteIssue = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No issue with that id');

  await Issue.findByIdAndRemove(id);

  res.json({ message: 'Issue has been deleted' });
};

export const commentIssue = async (req, res) => {};
