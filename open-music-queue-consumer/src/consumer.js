require('dotenv').config();
const amqp = require('amqplib');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const MailSender = require('./services/mail/MailSender');

const init = async () => {
  const playlistsService = new PlaylistsService();
  const mailSender = new MailSender();
  
  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();
  await channel.assertQueue('export:playlists', {
    durable: true,
  });
  
  channel.consume('export:playlists', async (msg) => {
    try {
      const { playlistId, targetEmail } = JSON.parse(msg.content.toString());
      console.log(`Processing export for playlist ${playlistId} to ${targetEmail}`);
      
      const playlist = await playlistsService.getSongsFromPlaylist(playlistId);
      
      const exportContent = JSON.stringify({
        playlist: {
          id: playlist.id,
          name: playlist.name,
          songs: playlist.songs.map(song => ({
            id: song.id,
            title: song.title,
            performer: song.performer
          }))
        }
      });
      
      await mailSender.sendEmail(targetEmail, exportContent);
      console.log(`Email sent to ${targetEmail}`);
      
      channel.ack(msg);
    } catch (error) {
      console.error(error);
    }
  });
  
  console.log('Consumer is running. Waiting for messages...');
};

init();
