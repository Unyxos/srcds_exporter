const { l4d2Registry } = require('../utils/metrics.js').registries;

const { metrics } = require('../utils/metrics.js');

const formatRconResult = function (result) {
    let { stats, status } = result;

    stats = stats.split(/\r?\n/);
    stats.shift();
    stats = stats[0].trim().split(/\s+/);

    const infosArray = status.split(/\r?\n/);

    status = {
        hostname: infosArray[0].split(': ')[1],
        version: infosArray[1].split(': ')[1].split(' ')[0],
    }

    return {
        stats,
        status
    };
}

const setMetrics = function (result, reqInfos) {
    const { stats, status } = formatRconResult(result);

    const defaultLabels = {
        server: `${reqInfos.ip}:${reqInfos.port}`,
        game: reqInfos.game,
        version: status.version,
        hostname: status.hostname,
    };
    l4d2Registry.setDefaultLabels(defaultLabels);

    metrics.status.set((Number(1)));
    metrics.cpu.set((Number(stats[0])));
    metrics.netin.set((Number(stats[1])));
    metrics.netout.set((Number(stats[2])));
    metrics.uptime.set((Number(stats[3])));
    metrics.users.set((Number(stats[4])));
    metrics.fps.set((Number(stats[5])));
    metrics.players.set((Number(stats[6])));

    return l4d2Registry.metrics();
}

setNoMetrics = function (reqInfos) {
    const defaultLabels = {
        server: `${reqInfos.ip}:${reqInfos.port}`,
        game: reqInfos.game,
    };
    l4d2Registry.setDefaultLabels(defaultLabels);

    metrics.status.set((Number(0)));

    return l4d2Registry.metrics();
}

module.exports = {
    setMetrics,
    setNoMetrics
}