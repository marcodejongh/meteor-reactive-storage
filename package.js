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
    'jquery',
    'tracker'
  ]);

  api.addFiles([
    'client/reactiveStorageWrapper.js'
  ], 'client');

  api.export(['reactiveLocalStorage', 'reactiveSessionStorage']);
  api.export('ReactiveStorageWrapper', {testOnly:true});

});

Package.onTest(function(api) {
  api.use([
    'ecmascript',
    'mike:mocha-package@0.5.8',
    'practicalmeteor:sinon',
    'practicalmeteor:chai',
    'underscore',
    'mdj:localstorage',
    'tracker'
  ]);

  api.addFiles([
    'test/client/reactiveStorageWrapper.test.js'
  ], 'client');
});
