import express from 'express';

import { getIssues, createIssue, deleteIssue, commentIssue } from '../../controllers/issues.js';

const router = express.Router();

// ROUTE /issues/
router.get('/', getIssues);
router.post('/', createIssue);
router.delete('/:id', deleteIssue);
router.patch('/comment', commentIssue);

export default router;
