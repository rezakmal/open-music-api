const express = require('express');
const authMiddleware = require('../../middleware/auth');

const routes = (handler) => {
  const router = express.Router();

  router.post('/:id/likes', authMiddleware, handler.postLikeHandler);
  router.delete('/:id/likes', authMiddleware, handler.deleteLikeHandler);
  router.get('/:id/likes', handler.getLikesCountHandler);

  return router;
};

module.exports = routes;
