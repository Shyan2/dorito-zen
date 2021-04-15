import express from 'express';

import {
  getGoogleUrl,
  googleCallbackRoute,
  googleLogout,
  isAuthorized,
  getUserProfile,
  getGDrive,
} from '../../controllers/google.js';

import {
  sendToTranslationRoute,
  isTranslated,
  uploadAndTranslate,
} from '../../controllers/forgeGoogle.js';

const router = express.Router();

// ROUTE /api/google
router.get('/oauth/url', getGoogleUrl);
router.get('/callback/oauth', googleCallbackRoute);
router.get('/logout', googleLogout);
router.get('/isAuthorized', isAuthorized);
router.get('/profile', getUserProfile);
router.get('/gdrive', getGDrive);

router.post('/sendToTranslation', sendToTranslationRoute);
router.post('/isTranslated', isTranslated);
router.post('/uploadAndTranslate', uploadAndTranslate);

export default router;
