const autoBind = require("auto-bind");

class AlbumLikesHandler {
  constructor(service) {
    this.service = service;

    autoBind(this);
  }

  async postLikeAlbumHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this.service.verifyAlbumExists(albumId);

    const isLiked = await this.service.isAlbumLiked(userId, albumId);
    if (isLiked) {
      return h
        .response({
          status: "fail",
          message: "You have already liked this album",
        })
        .code(400);
    }

    await this.service.addLikeToAlbum(userId, albumId);

    return h
      .response({
        status: "success",
        message: "Album successfully liked",
      })
      .code(201);
  }

  async deleteLikeAlbumHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this.service.verifyAlbumExists(albumId);

    const isLiked = await this.service.isAlbumLiked(userId, albumId);
    if (!isLiked) {
      return h
        .response({
          status: "fail",
          message: "You have not liked this album",
        })
        .code(400);
    }

    await this.service.removeLikeFromAlbum(userId, albumId);

    return h
      .response({
        status: "success",
        message: "Album successfully unliked",
      })
      .code(200);
  }

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;

    await this.service.verifyAlbumExists(albumId);

    const likes = await this.service.countAlbumLikes(albumId);

    return h
      .response({
        status: "success",
        data: { likes },
      })
      .code(200);
  }
}

module.exports = AlbumLikesHandler;
