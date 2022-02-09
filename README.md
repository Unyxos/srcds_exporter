# SRCDS Prometheus exporter

Works (or should work) with the following servers :

* Working :
    * CSGO
    * GMod
* Not working (I'm planning on adding them in the near future) :
    * CSS
    * L4D2
    * TF2
    * HL2DM

## How to install

### Method 1 : Download sources and run

You need to have NodeJS installed if you want to run the sources, NVM (Node Version Manager) is a simple tool to get it running : https://github.com/nvm-sh/nvm

1. Download the repo (using git clone or direct zip download)
2. Enter the srcds_exporter directory and run `npm i`, this will install all required dependencies
3. Start the script with node : `node index.js`, you can create a service or run it in a screen to keep it active in background

### Method 2 : With docker

`docker run -d -p <external port>:9591 --name srcds_exporter corentincl/srcds_exporter:latest`

## Configure Prometheus

Add the following configuration to Prometheus static configuration :
```
- job_name: srcds
    params:
      ip: ['<srcds ip>']
      port: ['<srcds port>']
      password: ['<rcon password>']
      game: ['<game>']
    static_configs:
      - targets:
          - '<exporter ip>:<exporter port>'
```

Values for `game` field :

| Game   |      Value      |
|:----------:|:-------------:|
| CS:GO |  csgo |
| Garry's Mod |    gmod   |

## How to access

If you want to see what the exporter returns, you can access :
 
 `http://<ip>:9591/metrics?ip=<srcds ip>&port=<srcds port>&password=<rcon password>&game=<game>`
 
## Grafana dashboard

Is there a Grafana dashboard available ? Of course!

**CSGO** : https://grafana.com/grafana/dashboards/11333

**GMod** : Coming


### Support

If you encounter any issue, feel free to open an issue.
If you want to contact me :

* Twitter : [@Unyxos](https://twitter.com/Unyxos)
* Discord : Unyxos#1337
* Email : [me@corentincloss.fr](mailto://me@corentincloss.fr)
