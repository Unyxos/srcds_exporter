const express = require('express');
const { connect, TimeoutError } = require('working-rcon');
const prometheus = require('prom-client');

const Gauge = prometheus.Gauge;

const app = express();

async function getStats(ip, port, password) {
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
    return result;
}

const status = new Gauge({name: "srcds_status", help: "The server's status, 0 = offline/bad password, 1 = online"});
const cpu = new Gauge({name: "srcds_cpu", help: "Probably the priority level of the srcds executable from an operating system point of view (0 - No priority, 10 - biggest priority)"});
const netin = new Gauge({name: "srcds_netin", help: "Incoming bandwidth, in kbps, received by the server"});
const netout = new Gauge({name: "srcds_netout", help: "Incoming bandwidth, in kbps, sent by the server"});
const uptime = new Gauge({name: "srcds_uptime", help: "The server's uptime, in minutes"});
const maps = new Gauge({name: "srcds_maps", help: "The number of maps played on that server since it's start"});
const fps = new Gauge({name: "srcds_fps", help: "The server's tick (10 fps on idle, 64 fps for 64 ticks server, 128 fps for 128 ticks..)"});
const players = new Gauge({name: "srcds_players", help: "The number of real players actually connected on the server"});
const svms = new Gauge({name: "srcds_svms", help: "ms per sim frame"});
const varms = new Gauge({name: "srcds_varms", help: "ms variance"});
const tick = new Gauge({name: "srcds_tick", help: "The time in MS per tick"});

app.get('/metrics', (req, res) => {
    var ip = req.query.ip;
    var port = req.query.port;
    var password = req.query.password;

    if (ip == null || port == null || password == null){
        res.send("Missing parameter, either IP, port or RCON password");
    } else {
        getStats(ip, port, password).then(result => {
            var resultArray = result.split(/\r?\n/);
            resultArray.pop();
            resultArray.shift();
            var finalArray = resultArray[0].split(/\s+/);
            finalArray.shift();

            status.set((Number(1)));
            cpu.set((Number(finalArray[0])));
            netin.set((Number(finalArray[1])));
            netout.set((Number(finalArray[2])));
            uptime.set((Number(finalArray[3])));
            maps.set((Number(finalArray[4])));
            fps.set((Number(finalArray[5])));
            players.set((Number(finalArray[6])));
            svms.set((Number(finalArray[7])));
            varms.set((Number(finalArray[8])));
            tick.set((Number(finalArray[9])));

            res.end(prometheus.register.metrics());
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

            res.end(prometheus.register.metrics());
        })
    }
});

app.listen(9591);