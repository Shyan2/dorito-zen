import { getPublicTokenTwoLegged, getInternalTokenTwoLegged } from '../oauth.js';
import axios from 'axios';

export const getToken2 = async (req, res) => {
  try {
    const accessToken = await getPublicTokenTwoLegged();
    res.status(200).json(accessToken);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// uses internal token
export const getBuckets = async (req, res) => {
  const token = await getInternalTokenTwoLegged();
  const bucket_name = req.query.id;
  // const token = req.headers.token;
  // const token = req.oauth_token;
  if (!bucket_name || bucket_name === '#') {
    try {
      //retrieve buckets
      const buckets = await axios.get('https://developer.api.autodesk.com/oss/v2/buckets', {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      });
      res.json(
        buckets.data.items.map((bucket) => {
          return {
            id: bucket.bucketKey,
            text: bucket.bucketKey,
            type: 'bucket',
            children: true,
          };
        })
      );
    } catch (err) {
      next(err);
    }
  } else {
    try {
      //retrieve objects from buckets
      const objects = await axios.get(
        `https://developer.api.autodesk.com/oss/v2/buckets/${bucket_name}/objects`,
        {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        }
      );
      res.json(
        objects.data.items.map((object) => {
          return {
            id: Buffer.from(object.objectId).toString('base64'),
            text: object.objectKey,
            type: 'object',
            children: false,
          };
        })
      );
    } catch (err) {
      next(err);
    }
  }
};

export const getSupportedFormats = async (req, res) => {
  const token = await getInternalTokenTwoLegged();

  try {
    const data = await axios.get(
      'https://developer.api.autodesk.com/modelderivative/v2/designdata/formats',
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      }
    );
    res.status(200).json(data.data.formats.svf2);
  } catch (err) {
    res.send(err);
  }
};
