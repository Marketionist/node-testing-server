# node-testing-server

[![Actions Status](https://github.com/Marketionist/node-testing-server/workflows/Build%20and%20Test/badge.svg)](https://github.com/Marketionist/node-testing-server/actions)
[![npm version](https://img.shields.io/npm/v/node-testing-server.svg)](https://www.npmjs.com/package/node-testing-server)
[![NPM License](https://img.shields.io/npm/l/node-testing-server.svg)](https://github.com/Marketionist/node-testing-server/blob/master/LICENSE)

Simple node.js server to generate .html, .json, .js, .css, .jpg, .png pages for end-to-end and API testing

## Supported versions
[Node.js](http://nodejs.org/):
- 10.x
- 11.x
- 12.x
- 13.x
- 14.x

## Installation
`npm install node-testing-server --save-dev`

## Importing and configuring
You can require node-testing-server and configure it like this:

```javascript
let { nodeTestingServer } = require('node-testing-server');

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
- 1 - partial logs are enabled - prints out:
  * incoming request METHOD, URL and outcoming response CODE
  * pages that were generated or served
- 2 - full logs are enabled - prints out:
  * incoming request METHOD, URL and outcoming response CODE
  * pages that were generated or served
  * incoming request headers
  * response time

## Usage
Start and stop server like this:

```javascript
// Start node testing server
nodeTestingServer.start();

// Stop node testing server
nodeTestingServer.stop();
```

If you will configure the `/test.html` server page as described in
[Importing and configuring](#importing-and-configuring) section above, and send
a `GET` request to `http://localhost:3001/test.html`, then the server will
return html page with:

```html
<ul class="items">
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
</ul>
```

There are also 2 default pre-configured pages that you can hit:

1. Sending `GET` request to `http://localhost:3001/` will return:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Node testing server - main page</title>
</head>
<body>
    <h1 class="title-main">Main page of node testing server</h1>
    <p>This page was constructed for testing purposes.</p>
    <ul>More info about <strong>node-testing-server</strong>:
        <li><a href="https://github.com/Marketionist/node-testing-server">on Github</a></li>
        <li><a href="https://www.npmjs.com/package/node-testing-server">on npm</a></li>
    </ul>
</body>
</html>
```

> Note: if you want to serve your own page from `http://localhost:3001/` - just
> create it in `public/index.html` in your root folder - otherwise it will be
> served from `node_modules/node-testing-server/public/index.html`

2. Sending `POST` request to `http://localhost:3001/post` with `{"test1":1,"test2":"Test text"}`
in the body will return a string with request headers and body:

```
`Incoming request headers: {"content-type":"application/json","connection":"close","content-length":"31","host":"localhost:3001"}
Incoming request body: {"test1":1,"test2":"Test text"}`
```

You can see live examples of node-testing-server usage in
[page-content-tests.js](https://github.com/Marketionist/node-testing-server/blob/master/tests/page-content-tests.js),
in [Protractor tests](https://github.com/Marketionist/protractor-numerator/blob/master/test/spec.ts)
and in [TestCafe tests](https://github.com/Marketionist/testcafe-cucumber-steps/blob/master/tests/testing-server.js)

## Thanks
If this script was helpful to you, please give it a **★ Star**
on [Github](https://github.com/Marketionist/node-testing-server)
