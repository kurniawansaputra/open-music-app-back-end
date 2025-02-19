const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/ClientError");
const NotFoundError = require("../../exceptions/NotFoundError");

class AlbumsService {
  constructor() {
    this._albums = [];
  }

  addAlbum({ title, year }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newAlbum = {
      id,
      title,
      year,
      createdAt,
      updatedAt,
    };

    this._albums.push(newAlbum);

    const isSuccess =
      this._albums.filter((album) => album.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError("Fail to add album");
    }

    return id;
  }

  getAlbums() {
    return this._albums;
  }

  getAlbumById(id) {
    const album = this._albums.filter((n) => n.id === id)[0];
    if (!album) {
      throw new NotFoundError("Album not found");
    }
    return album;
  }

  editAlbumById(id, { title, year }) {
    const index = this._albums.findIndex((n) => n.id === id);
    if (index === -1) {
      throw new NotFoundError("Fail to edit album. Album not found");
    }

    const updatedAt = new Date().toISOString();

    this._albums[index] = {
      ...this._albums[index],
      title,
      year,
      updatedAt,
    };
  }

  deleteAlbumById(id) {
    const index = this._albums.findIndex((n) => n.id === id);
    if (index === -1) {
      throw new NotFoundError("Fail to delete album. Album not found");
    }

    this._albums.splice(index, 1);
  }
}

module.exports = AlbumsService;
