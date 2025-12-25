const ClientError = require('../exceptions/ClientError');
const AuthenticationError = require('../exceptions/AuthenticationError');
const TokenManager = require('../tokenize/TokenManager');

const authMiddleware = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new AuthenticationError('Missing authentication');
    }

    const token = authorization.split(' ')[1];
    
    if (!token) {
        throw new AuthenticationError('Missing authentication');
    }

    const { id } = TokenManager.verifyAccessToken(token);
    req.user = { id };
    next();
  } catch (error) {
      if (error instanceof ClientError) {
          next(error);
      } else {
          next(new AuthenticationError('Access token tidak valid'));
      }
  }
};

module.exports = authMiddleware;
