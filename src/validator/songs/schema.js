const Joi = require("joi");

const SongPayloadSchema = Joi.object({
  albumId: Joi.string(),
  title: Joi.string().required(),
  year: Joi.number().required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number(),
});

module.exports = { SongPayloadSchema };
