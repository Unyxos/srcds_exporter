const fs = require('fs');
const Joi = require('joi');

const games = fs.readdirSync('./games').map(file => file.replace('.js', ''));

const metricsParamsSchema = Joi.object({
    ip: [Joi.string().hostname().required(), Joi.string().ip().required()],
    port: Joi.number().integer().min(1).max(65535).required(),
    password: Joi.string().required(),
    game: Joi.string().valid(...games).required(),
})

module.exports = {
    metricsParamsSchema
}