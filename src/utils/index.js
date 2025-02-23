const mapDBToAlbumModel = ({ id, name, year }) => ({
  id,
  name,
  year,
});

const mapDBToSongListModel = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

const mapDBToSongDetailModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
});

const mapDBToPlaylistModel = ({ id, name, username }) => ({
  id,
  name,
  username,
});

module.exports = {
  mapDBToAlbumModel,
  mapDBToSongListModel,
  mapDBToSongDetailModel,
  mapDBToPlaylistModel,
};
