exports.config = {
    directConnect: true,

    framework: 'jasmine2',

    specs: [
        'spec.js'
    ],

    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: [
                // Disable "Chrome is being controlled by automated test software" infobar
                '--disable-infobars'
            ],
            prefs: {
                // Disable Chrome's annoying password manager
                'profile.password_manager_enabled': false,
                'credentials_enable_service': false,
                'password_manager_enabled': false
            }
        }
    }
};
