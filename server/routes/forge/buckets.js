import express from 'express';

import { getToken2, getBuckets, getSupportedFormats } from '../../controllers/forge/buckets.js';

const router = express.Router();

// ROUTE /api/forge
router.get('/getToken', getToken2);
router.get('/buckets', getBuckets);
router.get('/supportedFormats', getSupportedFormats);

export default router;
