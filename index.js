'use strict';

/*
 * Created by marketionist on 21.01.2017
 */

// #############################################################################

let http = require('http');
let fs = require('fs');
let path = require('path');

let packageName = '[node-testing-server]:';

let nodeTestingServer = {
    // Config default options
    config: {
        hostname: 'localhost',
        port: 3001,
        logsEnabled: 0,
        pages: {}
    },

    server: http.createServer((req, res) => {
        let status200 = 200;
        let status404 = 404;

        // Show logs if they are enabled in nodeTestingServer.config.logsEnabled
        if (nodeTestingServer.config.logsEnabled >= 1) {
            // Print incoming request METHOD, URL and outcoming response CODE
            console.log(`${req.method} ${req.url} ${res.statusCode}`);
        }
        if (nodeTestingServer.config.logsEnabled === 2) {
            // Print incoming request headers
            console.log('\nRequest headers:\n', req.headers, '\n');
            // Start counting response time
            console.time('Response time');
        }

        if (req.method === 'GET') {
            if (req.url === '/') {
                let mainPagePath = path.resolve('public/index.html');

                res.writeHead(status200, { 'Content-Type': 'text/html' });
                fs.createReadStream(mainPagePath).pipe(res);
                // Show logs if they are enabled in nodeTestingServer.config.logsEnabled
                if (nodeTestingServer.config.logsEnabled >= 1) {
                    console.log(packageName, `Served ${mainPagePath} from the server to the client`);
                }
                if (nodeTestingServer.config.logsEnabled === 2) {
                    console.timeEnd('Response time');
                }

                return;
            }

            let fileURL = req.url;
            let filePath = path.resolve(`public/${fileURL}`);
            let fileExtension = path.extname(filePath);

            if (fileExtension === '.html') {
                fs.exists(filePath, (exists) => {
                    // If requested page cannot be found in public/ folder,
                    // then it will be generated from nodeTestingServer.config.pages
                    if (!exists) {
                        res.writeHead(status200, { 'Content-Type': 'text/html' });
                        res.end(nodeTestingServer.config.pages[fileURL]);
                        // Show logs if they are enabled in nodeTestingServer.config.logsEnabled
                        if (nodeTestingServer.config.logsEnabled >= 1) {
                            console.log(packageName, `Generated ${fileURL} from nodeTestingServer.config.pages`);
                        }
                        if (nodeTestingServer.config.logsEnabled === 2) {
                            console.timeEnd('Response time');
                        }

                        return;
                    }
                    res.writeHead(status200, { 'Content-Type': 'text/html' });
                    fs.createReadStream(filePath).pipe(res);
                    // Show logs if they are enabled in nodeTestingServer.config.logsEnabled
                    if (nodeTestingServer.config.logsEnabled >= 1) {
                        console.log(packageName, `Served ${filePath} from the server to the client`);
                    }
                    if (nodeTestingServer.config.logsEnabled === 2) {
                        console.timeEnd('Response time');
                    }

                    return;
                });
            } else {
                res.writeHead(status404, { 'Content-Type': 'text/html' });
                res.end(`<h1>Error 404: ${fileURL} is not an HTML file</h1>`);
            }
        } else {
            res.writeHead(status404, { 'Content-Type': 'text/html' });
            res.end(`<h1>Error 404: ${req.method} is not supported</h1>`);
        }
    }),

    start() {
        return this.server.listen(nodeTestingServer.config.port, nodeTestingServer.config.hostname)
            .on('listening', () => console.log(
                packageName,
                `Server running at http://${nodeTestingServer.config.hostname}:${nodeTestingServer.config.port}/`))
            .on('error', (err) => console.log('Error starting server:', err));
    },

    stop() {
        return this.server.close()
            .on('close', () => console.log(
                packageName,
                `Server stopped at http://${nodeTestingServer.config.hostname}:${nodeTestingServer.config.port}/`))
            .on('error', (err) => console.log('Error stopping server:', err));
    }

};

exports.nodeTestingServer = nodeTestingServer;
