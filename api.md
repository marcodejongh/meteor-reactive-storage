

<!-- Start client/reactiveStorageWrapper.js -->

global ReactiveStorageWrapper:true

## key(number)

When passed a number n, this method will return the name of the nth key in the storage.

### Params:

* **Number** *number* 

### Return:

* **String** 

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

<!-- End client/reactiveStorageWrapper.js -->

