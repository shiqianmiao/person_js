package
{
    import flash.display.Bitmap;
    import flash.display.BitmapData;
    import flash.display.Loader;
    import flash.errors.IOError;
    import flash.events.ErrorEvent;
    import flash.events.Event;
    import flash.events.ProgressEvent;
    import flash.events.IOErrorEvent;
    import flash.events.EventDispatcher;
    import flash.events.TimerEvent;
    import flash.filters.BitmapFilter;
    import flash.filters.BitmapFilterQuality;
    import flash.filters.BlurFilter;
    import flash.geom.Matrix;
    import flash.geom.Point;
    import flash.geom.Rectangle;
    import flash.net.FileReference;
    import flash.utils.ByteArray;
    import flash.utils.Timer;
    import lib.image.EncodeCompleteEvent;
    import lib.image.EncodeProgressEvent;
    import lib.image.AsyncJPEGEncoder;
    import lib.image.PNGEncoder;

    import ExternalCall;
    /*
    Technique adapted from Kun Janos (http://kun-janos.ro/blog/?p=107)
    */
    public class ImageResizer extends EventDispatcher
    {
        private var file:FileItem = null;
        private var newWidth:Number = 0;
        private var newHeight:Number = 0;
        private var encoder:Number = ImageResizer.JPEGENCODE;
        private var quality:Number = 100;
        private var targetWidth:Number = 0;
        private var targetHeight:Number = 0;
        private var originSize:Number = 0;
        private var debugCallback:String = 'G.log';

        public static const JPEGENCODE:Number = -1;
        public static const PNGENCODE:Number = -2;

        public function ImageResizer(file:FileItem, targetWidth:Number = 0, targetHeight:Number = 0, quality:Number = 100) {
            this.file = file;
            this.targetHeight = targetWidth;
            this.targetWidth  = targetWidth;
            this.quality = quality;
            if (this.quality < 0 || this.quality > 90) {
                this.quality = 90;
            }
        }

        public function start():void {
            try {
                var timer:Timer = new Timer(3000);
                var t:ImageResizer = this;
                timer.addEventListener(TimerEvent.TIMER, function ():void {
                    t.debug('error in loading file');
                    timer.stop();
                    dispatchEvent(new ErrorEvent(ErrorEvent.ERROR, false, false, 'error in loading file'));
                    t.file.file_reference.removeEventListener(Event.COMPLETE, t.loadBytes);
                    t.file = null;
                });
                this.file.file_reference.addEventListener(Event.COMPLETE, this.loadBytes);
                this.file.file_reference.addEventListener(Event.COMPLETE, function ():void {
                    timer.stop();
                });
                this.file.file_reference.load();
                timer.start();
            } catch (ex:Error) {
                this.debug('error in ResizeImage: ' + ex.message);
                this.file.file_reference.removeEventListener(Event.COMPLETE, this.loadBytes);
                dispatchEvent(new ErrorEvent(ErrorEvent.ERROR, false, false, "Loading from file reference: " + ex.message));
                this.file = null;
            }
        }
        private function loadBytes(event:Event):void {
            try {
                event.target.removeEventListener(Event.COMPLETE, this.loadBytes);
                var loader:Loader = new Loader();
                // Load the image data, resizing takes place in the event handler
                loader.contentLoaderInfo.addEventListener(Event.COMPLETE, this.resize);
                loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, this.onLoadError);

                this.originSize = FileReference(event.target).data.length;
                this.debug('origin size:'+this.originSize);
                loader.loadBytes(FileReference(event.target).data);
            } catch (ex:Error) {
                loader.removeEventListener(Event.COMPLETE, this.resize);
                dispatchEvent(new ErrorEvent(ErrorEvent.ERROR, false, false, "Loading Loader" + ex.message));
                this.file = null;
            }
        }
        private function onLoadError(event:IOErrorEvent):void {
            try {
                event.target.removeEventListener(Event.COMPLETE, this.resize);
                event.target.removeEventListener(IOErrorEvent.IO_ERROR, this.onLoadError);
            } catch (ex:Error) {}

            dispatchEvent(new ErrorEvent(ErrorEvent.ERROR, false, false, "Resizing: " + event.text));
        }

        private function resize(event:Event):void {
            try {
                event.target.removeEventListener(Event.COMPLETE, this.resize);
                event.target.removeEventListener(IOErrorEvent.IO_ERROR, this.onLoadError);

                var loader:Loader = Loader(event.target.loader);
                var bytes:ByteArray;

                var contentType:String = loader.contentLoaderInfo.contentType;

                if (contentType === 'image/jpeg') {
                    this.encoder = ImageResizer.JPEGENCODE;
                } else if (contentType === 'image/png') {
                    this.encoder = ImageResizer.PNGENCODE;
                }

                // Get the image data
                var bmp:BitmapData = Bitmap(loader.content).bitmapData;

                loader.unload();
                loader = null;

                var ratio:Number = bmp.width / bmp.height;

                if (this.targetWidth || this.targetHeight) {
                    if (bmp.width <= bmp.height && bmp.width > this.targetWidth) {
                        this.newWidth = this.targetWidth;
                        this.newHeight = this.targetWidth / ratio;
                    } else if (bmp.height <= bmp.width && bmp.height > this.targetHeight) {
                        this.newHeight = this.targetHeight;
                        this.newWidth = this.targetHeight * ratio;
                    } else {
                        this.newWidth = bmp.width;
                        this.newHeight = bmp.height;
                    }
                } else {
                    this.newWidth = bmp.width;
                    this.newHeight = bmp.height;
                }
                this.debug('targetWidth: '+this.targetWidth + ', targetHeight: ' + this.targetHeight);
                this.debug('newWidth' + this.newWidth + ', newHeight' + this.newHeight);

                if (this.encoder) {
                    // Apply the resizing
                    var matrix:Matrix = new Matrix();
                    matrix.identity();
                    matrix.createBox(this.newWidth / bmp.width, this.newHeight / bmp.height);

                    var resizedBmp:BitmapData = new BitmapData(this.newWidth, this.newHeight, true, 0x000000);
                    resizedBmp.draw(bmp, matrix, null, null, null, true);

                    bmp.dispose();

                    var encoder:Object = null;
                    if (this.encoder == ImageResizer.PNGENCODE) {
                        encoder = new PNGEncoder(PNGEncoder.TYPE_SUBFILTER, 1);
                    } else {
                        encoder = new AsyncJPEGEncoder(this.quality, 1, 100);
                    }

                    encoder.addEventListener(EncodeCompleteEvent.COMPLETE, this.onEncodeComplete);
                    encoder.addEventListener(EncodeProgressEvent.PROGRESS, this.onEncodeProgress);
                    encoder.addEventListener(ErrorEvent.ERROR, this.onEncodeError);
                    encoder.encode(resizedBmp);
                } else {
                    // Just send along the unmodified data
                    dispatchEvent(new ImageResizerEvent(ImageResizerEvent.COMPLETE, this.file.file_reference.data, this.encoder));
                }
            } catch (ex:Error) {
                dispatchEvent(new ErrorEvent(ErrorEvent.ERROR, false, false, "Resizing: " + ex.message));
            }

            this.file = null;
        }

        private function onEncodeError(e:ErrorEvent):void {
            dispatchEvent(e);
        }

        private function onEncodeComplete(e:EncodeCompleteEvent):void {
            this.debug('encoded size:' + e.data.length);
            this.debug('reduced by:' + ((1 - e.data.length/this.originSize)*100)  + '%');
            dispatchEvent(new ImageResizerEvent(ImageResizerEvent.COMPLETE, e.data, this.encoder));
        }

        private function onEncodeProgress(e:EncodeProgressEvent):void {
            dispatchEvent(new ProgressEvent(ProgressEvent.PROGRESS, false, false, e.doneLines, e.totalLines));
        }

        private function debug(msg:String):void {
            ExternalCall.Debug(this.debugCallback, msg);
        }

    }

}