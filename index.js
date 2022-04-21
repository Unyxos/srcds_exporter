require('dotenv').config();

const process = require('process');
const { connect } = require('@unyxos/working-rcon');
const validator = require('express-joi-validation').createValidator({});
const express = require('express');
const app = express();

const { metricsParamsSchema } = require('./utils/joi-schema');
const logger = require('./utils/logging');

const games = {
    csgo: require('./games/csgo'),
    gmod: require('./games/gmod'),
    css: require('./games/css'),
    hl2: require('./games/hl2'),
    tf2: require('./games/tf2'),
    l4d2: require('./games/l4d2'),
};


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/utils/homepage.html');
});

app.get('/metrics', validator.query(metricsParamsSchema), async (req, res) => {
    const { ip, port, password, game } = req.query;

    try {
        const client = await connect(ip, port, password, 5000);

        const status = await client.command('status');
        const stats = await client.command('stats');

        await client.disconnect();

        const response = games[game].setMetrics({ stats, status }, { ip, port, game });

        res.end(response);
    } catch (err) {
        const response = games[game].setNoMetrics({ ip, port, game });

        res.end(response);
    }
});

const port = process.env.HTTP_PORT || 9591;

app.listen(port, () => {
    logger.info(`Metrics server listening on port ${port}`);
});

process.on('uncaughtException', (err) => {
    logger.error({ step: 'UNCAUGHT_EXCEPTION', err: err.message }, 'uncaught exception');
});