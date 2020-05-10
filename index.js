'use strict';

/*
 * Created by marketionist on 21.01.2017
 */

// #############################################################################

const http = require('http');
const fs = require('fs');
const path = require('path');

const packageName = '[node-testing-server]:';

/**
 * Transforms incoming stream to string
 * @param {stream} stream
 * @param {function} callback
 */
function streamToString (stream, callback) {
    let chunks = [];

    stream.on('data', (chunk) => {
        chunks.push(chunk);
    });
    stream.on('end', () => {
        callback(Buffer.concat(chunks).toString());
    });
}

let nodeTestingServer = {
    // Config default options
    config: {
        hostname: 'localhost',
        port: 3001,
        logsEnabled: 0,
        pages: {}
    },

    server: http.createServer((req, res) => {
        const status200 = 200;
        const status404 = 404;

        // Show logs if they are enabled in nodeTestingServer.config.logsEnabled
        if (nodeTestingServer.config.logsEnabled >= 1) {
            console.log('\n========');
            // Print incoming request METHOD, URL
            console.log(`Request: ${req.method} ${req.url}`);
        }
        if (nodeTestingServer.config.logsEnabled === 2) {
            // Print incoming request headers
            console.log('\nRequest headers:\n', req.headers, '\n');
            // Start counting response time
            console.time('Response time');
        }

        if (req.method === 'POST') {
            if (req.url === '/post') {
                let chunks = [];

                res.writeHead(status200, { 'Content-Type': 'application/json', 'Connection': 'close' });

                req.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                req.on('end', () => {
                    const data = Buffer.concat(chunks);

                    res.end(
                        `\nIncoming request headers: ${JSON.stringify(req.headers)}` +
                        `\nIncoming request body: ${JSON.stringify(JSON.parse(data))}`
                    );

                    // Show logs if they are enabled in nodeTestingServer.config.logsEnabled
                    if (nodeTestingServer.config.logsEnabled >= 1) {
                        const spacesToIndent = 4;

                        console.log(packageName, 'Served back /post body JSON from the server to the client');

                        // Print outcoming response CODE
                        console.log(`\nResponse: ${res.statusCode}`);
                        console.log(
                            '\nResponse data (incoming request body):',
                            JSON.stringify(JSON.parse(data), null, spacesToIndent)
                        );
                        console.log('========');
                    }
                    if (nodeTestingServer.config.logsEnabled === 2) {
                        // Print response time
                        console.log(' ^');
                        console.log(' |');
                        console.timeEnd('Response time');
                    }

                    return;
                });
            }
        } else if (req.method === 'GET') {
            if (req.url === '/') {
                const isCalledExternally = __dirname.includes('node_modules');
                let mainPagePath = path.join(__dirname, 'public/index.html');
                const pathFromRoot = isCalledExternally ?
                    path.resolve(__dirname, '../..', 'public/index.html') :
                    mainPagePath;

                fs.exists(pathFromRoot, (exists) => {
                    if (exists) {
                        mainPagePath = pathFromRoot;
                    } else {
                        console.log(
                            packageName,
                            'There is no "public/index.html" in your ' +
                            'root folder - so serving from ' +
                            'node_modules/node-testing-server/public/index.html'
                        );
                    }

                    res.writeHead(status200, { 'Content-Type': 'text/html', 'Connection': 'close' });

                    let stream = fs.createReadStream(mainPagePath);

                    streamToString(stream, (data) => {
                        res.end(data);

                        // Show logs if they are enabled in nodeTestingServer.config.logsEnabled
                        if (nodeTestingServer.config.logsEnabled >= 1) {
                            // Print outcoming response CODE
                            console.log(`\nResponse: ${res.statusCode}`);
                            console.log(packageName, `Served ${mainPagePath} from the server to the client`);
                            console.log('\nResponse data:', data);
                            console.log('========');
                        }
                        if (nodeTestingServer.config.logsEnabled === 2) {
                            console.log(' ^');
                            console.log(' |');
                            console.timeEnd('Response time');
                        }

                    });
                });

                return;
            }

            let fileURL = req.url;
            let filePath = path.resolve(`public/${fileURL}`);
            let fileExtension = path.extname(filePath);
            // All supported file extensions
            const supportedFileExtensions = [
                '.html',
                '.json',
                '.js',
                '.css',
                '.jpg',
                '.png'
            ];
            // Set initial Content-Type
            let contentType;

            // Check fileExtension and set corresponding Content-Type
            switch (fileExtension) {
                case '.json':
                    contentType = 'application/json';
                    break;
                case '.js':
                    contentType = 'text/javascript';
                    break;
                case '.css':
                    contentType = 'text/css';
                    break;
                case '.jpg':
                    contentType = 'image/jpg';
                    break;
                case '.png':
                    contentType = 'image/png';
                    break;
                default:
                    contentType = 'text/html';
            }

            if (supportedFileExtensions.indexOf(fileExtension) === -1) {
                res.writeHead(status404, { 'Content-Type': 'text/html' });
                res.end(`<h1>Error 404: ${fileExtension} is not among supported file formats:
                    ${supportedFileExtensions.join(', ')}</h1>`);

                // Show logs if they are enabled in nodeTestingServer.config.logsEnabled
                if (nodeTestingServer.config.logsEnabled >= 1) {
                    // Print outcoming response CODE
                    console.log(`Response: ${res.statusCode}`);
                    console.log('========');
                }
            } else {
                fs.exists(filePath, (exists) => {
                    if (!exists) {
                        if (typeof nodeTestingServer.config.pages[fileURL] === 'undefined') {
                            res.writeHead(status404, { 'Content-Type': 'text/html' });
                            res.end(`<h1>Error 404: ${fileURL} is not set in nodeTestingServer.config.pages</h1>`);
                        } else {
                            // If requested page cannot be found in public/ folder,
                            // then it will be generated from nodeTestingServer.config.pages
                            res.writeHead(status200, { 'Content-Type': contentType });
                            res.end(nodeTestingServer.config.pages[fileURL]);
                            // Show logs if they are enabled in nodeTestingServer.config.logsEnabled
                            if (nodeTestingServer.config.logsEnabled >= 1) {
                                // Print outcoming response CODE
                                console.log(`Response: ${res.statusCode}`);
                                console.log(packageName, `Generated ${fileURL} from nodeTestingServer.config.pages`);
                                console.log('========');
                            }
                            if (nodeTestingServer.config.logsEnabled === 2) {
                                console.log(' ^');
                                console.log(' |');
                                console.timeEnd('Response time');
                            }
                        }

                        return;
                    }
                    res.writeHead(status200, { 'Content-Type': contentType });

                    let stream = fs.createReadStream(filePath);

                    streamToString(stream, (data) => {
                        res.end(data);

                        // Show logs if they are enabled in nodeTestingServer.config.logsEnabled
                        if (nodeTestingServer.config.logsEnabled >= 1) {
                            // Print outcoming response CODE
                            console.log(`\nResponse: ${res.statusCode}`);
                            console.log(packageName, `Served ${filePath} from the server to the client`);
                            console.log('\nResponse data:', data);
                            console.log('========');
                        }
                        if (nodeTestingServer.config.logsEnabled === 2) {
                            console.log(' ^');
                            console.log(' |');
                            console.timeEnd('Response time');
                        }

                    });

                    return;
                });
            }
        } else {
            res.writeHead(status404, { 'Content-Type': 'text/html' });
            res.end(`<h1>Error 404: ${req.method} is not supported</h1>`);

            // Show logs if they are enabled in nodeTestingServer.config.logsEnabled
            if (nodeTestingServer.config.logsEnabled >= 1) {
                // Print outcoming response CODE
                console.log(`Response: ${res.statusCode}`);
                console.log('========');
            }
        }
    }),

    start () {
        return this.server.listen(nodeTestingServer.config.port, nodeTestingServer.config.hostname)
            .on('listening', () => console.log(
                packageName,
                `Server running at http://${nodeTestingServer.config.hostname}:${nodeTestingServer.config.port}/`))
            .on('error', (err) => console.log('Error starting server:', err));
    },

    stop () {
        return this.server.close()
            .on('close', () => console.log(
                packageName,
                `Server stopped at http://${nodeTestingServer.config.hostname}:${nodeTestingServer.config.port}/`))
            .on('error', (err) => console.log('Error stopping server:', err));
    }

};

exports.nodeTestingServer = nodeTestingServer;
