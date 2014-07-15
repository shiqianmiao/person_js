var Uploader = require('widget/uploader/uploader.js');

var uploader = new Uploader();

uploader.ready(function (type) {
    console.log('done', type);
})

module.exports = function (defer) {
    defer.done();
}
