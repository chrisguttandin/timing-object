const { env } = require('process');

module.exports = (config) => {
    config.set({
        browserNoActivityTimeout: 20000,

        concurrency: 2,

        files: [
            {
                included: false,
                pattern: '../../src/**',
                served: false,
                watched: true
            },
            '../../test/unit/**/*.js'
        ],

        frameworks: ['mocha', 'sinon-chai'],

        preprocessors: {
            '../../test/unit/**/*.js': 'webpack'
        },

        webpack: {
            mode: 'development',
            module: {
                rules: [
                    {
                        test: /\.ts?$/,
                        use: {
                            loader: 'ts-loader'
                        }
                    }
                ]
            },
            resolve: {
                extensions: ['.js', '.ts']
            }
        },

        webpackMiddleware: {
            noInfo: true
        }
    });

    if (env.TRAVIS) {
        config.set({
            browserStack: {
                accessKey: env.BROWSER_STACK_ACCESS_KEY,
                username: env.BROWSER_STACK_USERNAME
            },

            browsers: ['ChromeBrowserStack', 'FirefoxBrowserStack', 'SafariBrowserStack'],

            captureTimeout: 120000,

            customLaunchers: {
                ChromeBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'chrome',
                    os: 'OS X',
                    os_version: 'High Sierra' // eslint-disable-line camelcase
                },
                FirefoxBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'firefox',
                    os: 'Windows',
                    os_version: '10' // eslint-disable-line camelcase
                },
                SafariBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'safari',
                    os: 'OS X',
                    os_version: 'High Sierra' // eslint-disable-line camelcase
                }
            },

            tunnelIdentifier: env.TRAVIS_JOB_NUMBER
        });
    } else {
        config.set({
            browsers: ['ChromeHeadless', 'ChromeCanaryHeadless', 'FirefoxHeadless', 'FirefoxDeveloperHeadless', 'Safari']
        });
    }
};
