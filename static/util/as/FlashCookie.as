package {
    import flash.display.Sprite;
    import flash.system.Security;
    import flash.net.SharedObject;
    import flash.events.*;
    import flash.external.ExternalInterface;

    public class FlashCookie extends Sprite{

        // LSO对象
        private var cookie:SharedObject;

        // LSO名字（即生成的.sol文件名：flash_cookie.sol）
        private var file:String = 'flash_cookie';

        // LSO存储路径
        private var path:String = '/';

        // js端调用接口（即window.__FLASH_COOKIE__）
        private var jsName:String = '__FLASH_COOKIE__';

        public function FlashCookie() {

            Security.allowDomain('*');
            Security.allowInsecureDomain('*');

            this.cookie = SharedObject.getLocal(this.file, this.path);

            this.addEventListener(Event.ENTER_FRAME, this.registerExternalCallbacks);
        }

        private function registerExternalCallbacks(event:Event):void {
            this.callJs('log', 'flash cookie is initing...');

            this.removeEventListener(Event.ENTER_FRAME, this.registerExternalCallbacks);

            if (ExternalInterface.available) {
                try {
                    ExternalInterface.addCallback('get', this.get);
                    ExternalInterface.addCallback('set', this.set);
                    ExternalInterface.addCallback('remove', this.remove);
                    ExternalInterface.addCallback('clear', this.clear);
                } catch (error:Error) {
                    this.callJs('log','ExternalInterface is not supported');
                }
            }

            this.callJs('log', 'flash cookie is ready from flash');
            this.callJs('ready');
        }

        private function callJs(func:String, ... rest):* {
            var arr:Array = new Array();

            arr.push(this.jsName + '.' + func);

            for each (var value:* in rest) {
                arr.push(value);
            }
            return ExternalInterface.call.apply(ExternalInterface, arr);
        }

        private function flush():void {
            this.cookie.flush();
        }

        public function get(name:String):* {
            return this.cookie.data[name];
        }

        public function set(name:String, value:*):void {
            this.cookie.data[name] = value;
            this.flush();
        }

        public function remove(name:String):void {
            delete this.cookie.data[name];
            this.flush();
        }

        public function clear():void {
            this.cookie.clear();
        }
    }
}