# SRCDS Prometheus exporter

Works (or should work) with the following servers :

* Tested :
    * CSGO (tested)
* Not tested :
    * CSS
    * L4D2
    * GMod
    * TF2
    * HL2DM

## How to install

### Method 1 : Download sources and run

1. Download the repo (using git clone or direct zip download)
2. Start the script with node : `node index.js`, you can create a service or run it in a screen to keep it active in background

### Method 2 : With docker

`docker run -d -p <external port>:9591 --name srcds_exporter srcds_exporter:latest`

## Configure Prometheus

Add the following configuration to Prometheus static configuration :

```
- job_name: 'srcds'
    static_configs:
      - targets: ["<ip>:<port>:<rconpassword>"]


    relabel_configs:
      - source_labels: [__address__]
        regex: "(.+):.+:.+"
        replacement: "$1"
        target_label: __param_ip
      - source_labels: [__address__]
        regex: ".+:(.+):.+"
        replacement: "$1"
        target_label: __param_port
      - source_labels: [__address__]
        regex: ".+:.+:(.+)"
        replacement: "$1"
        target_label: __param_password
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: <IP>:<port> # Real exporter's IP:Port
```

## How to access

If you want to see what the exporter returns, you can access :
 
 `http://<ip>:9591/metrics?ip=<srcds ip>&?port=<srcds port>&?password=<rcon password>`
 
## Grafana dashboard

Is there a Grafana dashboard available ? Of course!

https://grafana.com/grafana/dashboards/11333


### Support

If you encounter any issue, feel free to open an issue.
If you want to contact me :

* Twitter : [@Unyxos](https://twitter.com/Unyxos)
* Discord : Unyxos#5968
* Email : [me@corentincloss.fr](mailto://me@corentincloss.fr)