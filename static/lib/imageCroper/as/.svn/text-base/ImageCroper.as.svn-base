package {
    import flash.display.Sprite;
    import flash.display.Stage;
    import flash.events.*;
    import flash.system.Security;
    import flash.external.ExternalInterface;
    import lib.util.ExternalCall;
    import ImageFile;
    import flash.display.Bitmap;

    public class ImageCroper extends Sprite {
        private var instance:Object;

        public static function main():void {
            var ImageCroper:ImageCroper = new ImageCroper();
        }

        public function ImageCroper() {
            this.debug('init ImageCroper')
            var counter:Number = 0;
            root.addEventListener(Event.ENTER_FRAME, function ():void { if (++counter > 100) counter = 0; });

            var self:ImageCroper = this;
            Security.allowDomain("*");
            Security.allowInsecureDomain("*");
            var params:Object = stage.loaderInfo.parameters;

            if (params['policyFiles']) {
                var policyFiles:Array = params['policyFiles'].split(',');
                for each (var policyFile:String in policyFiles) {
                    Security.loadPolicyFile(policyFile.replace(/^\s+|\s+$/g, ""));
                }
            }

            this.instance = {};
            this.SetupExternalInterface();
            ExternalCall.Call('ImageCroper.flashReady');
            this.debug('init finished');
        }

        private function debug(message:String):void {
            try {
                ExternalCall.Call('ImageCroper.log', message);
            } catch (ex:Error) {
                trace(message);
            }
        }

        private function createInstance(url:String):void {
            this.debug('create instance');
            var self:ImageCroper = this;
            var img:ImageFile = new ImageFile(url);
            this.instance[url] = img;
        }

        private function reset(url:String):void {
            this.instance[url].reset();
        }

        private function fetch(url:String):void {
            this.debug('fetch:'+url);
            var self:ImageCroper = this;
            var img:ImageFile = this.instance[url];

            img.addEventListener(ImageFile.FETCHED, function ():void {
                self.emit('fetched', url);
            });
            img.addEventListener(ImageFile.FETCHFAIL, function ():void {
                self.emit('fetch-fail', url);
            });

            img.fetch();
        }

        private function rotate(url:String, deg:int):void {
            if (deg < 0) {
                deg = (deg % 360) + 360;
            } else {
                deg = (deg % 360);
            }
            this.debug('rotate:' + deg);

            this.instance[url].rotate(deg);
        }

        private function cut(url:String, x:int, y:int, w:int, h:int):void {
            this.debug('cut');
            this.instance[url].cut(x, y, w, h);
        }

        private function upload(url:String, uploadTo:String, params:Object=null):void {
            var self:ImageCroper = this;
            var img:ImageFile = this.instance[url];

            this.debug(url);
            function onUploaded (e:DataEvent):void {
                img.removeEventListener(DataEvent.UPLOAD_COMPLETE_DATA, onUploaded);
                self.emit('uploaded', url, e.data)
            }

            img.addEventListener(DataEvent.UPLOAD_COMPLETE_DATA, onUploaded);

            this.instance[url].upload(uploadTo, params);
        }

        public function emit(eventName:String, ... rest):void {
            var args:Array = new Array();
            args.push('ImageCroper.emit');
            args.push(eventName);
            for each (var i:* in rest) {
                args.push(i);
            }
            ExternalCall.Call.apply(ExternalCall, args);
        }

        private function loadPolicyFile(url:String):void {
            this.debug('load policyFile' + url)
            Security.loadPolicyFile(url);
        }

        private function SetupExternalInterface():void {
            this.debug('setup ExternalCall');
            try {
                ExternalInterface.addCallback("loadPolicyFile", this.loadPolicyFile);
                ExternalInterface.addCallback("createInstance", this.createInstance);
                ExternalInterface.addCallback("fetch", this.fetch);
                ExternalInterface.addCallback("rotate", this.rotate);
                ExternalInterface.addCallback("cut", this.cut);
                ExternalInterface.addCallback("upload", this.upload);
                ExternalInterface.addCallback("reset", this.reset);
            } catch (ex:Error) {
                this.debug(ex.message);
            }
        }
    }
}