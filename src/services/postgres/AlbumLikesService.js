const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class AlbumLikesService {
  constructor() {
    this.pool = new Pool();
  }

  async verifyAlbumExists(albumId) {
    const result = await this.pool.query(
      "SELECT id FROM albums WHERE id = $1",
      [albumId]
    );
    if (!result.rowCount) {
      throw new NotFoundError("Album not found");
    }
  }

  async isAlbumLiked(userId, albumId) {
    const result = await this.pool.query(
      "SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
      [userId, albumId]
    );
    return result.rowCount > 0;
  }

  async addLikeToAlbum(userId, albumId) {
    const id = nanoid(16);

    const result = await this.pool.query(
      "INSERT INTO user_album_likes (id, user_id, album_id) VALUES ($1, $2, $3) RETURNING id",
      [id, userId, albumId]
    );

    if (!result.rowCount) {
      throw new InvariantError("Failed to like album");
    }
  }

  async removeLikeFromAlbum(userId, albumId) {
    const result = await this.pool.query(
      "DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id",
      [userId, albumId]
    );

    if (!result.rowCount) {
      throw new InvariantError("Failed to unlike album");
    }
  }

  async countAlbumLikes(albumId) {
    const result = await this.pool.query(
      "SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1",
      [albumId]
    );
    return parseInt(result.rows[0].count, 10);
  }
}

module.exports = AlbumLikesService;
