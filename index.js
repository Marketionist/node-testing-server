'use strict';

/*
 * Created by marketionist on 21.01.2017
 */

// #############################################################################

let http = require('http');
let fs = require('fs');
let path = require('path');

let packageName = '[node-testing-server]';

exports.nodeTestingServer = {
    // Config default options
    config: {
        hostname: 'localhost',
        port: 3001,
        logsEnabled: false,
        pages: {}
    },

    server: http.createServer(function (req, res) {
        let status200 = 200;
        let status404 = 404;

        // If logs are enabled in nodeTestingServer.config.logsEnabled
        if (nodeTestingServer.config.logsEnabled) {
            // Print incoming request headers
            console.log(req.headers);
            // Print incoming request URL and METHOD
            console.log(`Request for ${req.url} by method ${req.method}`);
        }

        if (req.method === 'GET') {
            let fileURL;

            if (req.url === '/') {
                let mainPagePath = path.resolve('public/index.html');

                res.writeHead(status200, { 'Content-Type': 'text/html' });
                fs.createReadStream(mainPagePath).pipe(res);
            } else {
                fileURL = req.url;
            }

            let filePath = path.resolve(`public/${fileURL}`);
            let fileExtension = path.extname(filePath);

            // If logs are enabled in nodeTestingServer.config.logsEnabled
            if (nodeTestingServer.config.logsEnabled) {
                console.log(`${packageName}: Serving ${filePath} from the server to the client`);
            }

            if (fileExtension === '.html') {
                fs.exists(filePath, function (exists) {
                    // If requested page cannot be found in public folder,
                    // then it will be generated from nodeTestingServer.config.pages
                    if (!exists) {
                        if (nodeTestingServer.config.logsEnabled) {
                            console.log(`${packageName}: Generating ${fileURL} from nodeTestingServer.config.pages`);
                        }
                        res.writeHead(status200, { 'Content-Type': 'text/html' });
                        res.end(nodeTestingServer.config.pages[fileURL]);

                        return;
                    } else {
                        res.writeHead(status200, { 'Content-Type': 'text/html' });
                        fs.createReadStream(filePath).pipe(res);
                    }
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

    start(port, hostname) {
        return this.server.listen(port, hostname)
            .on('listening', () => console.log(`${packageName}: Server running
                at http://${hostname}:${port}/`))
            .on('error', (err) => console.log('Error starting server:', err));
    },

    stop() {
        return this.server.close()
            .on('close', () => console.log(`Server stopped at
                http://${nodeTestingServer.config.hostname}:${nodeTestingServer.config.port}/`))
            .on('error', (err) => console.log('Error stopping server:', err));
    }

};
