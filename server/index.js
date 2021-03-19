import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieSession from 'cookie-session';

import userRoutes from './routes/users.js';
import bucketRoutes from './routes/forge/buckets.js';
import bim360Routes from './routes/forge/bim360.js';

const app = express();
dotenv.config();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

app.set('trust proxy', 1);
app.use(
  cookieSession({
    // secure: true, // 'false' for Heroku (true?)
    // sameSite: 'none', // 'none' for Heroku
    name: 'forge_session',
    keys: ['forge_secure_key'],
    resave: false,
    saveUninitialized: false,
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days, same as refresh token
  })
);

app.use('/user', userRoutes);
app.use('/api/forge', bucketRoutes);
app.use('/api/forge', bim360Routes);

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

const PORT = process.env.PORT || 9001;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));

mongoose.set('useFindAndModify', false);
