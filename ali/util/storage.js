var config  = require( 'config' );

var STORAGE_AGENT = '__STORAGE_AGENT__';
var DEFAULT_NAMESPACE  = '__LOCAL_STORAGE__';

var Storage;

// in IE 6-7, we use UserData instead
if ( !window.localStorage ) {
    // pause the module declearation until the iframe loaded
    var done = module.async();

    var iframe = document.createElement("IFRAME");
    iframe.src = 'javascript:false';
    iframe.style.display = "none";
    iframe.attachEvent('onload', function () {
        var doc = iframe.contentWindow.document;
        var data = doc.createElement( 'INPUT' );

        data.type = 'hidden';
        doc.insertBefore( data, doc.firstChild );

        if ( !data.addBehavior ) {
            throw new Error('this browser does not support userData');
        }

        data.addBehavior('#default#userData');

        Storage = function ( namespace ) {
            data.load( STORAGE_AGENT );
            var saved_namespace = {};
            try {
                saved_namespace = JSON.parse( data.getAttribute( '__SAVED_NS__' ) ) || {};
            } catch ( ex ) {
                // it is ok
            }
            if ( !saved_namespace[namespace] ) {
                saved_namespace[namespace] = 1;
                data.setAttribute( '__SAVED_NS__', JSON.stringify( saved_namespace ) );
                data.save( STORAGE_AGENT );
            }

            var self = {
                set: function ( k, v ) {
                    var saved_keys = {};

                    data.setAttribute( k, v );
                    data.save( namespace );
                    data.load( namespace );
                    try {
                        saved_keys = JSON.parse( data.getAttribute( '__SAVED_K__' ) ) || {};
                    } catch ( ex ) {
                        // it is ok
                    }

                    if ( !saved_keys[k] ) {
                        saved_keys[k] = 1;
                        data.setAttribute( '__SAVED_K__', JSON.stringify( saved_keys ) );
                        data.save( namespace );
                    }
                },
                get: function ( k ) {
                    data.load( namespace );
                    return data.getAttribute( k );
                },
                remove: function ( k ) {
                    var saved_keys = {};

                    data.removeAttribute( k );
                    data.save( namespace );
                    try {
                        saved_keys = JSON.parse( data.getAttribute( '__SAVED_K__' ) ) || {};
                    } catch (ex) {
                        // it is ok
                    }
                    if ( saved_keys[k] ) {
                        delete saved_keys[k];
                        data.setAttribute( '__SAVED_K__', JSON.stringify( saved_keys ) );
                        data.save( namespace );
                    }
                },
                clear: function () {
                    if ( namespace === DEFAULT_NAMESPACE ) {
                        // then clear all namespace;
                        data.load( STORAGE_AGENT );
                        var saved_namespace = {};
                        try {
                            saved_namespace = JSON.parse( data.getAttribute( '__SAVED_NS__' ) ) || {};
                            // clear namespace
                            data.setAttribute('__SAVED_NS__', '{}');
                            data.save( STORAGE_AGENT );
                        } catch ( ex ) {
                            // it is ok
                        }
                        delete saved_namespace[DEFAULT_NAMESPACE];
                        Object.keys( saved_namespace ).forEach( function ( ns ) {
                            var storage = new Storage( ns );
                            storage.clear();
                            delete saved_namespace[ns];
                        } );

                    }
                    // just clear this namespace
                    var saved_keys = JSON.parse(self.get( '__SAVED_K__' )) || {};
                    Object.keys( saved_keys ).forEach( function ( key ) {
                        self.remove( key );
                    });
                }
            };
            return self;
        };

        var storage = Storage( DEFAULT_NAMESPACE );
        Storage.get = storage.get;
        Storage.set = storage.set;
        Storage.remove = storage.remove;
        Storage.clear = storage.clear;

        module.exports = Storage;
        // this module is now ready
        done();
    });

    document.appendChild( iframe );

    // iframe.src = config.baseUrl + "crossdomain.html";
    iframe.src = 'http://static.273.cn/' + "crossdomain.html";
} else {
    Storage = function ( namespace ) {
        var saved_namespace = {};
        try {
            saved_namespace = JSON.parse( localStorage.getItem( STORAGE_AGENT + '__SAVED_NS__' ) ) || {};
        } catch ( ex ) {
            // it is ok;
        }
        if ( !saved_namespace[namespace] ) {
            saved_namespace[namespace] = 1;
            localStorage.setItem( STORAGE_AGENT + '__SAVED_NS__', JSON.stringify( saved_namespace ) );
        }

        var self = {
            set: function ( k, v ) {
                localStorage.setItem( namespace + k, v );
                var saved_keys = {};
                try {
                    saved_keys = JSON.parse( localStorage.getItem( namespace + '__SAVED_K__' ) ) || {};
                } catch ( ex ) {
                    // it is ok
                }
                if ( !saved_keys[k] ) {
                    saved_keys[k] = 1;
                    localStorage.setItem( namespace + '__SAVED_K__', JSON.stringify( saved_keys ) );
                }
            },
            get: function ( k ) {
                return localStorage.getItem( namespace + k );
            },
            remove: function ( k ) {
                localStorage.removeItem( namespace + k );
                var saved_keys = {};
                try {
                    saved_keys = JSON.parse( localStorage.getItem( namespace + '__SAVED_K__' ) ) || {};
                } catch ( ex ) {
                    // it is ok
                }
                if ( saved_keys[k] ) {
                    delete saved_keys[k];
                    localStorage.setItem( namespace + '__SAVED_K__', JSON.stringify( saved_keys ) );
                }
            },
            clear: function () {
                if ( namespace === DEFAULT_NAMESPACE ) {
                    // then clear all
                    localStorage.clear();
                } else {
                    var saved_keys =  {};
                    try {
                        saved_keys = JSON.parse( self.get( '__SAVED_K__' ) ) || {};
                    } catch ( ex ) {
                        // it is ok
                    }
                    Object.keys( saved_keys ).forEach( function ( key ) {
                        self.remove( key );
                    } );
                    localStorage.removeItem( namespace + '__SAVED_K__' );
                }
            }
        };
        return self;
    };

    var storage = Storage( DEFAULT_NAMESPACE );
    Storage.get = storage.get;
    Storage.set = storage.set;
    Storage.remove = storage.remove;
    Storage.clear = storage.clear;

    module.exports = Storage;
}