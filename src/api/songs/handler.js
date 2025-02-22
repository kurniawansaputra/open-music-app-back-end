const autoBind = require("auto-bind");

class SongsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this.validator.validateSongPayload(request.payload);
    const {
      title, year, performer, genre, duration, albumId,
    } = request.payload;

    const songId = await this.service.addSong({
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    });

    const response = h.response({
      status: "success",
      message: "Successfully added song",
      data: { songId },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request) {
    const { title, performer } = request.query;
    const songs = await this.service.getSongs({ title, performer });

    return {
      status: "success",
      data: { songs },
    };
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this.service.getSongById(id);

    if (song !== undefined) {
      return {
        status: "success",
        data: {
          song,
        },
      };
    }

    const response = h.response({
      status: "fail",
      message: "Song not found",
    });
    response.code(404);
    return response;
  }

  async putSongByIdHandler(request) {
    this.validator.validateSongPayload(request.payload);
    const { id } = request.params;

    await this.service.editSongById(id, request.payload);

    return {
      status: "success",
      message: "Song updated successfully",
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this.service.deleteSongById(id);

    return {
      status: "success",
      message: "Song deleted successfully",
    };
  }
}

module.exports = SongsHandler;
