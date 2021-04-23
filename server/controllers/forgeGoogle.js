import { OAuth } from './oauth.js';
import { config } from '../config.js';
import axios from 'axios';
import request from 'request';

import { google } from 'googleapis';
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(
  config.google.client_id,
  config.google.client_secret,
  config.google.callback_url
);

import pkg from 'forge-apis';
import { getInternalTokenTwoLegged } from './oauth.js';

const {
  BucketsApi,
  ObjectsApi,
  PostBucketsPayload,
  DerivativesApi,
  UserProfileApi,
  HubsApi,
  ProjectsApi,
  FoldersApi,
  ItemsApi,
} = pkg;

export const sendToTranslationRoute = async (req, res) => {
  console.log('Sent to translation route!');
  const tokenSession = new OAuth(req.session);
  const googleFileId = req.body.googlefile;
  // console.log(googleFileId);

  const tokenInternal = await getInternalTokenTwoLegged();

  if (!tokenSession.isGoogleAuthorized()) {
    console.log('Unauthorized!');
    res.status(401).end('Please Google login first');
    return;
  }

  oauth2Client.setCredentials({
    access_token: tokenSession.getGoogleToken(),
  });

  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  const people = google.people({ version: 'v1', auth: oauth2Client });

  people.people.get(
    { resourceName: 'people/me', personFields: 'emailAddresses,names' },
    function (err, user) {
      if (err || user == null) {
        console.log(
          'model.derivative.google.drive.integration:sentToTranslation:google.user.get => ' + err
        );
        res.status(500).json({
          error: 'Cannot get Google user information, please try again.',
        });
        return;
      } else {
        // ForgeSDK OSS Bucket Name: username + userId (no spaces, lower case)
        // that way we have one bucket for each Google account using this application
        const ossBucketKey =
          config.credentials.client_id.toLowerCase() +
          (
            user.data.names[0].displayName.replace(/\W+/g, '') +
            user.data.resourceName.split('/')[1]
          ).toLowerCase();
        console.log(ossBucketKey);

        const buckets = new BucketsApi();
        const objects = new ObjectsApi();
        const postBuckets = new PostBucketsPayload();
        postBuckets.bucketKey = ossBucketKey;
        postBuckets.policyKey = 'transient'; // files expire in 24h

        buckets
          .createBucket(postBuckets, {}, null, tokenInternal)
          .catch(function (err) {
            console.log(err);
          })
          .then(function () {
            drive.files.get(
              {
                fileId: googleFileId,
                fields: 'name, fileExtension, version',
                supportsAllDrives: true,
              },
              function (err, fileInfo) {
                if (err) console.log(err);
                const fileName = fileInfo.data.name;
                // var fileExtension = fileInfo.data.fileExtension;

                const ossObjectName =
                  // fileName + '.' + fileInfo.data.fileExtension;
                  // fileName;
                  googleFileId + '_V' + fileInfo.data.version + '_' + fileInfo.data.name;
                console.log(fileName, ossObjectName);
                // at this point the bucket exists (either created or already there)
                objects
                  .getObjects(ossBucketKey, { limit: 100 }, null, tokenInternal)
                  .then(function (response) {
                    var alreadyTranslated = false;
                    var objectsInBucket = response.body.items;

                    console.log(objectsInBucket);

                    objectsInBucket.forEach(function (item) {
                      if (item.objectKey === ossObjectName) {
                        // check if file is translated
                        res.status(200).json({
                          readyToShow: true,
                          status: 'File already translated.',
                          objectId: item.objectId,
                          urn: item.objectId.toBase64(),
                        });
                        alreadyTranslated = true;
                      }
                    });

                    if (!alreadyTranslated) {
                      // prepare to download from Google drive
                      // drive.files.get(
                      //   {
                      //     fileId: googleFileId,
                      //     alt: 'media',
                      //   },
                      const googleToken = tokenSession.getGoogleToken();
                      console.log(googleToken);

                      request(
                        {
                          url:
                            'https://www.googleapis.com/drive/v2/files/' +
                            googleFileId +
                            '?alt=media',
                          method: 'GET',
                          headers: {
                            Authorization: 'Bearer ' + googleToken,
                          },
                          encoding: null,
                        },
                        function (err, response, filestream) {
                          // console.log(err, response);
                          console.log('starting upload....');

                          // process.env.UV_THREADPOOL_SIZE = 128;
                          // console.log(process.env.UV_THREADPOOL_SIZE);

                          objects
                            .uploadObject(
                              ossBucketKey,
                              ossObjectName,
                              filestream.length,
                              filestream,
                              {},
                              null,
                              tokenInternal
                            )

                            .then(async (response) => {
                              var ossUrn = response.body.objectId.toBase64();
                              console.log('reached down here! ', ossUrn);
                              var derivative = new DerivativesApi();
                              derivative
                                .translate(translateData(ossUrn), {}, null, tokenInternal)
                                .then(function (data) {
                                  res.status(200).json({
                                    readyToShow: false,
                                    status: 'Translation in progress, please wait...',
                                    urn: ossUrn,
                                  });
                                })
                                .catch(function (e) {
                                  res.status(500).json({ error: e.statusMessage });
                                }); //translate
                            })
                            .catch(function (err) {
                              console.log(err);
                            }); //uploadObject
                        }
                      );
                    }
                  })
                  .catch(function (e) {
                    res.status(500).json({ error: e.statusMessage });
                  }); //getObjects
              }
            );
          });
      }
    }
  );
};

export const isTranslated = async (req, res) => {
  console.log('entered is translated!');
  try {
    let bucketExistsBool = false;
    let objectTranslatedBool = false;
    const googleFileId = req.body.googlefile;
    console.log(googleFileId);

    const token = await getInternalTokenTwoLegged();
    console.log(token);
    const tokenSession = new OAuth(req.session);

    oauth2Client.setCredentials({
      access_token: tokenSession.getGoogleToken(),
    });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    const people = google.people({ version: 'v1', auth: oauth2Client });

    const peopleResult = await people.people.get({
      resourceName: 'people/me',
      personFields: 'emailAddresses,names',
    });

    const bucketKey =
      config.credentials.client_id.toLowerCase() +
      (
        peopleResult.data.names[0].displayName.replace(/\W+/g, '') +
        peopleResult.data.resourceName.split('/')[1]
      ).toLowerCase();

    const bucketsApi = new BucketsApi();
    const postBuckets = new PostBucketsPayload();
    postBuckets.bucketKey = bucketKey;
    postBuckets.policyKey = 'transient'; // expires in 24h

    // check if bucket exists, else create

    // now check if the file exists in the bucket (first check if bucket even exists)
    // make sure the names follow the naming rules
    const buckets = await axios.get('https://developer.api.autodesk.com/oss/v2/buckets', {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    buckets.data.items.forEach((bucket) => {
      if (bucket.bucketKey === bucketKey) {
        console.log(bucket);
        console.log('bucket exists! bucketKey:' + bucketKey);
        bucketExistsBool = true;
      }
    });
    // TO DO: change to .includes or something
    if (!bucketExistsBool) {
      const createBucketResult = await bucketsApi.createBucket(postBuckets, {}, null, token);
      console.log(createBucketResult);
    }

    // check if file exists

    // get the file name from gdrive
    const driveFileResult = await drive.files.get({
      fileId: googleFileId,
      fields: 'name, fileExtension, version',
      supportsAllDrives: true,
    });

    const driveFileName =
      googleFileId + '_V' + driveFileResult.data.version + '_' + driveFileResult.data.name;

    // const driveFileName = driveFileResult.data.name;

    console.log('File name: ' + driveFileName);

    const objects = await axios.get(
      `https://developer.api.autodesk.com/oss/v2/buckets/${bucketKey}/objects`,
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      }
    );
    let urn = '';
    objects.data.items.forEach((object) => {
      if (object.objectKey === driveFileName) {
        console.log(object);
        objectTranslatedBool = true;
        urn = object.objectId.toBase64();
        console.log('object exists! urn: ' + urn);
      }
    });

    // check the manifest now

    // TEST TRANSLATE

    // try to just send it to translation
    // send to translation if both the bucket and object exists

    // if (!manifestResult.data.urn) {
    //   console.log('file has not been translated!');
    // }

    // END TEST

    if (bucketExistsBool && objectTranslatedBool) {
      const result = await getManifest(urn, token.access_token);
      console.log(result.status);
      // console.log(result.response.status)
      // console.log(result);
      let responseObj = {
        status: result.status,
        manifest: result.data,
      };
      console.log(responseObj);
      res.json(responseObj);
    } else {
      res.json({});
    }
  } catch (error) {
    res.json(error);
  }
};

// api/google/uploadAndTranslate
export const uploadAndTranslate = async (req, res) => {
  // IF file does not exist, upload
  // IF file exists, translate
  console.log(req.body.googlefile);
  try {
    const googleFileId = req.body.googlefile;

    const token = await getInternalTokenTwoLegged();
    const tokenSession = new OAuth(req.session);

    oauth2Client.setCredentials({
      access_token: tokenSession.getGoogleToken(),
    });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    const people = google.people({ version: 'v1', auth: oauth2Client });

    const peopleResult = await people.people.get({
      resourceName: 'people/me',
      personFields: 'emailAddresses,names',
    });

    const bucketKey =
      config.credentials.client_id.toLowerCase() +
      (
        peopleResult.data.names[0].displayName.replace(/\W+/g, '') +
        peopleResult.data.resourceName.split('/')[1]
      ).toLowerCase();

    //check if bucket exists, if not create it
    // or just create

    // check if file exists
    // get the file name from gdrive
    const driveFileResult = await drive.files.get({
      fileId: googleFileId,
      fields: 'name, fileExtension, version',
      supportsAllDrives: true,
    });

    const driveFileName =
      googleFileId + '_V' + driveFileResult.data.version + '_' + driveFileResult.data.name;
    console.log('File name: ' + driveFileName);

    // const tokenInternal = await getInternalTokenTwoLegged();

    // upload driveFileName into the bucketKey
    const googleToken = tokenSession.getGoogleToken();
    console.log('getting file from google...');

    // const driveResult = await drive.files.get({
    //   fileId: googleFileId,
    //   alt: 'media',
    // });
    // console.log(driveResult.data);
    const driveResult = await axios({
      url:
        'https://www.googleapis.com/drive/v3/files/' +
        googleFileId +
        '?alt=media&supportsAllDrives=true',

      method: 'get',
      headers: {
        Authorization: 'Bearer ' + googleToken,
      },
      // supportsAllDrives: true,
      responseType: 'arraybuffer',
    });
    // console.log(driveResult);
    console.log('uploading...');
    // const uploadResult = await objects.uploadObject(
    //   bucketKey,
    //   driveFileName,
    //   driveResult.data.length,
    //   driveResult.data,
    //   {},
    //   null,
    //   tokenInternal
    // );
    const uploadResult = await axios({
      url: `https://developer.api.autodesk.com/oss/v2/buckets/${bucketKey}/objects/${driveFileName}`,
      method: 'put',
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        // 'Content-Type': 'application/octet-stream',
        'Content-Length': driveResult.data.length,
      },
      data: driveResult.data,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    console.log(uploadResult.data);
    console.log('translating...');
    const ossUrn = uploadResult.data.objectId.toBase64();
    const derivative = new DerivativesApi();
    const derivativeResult = await derivative.translate(translateData(ossUrn), {}, null, token);
    console.log(derivativeResult);
    console.log('finished!');
  } catch (error) {
    res.json(error);
  }
};

const getManifest = async (urn, token) => {
  try {
    const manifestResult = await axios(
      `https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/manifest`,
      {
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return manifestResult;
  } catch (error) {
    // to return the status
    return error.response;
  }
};

function translateData(ossUrn) {
  var postJob = {
    input: {
      urn: ossUrn,
    },
    output: {
      formats: [
        {
          type: 'svf2',
          views: ['2d', '3d'],
        },
      ],
    },
  };
  return postJob;
}

String.prototype.toBase64 = function () {
  return Buffer.from(this)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};
