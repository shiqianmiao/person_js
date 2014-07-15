var Storage = require('util/storage/localStorage.js');
var except = require('../lib/expect.js');

module.exports = function (defer) {
    describe('localStorage', function(){
        it('data between to different namespace won\'t be shared', function () {
            var S1 = new Storage('S1');
            var S2 = new Storage('S2');
            S1.set('foo', 'bar');
            S2.set('foo', 'notbar');
            except(S1.get('foo')).to.be('bar');
            except(S2.get('foo')).not.to.be('bar');
            S1.clear();
            except(S2.get('foo')).to.be('notbar');
            S2.clear();
        });
        it('data will gone after clear', function () {
            var s = new Storage('CL');
            s.set('f1', 'f1');
            s.set('f2', 'f2');
            s.clear();
            except(s.get('f1')).to.be(null);
            except(s.get('f2')).to.be(null);
        });
        it('all data will gone after global clear', function () {
            var s1 = new Storage('S1');
            var s2 = new Storage('S2');
            s1.set('foo', 'bar');
            s2.set('pub', 'hub');
            Storage.clear();
            except(s1.get('foo')).to.be(null);
            except(s2.get('pub')).to.be(null);
        });
    });
    defer.done();
}
