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
    
    // In some cases, the header might be just the token, but standard is Bearer <token>
    // We assume Bearer <token> based on common practice and library usage.
    
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
          // TokenManager throws InvariantError for invalid token, which is 400.
          // But for auth middleware, invalid token usually means 401 Unauthorized.
          // We can map InvariantError to AuthenticationError here if we want strict 401.
          // However, the requirement says "Playlist... membutuhkan access token", usually implying 401 if missing/invalid.
          // If TokenManager throws InvariantError("Access token tidak valid"), it will result in 400 Bad Request.
          // Let's decide to catch InvariantError and throw AuthenticationError for better semantics?
          // Or just let it bubble as 400.
          // Let's wrap it in AuthenticationError if key is invalid.
          next(new AuthenticationError('Access token tidak valid'));
      }
  }
};

module.exports = authMiddleware;
