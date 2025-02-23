const autoBind = require("auto-bind");

class PlaylistSongsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    autoBind(this);
  }

  async postPlaylistSongHandler(request, h) {
    this.validator.validatePlaylistSongPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;

    await this.service.verifyPlaylistOwner(playlistId, credentialId);

    await this.service.addSongToPlaylist(playlistId, songId);

    return h
      .response({
        status: "success",
        message: "Song successfully added to playlist",
      })
      .code(201);
  }

  async getPlaylistSongsHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.service.verifyPlaylistOwner(playlistId, credentialId);

    const playlist = await this.service.getPlaylistDetails(playlistId);
    const songs = await this.service.getPlaylistSongs(playlistId);

    return h
      .response({
        status: "success",
        data: {
          playlist: {
            id: playlist.id,
            name: playlist.name,
            username: playlist.username,
            songs,
          },
        },
      })
      .code(200);
  }

  async deletePlaylistSongHandler(request, h) {
    this.validator.validatePlaylistSongPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;

    await this.service.verifyPlaylistOwner(playlistId, credentialId);

    await this.service.deleteSongFromPlaylist(playlistId, songId);

    return h
      .response({
        status: "success",
        message: "Song successfully removed from playlist",
      })
      .code(200);
  }
}

module.exports = PlaylistSongsHandler;
