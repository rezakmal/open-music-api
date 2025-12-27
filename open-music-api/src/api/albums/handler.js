class AlbumsHandler {
  constructor(service, validator, storageService) {
    this._service = service;
    this._validator = validator;
    this._storageService = storageService;
    
    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.postUploadCoverHandler = this.postUploadCoverHandler.bind(this);
  }
  
  async postAlbumHandler(req, res, next) {
    try {
      this._validator.validateAlbumPayload(req.body);
      const { name, year } = req.body;
      
      const albumId = await this._service.addAlbum({ name, year });
      
      res.status(201).json({
        status: 'success',
        data: {
          albumId,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  async getAlbumByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const album = await this._service.getAlbumById(id);
      res.json({
        status: 'success',
        data: {
          album,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  async putAlbumByIdHandler(req, res, next) {
    try {
      this._validator.validateAlbumPayload(req.body);
      const { id } = req.params;
      
      await this._service.editAlbumById(id, req.body);
      
      res.json({
        status: 'success',
        message: 'Album berhasil diperbarui',
      });
    } catch (error) {
      next(error);
    }
  }
  
  async deleteAlbumByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this._service.deleteAlbumById(id);
      
      res.json({
        status: 'success',
        message: 'Album berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
  
  async postUploadCoverHandler(req, res, next) {
    try {
      const { id } = req.params;
      const { file } = req;
      
      if (!file) {
        const err = new Error('Invalid file type or size');
        err.statusCode = 400;
        if (!file) {
          throw new Error('Cover is required and must be an image');
        }
      }
      
      this._validator.validateImageHeaders(file.mimetype ? {'content-type': file.mimetype} : {'content-type': ''});
      
      const filename = await this._storageService.writeFile(file, { filename: file.originalname });
      
      const coverUrl = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 5000}/upload/images/${filename}`;
      
      await this._service.addCoverUrl(id, coverUrl);
      
      res.status(201).json({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = AlbumsHandler;