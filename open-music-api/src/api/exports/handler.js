class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    
    this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this);
  }
  
  async postExportPlaylistsHandler(req, res, next) {
    try {
      this._validator.validateExportPlaylistsPayload(req.body);
      
      const { playlistId } = req.params;
      const { targetEmail } = req.body;
      const { id: credentialId } = req.user;
      
      await this._service.exportPlaylist(credentialId, playlistId, targetEmail);
      
      res.status(201).json({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ExportsHandler;
