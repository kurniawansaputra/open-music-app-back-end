const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const BaseService = require("./BaseService");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class PlaylistsService extends BaseService {
  constructor() {
    super();
    this.pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: `INSERT INTO playlists (id, name, owner, created_at, updated_at) 
            VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      values: [id, name, owner, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Playlist failed to add");
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `
            SELECT playlists.id, playlists.name, users.username 
            FROM playlists
            JOIN users ON users.id = playlists.owner
            WHERE playlists.owner = $1
        `,
      values: [owner],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist failed to delete. Id not found");
    }
  }
}

module.exports = PlaylistsService;
