# node-testing-server

[![npm version](https://img.shields.io/npm/v/node-testing-server.svg)](https://www.npmjs.com/package/node-testing-server)
[![NPM License](https://img.shields.io/npm/l/node-testing-server.svg)](https://github.com/Marketionist/node-testing-server/blob/master/LICENSE)

Simple node.js server to generate HTML pages for testing

## Supported versions
[Node.js](http://nodejs.org/):
- 6.x
- 7.x

## Installation
`npm install node-testing-server --save-dev`

## Importing and configuring
You can require node-testing-server and configure it like this:

```javascript
let nodeTestingServer = require('node-testing-server').nodeTestingServer;

// Setting for node testing server
nodeTestingServer.config = {
    hostname: 'localhost',
    port: 3001,
    logsEnabled: false,
    pages: {
        '/test.html': `<ul class="items">
                        <li>First</li>
                        <li>Second</li>
                        <li>Third</li>
                        <li>Fourth</li>
                        <li>Fifth</li>
                        <li>Sixth</li>
                        <li>Seventh</li>
                        <li>Eighth</li>
                        <li>Ninth</li>
                        <li>Tenth</li>
                    </ul>`
    }
}
```

## Usage
Start and stop server like this:

```javascript
// Start node test server
nodeTestingServer.start(nodeTestingServer.config.port, nodeTestingServer.config.hostname);

// Stop node testing server
nodeTestingServer.stop();
```

## Thanks
If this script was helpful for you, please give it a **Star**
on [github](https://github.com/Marketionist/node-testing-server) and
[npm](https://www.npmjs.com/package/node-testing-server)
