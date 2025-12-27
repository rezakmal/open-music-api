const express = require('express');
const authMiddleware = require('../../middleware/auth');

const routes = (handler) => {
  const router = express.Router();
  
  router.use(authMiddleware);
  
  router.post('/playlists/:playlistId', handler.postExportPlaylistsHandler);
  
  return router;
};

module.exports = routes;
