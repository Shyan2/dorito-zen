import express from 'express';

import { getToken2, getBuckets } from '../../controllers/forge/buckets.js';

const router = express.Router();
router.get('/getToken', getToken2);
router.get('/buckets', getBuckets);

export default router;
