const { csgoRegistry } = require('../utils/metrics.js').registries;

const { metrics } = require('../utils/metrics.js');

const formatRconResult = function (result) {
    let { stats, status } = result;

    stats = stats.split(/\r?\n/);
    stats.pop();
    stats.shift();
    stats = stats[0].trim().split(/\s+/);

    const infosArray = status.split(/\r?\n/);
    status = {
        hostname: infosArray[0].split(': ')[1],
        version: infosArray[1].split(': ')[1].split('/')[0],
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
    csgoRegistry.setDefaultLabels(defaultLabels);

    metrics.status.set((Number(1)));
    metrics.cpu.set((Number(stats[0])));
    metrics.netin.set((Number(stats[1])));
    metrics.netout.set((Number(stats[2])));
    metrics.uptime.set((Number(stats[3])));
    metrics.maps.set((Number(stats[4])));
    metrics.fps.set((Number(stats[5])));
    metrics.players.set((Number(stats[6])));
    metrics.svms.set((Number(stats[7])));
    metrics.varms.set((Number(stats[8])));
    metrics.tick.set((Number(stats[9])));

    return csgoRegistry.metrics();
}

setNoMetrics = function (reqInfos) {
    const defaultLabels = {
        server: `${reqInfos.ip}:${reqInfos.port}`,
        game: reqInfos.game,
    };
    csgoRegistry.setDefaultLabels(defaultLabels);

    metrics.status.set((Number(0)));

    return csgoRegistry.metrics();
}

module.exports = {
    setMetrics,
    setNoMetrics
}