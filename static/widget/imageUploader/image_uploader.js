/**
 * @desc 图片上传组件
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-08-01
 */

require('widget/imageUploader/image_uploader.css');

var $ = require('jquery');
var EventEmitter = require('lib/event/event.js');
var Uploader = require('lib/uploader/uploader.js');
//var ImageCroper = require('lib/imageCroper/imageCroper.js');

var UploaderTpl = require('widget/imageUploader/image_uploader.tpl');

function ImageUploader (config) {
    var self = this,
        $el = $(config.el);

    if (!$el.size()) {
        throw new Error('参数el不可以为空');
    }
    
    var $msg = self.$msg = $('<div>');
    var $btn = self.$btn = $('<div>');
    var $list = self.$list = $('<ul>');
    var $input = self.$input = $('<input>');

    self.$el = $el;

    $input.attr({
        type : 'hidden',
        name : config.name || 'images'
    });
    $btn.addClass('js-ui-uploader-btn');
    $msg.addClass('js-ui-uploader-msg').html('正在载入上传控件...');
    $list.addClass('js-ui-uploader-list');
    $el.addClass('js-ui-uploader loading').append($msg, $btn, $list);
    
    // dom list
    this.list = {};

    var uploader = this.uploader = new Uploader($.extend(config, {$el: $btn}));

    this.config = uploader.config;
    
    $input.val(this.toJSON());

    $el.append($input);

    EventEmitter.mixTo(this);

    uploader
        .on('load.success', function () {
            self.onReady();
        })
        .on('load.fail', function () {
            self.onFail();
        })
        .on('upload.start', function (file) {
            self.onStart(file);
        })
        .on('upload.complete', function (file) {
            self.onComplete(file);
        })
        .on('encode.progress', function (file, load, total) {
            self.onEncodeProgress(file, load, total);
        })
        .on('upload.progress', function (file, load, total) {
            self.onProgress(file, load, total);
        })
        .on('upload.success', function (file) {
            self.onSuccess(file);
        })
        .on('upload.error', function (file, msg) {
            self.onError(file, msg);
        })
        .on('check.error', function (file, msg) {
            self.onError(file, msg);
        }).on('upload.cancel', function (file) {
            self.onCancel(file);
        })
        .on('upload.remove', function (file) {
            self.onRemove(file);
        })
        .on('upload.move.right', function (file) {
            self.onMoveRight(file);
        })
        .on('upload.move.left', function (file) {
            self.onMoveLeft(file);
        })
        .on('upload.cover', function (file) {
            self.onSetCover(file);
        })
        .on('upload.modify', function (file) {
            self.onModify(file);
        });


    $list.delegate('.js-ui-uploader-close', 'click', function () {
        var $this = $(this),
            $li = $this.parents('.js-ui-uploader-li'),
            id = $li[0].id,
            action = $this.data('action');

        if (action === 'cancel') {
            self.cancel(id);
        } else if (action === 'remove') {
            self.remove(id);
        }
        return false;
    }).delegate('.js-ui-uploader-edit', 'click', function () {
        var $this = $(this),
            $bar = $this.parents('.js-ui-uploader-edit-bar'),
            $li = $this.parents('.js-ui-uploader-li'),
            id = $li[0].id,
            action = $this.data('action');

        if (action === 'open') {

            if ($bar.data('inited')) {
                $bar.addClass('loaded');
                $this.data('action', 'close');
            } else {
                $bar.addClass('loading');
                $this.data('action', '');
                self.initCrop(id);
            }
            
        } else if (action === 'close') {

            $bar.removeClass('loaded');
            $this.data('action', 'open');
        }
    }).delegate('.js-ui-uploader-move', 'click', function () {
        var $this = $(this),
            $li = $this.parents('.js-ui-uploader-li'),
            id = $li[0].id,
            action = $this.data('action');

        if (action === 'right') {
            self.moveRight(id);
        } else if (action === 'left') {
            self.moveLeft(id);
        }
    }).delegate('.js-ui-uploader-status', 'click', function () {

        var $this = $(this);
        var $li = $this.parents('.js-ui-uploader-li');

        var id = $li[0].id;
        var action = $this.data('action');

        if (action === 'cover') {
            self.setCover(id);
        }
    });
}


ImageUploader.prototype.onReady = function () {
    var self = this,
        files = self.getFiles(),
        list = self.list,
        $list = self.$list,
        config = self.config,
        editAble = config.editAble,
        file,
        $li;

    this.$el.removeClass('loading');
    this.$msg.html('上传控件加载成功');
    $list.html('');

    for (var i = 0, l = files.length; i < l; i++) {

        file = $.extend({}, files[i]);
        file.processStyle = 'js-ui-uploder-ok';
        file.closeAction = 'remove';
        file.editAction = 'open';
        file.percent = '100%';
        file.msg = '';
        file.width = config.postParams.thumbWidth;
        file.height = config.postParams.thumbHeight;
        file._height = config.postParams.thumbHeight + 2;
        file.editAble = editAble;
        file.coverStyle = config.coverStyle;
        file.frontCover = config.frontCover;
        
        if (i === 0) {
            file.status = '封面';
            file.statusStyle = '';
            file.coverAction = '';
        } else {
            file.status = '设为封面';
            file.statusStyle = 'clickable';
            file.coverAction = 'cover';
        }
        $li = $(UploaderTpl(file));
        
        if (i === 0) {
            self.setCoverStyle($li);
        }
        $list.append($li);
        list[file.id] = $li;
    }

    this.$input.val(this.toJSON());

    window.setInterval(function () {

        var length = self.getFiles().length || 0;

        if (length < config.maxNum) {
            self.setDisabled(false);
        } else {
            self.setDisabled(true);
        }
    }, 500);
};

ImageUploader.prototype.onFail = function () {
    this.$msg.html('上传控件加载失败');
};

ImageUploader.prototype.onStart = function (file) {
    var self = this,
        config = self.config,
        editAble = config.editAble,
        $li;
    
    file = $.extend({
        processStyle : 'processing',
        closeAction : 'cancel',
        editAction : '',
        status : '正在等待',
        statusStyle : '',
        coverAction : '',
        url : '',
        org_url : '', // 原图无水印
        msg : '',
        percent : '0%',
        width : config.postParams.thumbWidth,
        height : config.postParams.thumbHeight,
        _height : config.postParams.thumbHeight + 2,
        editAble : editAble,
        coverStyle : config.coverStyle,
        frontCover : config.frontCover
    }, file);

    $li = $(UploaderTpl(file));

    this.$list.append($li);
    this.list[file.id] = $li;
};

ImageUploader.prototype.onSuccess = function (file) {
    var self = this,
        config = self.config,
        $file = self.list[file.id],
        index = $file.index(),
        frontCover = config.frontCover;

    $file.find('img').attr('src', file.url).data('url', file.org_url);

    if (index === 0 && frontCover) {
        self.setCoverStyle($file);
    } else {
        self.setNoCoverStyle($file);
    }

    $file.find('.js-ui-uploader-edit')
        .data('action', 'open')
        .end()
        .find('.js-ui-uploader-close')
        .data('action', 'remove');

    $file.removeClass('processing')
        .addClass('js-ui-uploder-ok');

    this.$input.val(this.toJSON());
};

ImageUploader.prototype.onError = function (file, msg) {
    var self = this,
        $file = self.list[file.id],
        config = self.config,
        editAble = config.editAble;

    if ($file) {
        $file.removeClass('processing')
            .addClass('js-ui-uploder-error')
            .find('.js-ui-uploader-status')
            .data('action', '')
            .removeClass('clickable')
            .text('上传失败')
            .end()
            .find('.js-ui-uploader-close')
            .data('action', 'remove')
            .end()
            .find('.js-ui-uploader-error-msg')
            .html(msg);
    } else {
        file = $.extend({
            processStyle : 'js-ui-uploder-error',
            closeAction : 'remove',
            editAction : '',
            msg : msg,
            status : '上传失败',
            statusStyle : '',
            coverAction : '',
            url : '',
            percent : '0%',
            width : config.postParams.thumbWidth,
            height : config.postParams.thumbHeight,
            _height : config.postParams.thumbHeight + 2,
            editAble : editAble,
            coverStyle : config.coverStyle,
            frontCover : config.frontCover
        }, file);

        $file = $(UploaderTpl(file));

        this.$list.append($file);
        this.list[file.id] = $file;
    }

    setTimeout(function () {
        self.remove(file.id);
    }, 5000);
};

ImageUploader.prototype.onProgress = function (file, load, total) {
    var $file = this.list[file.id],
        percent = parseInt(load/total*100, 10) + '%';

    if ($file) {
        $file.find('.js-ui-uploader-status').text('正在上传');
        $file.find('.js-ui-uploader-percent').text(percent);
    }
};

ImageUploader.prototype.onEncodeProgress = function (file, load, total) {
    var $file   = this.list[file.id],
        percent = parseInt(load/total*100, 10) + '%';

    if ($file) {
        $file.find('.js-ui-uploader-status').text('正在压缩');
        $file.find('.js-ui-uploader-percent').text(percent);
    }
};

ImageUploader.prototype.onComplete = function () {

};

ImageUploader.prototype.onCancel = function (file) {
    var $file   = this.list[file.id];

    if ($file) {
        delete this.list[file.id];
        $file.remove();
    }

};

ImageUploader.prototype.onRemove = function (file) {
    var self = this,
        config = self.config,
        frontCover = config.frontCover,
        $file = self.list[file.id],
        $next,
        index;

    if ($file) {
        $next = $file.next();
        index = $file.index();

        if (index === 0 && $next.size() && frontCover) {
            self.setCoverStyle($next);
        }
        delete this.list[file.id];
        $file.remove();
    }
    this.$input.val(this.toJSON());
};


ImageUploader.prototype.onMoveRight = function (file) {
    var self = this,
        $file = self.list[file.id],
        $children = self.$list.children(),
        index = $file.index(),
        lastIndex = $children.length - 1,
        needSetCover,
        $first,
        $next;
    
    if (index === 0) {
        $next = $file.next();
        
        needSetCover = self.needSetCover($file, $next);
        if (needSetCover) {
            self.setCoverStyle($next);
        }
        self.setNoCoverStyle($file);
        $next.after($file);
    } else if (index === lastIndex) {
        $first = $children.first();
        
        needSetCover = self.needSetCover($file, $first);
        if (needSetCover) {
            self.setCoverStyle($file);
        }
        self.setNoCoverStyle($first);
        $first.before($file);
    } else {
        $file.next().after($file);
    }
    this.$input.val(this.toJSON());
};


ImageUploader.prototype.onMoveLeft = function (file) {
    var self = this,
        $file = self.list[file.id],
        $list = self.$list,
        index = $file.index(),
        needSetCover;
    
    if (index === 0) {
        var $next = $file.next();
        
        needSetCover = self.needSetCover($file, $next);
        if (needSetCover) {
            self.setCoverStyle($next);
        }
        self.setNoCoverStyle($file);
        $file.appendTo($list);
    } else if (index === 1) {
        var $prev = $file.prev();
        
        needSetCover = self.needSetCover($file, $prev);
        if (needSetCover) {
            self.setCoverStyle($file);
        }
        self.setNoCoverStyle($prev);
        $file.prependTo($list);
    } else {
        $file.prev().before($file);
    }
    this.$input.val(this.toJSON());
};

/**
 * 设为封面图样式
 * @param $file 要改变状态的元素
 * @return $file 要改变状态的元素
 */
ImageUploader.prototype.setCoverStyle = function($file) {
    var self = this,
        config = self.config,
        coverStyle = config.coverStyle;
    
    if (coverStyle === 'v2') {
        $file.find('.f').show();
    }
    
    return $file.find('.js-ui-uploader-status')
                .text('封面')
                .data('action', '')
                .removeClass('clickable').end();
};

/**
 * 设为非封面图样式
 * @param $file 要改变状态的元素
 * @return $file 要改变状态的元素
 */
ImageUploader.prototype.setNoCoverStyle = function($file) {
    var self = this,
        config = self.config,
        coverStyle = config.coverStyle;
    
    if (coverStyle === 'v2') {
        $file.find('.f').hide();
    }
    return $file.find('.js-ui-uploader-status')
                .text('设为封面')
                .data('action', 'cover')
                .addClass('clickable').end();
};

/**
 * 检查当前元素是不是封面
 * @return boolean
 */
ImageUploader.prototype.isCover = function($file) {
    var isCover = $file.find('.js-ui-uploader-status').data('action');
    return isCover === 'cover' ? false : true;
};

/**
 * 检查是否需要设为封面
 * @return boolean
 */
ImageUploader.prototype.needSetCover = function($file, $secFile) {
    var self = this,
        config = self.config,
        frontCover = config.frontCover;
    
    if (!frontCover) {
        var fileIsCover = self.isCover($file),
            secIsCover = self.isCover($secFile);
        if (!fileIsCover && !secIsCover) {
            return false;
        }
    }
    return true;
};

ImageUploader.prototype.onSetCover = function (file) {
    var self = this,
        $file = self.list[file.id],
        $list = self.$list,
        $children = self.$list.children();

    self.setNoCoverStyle($children.first());
    self.setCoverStyle($file)
        .prependTo($list);
    
    this.$input.val(this.toJSON());
};

ImageUploader.prototype.onModify = function (file) {
    var self = this,
        $file = self.list[file.id],
        $img = $file.find('img'),
        $bar = $file.find('.js-ui-uploader-edit-bar'),
        $edit = $bar.find('.js-ui-uploader-edit');

    if (file.url) {
        $img.on('load', function () {
            $bar.removeClass('loading')
                .addClass('loaded');
            $edit.data('action', 'close');

            self.$input.val(self.toJSON());
            $img.off('load');
        });
        $img.attr('src', file.url).data('url', file.org_url);
    }
};

ImageUploader.prototype.toJSON = function () {
    return this.uploader.toJSON();
};

ImageUploader.prototype.cancel = function (id) {
    if (this.uploader) {
        this.uploader.cancel(id);
    }
};

ImageUploader.prototype.remove = function (id) {
    if (this.uploader) {
        this.uploader.remove(id);
    }
};

ImageUploader.prototype.getFiles = function () {
    if (this.uploader) {
        return this.uploader.getFiles();
    }

    return [];
};

ImageUploader.prototype.moveRight = function (id) {

    if (this.uploader) {
        this.uploader.moveRight(id);
    }
};

ImageUploader.prototype.moveLeft = function (id) {

    if (this.uploader) {
        this.uploader.moveLeft(id);
    }
};

ImageUploader.prototype.setCover = function (id) {

    if (this.uploader) {
        this.uploader.setCover(id);
    }
};

ImageUploader.prototype.setDisabled = function (isDisabled) {

    if (this.uploader) {
        this.uploader.setDisabled(isDisabled);
    }
};

ImageUploader.prototype.modify = function (id, data) {

    if (this.uploader) {
        this.uploader.modify(id, data);
    }
};

ImageUploader.prototype.initCrop = function (id) {
    var self = this,
        $li = this.list[id],
        $img = $li.find('img'),
        $rotate = $li.find('.js-ui-uploader-rotate'),
        $bar = $li.find('.js-ui-uploader-edit-bar'),
        $edit = $bar.find('.js-ui-uploader-edit');

    G.use(['lib/imageCroper/imageCroper.js'], function (ImageCroper) {

        var imageCroper = new ImageCroper({
            $el: $img,
            uploadTo: self.config.url
        });

        var postParams = self.config.postParams;
        var params = {
            category : postParams.category,
            store_id : postParams.store_id
        };
        $rotate.click(function () {
            var $this = $(this);
            var action = $this.data('action');
            self.id = id;

            $bar.removeClass('loaded')
                .addClass('loading');
            $edit.data('action', '');

            window.setTimeout(function () {

                if (action === 'left') {
                    imageCroper.rotate(-90);
                    imageCroper.upload(params);
                } else if (action === 'right') {
                    imageCroper.rotate(90);
                    imageCroper.upload(params);
                }
            }, 50);
        });

        imageCroper.ready(function () {
            $bar.removeClass('loading')
                .addClass('loaded')
                .data('inited', true);

            $edit.data({
                action : 'close'
            });
        }).on('uploaded', function (data) {
            try {
                data = JSON.parse(data);

                if (!data.error && data.url) {
                    self.modify(self.id, data);
                }

            } catch (e) {}
        });
    });
};

module.exports = ImageUploader;