const autoBind = require("auto-bind");

class ExportsHandler {
  constructor(service, playlistsService, validator) {
    this.service = service;
    this.playlistsService = playlistsService;
    this.validator = validator;

    autoBind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    this.validator.validateExportPlaylistPayload(request.payload);

    const { id: playlistId } = request.params;
    const { id: userId } = request.auth.credentials;
    const { targetEmail } = request.payload;

    await this.playlistsService.verifyPlaylistOwner(playlistId, userId);

    const message = {
      userId,
      playlistId,
      targetEmail,
    };

    await this.service.sendMessage("export:playlists", JSON.stringify(message));

    const response = h.response({
      status: "success",
      message: "Your request is being processed",
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
