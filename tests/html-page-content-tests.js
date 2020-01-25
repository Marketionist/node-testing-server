'use strict';
/* eslint new-cap: 0 */ // --> OFF for Selector

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
