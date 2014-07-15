var except = require('lib/expect/expect.js');

module.exports = function (defer) {
    describe('G.config', function(){
        it('just works', function () {
            G.config('foo', 'ok');
            except(G.config('foo')).to.be('ok');
            delete G.config()['foo'];
            except(G.config('foo')).to.be(undefined);
        });
        it('use array as value path', function () {
            var value = {'it is': 'ok'};
            G.config(['foo', 'bar', 'pub', 'hub'], value);
            except(G.config(['foo', 'bar', 'pub', 'hub'])).to.be(value);
            delete G.config().foo.bar.pub.hub;
            except(G.config(['foo', 'bar', 'pub', 'hub'])).to.be(undefined);
        });
    });
    defer.done();
}
