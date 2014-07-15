var $       = require('jquery');
var Events  = require('lib/event/event.js');
var FlashUploader = require('lib/uploader/flash-backend.js');

function Uploader (config) {
    var self = this;

    config = $.extend({
        $el              : '',
        uploadTo         : '',
        debug            : false,
        maxNum           : 5,     // 最多上传文件数
        type             : 'gif,jpg,jpeg,png,bmp',

        height           : 80,
        width            : 24,
        button_image_url : G.config('baseUrl') + require.resolve('./upload.png'),    // 按钮图片
        
        editAble: true,     //是否允许编辑
        frontCover: true,       //是否自动选择封面
        coverStyle: 'v1',       //封面版本 (v1|v2)
        
        uploadedFiles    : [],    // 已上传的文件
        postParams       : {      // 随着文件上传时附带的数据
            maxSize          : 0,  // 设为0则按控件默认行为控制文件大小限制{ swf: 10mb, html: 10mb, ajax: 2mb}
            resizeImage      : true,
            resizeWidth      : 0,   // 自动裁剪
            resizeHeight     : 0,
            resizeCutEnable  : false,

            createThumb      : false,
            thumbWidth       : 120,   // 缩略图
            thumbHeight      : 90,
            thumbCutEnable   : true,

            minWidth         : 0,
            minHeight        : 0
        }
    }, config);

    this.config = config;

    var $el = config.$el = $(config.$el);
    self.$el   = $el;

    Events.mixTo(self);


    var uploader = self.uploader = new FlashUploader(config);

    uploader
        .on('load.success', function () {
            self.trigger('load.success')
        })
        .on('load.fail', function () {
            self.trigger('load.fail')
        })
        .on('upload.start', function (file) {
            self.trigger('upload.start', file)
        })
        .on('upload.success', function (file) {
            self.trigger('upload.success', file);
        })
        .on('upload.cancel', function (file) {
            self.trigger('upload.cancel', file);
        })
        .on('upload.error', function (file, msg) {
            self.trigger('upload.error', file, msg);
        })
        .on('encode.progress', function (file, load, total) {
            self.trigger('encode.progress', file, load, total);
        })
        .on('upload.progress', function (file, load, total) {
            self.trigger('upload.progress', file, load, total);
        })
        .on('upload.complete', function (file) {
            self.trigger('upload.complete', file);
        })
        .on('check.error', function (file, msg) {
            self.trigger('check.error', file, msg);
        })
        .on('upload.remove', function (file) {
            self.trigger('upload.remove', file);
        })
        .on('upload.move.right', function (file) {
            self.trigger('upload.move.right', file);
        })
        .on('upload.move.left', function (file) {
            self.trigger('upload.move.left', file);
        })
        .on('upload.cover', function (file) {
            self.trigger('upload.cover', file);
        })
        .on('upload.modify', function (file) {
            self.trigger('upload.modify', file);
        });
}

Uploader.prototype.toJSON = function () {
    var files = this.uploader.uploadedFiles.slice();

    files = files.filter(function (f) {

        if (f.url) {
            return true;
        }
    });
    return JSON.stringify(files);
}

Uploader.prototype.cancel = function (id) {
    if (this.uploader) {
        this.uploader.cancel(id);
    }
}

Uploader.prototype.remove = function (id) {
    if (this.uploader) {
        this.uploader.deleteFile(id);
    }
}

Uploader.prototype.getFiles = function () {
    if (this.uploader) {
        return this.uploader.uploadedFiles || [];
    }
}

Uploader.prototype.moveRight = function (id) {

    if (this.uploader) {
        this.uploader.moveRight(id);
    }
};

Uploader.prototype.moveLeft = function (id) {

    if (this.uploader) {
        this.uploader.moveLeft(id);
    }
};

Uploader.prototype.setCover = function (id) {

    if (this.uploader) {
        this.uploader.setCover(id);
    }
};

Uploader.prototype.setDisabled = function (isDisabled) {

    if (this.uploader) {
        this.uploader.setDisabled(isDisabled);
    }
};

Uploader.prototype.modify = function (id, data) {

    if (this.uploader) {
        this.uploader.modifyFile(id, data);
    }
};
module.exports = Uploader;