# node-testing-server

[![Build Status](https://travis-ci.org/Marketionist/node-testing-server.svg?branch=master)](https://travis-ci.org/Marketionist/node-testing-server)
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

// Settings for node testing server
nodeTestingServer.config = {
    hostname: 'localhost',
    port: 3001,
    logsEnabled: 0,
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

By default logs are disabled (`logsEnabled` is set to 0). You can set
`logsEnabled` config to one of 3 levels:
- 0 - logs disabled
- 1 - partial logs are enabled
- 2 - full logs are enabled

## Usage
Start and stop server like this:

```javascript
// Start node testing server
nodeTestingServer.start();

// Stop node testing server
nodeTestingServer.stop();
```

You can see the live example of node-testing-server usage with Protractor tests
[here](https://github.com/Marketionist/protractor-numerator/blob/master/test/spec.js)

## Thanks
If this script was helpful for you, please give it a **Star**
on [github](https://github.com/Marketionist/node-testing-server) and
[npm](https://www.npmjs.com/package/node-testing-server)
