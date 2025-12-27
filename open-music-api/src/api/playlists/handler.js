class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    
    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this);
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
  }
  
  async postPlaylistHandler(req, res, next) {
    try {
      this._validator.validatePostPlaylistPayload(req.body);
      const { name } = req.body;
      const { id: credentialId } = req.user;
      
      const playlistId = await this._service.addPlaylist({ name, owner: credentialId });
      
      res.status(201).json({
        status: 'success',
        data: {
          playlistId,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  async getPlaylistsHandler(req, res, next) {
    try {
      const { id: credentialId } = req.user;
      const playlists = await this._service.getPlaylists(credentialId);
      
      res.json({
        status: 'success',
        data: {
          playlists: playlists.map(p => ({
            id: p.id,
            name: p.name,
            username: p.username
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  async deletePlaylistByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const { id: credentialId } = req.user;
      
      await this._service.verifyPlaylistOwner(id, credentialId);
      await this._service.deletePlaylistById(id);
      
      res.json({
        status: 'success',
        message: 'Playlist berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
  
  async postSongToPlaylistHandler(req, res, next) {
    try {
      this._validator.validatePostSongToPlaylistPayload(req.body);
      const { id } = req.params;
      const { songId } = req.body;
      const { id: credentialId } = req.user;
      
      await this._service.verifyPlaylistAccess(id, credentialId);
      await this._service.addSongToPlaylist(id, songId);
      
      res.status(201).json({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });
    } catch (error) {
      next(error);
    }
  }
  
  async getSongsFromPlaylistHandler(req, res, next) {
    try {
      const { id } = req.params;
      const { id: credentialId } = req.user;
      
      await this._service.verifyPlaylistAccess(id, credentialId);
      const playlist = await this._service.getSongsFromPlaylist(id);
      
      res.json({
        status: 'success',
        data: {
          playlist: {
            id: playlist.id,
            name: playlist.name,
            username: playlist.username,
            songs: playlist.songs,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  async deleteSongFromPlaylistHandler(req, res, next) {
    try {
      this._validator.validateDeleteSongFromPlaylistPayload(req.body);
      const { id } = req.params;
      const { songId } = req.body;
      const { id: credentialId } = req.user;
      
      await this._service.verifyPlaylistAccess(id, credentialId);
      await this._service.deleteSongFromPlaylist(id, songId);
      
      res.json({
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PlaylistsHandler;
