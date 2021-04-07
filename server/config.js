import dotenv from 'dotenv';
dotenv.config();

export const config = {
  // Set environment variables or hard-code here
  credentials: {
    client_id: process.env.FORGE_CLIENT_ID,
    client_secret: process.env.FORGE_CLIENT_SECRET,
    callback_url: process.env.FORGE_CALLBACK_URL,
  },
  scopes: {
    // Required scopes for the server-side application
    internal: [
      'bucket:create',
      'bucket:read',
      'data:read',
      'data:create',
      'data:write',
      'account:read',
    ],
    // Required scope for the client-side viewer
    public: ['data:read'],
  },
  google: {
    callback_url: process.env.GOOGLE_CALLBACK_URL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
  },
};
