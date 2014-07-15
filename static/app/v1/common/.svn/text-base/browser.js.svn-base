browserModule = exports;
browserModule.isMozilla = (typeof document.implementation != 'undefined') && (typeof document.implementation.createDocument != 'undefined') && (typeof HTMLDocument != 'undefined');
browserModule.isIE = window.ActiveXObject ? true : false;
browserModule.isFirefox = (navigator.userAgent.toLowerCase().indexOf("firefox") != - 1);
browserModule.isSafari = (navigator.userAgent.toLowerCase().indexOf("safari") != - 1);
browserModule.isOpera = (navigator.userAgent.toLowerCase().indexOf("opera") != - 1);