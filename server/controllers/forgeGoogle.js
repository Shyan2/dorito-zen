import { OAuth } from './oauth.js';
import { config } from '../config.js';

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
        postBuckets.policyKey = 'transient'; // expires in 24h

        buckets
          .createBucket(postBuckets, {}, null, tokenInternal)
          .catch(function (err) {
            console.log(err);
          })
          .then(function () {
            drive.files.get(
              {
                fileId: googleFileId,
                fields: 'name, fileExtension',
              },
              function (err, fileInfo) {
                if (err) console.log(err);
                var fileName = fileInfo.data.name;
                // var fileExtension = fileInfo.data.fileExtension;
                var ossObjectName =
                  // fileName + '.' + fileInfo.data.fileExtension;
                  fileName;
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
                      // axios.get(
                      //   `https://www.googleapis.com/drive/v2/files/${googleFileId}?alt=media`,
                      //   {
                      //     headers: {
                      //       Authorization: `Bearer ${googleToken}`,
                      //     },
                      //     // encoding: null,
                      //   },
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
                          console.log(filestream);
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
                            .then(function (response) {
                              var ossUrn = response.body.objectId.toBase64();
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
