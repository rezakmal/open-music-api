const AlbumLikesHandler = require('./handler');
const routes = require('./routes');

module.exports = (service) => {
  const handler = new AlbumLikesHandler(service);
  return routes(handler);
};
