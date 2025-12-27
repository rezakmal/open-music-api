const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { Pool } = require('pg');

class ExportsService {
  constructor(producerService, playlistsService) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._pool = new Pool();
  }
  
  async exportPlaylist(userId, playlistId, targetEmail) {
    await this._playlistsService.verifyPlaylistOwner(playlistId, userId);
    
    const message = {
      playlistId,
      targetEmail,
    };
    
    await this._producerService.sendMessage('export:playlists', JSON.stringify(message));
  }
}

module.exports = ExportsService;
