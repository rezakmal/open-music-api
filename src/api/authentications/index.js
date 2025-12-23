const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = (authenticationsService, usersService, tokenManager, validator) => {
  const authenticationsHandler = new AuthenticationsHandler(
    authenticationsService,
    usersService,
    tokenManager,
    validator,
  );
  return routes(authenticationsHandler);
};
