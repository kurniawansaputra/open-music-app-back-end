const autoBind = require("auto-bind");

class AlbumsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this.validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;
    const albumId = await this.service.addAlbum({ name, year });

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

  async getAlbumsHandler() {
    const albums = await this.service.getAlbums();
    return {
      status: "success",
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this.service.getAlbumById(id);

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

  async putAlbumByIdHandler(request) {
    this.validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this.service.editAlbumById(id, request.payload);

    return {
      status: "success",
      message: "Album updated successfully",
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this.service.deleteAlbumById(id);
    return {
      status: "success",
      message: "Album deleted successfully",
    };
  }
}

module.exports = AlbumsHandler;
