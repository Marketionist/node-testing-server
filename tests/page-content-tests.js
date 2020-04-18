'use strict';
/* eslint new-cap: 0 */ // --> OFF for Selector

const http = require('http');
const url = require('url');
let { nodeTestingServer } = require('../index.js');
const { Selector } = require('testcafe');

// Settings for node testing server
nodeTestingServer.config = {
    hostname: 'localhost',
    port: 3001,
    logsEnabled: 2,
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
};

/**
 * Creates request
 * @param {string} method
 * @param {string} requestUrl
 * @param {string} bodyString
 * @returns {Promise} response
 */
function createRequest (method, requestUrl, bodyString = '') {
    return new Promise((resolve, reject) => {
        // Check incoming body string to have proper JSON inside of it
        const requestBody = bodyString.length > 0 ? JSON.stringify(JSON.parse(bodyString)) : '';
        const contentType = method.toUpperCase() === 'GET' ? 'text/html' : 'application/json';
        const spacesToIndent = 4;

        // Set options for request
        const parsedUrl = url.parse(requestUrl);
        const options = {
            protocol: parsedUrl.protocol,
            auth: parsedUrl.auth,
            hostname: parsedUrl.hostname,
            path: parsedUrl.path,
            hash: parsedUrl.hash,
            port: parsedUrl.port,
            method: method,
            headers: {
                'Content-Type': contentType,
                'Connection': 'close',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';

            console.log(`\nResponse status: ${res.statusCode}`);
            console.log(`\nResponse headers: ${JSON.stringify(res.headers, null, spacesToIndent)}`);

            res.setEncoding('utf8');

            res.on('data', (chunk) => {
                // Accumulate all data from response
                data += chunk;
            });
            res.on('end', () => {
                let response = data.length > 0 ? data : 'empty';

                console.log(`\nResponse body: ${response}`);
                // Resolve after response was finished and all data from response was accumulated
                resolve(data);
            });
        });

        req.on('error', (err) => {
            console.log(`Problem with request: ${err.message}`);
            reject(err);
        });

        // Write data to request body
        req.write(requestBody);
        req.end();

    });
}

fixture(
    'node-testing-server .html page content tests'
).before(async (ctx) => {
    // Output some information about current tests process
    console.log(`==> Tests running at: ${process.cwd()}`);
    console.log(`==> With argv: ${process.argv}`);

    // Start node testing server
    await nodeTestingServer.start();
}).after(async (ctx) => {
    // Stop node testing server
    await nodeTestingServer.stop();
});

test.page(
    `http://${nodeTestingServer.config.hostname}:${nodeTestingServer.config.port}/`
)(
    'should get the h1 text from the /index.html main test server page',
    async (t) => {
        const titleMain = Selector('h1.title-main');

        await t.expect(titleMain.innerText)
            .eql('Main page of node testing server');
    }
);

test.page(
    `http://${nodeTestingServer.config.hostname}` +
        `:${nodeTestingServer.config.port}/test.html`
)(
    'should get the first list item text from the /test.html server page',
    async (t) => {
        const listItemFirst = Selector('.items li').nth(0);

        await t.expect(listItemFirst.innerText).eql('First');
    }
);

test(
    'should get the post body JSON from the /post server page',
    async (t) => {
        const responseJSON = await createRequest(
            'POST',
            `http://${nodeTestingServer.config.hostname}:${nodeTestingServer.config.port}/post`,
            '{ "test1": 1, "test2": "Test text" }'
        );

        await t.expect(JSON.parse(responseJSON).test2).eql('Test text');
    }
);
