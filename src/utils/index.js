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

module.exports = {
  mapDBToAlbumModel,
  mapDBToSongListModel,
  mapDBToSongDetailModel,
};
