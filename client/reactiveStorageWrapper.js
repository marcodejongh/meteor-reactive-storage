/*global ReactiveStorageWrapper:true*/

ReactiveStorageWrapper = class ReactiveStorageWrapper {
  constructor(storage) {
    this._storage = storage;
    this._dependencies = {};
    this._updateLength();
  }

  _updateLength() {
    this.length = this._storage.length;
  }

  _depend(item) {
    let dependency = this._dependencies[item];

    if (!dependency) {
      dependency = this._addDepencency(item);
    }

    dependency.depend();
  }

  _addDepencency(item) {
    return this._dependencies[item] = new Tracker.Dependency;
  }

  _dependencyChanged(item) {
    let dependency = this._dependencies[item];

    if (dependency) {
      dependency.changed();
    }
  }

  _allDependenciesChanged() {
    _.invoke(this._dependencies, 'changed');
  }

  /**
   * When passed a number n, this method will return the name of the nth key in the storage.
   *
   * @param {Number} number
   * @returns {String}
   */
  key(number) {
    return this._storage.key(number);
  }

  /**
   * When passed a key name, will return that key's value.
   * Registers a dependency on the key.
   *
   * @param {String} keyName the name of the key you want to retrieve the value of.
   * @returns {String} the value of the key
   */
  getItem(keyName) {
    this._depend(keyName);
    return this._storage.getItem(keyName);
  }

  /**
   * When passed a key name and keyValue, will add that key to the storage, or update that key's keyValue if it already exists.
   * Triggers dependency changed on all dependents of the key
   *
   * @param {String} keyName the name of the key you want to create/update.
   * @param {String} keyValue the value you want to give the key you are creating/updating.
   */
  setItem(keyName, keyValue) {
    this._dependencyChanged(keyName);
    this._storage.setItem(keyName, keyValue);
    this._updateLength();
  }

  /**
   * When passed a key name, will remove that key from the storage.
   * Triggers dependency changed on all dependents of the key
   *
   * @param {String} keyName the name of the key you want to remove.
   */
  removeItem(keyName) {
    this._storage.removeItem(keyName);
    this._dependencyChanged(keyName);
    this._updateLength();
  }

  /**
   * When invoked, will empty all keys out of the storage.
   * Triggers dependency changed on all dependents of keys
   */
  clear() {
    this._storage.clear();
    this._allDependenciesChanged();
    this._updateLength();
  }
};

reactiveLocalStorage = new ReactiveStorageWrapper(localStorage);
reactiveSessionStorage = new ReactiveStorageWrapper(sessionStorage);
