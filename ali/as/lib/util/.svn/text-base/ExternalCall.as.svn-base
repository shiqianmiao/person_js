package lib.util
{
    import flash.external.ExternalInterface;

    public class ExternalCall {
        public static function Call(callback:String, ... rest):* {
            var escapedRest:Array = new Array();
            escapedRest.push(EscapeMessage(callback));

            for each (var i:* in rest) {
                escapedRest.push(EscapeMessage(i));
            }

            return ExternalInterface.call.apply(ExternalInterface, escapedRest);

        }

        /* Escapes all the backslashes which are not translated correctly in the Flash -> JavaScript Interface
         *
         * These functions had to be developed because the ExternalInterface has a bug that simply places the
         * value a string in quotes (except for a " which is escaped) in a JavaScript string literal which
         * is executed by the browser.  These often results in improperly escaped string literals if your
         * input string has any backslash characters. For example the string:
         *      "c:\Program Files\uploadtools\"
         * is placed in a string literal (with quotes escaped) and becomes:
         *      var __flash__temp = "\"c:\Program Files\uploadtools\\"";
         * This statement will cause errors when executed by the JavaScript interpreter:
         *  1) The first \" is succesfully transformed to a "
         *  2) \P is translated to P and the \ is lost
         *  3) \u is interpreted as a unicode character and causes an error in IE
         *  4) \\ is translated to \
         *  5) leaving an unescaped " which causes an error
         *
         * I fixed this by escaping \ characters in all outgoing strings.  The above escaped string becomes:
         *      var __flash__temp = "\"c:\\Program Files\\uploadtools\\\"";
         * which contains the correct string literal.
         *
         * Note: The "var __flash__temp = " portion of the example is part of the ExternalInterface not part of
         * my escaping routine.
         */
        private static function EscapeMessage(message:*):* {
            if (message is String) {
                message = EscapeString(message);
            }
            else if (message is Array) {
                message = EscapeArray(message);
            }
            else if (message is Object) {
                message = EscapeObject(message);
            }

            return message;
        }

        private static function EscapeString(message:String):String {
            var replaceSlashPattern:RegExp = /\\/g;
            var replaceNewLinePattern:RegExp = /\n/g;
            var replaceCarraigeReturnPattern:RegExp = /\r/g;
            var replaceNullPattern:RegExp = /\0/g;

            return message.replace(replaceSlashPattern, "\\\\").replace(replaceNewLinePattern, "\\n").replace(replaceCarraigeReturnPattern, "\\r").replace(replaceNullPattern, "\\0");
        }
        private static function EscapeArray(message_array:Array):Array {
            var length:uint = message_array.length;
            var i:uint = 0;
            for (i; i < length; i++) {
                message_array[i] = EscapeMessage(message_array[i]);
            }
            return message_array;
        }
        private static function EscapeObject(message_obj:Object):Object {
            for (var name:String in message_obj) {
                message_obj[name] = EscapeMessage(message_obj[name]);
            }
            return message_obj;
        }
    }
}