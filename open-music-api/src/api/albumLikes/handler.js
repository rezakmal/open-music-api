class AlbumLikesHandler {
  constructor(service) {
    this._service = service;
    
    this.postLikeHandler = this.postLikeHandler.bind(this);
    this.deleteLikeHandler = this.deleteLikeHandler.bind(this);
    this.getLikesCountHandler = this.getLikesCountHandler.bind(this);
  }
  
  async postLikeHandler(req, res, next) {
    try {
      const { id: albumId } = req.params;
      const { id: userId } = req.user;
      
      await this._service.likeAlbum(userId, albumId);
      
      res.status(201).json({
        status: 'success',
        message: 'Berhasil menyukai album',
      });
    } catch (error) {
      next(error);
    }
  }
  
  async deleteLikeHandler(req, res, next) {
    try {
      const { id: albumId } = req.params;
      const { id: userId } = req.user;
      
      await this._service.unlikeAlbum(userId, albumId);
      
      res.status(200).json({
        status: 'success',
        message: 'Berhasil batal menyukai album',
      });
    } catch (error) {
      next(error);
    }
  }
  
  async getLikesCountHandler(req, res, next) {
    try {
      const { id: albumId } = req.params;
      const { likes, dataSource } = await this._service.getLikesCount(albumId);
      
      if (dataSource === 'cache') {
        res.set('X-Data-Source', 'cache');
      }
      
      res.status(200).json({
        status: 'success',
        data: {
          likes,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AlbumLikesHandler;
