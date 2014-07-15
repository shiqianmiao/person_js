package
{
    import flash.display.Loader;
    import flash.display.LoaderInfo;
    import flash.events.ErrorEvent;
    import flash.events.Event;
    import flash.events.EventDispatcher;
    import flash.events.IOErrorEvent;
    import flash.events.DataEvent;
    import flash.events.HTTPStatusEvent;
    import flash.events.ErrorEvent;
    import flash.events.UncaughtErrorEvent;
    import flash.display.Bitmap;
    import flash.display.BitmapData;
    import flash.geom.Point;
    import flash.geom.Rectangle;
    import flash.geom.Matrix;
    import flash.system.JPEGLoaderContext;
    import flash.utils.ByteArray;
    import flash.net.URLLoader;
    import flash.net.URLRequest;
    import flash.net.URLRequestHeader;
    import flash.net.URLRequestMethod;
    import flash.net.URLVariables;
    import lib.image.JPEGEncoder;
    import lib.network.MultipartURLLoader;
    import lib.util.ExternalCall;
    import lib.crypto.MD5;

    /**
     * ...
     * @author jianbin
     */
    public class ImageFile extends EventDispatcher
    {
        public static const FETCHFAIL:String = 'fetchfail';
        public static const FETCHED:String = 'fetched';
        public static const UPLOADED:String = 'uploaded';
        public var bitmapData:BitmapData;
        public var originData:BitmapData;

        public var response:String = '';
        private var width:int = 0;
        private var height:int = 0;
        private var fetched:Boolean = false;
        private var url:String = '';

        public function ImageFile(url:String) {
            this.debug('init1:'+url);
            this.url = url;
        }

        public function fetch():void {
            this.debug('start fetch');
            var self:ImageFile = this;
            var key:String = '';
            /*
            if (this.url.indexOf('http://image.ganji.com') !== -1 || this.url.indexOf('http://image.ganjistatic1.com') !== -1) {
                key = '?okey=' + MD5.hash(this.url
                        .replace('http://image.ganji.com/', '')
                        .replace('http://image.ganjistatic1.com/', '')
                        + 'ankp@gc'
                     );
            }*/
            var url:String = encodeURI(this.url + key);
            this.debug('url: ' + url);
            var loader:Loader = new Loader();
            var request:URLRequest = new URLRequest(url);
            var nocache:URLRequestHeader = new URLRequestHeader('cache-control', 'no-cache');
            request.requestHeaders.push(nocache);

            loader.contentLoaderInfo.addEventListener(Event.COMPLETE, function (e:Event):void {
                self.bitmapData = e.target.content.bitmapData;
                self.originData = e.target.content.bitmapData;

                self.fetched = true;
                dispatchEvent(new Event(ImageFile.FETCHED));
            });

            loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, function (e:Event):void {
                dispatchEvent(new Event(ImageFile.FETCHFAIL));
            });

            loader.addEventListener(HTTPStatusEvent.HTTP_STATUS, function (e:HTTPStatusEvent):void {
                self.debug(e.status + 'status');
            });

            try {
                this.debug('strat loading');
                loader.load(request);
                this.debug('loading');
            } catch (ex:Error) {
                dispatchEvent(new Event(ImageFile.FETCHFAIL));
            }
        }

        public function cut(x:int = 0, y:int = 0, w:int = 0, h:int = 0):void {
            var rect:Rectangle = new Rectangle(x, y, w, h);
            var ret:BitmapData = new BitmapData(w, h);

            try {
                ret.copyPixels(this.bitmapData, rect, new Point(0, 0));
            } catch (ex:Error) {
                this.debug(ex.message);
            }

            this.bitmapData = ret;
        }

        public function rotate(deg:int):void {
            var bitData:BitmapData = this.bitmapData;
            var h:int = bitData.height, w:int = bitData.width;
            var cos:Function = Math.cos, sin:Function = Math.sin;
            var r:Number = Math.PI / 180 * deg;
            var x:int, y:int, nw:int, nh:int;

            if (deg <= 90) {
                x = sin(r) * h;
                y = 0;
                nw = sin(r) * h + cos(r) * w;
                nh = cos(r) * h + sin(r) * w;
            } else if (deg <= 180) {
                x = sin(r) * h - cos(r) * w;
                y = -cos(r) * h;
                nw = sin(r) * h - cos(r) * w;
                nh = -cos(r) * h + sin(r) * w;
            } else if (deg <= 270) {
                x = -cos(r) * w;
                y = -sin(r) * w - cos(r) * h;
                nw = -sin(r) * h - cos(r) * w;
                nh = -sin(r) * w - cos(r) * h;
            } else {
                x = 0;
                y = -sin(r) * w;
                nw = -sin(r) * h + cos(r) * w;
                nh = cos(r) * h - sin(r) * w;
            }


            var mc:Matrix = new Matrix();

            mc.rotate(r);
            mc.translate(x, y);

            var ret:BitmapData = new BitmapData(nw, nh);
            ret.draw(bitData, mc)

            this.bitmapData = ret;
        }

        public function upload(url:String, params:Object=null):void {
            url = encodeURI(url);
            var self:ImageFile = this;
            this.debug('encode')
            var encoder:JPEGEncoder = new JPEGEncoder(90);
            this.debug('encode init');
            var data:ByteArray = encoder.encode(this.bitmapData);
            this.debug('ecnode end');
            var request:URLRequest = new URLRequest(url);
            request.method = URLRequestMethod.POST;

            if (params != null) {
                var variables:URLVariables = new URLVariables();
                for (var name:String in params) {
                    variables[name] = params[name];
                }
                request.data = variables;
            }

            var uploader:MultipartURLLoader = new MultipartURLLoader(data, 'whatever.jpg');

            uploader.addEventListener(DataEvent.UPLOAD_COMPLETE_DATA, function (e:DataEvent):void {
                self.dispatchEvent(e);
            });
            uploader.upload(request, 'file');
        }

        public function reset():void {
            this.bitmapData = this.originData;
        }

        private function debug(message:String):void {
            try {
                ExternalCall.Call('ImageCroper.log', message);
            } catch (ex:Error) {
                trace(message);
            }
        }
    }
}