const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const { mapDBToSongListModel, mapDBToSongDetailModel } = require("../../utils");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class SongsService {
  constructor() {
    this.pool = new Pool();
  }

  async addSong({
    title,
    year,
    performer,
    genre,
    duration = null,
    albumId = null,
  }) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: `INSERT INTO songs (id, title, year, performer, genre, duration, album_id, created_at, updated_at) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      values: [
        id,
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Song failed to add");
    }

    return result.rows[0].id;
  }

  async getSongs({ title, performer }) {
    let query = "SELECT id, title, performer FROM songs";
    const values = [];
    const conditions = [];

    if (title) {
      conditions.push(`LOWER(title) LIKE LOWER($${values.length + 1})`);
      values.push(`%${title}%`);
    }

    if (performer) {
      conditions.push(`LOWER(performer) LIKE LOWER($${values.length + 1})`);
      values.push(`%${performer}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    const result = await this.pool.query({ text: query, values });
    return result.rows.map(mapDBToSongListModel);
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Song not found");
    }

    return result.rows.map(mapDBToSongDetailModel)[0];
  }

  async editSongById(
    id,
    {
      title, year, performer, genre, duration = null, albumId = null,
    },
  ) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: `UPDATE songs 
           SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6, updated_at = $7 
           WHERE id = $8 RETURNING id`,
      values: [title, year, performer, genre, duration, albumId, updatedAt, id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Song not found");
    }

    return result.rows[0].id;
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Song not found");
    }
  }
}

module.exports = SongsService;
