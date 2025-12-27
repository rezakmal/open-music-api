const express = require('express');
const upload = require('./uploads_config');

const routes = (handler) => {
  const router = express.Router();

  router.post('/', handler.postAlbumHandler);
  router.post('/:id/covers', upload.single('cover'), handler.postUploadCoverHandler);
  router.get('/:id', handler.getAlbumByIdHandler);
  router.put('/:id', handler.putAlbumByIdHandler);
  router.delete('/:id', handler.deleteAlbumByIdHandler);

  return router;
};

module.exports = routes;