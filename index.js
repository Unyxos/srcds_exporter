const express = require('express');
const { connect, TimeoutError } = require('working-rcon');
const prometheus = require('prom-client');

const Gauge = prometheus.Gauge;

const app = express();

function csgoRequest(response, res){
    status.set((Number(1)));
    cpu.set((Number(response[0])));
    netin.set((Number(response[1])));
    netout.set((Number(response[2])));
    uptime.set((Number(response[3])));
    maps.set((Number(response[4])));
    fps.set((Number(response[5])));
    players.set((Number(response[6])));
    svms.set((Number(response[7])));
    varms.set((Number(response[8])));
    tick.set((Number(response[9])));
    res.end(csgoRegistry.metrics());
}

function gmodRequest(response, res){
    status.set((Number(1)));
    cpu.set((Number(response[0])));
    netin.set((Number(response[1])));
    netout.set((Number(response[2])));
    uptime.set((Number(response[3])));
    maps.set((Number(response[4])));
    fps.set((Number(response[5])));
    players.set((Number(response[6])));
    res.end(gmodRegistry.metrics());
}

async function getStats(ip, port, password, game) {
    let result;
    try {
        const client = await connect(ip, port, password, 5000);
        const stats = await client.command('stats');
        await client.disconnect();
        result = stats;
    } catch (err) {
        if (err instanceof TimeoutError) {
            console.error('request timed out')
        } else {
            throw err
        }
    }
    if (game === "csgo"){
        var resultArray = result.split(/\r?\n/);
        resultArray.pop();
        resultArray.shift();
        var finalArray = resultArray[0].split(/\s+/);
        finalArray.shift();
        return finalArray;
    } else if (game === "gmod") {
        var resultArray = result.split(/\r?\n/);
        resultArray.shift();
        var finalArray = resultArray[0].split(/\s+/);
        return finalArray;
    }
}
const csgoRegistry = new prometheus.Registry();
const gmodRegistry = new prometheus.Registry();

//Global metrics, used accross all Source gameservers
const status = new Gauge({name: "srcds_status", help: "The server's status, 0 = offline/bad password, 1 = online", registers: [csgoRegistry, gmodRegistry]});
const cpu = new Gauge({name: "srcds_cpu", help: "Probably the priority level of the srcds executable from an operating system point of view (0 - No priority, 10 - biggest priority)", registers: [csgoRegistry, gmodRegistry]});
const netin = new Gauge({name: "srcds_netin", help: "Incoming bandwidth, in kbps, received by the server", registers: [csgoRegistry, gmodRegistry]});
const netout = new Gauge({name: "srcds_netout", help: "Incoming bandwidth, in kbps, sent by the server", registers: [csgoRegistry, gmodRegistry]});
const uptime = new Gauge({name: "srcds_uptime", help: "The server's uptime, in minutes", registers: [csgoRegistry, gmodRegistry]});
const maps = new Gauge({name: "srcds_maps", help: "The number of maps played on that server since it's start", registers: [csgoRegistry, gmodRegistry]});
const fps = new Gauge({name: "srcds_fps", help: "The server's tick (10 fps on idle, 64 fps for 64 ticks server, 128 fps for 128 ticks..)", registers: [csgoRegistry, gmodRegistry]});
const players = new Gauge({name: "srcds_players", help: "The number of real players actually connected on the server", registers: [csgoRegistry, gmodRegistry]});

// CSGO metrics
const svms = new Gauge({name: "srcds_svms", help: "ms per sim frame", registers: [csgoRegistry]});
const varms = new Gauge({name: "srcds_varms", help: "ms variance", registers: [csgoRegistry]});
const tick = new Gauge({name: "srcds_tick", help: "The time in MS per tick", registers: [csgoRegistry]});

app.get('/', (req, res) => {
    res.send('use /metrics?ip=&lt;srcds ip&gt;&port=&lt;srcds port&gt;&password=&lt;rcon password&gt;&game=&lt;game&gt; to get data');
});

app.get('/metrics', (req, res) => {
    var ip = req.query.ip;
    var port = req.query.port;
    var password = req.query.password;
    var game = req.query.game;

    if (ip == null || port == null || password == null || game == null){
        res.send("Missing parameter, either IP, port, RCON password or game<br />use /metrics?ip=&lt;srcds ip&gt;&port=&lt;srcds port&gt;&password=&lt;rcon password&gt;&game=&lt;game&gt; to get data");
    } else {
        if (game === "csgo" || game === "gmod"){
            getStats(ip, port, password, game, res).then(result => {
                if (game === "csgo"){
                    const defaultLabels = { server: ip+':'+port, game: game };
                    csgoRegistry.setDefaultLabels(defaultLabels);
                    csgoRequest(result, res);
                } else if (game === "gmod"){
                    const defaultLabels = { server: ip+':'+port, game: game };
                    gmodRegistry.setDefaultLabels(defaultLabels);
                    gmodRequest(result, res);
                }
            }).catch(e => {
                status.set((Number(0)));
                cpu.set((Number(0)));
                netin.set((Number(0)));
                netout.set((Number(0)));
                uptime.set((Number(0)));
                maps.set((Number(0)));
                fps.set((Number(0)));
                players.set((Number(0)));
                svms.set((Number(0)));
                varms.set((Number(0)));
                tick.set((Number(0)));

                if (game === "csgo"){
                    res.end(csgoRegistry.metrics());
                } else if (game === "gmod"){
                    res.end(gmodRegistry.metrics());
                }
            })
        } else {
            res.send("Incorrect game value, currently supported games are : csgo, gmod");
        }
    }
});

app.listen(9591);