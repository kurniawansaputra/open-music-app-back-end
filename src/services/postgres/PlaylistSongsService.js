const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const BaseService = require("./BaseService");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class PlaylistSongsService extends BaseService {
  constructor() {
    super();
    this.pool = new Pool();
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `playlistSong-${nanoid(16)}`;

    // Check if the song exists
    const songQuery = {
      text: "SELECT id FROM songs WHERE id = $1",
      values: [songId],
    };
    const songResult = await this.pool.query(songQuery);
    if (!songResult.rows.length) {
      throw new NotFoundError("Song not found");
    }

    // Insert song into playlist
    const insertQuery = {
      text: "INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES ($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };

    const insertResult = await this.pool.query(insertQuery);
    if (!insertResult.rows.length) {
      throw new InvariantError("Failed to add song to playlist");
    }

    return insertResult.rows[0].id;
  }

  async getPlaylistDetails(playlistId) {
    const query = {
      text: `
      SELECT playlists.id, playlists.name, users.username
      FROM playlists
      JOIN users ON playlists.owner = users.id
      WHERE playlists.id = $1
    `,
      values: [playlistId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist not found");
    }

    return result.rows[0];
  }

  async getPlaylistSongs(playlistId) {
    const query = {
      text: `
            SELECT songs.id, songs.title, songs.performer
            FROM playlist_songs
            JOIN songs ON songs.id = playlist_songs.song_id
            WHERE playlist_songs.playlist_id = $1
        `,
      values: [playlistId],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [playlistId, songId],
    };

    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Song not found in playlist");
    }
  }
}

module.exports = PlaylistSongsService;
