import { OAuth } from './oauth.js';
import { config } from '../config.js';

import { google } from 'googleapis';
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(
  config.google.client_id,
  config.google.client_secret,
  config.google.callback_url
);

export const getGoogleUrl = async (req, res) => {
  var scopes = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/spreadsheets.readonly',
  ];

  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
    scope: scopes, // If you only need one scope you can pass it as string
  });
  res.end(url);
};

export const googleCallbackRoute = async (req, res) => {
  var code = req.query.code;

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const oauth = new OAuth(req.session);
  oauth.setGoogleToken(tokens.access_token);

  res.redirect('http://localhost:3000/gdrive');
};

export const googleLogout = async (req, res) => {
  req.session = null;
  res.redirect('http://localhost:3000');
};

export const isAuthorized = async (req, res) => {
  var tokenSession = new OAuth(req.session);
  res.end(tokenSession.isGoogleAuthorized() ? 'true' : 'false');
};

export const getUserProfile = async (req, res) => {
  try {
    console.log('getUserProfile function entered!');

    const tokenSession = new OAuth(req.session);

    oauth2Client.setCredentials({
      access_token: tokenSession.getGoogleToken(),
    });

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });

    const userinfo = await oauth2.userinfo.get();
    console.log(userinfo.data);

    const returnObject = {
      fullName: userinfo.data.name,
      firstName: userinfo.data.given_name,
      lastName: userinfo.data.family_name,
      email: userinfo.data.email,
      picture: userinfo.data.picture,
    };
    res.status(200).json(returnObject);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

export const getGDrive = async (req, res) => {
  var tokenSession = new OAuth(req.session);
  if (!tokenSession.isGoogleAuthorized()) {
    res.status(401).end('Please Google login first');
    return;
  }

  oauth2Client.setCredentials({
    access_token: tokenSession.getGoogleToken(),
  });
  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  // var folderId = '#';
  var folderId = req.query.id;
  console.log('id: ', folderId);
  // var folderId = '1ez66JOVdKmvSusCrSEcjaHmJO6jtutPd'; // colab folder

  // as we don't know how many pages we have,
  // we'll do a recursive call on all pages
  // following the root folder from the user
  res.setHeader('Content-Type', 'application/json');
  res.write('[');
  drivePage(res, drive, folderId, null, true);
  // const result = await listFiles(drive);
  // console.log(result);
  // res.status(200).send(result);
};

function drivePage(res, drive, folderId, npToken, first) {
  drive.files.list(
    {
      pageSize: 1000,
      maxResults: 1000,
      q:
        (folderId === '#' ? "'root' in parents" : "'" + folderId + "' in parents") +
        ' and trashed = false',
      // fields: '*',
      fields:
        'nextPageToken, files(id, name, mimeType, iconLink, webViewLink, version, fileExtension)',
      // fields:
      //   'nextPageToken, id, mimeType, name, iconLink, webViewLink, version, sharingUser, fileExtension',
      pageToken: npToken,
    },
    function (err, lst) {
      if (err) console.log(err);

      var items = lst.data.files;
      // console.log(lst.data);
      items.forEach(function (item) {
        var treeItem = {
          id: item.id,
          name: item.name,
          type: item.mimeType,
          icon: item.iconLink,
          version: item.version,
          webViewLink: item.webViewLink,
          sharingUser: item.sharingUser,
          fileExtension: item.fileExtension,
          // children: item.mimeType === 'application/vnd.google-apps.folder',
          children: item.mimeType === 'application/vnd.google-apps.folder',
        };
        res.write((first ? '' : ',') + JSON.stringify(treeItem));
        first = false;
      });

      if (lst.nextPageToken) drivePage(res, drive, folderId, lst.nextPageToken, first);
      else res.end(']');
    }
  );
}
