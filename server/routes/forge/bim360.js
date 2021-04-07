import express from 'express';

import {
  forgeCallbackRoute,
  getUrl,
  logout,
  getUserProfile,
  listProjects,
} from '../../controllers/forge/bim360.js';

const router = express.Router();

// ROUTE /api/forge
router.get('/callback/oauth', forgeCallbackRoute);
router.get('/oauth/url', getUrl);
router.get('/oauth/logout', logout);
router.get('/user/profile', getUserProfile);
router.get('/listProjects', listProjects);

export default router;
