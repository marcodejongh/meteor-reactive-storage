function getRandomItem() {
  return Math.floor(Math.random() * 90000) + 10000;
}

describe('ReactiveLocalStorage', function() {
  describe('Unit tests', function() {
    let storage;
    let instance;

    beforeEach(function() {
      storage = localStorage;
      storage.clear();
      instance = new ReactiveStorageWrapper(storage);
    });

    afterEach(function() {
      storage.clear();
    });

    describe('#getItem', function() {
      it('Should return undefined', function() {
        const testItem = 'foo';
        expect(instance.getItem(testItem)).to.equal(null);
      });

      describe('Called with a key that already exists in Storage', function() {
        it('Should return the value', function() {
          const testItem = getRandomItem();
          const testValue = 'test123456';

          storage.setItem(testItem, testValue);

          expect(instance.getItem(testItem)).to.equal(testValue);
        });
      });
    });

    describe('#setItem', function() {
      it('Should update the value in the storage', function() {
        const testItem = getRandomItem();
        const testValue = '123456';
        instance.setItem(testItem, testValue);
        expect(storage.getItem(testItem)).to.equal(testValue);
      });

      it('Should increase the lenght property', function() {
        let newLen = storage.length + 1;
        const testItem = getRandomItem();
        const testValue = '123456';
        instance.setItem(testItem, testValue);
        expect(instance.length).to.equal(newLen);
      });
    });

    describe('#removeItem', function() {
      let testItem;

      beforeEach(function() {
        testItem = getRandomItem();
        storage.setItem(testItem, 'whatever');
      });
      it('Should remove the item', function() {
        instance.removeItem(testItem);
        expect(storage.getItem(testItem)).to.equal(null);
      });

      it('Should decrease the lenght property', function() {
        let newLen = storage.length - 1;
        instance.removeItem(testItem);
        expect(instance.length).to.equal(newLen);
      });
    });

    describe('#clear', function() {
      let testItem1;
      let testItem2;

      beforeEach(function() {
        testItem1 = getRandomItem();
        testItem2 = getRandomItem();
        storage.setItem(testItem1, 'whatever');
        storage.setItem(testItem2, 'foobar');
      });

      it('Should clear the storage', function() {
        instance.clear();
        expect(storage.getItem(testItem1)).to.equal(null);
        expect(storage.getItem(testItem2)).to.equal(null);
      });

      it('Should decrease the lenght property', function() {
        let newLen = storage.length - 2;
        instance.clear();
        expect(instance.length).to.equal(newLen);
      });
    });
  });

  describe('Integration tests', function() {
    _.each([reactiveLocalStorage, reactiveSessionStorage], function(instance, pos) {
      beforeEach(function() {
        instance.clear();
      });

      describe(pos ? 'reactiveLocalStorage' : 'reactiveSessionStorage', function() {
        describe('#getItem', function() {
          describe('When run from within a autorun', function() {
            it('Should rerun the autorun each time setItem is called', function(done) {
              let runCount = 0;
              const testItem = getRandomItem();

              this.timeout(5000);

              Tracker.autorun(function() {
                runCount++;
                instance.getItem(testItem);
              });

              Meteor.setTimeout(() => instance.setItem(testItem, '1'), 100);
              Meteor.setTimeout(() => instance.setItem(testItem, '2'), 150);
              Meteor.setTimeout(() => instance.setItem(testItem, '3'), 200);
              Meteor.setTimeout(() => instance.setItem(testItem, '4'), 250);

              Meteor.setTimeout(function() {
                try {
                  expect(runCount).to.equal(5);
                  done();
                } catch (e) {
                  done(e);
                }
              }, 400);
            });
          });
        });

        describe('#removeItem', function() {
          it('Should rerun the dependents one more time', function(done) {
            let runCount = 0;
            const testItem = getRandomItem();

            this.timeout(5000);

            Tracker.autorun(function() {
              runCount++;
              instance.getItem(testItem);
            });

            Meteor.setTimeout(() => instance.setItem(testItem, '1'), 100);
            Meteor.setTimeout(() => instance.removeItem(testItem), 200);

            Meteor.setTimeout(function() {
              try {
                expect(runCount).to.equal(3);
                done();
              } catch (e) {
                done(e);
              }
            }, 500);
          });
        });

        describe('#clear', function() {
          it('Should rerurn all dependents', function(done) {
            let autorun1Count = 0;
            let autorun2Count = 0;
            let autorun3Count = 0;
            const testItem1 = getRandomItem();
            const testItem2 = getRandomItem();
            const testItem3 = getRandomItem();

            this.timeout(5000);

            Tracker.autorun(function() {
              autorun1Count++;
              instance.getItem(testItem1);
            });

            Tracker.autorun(function() {
              autorun2Count++;
              instance.getItem(testItem2);
            });

            Tracker.autorun(function() {
              autorun3Count++;
              instance.getItem(testItem3);
            });

            Meteor.setTimeout(() => instance.clear(), 100);

            Meteor.setTimeout(function() {
              try {
                expect(autorun1Count).to.equal(2);
                expect(autorun2Count).to.equal(2);
                expect(autorun3Count).to.equal(2);
                done();
              } catch (e) {
                done(e);
              }
            }, 500);
          });
        });

        describe('StorageEvent handling', function() {
          describe('When key is null & newValue is null & oldValue is null', function() {
            it('Should call clear on the storage', function(done) {
              instance.setItem('testValue1', '1');
              instance.setItem('testValue2', '2');
              instance.setItem('testValue3', '3');

              onStorageEvent(new StorageEvent('storage', {
                key: null,
                newValue: null,
                oldValue: null,
                storageArea: instance._storage
              }));

              Meteor.defer(function() {
                try {
                  expect(instance.length).to.equal(0);
                  done();
                } catch (e) {
                  done(e);
                }
              });
            });
          });

          describe('When key is a string & newValue is a string', function() {
            it('Should call setItem on the storage', function(done) {
              let testKey = 'testValue';
              let testValue = '1234567';

              instance.setItem(testKey, '1');

              onStorageEvent(new StorageEvent('storage', {
                key: testKey,
                newValue: testValue,
                storageArea: instance._storage
              }));

              Meteor.defer(function() {
                try {
                  expect(instance.getItem(testKey)).to.equal(testValue);
                  done();
                } catch (e) {
                  done(e);
                }
              });
            });
          });

          describe('When key is a string & newValue is null', function() {
            it('Should call removeItem on the storage', function(done) {
              let testKey = 'testValue';

              instance.setItem(testKey, '1');

              onStorageEvent(new StorageEvent('storage', {
                key: testKey,
                newValue: null,
                storageArea: instance._storage
              }));

              Meteor.defer(function() {
                try {
                  expect(instance.getItem(testKey)).to.equal(null);
                  done();
                } catch (e) {
                  done(e);
                }
              });
            });
          });
        });
      });
    });
  });

});
