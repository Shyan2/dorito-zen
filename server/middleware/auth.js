import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
  try {
    console.log(req.headers);
    const token = req.headers.authorization.split(' ')[1];
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, 'test');

      // need node 14 + for optional chaining ?. to work
      req.userId = decodedData.id;
    } else {
      decodedData = jwt.decode(token);

      // optional chaining ?.
      req.userId = decodedData.sub;
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
