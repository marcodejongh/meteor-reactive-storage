meteor-reactive-storage
================================

Adds reactivity to localstorage & sessionstorage

#Installation

```
meteor add mdj:reactive-storage
```

#Usage

The package adds ```reactiveLocalStorage``` and ```reactiveSessionStorage``` to the global scope of your application.
It wraps around the API of the normal localstorage adding reactivity. Use is the same as the normal ```localStorage``` or ```sessionStorage```

```js
reactiveLocalStorage.setItem('someValue', '1');

Template.someTemplate.helpers({
  getStuffFromStorage: function () {
    return reactiveLocalStorage.getItem('someValue');
  }
});

//Clicking someButton will cause the getStuffFromStorage helper to rerun
Template.someTemplate.events({
  'click someButton': function () { 
    var someValue = Number(reactiveLocalStorage.getItem('someValue'));
    reactiveLocalStorage.setItem('someValue', someValue++);
  }
});

```

#API

## key(number)

When passed a number n, this method will return the name of the nth key in the storage.

### Params:

* **Number** *number* integer representing the number of the key you want to get the name of. This is a zero-based index.

### Return:

* **String** the name of the key.

## getItem(keyName)

When passed a key name, will return that key's value.
Registers a dependency on the key.

### Params:

* **String** *keyName* the name of the key you want to retrieve the value of.

### Return:

* **String** the value of the key

## setItem(keyName, keyValue)

When passed a key name and keyValue, will add that key to the storage, or update that key's keyValue if it already exists.
Triggers dependency changed on all dependents of the key

### Params:

* **String** *keyName* the name of the key you want to create/update.
* **String** *keyValue* the value you want to give the key you are creating/updating.

## removeItem(keyName)

When passed a key name, will remove that key from the storage.
Triggers dependency changed on all dependents of the key

### Params:

* **String** *keyName* the name of the key you want to remove.

## clear()

When invoked, will empty all keys out of the storage.
Triggers dependency changed on all dependents of keys
