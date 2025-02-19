const ClientError = require("../../exceptions/ClientError");

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { title, year } = request.payload;
    const albumId = this._service.addAlbum({ title, year });

    const response = h.response({
      status: "success",
      message: "Successfully added album",
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  getAlbumsHandler() {
    const albums = this._service.getAlbums();
    return {
      status: "success",
      data: {
        albums,
      },
    };
  }

  getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = this._service.getAlbumById(id);

    if (album !== undefined) {
      return {
        status: "success",
        data: {
          album,
        },
      };
    }

    const response = h.response({
      status: "fail",
      message: "Album not found",
    });
    response.code(404);
    return response;
  }

  putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    this._service.editAlbumById(id, request.payload);

    return {
      status: "success",
      message: "Album updated successfully",
    };
  }

  deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    this._service.deleteAlbumById(id);
    return {
      status: "success",
      message: "Album deleted successfully",
    };
  }
}

module.exports = AlbumsHandler;
