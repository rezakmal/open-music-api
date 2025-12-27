const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = (service, validator) => {
  const playlistsHandler = new PlaylistsHandler(service, validator);
  return routes(playlistsHandler);
};
