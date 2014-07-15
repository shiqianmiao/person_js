var Events    = require('lib/event/event.js');
var SWFUpload = require('./swfupload-2.5.3.js');
var $         = require('jquery');
var Util      = require('util');

var Uploader = function (config) {
    var self = this;
    Events.mixTo(this);

    // 随文件上传的参数
    var postParams = config.postParams || {};
    if (!postParams.maxSize) {
        postParams.maxSize = postParams.MAX_FILE_SIZE = 1024*1024*10-1;
    } else {
        postParams.MAX_FILE_SIZE = postParams.maxSize;
    }
    postParams.type = config.type;

    postParams.maxNum = config.maxNum;
    var progress_handler   = ProgressHandler( this )
    var types              = formatFlashUploadType(config.type);
    var resizeWidth        = postParams.resizeWidth;
    var resizeHeight       = postParams.resizeHeight;
    var quality            = config.quality || 90;
    var maxParallelCount   = 8;
    var button_placeholder = $(config.$el)[0];


    var uploadedFiles = this.uploadedFiles = config.uploadedFiles.map(function (f) {

        if (!f.id) {
            f.id = Util.guid('SWFUpload');
        }

        return f;
    });

    var uploadedCounter = uploadedFiles.length;

    var settings = {
        upload_url: config.url
        ,flash_url : G.config('baseUrl') + require.resolve('./swf/uploader.swf')
        ,debug: config.debug || false
        ,post_params: postParams

        ,file_size_limit : postParams.MAX_FILE_SIZE
        ,file_types : types
        ,file_types_description : config.fileTypeDescription || "图片"
        ,file_upload_limit : config.maxNum
        ,file_queue_limit  : config.maxNum - uploadedCounter
        ,successful_uploads : uploadedCounter
        ,button_placeholder : button_placeholder

        ,prevent_swf_caching : false
        ,allow_script_access : 'always'

        ,file_post_name : "file"
        ,use_query_string : false
        ,requeue_on_error : false
        ,http_success : []
        ,assume_success_timeout : 0

        ,button_text: ''
        ,button_width: config.width
        ,button_height: config.height
        ,button_image_url: config.button_image_url
        ,button_text_left_padding: 0
        ,button_text_top_padding: 0
        ,button_disabled : false
        ,button_cursor : SWFUpload.CURSOR.HAND
        ,button_action : ''
        ,swfupload_preload_handler : function () {
            if (!this.support.loading) {
                self.trigger('load.fail');
                return false;
            } else if (!this.support.imageResize) {
                self.trigger('load.fail');
                return false;
            }
        }
        ,swfupload_load_failed_handler : function () {
            self.trigger('load.fail');
        }
        ,swfupload_loaded_handler : function(){
            self.trigger('load.success');
        }
        ,file_queued_handler : function (file) {
            if (config.maxNum - uploadedCounter - uploader.waitingQueue.length > 0) {
                self.trigger('upload.enqueue',{id: file.id, name: file.name}, 'flash');
                uploader.waitingQueue.push({
                    id      : file.id,
                    name    : file.name,
                    quality : quality
                });
                 dispatch();
            } else {
                uploader.cancelUpload(file.id);
            }
        }
        ,file_queue_error_handler: function(fileInfo, errorCode, message) {
            switch(errorCode) {
                case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
                    self.trigger('check.error', fileInfo, "您选择的文件太多了");
                    break;
                case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                    self.trigger('check.error', fileInfo, "【"+fileInfo.name+"】您所选择的文件太大了");
                    break;
                case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
                    self.trigger('check.error', fileInfo, "【"+fileInfo.name+"】您只能上传后缀名为（"+config.type+"）的文件");
                    break;
                case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                    self.trigger('check.error', fileInfo, "["+fileInfo.name+"]这个文件大小为0,无法上传");
                    break;
                default:
                    self.trigger('check.error', fileInfo, '该文件不符合要求');
            }
        }
        ,upload_resize_start_handler : function (file, width, height, encoding, quality) {
            progress_handler(file, 'encode.start');
        }
        ,upload_resize_complete_handler : function (file) {
            progress_handler(file, 'encode.complete');
        }
        ,resize_progress_handler : function (file, loaded, total) {
            progress_handler(file, 'encode.progress', loaded, total);
        }
        ,upload_progress_handler : function (file, loaded, total) {
            progress_handler(file, 'upload.progress', loaded, total);
        }
        ,upload_success_handler : function (file, serverData) {

            var fileInfo = {
                id: file.id
                // name: file.name
            };
            var response;
            try {
                response = JSON.parse(serverData);
            } catch (ex) {
                self.trigger('upload.error', fileInfo, "服务器返回信息格式错误，可能您的文件太大了，可以尝试减小文件大小重试！");
                return;
            }

            $.extend(fileInfo, response);
            file = self.getFile(file.id);
            uploadedFiles[file.index] = fileInfo;
            uploadedCounter++;

            if (response.error) {
                self.trigger('upload.error', fileInfo, response.text);
            } else {
                delete fileInfo.error;
                self.trigger('upload.success', fileInfo, 'flash');
                uploader.setFileQueueLimit(config.maxNum - uploadedCounter);
            }
        }
        ,upload_error_handler : function (file, errorCode, message) {
            var fileInfo = {};
            if (file) {
                fileInfo = {
                    id : file.id
                    ,name : file.name
                }
            }

            switch (errorCode) {
                case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
                    self.trigger('upload.error', fileInfo, "网络异常。(HTTP "+message+")");
                    break;
                case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
                    self.trigger('upload.error', fileInfo, "上传地址缺失。");
                    break;
                case SWFUpload.UPLOAD_ERROR.IO_ERROR:
                    self.trigger('upload.error', fileInfo, "文件读取错误。");
                    break;
                case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
                    self.trigger('upload.error', fileInfo, "文件安全策略错误。");
                    break;
                case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
                    self.trigger('upload.error', fileInfo, "文件太多了。");
                    break;
                case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
                    self.trigger('upload.error', fileInfo, "上传失败了。");
                    break;
                case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
                    self.trigger('upload.error', fileInfo, "指定文件没有找到。");
                    break;
                case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
                    self.trigger('upload.error', fileInfo, "文件验证失败。");
                    break;
                case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
                    self.trigger('upload.cancel', fileInfo);
                    break;
                case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
                    self.trigger('upload.error', fileInfo, "上传中断。");
                    break;
                case SWFUpload.UPLOAD_ERROR.RESIZE:
                    self.trigger('upload.error', fileInfo, "文件压缩失败。");
                    break;
                case SWFUpload.UPLOAD_ERROR.TIMEOUT:
                    self.trigger('upload.error', fileInfo, "上传超时,请重新上传,或者选择更小的文件上传。");
                    break;

                default:
                    self.trigger('upload.error', fileInfo, "未知错误.");
                    break;
            }
        }
        ,upload_complete_handler : function (fileInfo) {
            self.trigger('upload.complete', fileInfo);
        }
    };
    if (settings.file_upload_limit  === 0 || settings.file_upload_limit > 1) {
        settings.button_action = SWFUpload.BUTTON_ACTION.SELECT_FILES;
    } else {
        settings.button_action = SWFUpload.BUTTON_ACTION.SELECT_FILE;
    }

    if (settings.file_upload_limit < 1) {
        settings.file_upload_limit = 50;
    }

    var uploader = new SWFUpload(settings);
    uploader.waitingQueue = [];
    uploader.uploadingStack = {};
    function dispatch () {
        if (Object.keys(uploader.uploadingStack).length >= maxParallelCount) {
            return;
        }
        if (!uploader.waitingQueue.length) {
            return;
        }

        var file = uploader.waitingQueue.shift();
        var name = file.name.toLowerCase();

        uploadedFiles.push(file);
        uploader.uploadingStack[file.id] = 1
        self.trigger('upload.start', file);
        if (name.indexOf('.png') !== -1 || name.indexOf('.jpeg') !== -1 || name.indexOf('.jpg') !== -1) {
            uploader.startResizedUpload(file.id, resizeWidth, resizeHeight, 0, file.quality);
        } else {
            uploader.startUpload(file.id);
        }
    };

    self
        .on('upload.error', function (file, msg) {
            self.deleteFile(file.id, msg);
        })
        .on('upload.complete', function (file) {
            if (uploader.uploadingStack[file.id]) {
                delete uploader.uploadingStack[file.id];
            }
            dispatch();
        })
        .on('upload.cancel', function (file) {
            var queue = [];
            uploader.waitingQueue.forEach(function (f) {
                if (f.id !== file.id) {
                    queue.push(f);
                }
            });
            uploader.waitingQueue = queue;
            delete uploader.uploadingStack[file.id];
        });

    // bug: IE 7,8
    this.disable = function () {
        uploader.setButtonDisabled(true);
    };
    this.enable = function () {
        uploader.setButtonDisabled(false);
    };
    this.cancel = function (id) {
        uploader.cancelUpload(id);
        this.deleteFile(id, 'cancel');
    };
    this.destory = function () {
        try {
            this.unbind();
        } catch (ex) { }
        uploader = null;
        $(button_placeholder).children().remove();
    };
    this.deleteFile = function (id, msg) {
        var file = this.getFile(id);

        if (file) {
            uploadedCounter--;
            uploadedFiles.splice(file.index, 1);
            uploader.setSuccessfulUploads(uploadedCounter);
            uploader.setFileQueueLimit(config.maxNum - uploadedCounter);
        }
        if (!msg) {
            self.trigger('upload.remove', file || {id:id});
        }

    };

    this.getFile = function (id) {
        for (var i = 0, l = uploadedFiles.length; i < l; i++) {
            var file = $.extend({}, uploadedFiles[i]);
            if (file.id == id) {
                file.index = i;
                return file;
            }
        }
        return null;
    };


    this.modifyFile = function (id, data) {

        var file = this.getFile(id);
        var index = file.index;

        if (file && index > -1) {
            uploadedFiles[index]['url'] = data.url;
            uploadedFiles[index]['file_path'] = data.file_path;
            file.url = data.url;
            file.file_path = data.file_path;
            self.trigger('upload.modify', file);
        }

    };
    this.moveRight = function (id) {

        var file = this.getFile(id);
        var index = file.index;
        var lastIndex = uploadedFiles.length - 1;

        if (lastIndex == 0) {
            return;
        }

        delete file.index;
        if (index === lastIndex) {

            uploadedFiles.pop();
            uploadedFiles.unshift(file);
        } else {
            uploadedFiles.splice(index + 2, 0, file);
            uploadedFiles.splice(index, 1);
        }

        self.trigger('upload.move.right', file);
    };

    this.moveLeft = function (id) {

        var file = this.getFile(id);
        var index = file.index;
        var lastIndex = uploadedFiles.length - 1;

        if (lastIndex == 0) {
            return;
        }

        delete file.index;
        if (index === 0) {

            uploadedFiles.shift();
            uploadedFiles.push(file);
        } else {
            uploadedFiles.splice(index, 1);
            uploadedFiles.splice(index - 1, 0, file);
        }

        self.trigger('upload.move.left', file);
    };

    this.setCover = function (id) {

        var file = this.getFile(id);
        var frontCover = config.frontCover;
        var index = file.index;

        if (index === 0 && frontCover) {
            return;
        }

        delete file.index;
        uploadedFiles.splice(index, 1);
        uploadedFiles.unshift(file);
        self.trigger('upload.cover', file);
        
        config.onSetCover && config.onSetCover.call(this);
    };

    this.setDisabled = function (isDisabled) {

        uploader.setButtonDisabled(isDisabled);
    };
    
};


var formatFlashUploadType = function(type) {
    if (type == 'all'){
        return '*.*';
    } else {
        var types = type.split(','), flashTypes = [];
        types.forEach(function(v){
            flashTypes.push('*.'+v);
        });
        return flashTypes.join(';', flashTypes);
    }
};

var ProgressHandler = function (uploader) {
    var resize_progress = {};
    return function (file, type, loaded, total) {
        if (type === 'encode.start') {
            resize_progress[file.id] = {
                loaded: 0,
                total : 100
            };
            uploader.trigger('encode.start');
        }
        if (type === 'encode.complete') {
            resize_progress[file.id] = {
                loaded: 100,
                total : 100
            };
            uploader.trigger('encode.complete');
        }
        if (type === 'encode.progress') {
            resize_progress[file.id] = {
                loaded: loaded,
                total : total
            };
            uploader.trigger('encode.progress', file, loaded, total);
        }
        if (type === 'upload.progress') {
            uploader.trigger('upload.progress', file, loaded, total);
        }
    };
};

module.exports = Uploader;