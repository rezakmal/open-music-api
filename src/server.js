const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');

const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

const ClientError = require('./exceptions/ClientError');

dotenv.config();

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService();
  
  const app = express();
  const port = process.env.PORT || 5000;
  const host = process.env.HOST || 'localhost';

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use('/albums', albums(new AlbumsService(), AlbumsValidator));
  app.use('/songs', songs(new SongsService(), SongsValidator));
  app.use('/users', users(usersService, UsersValidator));
  app.use('/authentications', authentications(authenticationsService, usersService, TokenManager, AuthenticationsValidator));
  app.use('/playlists', playlists(playlistsService, PlaylistsValidator));

  // Global Error Handling
  app.use((err, req, res, next) => {
    if (err instanceof ClientError) {
      return res.status(err.statusCode).json({
        status: 'fail',
        message: err.message,
      });
    }

    if (err.status) {
         return res.status(err.status).json({
             status: 'fail',
             message: err.message,
         });
    }

    console.error(err);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kegagalan pada server kami',
    });
  });

  app.listen(port, host, () => {
    console.log(`Server berjalan pada http://${host}:${port}`);
  });
};

init();