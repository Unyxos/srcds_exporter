const prometheus = require('prom-client');
const { Gauge } = prometheus;

const registries = {
    csgoRegistry: new prometheus.Registry(),
    gmodRegistry: new prometheus.Registry(),
    cssRegistry: new prometheus.Registry(),
    tf2Registry: new prometheus.Registry(),
    l4d2Registry: new prometheus.Registry(),
    hl2Registry: new prometheus.Registry(),
};

const metrics = {
    status: new Gauge({ name: "srcds_status", help: "The server's status, 0 = offline/bad password, 1 = online", registers: [registries.csgoRegistry, registries.gmodRegistry, registries.cssRegistry, registries.hl2Registry, registries.tf2Registry, registries.l4d2Registry] }),
    cpu: new Gauge({ name: "srcds_cpu", help: "The server's CPU usage", registers: [registries.csgoRegistry, registries.gmodRegistry, registries.cssRegistry, registries.hl2Registry, registries.tf2Registry, registries.l4d2Registry] }),
    netin: new Gauge({ name: "srcds_netin", help: "The server's netin usage", registers: [registries.csgoRegistry, registries.gmodRegistry, registries.cssRegistry, registries.hl2Registry, registries.tf2Registry, registries.l4d2Registry] }),
    netout: new Gauge({ name: "srcds_netout", help: "The server's netout usage", registers: [registries.csgoRegistry, registries.gmodRegistry, registries.cssRegistry, registries.hl2Registry, registries.tf2Registry, registries.l4d2Registry] }),
    uptime: new Gauge({ name: "srcds_uptime", help: "The server's uptime", registers: [registries.csgoRegistry, registries.gmodRegistry, registries.cssRegistry, registries.hl2Registry, registries.tf2Registry, registries.l4d2Registry] }),
    maps: new Gauge({ name: "srcds_maps", help: "The server's current map", registers: [registries.csgoRegistry, registries.gmodRegistry, registries.cssRegistry, registries.hl2Registry, registries.tf2Registry] }),
    fps: new Gauge({ name: "srcds_fps", help: "The server's current FPS", registers: [registries.csgoRegistry, registries.gmodRegistry, registries.cssRegistry, registries.hl2Registry, registries.tf2Registry, registries.l4d2Registry] }),
    players: new Gauge({ name: "srcds_players", help: "The server's current players", registers: [registries.csgoRegistry, registries.gmodRegistry, registries.cssRegistry, registries.hl2Registry, registries.tf2Registry, registries.l4d2Registry] }),
    svms: new Gauge({ name: "srcds_svms", help: "The server's current SVMs", registers: [registries.csgoRegistry] }),
    varms: new Gauge({ name: "srcds_varm", help: "The server's current VARMs", registers: [registries.csgoRegistry] }),
    tick: new Gauge({ name: "srcds_tick", help: "The server's current tick", registers: [registries.csgoRegistry] }),
    connects: new Gauge({ name: "srcds_connects", help: "Number of players who connected on the server since it's boot", registers: [registries.gmodRegistry, registries.cssRegistry, registries.hl2Registry, registries.tf2Registry] }),
    users: new Gauge({ name: "srcds_users", help: "Number of users who connected on the server since it's boot", registers: [registries.l4d2Registry] }),
};

module.exports = {
    registries,
    metrics,
}