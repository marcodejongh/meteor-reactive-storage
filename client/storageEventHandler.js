/* global onStorageEvent:true*/
onStorageEvent = function onStorageEvent(storageEvent) {
  let storage;

  if (localStorage === storageEvent.storageArea) {
    storage = reactiveLocalStorage;
  } else if (sessionStorage === storageEvent.storageArea) {
    storage = reactiveSessionStorage;
  } else {
    throw Meteor.error('Unknow storage area');
  }

  let key = storageEvent.key;
  let newValue = storageEvent.newValue;
  let oldValue = storageEvent.oldValue;

  let isClear = _.isNull(key) && _.isNull(newValue) && _.isNull(oldValue);
  let isSet = _.isString(key) && _.isString(newValue);
  let isRemove = _.isString(key) && _.isNull(newValue);

  if (isClear) {
    storage.clear();
    return;
  }

  if (isSet) {
    storage.setItem(key, newValue);
    return;
  }

  if (isRemove) {
    storage.removeItem(key);
    return;
  }
};

window.addEventListener('storage', onStorageEvent, false);
