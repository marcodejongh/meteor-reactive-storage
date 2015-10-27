Package.describe({
  name: 'mdj:localstorage',
  version: '0.0.1',
  summary: 'Adds a reactive version of local storage to your application',
  git: 'https://github.com/marcodejongh/meteor-localstorage',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');
  api.use([
    'ecmascript',
    'underscore',
    'templating',
    'jquery'
  ]);
});

Package.onTest(function(api) {
  api.use([
    'ecmascript',
    'mike:mocha-package@0.5.8',
    'practicalmeteor:sinon',
    'practicalmeteor:chai',
    'underscore'
  ]);
});
