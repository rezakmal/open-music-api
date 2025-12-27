const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = (service, validator) => {
  const exportsHandler = new ExportsHandler(service, validator);
  return routes(exportsHandler);
};
