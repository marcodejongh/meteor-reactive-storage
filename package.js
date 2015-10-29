Package.describe({
  name: 'mdj:reactive-storage',
  version: '1.0.1',
  summary: 'Adds a reactive version of localStorage & sessionStorage',
  git: 'https://github.com/marcodejongh/meteor-reactive-storage',
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
    'client/reactiveStorageWrapper.js',
    'client/storageEventHandler.js'
  ], 'client');

  api.export(['reactiveLocalStorage', 'reactiveSessionStorage']);
  api.export(['ReactiveStorageWrapper', 'onStorageEvent'], {
    testOnly: true
  });

});

Package.onTest(function(api) {
  api.use([
    'ecmascript',
    'mike:mocha-package@0.5.8',
    'practicalmeteor:sinon',
    'practicalmeteor:chai',
    'underscore',
    'mdj:reactive-storage',
    'tracker'
  ]);

  api.addFiles([
    'test/client/reactiveStorageWrapper.test.js'
  ], 'client');
});
