module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {}
    },
    jasmineHtmlReporter: {
      suppressAll: true
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/pada'),
      subdir: ".",
      reporters: [{ type: 'html' }, { type: 'text-summary' }]
    },
    reporters: ["progress", "kjhtml"],
    browsers: ["CustomChrome", "Chrome"],
    customLaunchers: {
      CustomChrome: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', "--disable-gpu", "--disable-translate", "--disable-extensions"]
      }
    },
    restartOnFileChange: true
  });
};