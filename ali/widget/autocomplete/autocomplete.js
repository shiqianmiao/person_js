/**
 * @desc autocomplete组件（下版重构）
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-06-25
 */

var Log    = require('util/log.js');
module.exports = function () {

    var M = navigator.userAgent.indexOf("MSIE") != -1 && !window.opera;
    var V = (document.compatMode == "BackCompat");
    var DOMAIN = window.location.host.split('.')[0];
    function I(C) {
        return document.getElementById(C)
    }
    function K(C) {
        return document.createElement(C)
    }
    function S(C) {
        return String(C).replace(new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g"), "")
    }
    function U(C) {
        return String(C).replace(new RegExp("[\\s\\t\\xa0\\u3000]", "g"), "")
    }
    function P(G, X, C) {
        if (M) {
            G.attachEvent("on" + X, (function(Y) {
                return function() {
                    C.call(Y)
                }
            })(G))
        } else {
            G.addEventListener(X, C, false)
        }
    }
    function N(C) {
        if (M) {
            C.returnValue = false
        } else {
            C.preventDefault()
        }
    }
    //给头部添加css
    function R(X) {
        if (M) {
            var G = document.createStyleSheet();
            G.cssText = X
        } else {
            var C = document.createElement("style");
            C.type = "text/css";
            C.appendChild(document.createTextNode(X));
            document.getElementsByTagName("HEAD")[0].appendChild(C)
        }
    }
    //给表单添加和删除隐藏域input
    function H(G) {
        var X = I('js-search-form');
        for (var Y in G) {
            if (G[Y] == undefined) {
                if (I("bdsug_ipt_" + Y)) {
                    X.removeChild(I("bdsug_ipt_" + Y))
                }
            } else {
                if (!O(Y)) {
                    X.appendChild(C(Y, G[Y]))
                } else {
                    O(Y).value = G[Y]
                }
            }
        }
        function C(Z, b) {
            var a = K("INPUT");
            a.type = "hidden";
            a.name = Z;
            a.id = "bdsug_ipt_" + Z;
            a.value = b;
            return a
        }
    }
    function O(Y) {
        var X = I('js-search-form');
        var G = false;
        var C = X.getElementsByTagName("INPUT");
        for (var Z = 0; Z < C.length; Z++) {
            if (Y == C[Z].getAttribute("name")) {
                G = C[Z];
                return G
            } else {
                G = false
            }
        }
    }
    function L(G) {
        var X = I('js-search-form');
        for (var C in G) {
            if (C == "f") {
                if (O("f")) {
                    if (O("f").id == "bdsug_ipt_f") {
                        X.removeChild(I("bdsug_ipt_f"))
                    } else {
                        O("f").value = "8"
                    }
                }
            } else {
                if (I("bdsug_ipt_" + C)) {
                    X.removeChild(I("bdsug_ipt_" + C))
                }
            }
        }
    }
    var A = 0;
    if (typeof window.bdsug != "object" || window.bdsug == null) {
        window.bdsug = {}
    }
    bdsug.sug = {};
    bdsug.sugkeywatcher = {};
    //事件添加和触发基类
    var J = (function() {
        function C(b) {
            var Z = this.__MSG_QS__;
            if (!Z[b]) {
                Z[b] = []
            }
            for (var a = 1, X = arguments.length, Y; a < X; a++) {
                Z[b].push(arguments[a])
            }
        }
        function G(Y) {
            var Z = this.__MSG_QS__[Y.type];
            if (Z == null) {
                return
            }
            for (var a = 0, X = Z.length; a < X; a++) {
                Z[a].rm(Y)
            }
        }
        return {
            ini: function(X) {
                X.__MSG_QS__ = {};
                X.on = C;
                X.dm = G;
                return X
            }
        }
    })();
    var F = (function() {
        var X = I("kw");
        var g;
        var j = 0;
        var C = 0;
        var e = "";
        var Y = "";
        var d;
        var m = false;
        var b = true;
        var i;
        var l = I("su");
        var defaultValue = '请输入车辆名称 如：别克 或 别克 君威';
        // X.style.color = "#aaa";

        if (!X.value || X.value == defaultValue) {
            X.value = defaultValue;
        }

        P(l, "mousedown", Z);
        P(l, "keydown", Z);
        P(I("kw"), "paste",
        function() {
            H({
                n: 2
            });
            if (A == 0) {
                A = new Date().getTime()
            }
        });
        function Z() {
            H({
                inputT: A > 0 ? (new Date().getTime() - A) : 0
            })
        }
        function a() {
            if (b) {
                F.dm({
                    type: "start"
                });
                b = false
            }
        }
        function f(q) {
            if (A == 0) {
                A = new Date().getTime()
            }
            if (b) {
                F.dm({
                    type: "start"
                });
                b = false
            }
            q = q || window.event;
            if (q.keyCode == 9 || q.keyCode == 27) {
                F.dm({
                    type: "hide_div"
                })
            }
            if (q.keyCode == 13) {
                N(q);
                F.dm({
                    type: "key_enter"
                })
            }
            if (q.keyCode == 86 && q.ctrlKey) {
                H({
                    n: 2
                })
            }
            if (g.style.display != "none") {
                if (q.keyCode == 38) {
                    N(q);
                    F.dm({
                        type: "key_up"
                    })
                }
                if (q.keyCode == 40) {
                    F.dm({
                        type: "key_down"
                    })
                }
            } else {
                if (q.keyCode == 38 || q.keyCode == 40) {
                    F.dm({
                        type: "need_data",
                        wd: X.value
                    })
                }
            }
        }
        function n() {
            var q = X.value;
            if (q == e && q != "" && q != Y && q != d) {
                if (C == 0) {
                    C = setTimeout(function() {
                        F.dm({
                            type: "need_data",
                            wd: q
                        })
                    },
                    100)
                }
            } else {
                clearTimeout(C);
                C = 0;
                e = q;
                if (q == "") {
                    F.dm({
                        type: "hide_div"
                    })
                }
                if (Y != X.value) {
                    Y = ""
                }
            }
        }
        function o() {
            j = setInterval(n, 10)
        }
        function h() {
            clearInterval(j)
        }
        function k() {
            if (m) {
                window.event.cancelBubble = true;
                window.event.returnValue = false;
                m = false
            }
        }
        function c(q) {
            X.blur();
            X.setAttribute("autocomplete", q);
            X.focus()
        }
        function G(q) {
            var q = q || window.event;
            if (q.keyCode == 13) {
                N(q)
            }
        }
        X.setAttribute("autocomplete", "off");
        var p = false;
        bdsug.sugkeywatcher.on = function() {
            if (!p) {
                if (M) {
                    X.attachEvent("onkeydown", f)
                } else {
                    X.addEventListener("keydown", f, false)
                }
                p = true
            }
        };
        bdsug.sugkeywatcher.off = function() {
            if (p) {
                if (M) {
                    X.detachEvent("onkeydown", f)
                } else {
                    X.removeEventListener("keydown", f, false)
                }
                p = false
            }
        };
        bdsug.sugkeywatcher.on();
        P(X, "mousedown", a);
        P(X, "beforedeactivate", k);
        P(X, "focus", function () {
            if (X.value == defaultValue) {
                X.className = 'on';
                X.value = '';
            }

        });
        P(X, "blur", function () {
            X.className = '';
            if (!X.value) {
                X.value = defaultValue;
            }

        });
        if (window.opera) {
            P(X, "keypress", G)
        }
        return J.ini({
            rm: function(q) {
                switch (q.type) {
                case "div_ready":
                    g = q.sdiv;
                    Y = X.value;
                    o();
                    break;
                case "clk_submit":
                    h();
                    X.blur();
                    X.value = q.wd;
                    break;
                case "ent_submit":
                    h();
                    X.blur();
                    break;
                case "key_select":
                    d = q.selected;
                    break;
                case "close":
                    h();
                    c("on");
                    break;
                case "mousedown_tr":
                    if (navigator.userAgent.toLowerCase().indexOf("webkit") != -1) {
                        h();
                        setTimeout(o, 2000)
                    }
                    m = true;
                    break
                }
            }
        })
    })();
    var W = (function() {
        var h;
        var a = I("kw");
        var l;
        var d = -1;
        var C = new Array();
        var m;
        var o;
        function n() {      //鼠标移上去所有行样式初始化
            var r = l.rows;
            for (var q = 0; q < r.length; q++) {
                r[q].className = "ml"
            }
        }
        function e() {      //获取当前选择的下拉位置和文字
            if (typeof(l) != "undefined" && l != null && h.style.display != "none") {
                var r = l.rows;
                for (var q = 0; q < r.length; q++) {
                    if (r[q].className == "mo") {
                        return [q, r[q].cells[0].innerHTML]
                    }
                }
            }
            return [ - 1, ""]
        }
        function i() {      //如果获取的数据为空，则隐藏下拉框
            if (M) {
                o.style.display = "none"
            }
            h.style.display = "none"
        }
        function G() {      //鼠标移上去触发事件
            n();
            this.className = "mo"
        }
        function f(q) {
            q = q || window.event;
            N(q);
            W.dm({
                type: "close"
            });
            i();
        }
        function X() {
            var q = [a.offsetWidth, a.offsetHeight];
            h.style.width = ((M && V) ? q[0] : q[0] - 2) + "px";
            h.style.top = ((M && V) ? q[1] : q[1] - 1) + "px";
            h.style.display = "block";
            if (M) {
                o.style.top = ((M && V) ? q[1] : q[1] - 1) + "px";
                o.style.width = ((M && V) ? q[0] : q[0] - 2) + "px"
            }
        }
        function Y(r, q) {
            if (r && q) {
                var s = S(r);
                if (q.indexOf(s) == 0) {
                    q = p(q, s)
                } else {
                    if (q.indexOf(U(r)) == 0) {
                        s = U(r);
                        q = p(q, s)
                    } else {}
                }
            }
            q = q.replace("&", "&amp;");
            return q
        }
        function p(q, s) {
            var t = "<span>" + s + "</span>";
            var u = s.length;
            var r = "<b>" + q.substring(u) + "</b>";
            return (t + r)
        }
        function j() {
            l = K("TABLE");
            l.id = "st";
            l.cellSpacing = 0;
            l.cellPadding = 2;
            var s = K("tbody");
            l.appendChild(s);
            for (var t = 0, u = C.length; t < u; t++) {
                var r = s.insertRow( - 1);
                //绑定鼠标触发事件
                P(r, "mouseover", G);
                P(r, "mouseout", n);
                P(r, "mousedown", b);
                P(r, "click", c(t));
                var q = r.insertCell( - 1);
                q.innerHTML = Y(m, '<dl><dt>'+C[t][0]+'</dt><dd>'+C[t][2]+"\u6761\u8f66\u6e90</dd>");
            }
            h.innerHTML = "";
            h.appendChild(l);
            X();
            if (M) {
                o.style.display = "block";
                o.style.left = 0 + "px";
                o.style.top = a.offsetHeight + "px";
                o.style.width = a.offsetWidth + "px";
                o.style.height = h.offsetHeight - 1 + "px"
                o.style.backgroudColor = '#fff';
            }
        }
        //回车键事件
        function Z() {
            d = e()[0];
            if (d == -1) {
                W.dm({
                    type: "submit"
                })
            } else {
                W.dm({
                    type: "ent_submit",
                    oq: m,
                    url: C[d][1],
                    count: C[d][2],
                    rsp: d
                })
            }
        }
        //鼠标左键按下事件
        function b(q) {     
            d = e()[0];
            W.dm({
                type: "mousedown_tr"
            });
            if (!M) {
                q.stopPropagation();
                q.preventDefault();
                return false
            }
        }
        //鼠标左键点击触发事件
        function c(q) {     
            var r = q;
            return function() {
                var s = C[r];
                i();
                W.dm({
                    type: "clk_submit",
                    oq: I("kw").value,
                    wd: s[0],
                    url: s[1],
                    count: s[2]
                })
            }
        }
        //上箭头按下事件
        function k() {
            d = e()[0];
            n();
            if (d == 0) {
                W.dm({
                    type: "key_select",
                    selected: ""
                });
                I("kw").value = m;
                d--;
                L({
                    oq: m,
                    sug: C[d],
                    rsp: d
                })
            } else {
                if (d == -1) {
                    d = C.length
                }
                d--;
                var q = l.rows[d];
                q.className = "mo";
                W.dm({
                    type: "key_select",
                    selected: C[d][0]
                });
                I("kw").value = C[d][0];
                H({
                    oq: m,
                    sug: C[d][0],
                    rsp: d
                })
            }
        }
        //下箭头按下事件
        function g() {
            d = e()[0];
            n();
            if (d == C.length - 1) {
                W.dm({
                    type: "key_select",
                    selected: ""
                });
                I("kw").value = m;
                d = -1;
                L({
                    oq: m,
                    sug: C[d],
                    rsp: d
                })
            } else {
                d++;
                var q = l.rows[d];
                q.className = "mo";
                W.dm({
                    type: "key_select",
                    selected: C[d][0]
                });
                I("kw").value = C[d][0];
                H({
                    oq: m,
                    sug: C[d][0],
                    rsp: d
                })
            }
        }
        return J.ini({
            rm: function(q) {
                switch (q.type) {
                case "div_ready":
                    h = q.sdiv;
                    o = q.frm;
                    break;
                case "give_data":   //获取数据
                    m = q.data.q;
                    C = new Array();
                    for(qindex=0,qlen=q.data.s.length;qindex<qlen;qindex++){
                        C[qindex]=new Array();
                        C[qindex]=q.data.s[qindex].split("|");
                    }
                    if (C.length != 0) {
                        j()
                    } else {
                        i()
                    }
                    break;
                case "key_enter":
                    Z();
                    break;
                case "key_up":
                    k();
                    break;
                case "key_down":
                    g();
                    break;
                case "hide_div":
                    i();
                    break;
                case "mousedown_other":
                    i();
                    break;
                case "window_blur":
                    i();
                    break;
                case "need_resize":
                    X();
                    break
                }
            }
        })
    })();
    //表单提交管理器
    var T = (function() {
        var C = I('js-search-form');
        var defaultValue = '请输入车辆名称 如：别克 或 别克 君威';

        function G(e) {
            var value = S(I("kw").value);
            if ( !value || value == defaultValue) {
                if ( e && e.preventDefault ) {
                    e.preventDefault();
                } else {
                    window.event.returnValue = false;
                }
            }

            if (I("bdsug_ipt_sug")) {
                if (I("bdsug_ipt_sug").value == S(I("kw").value)) {
                    L({
                        n: 1,
                        sug: 1
                    })
                } else {
                    L({
                        f: 1
                    })
                }
            }
        }
        P(C, "submit", G);
        function X() {  //默认提交
            G();
            H({
                inputT: A > 0 ? (new Date().getTime() - A) : 0
            });
            var kw = I("kw").value;
            var to = C.action;
            var eqslog = '/search/log@etype=enter'+'@kw=' + kw + '@to=' + to + '@count=-1';
            Log.trackEventByGjalog(eqslog, null, 'click');
            C.submit()
        }
        function Y(Z) {  //下拉选择提交或鼠标按键提交
            H(Z);
            H({
                inputT: A > 0 ? (new Date().getTime() - A) : 0
            });
            L({
                sug: 1,
                n: 1
            });
            var eqslog = '/search/log@etype=click'+'@kw='+Z.oq + '@to='+Z.url+'@count='+Z.count;
            Log.trackEventByGjalog(eqslog, null, 'click');
            window.location.href=Z.url;
        }
        return J.ini({
            rm: function(Z) {
                switch (Z.type) {
                case "clk_submit":
                case "ent_submit":
                    Y({
                        oq: Z.oq,
                        rsp: Z.rsp,
                        url: Z.url,
                        count: Z.count
                    });
                    break;
                case "submit":
                    X();
                    break
                }
            }
        })
    })();
    var B = (function() {
        var G = {};
        function X(C) {
            if (typeof G[C] == "undefined") {
                B.dm({
                    type: "request_data",
                    wd: C
                })
            } else {
                B.dm({
                    type: "give_data",
                    data: G[C]
                })
            }
        }
        function Y(C) {
            G[C.q] = C;
            B.dm({
                type: "give_data",
                data: G[C.q]
            })
        }
        return J.ini({
            rm: function(C) {
                switch (C.type) {
                case "response_data":
                    Y(C.data);
                    break;
                case "need_data":
                    X(C.wd);
                    break
                }
            }
        })
    })();

    //baidu suggestion查询管理
    var Q = (function() {
        var C;
        function G(Y) {
            if (C) {
                document.body.removeChild(C)
            }
            C = K("SCRIPT");
            C.src = "http://data.273.cn/?_mod=AutoComplete&wd=" + encodeURIComponent(Y) + "&ar="+DOMAIN+"&t=" + (new Date()).getTime();
            C.charset = "utf-8";
            document.body.appendChild(C)
        }
        return J.ini({
            rm: function(Y) {
                switch (Y.type) {
                case "request_data":
                    G(Y.wd);
                    break;
                }
            }
        })
    })();
    bdsug.sug = function(C) {
        bdsug.dm({
            type: "response_data",
            data: C
        })
    };
    bdsug.initSug = function() {
        bdsug.dm({
            type: "init"
        })
    };
    J.ini(bdsug);


    //D 百度suggestion 显示管理
    var D = (function() {
        var Z = I("kw");
        var C;
        var c = Z.parentElement;
        var Y;
        //宽度变化
        function a() {
            if (C.offsetWidth != 0 && Z.offsetWidth != C.offsetWidth) {
                D.dm({
                    type: "need_resize"
                })
            }
        }
        //插入sug块，ie要在之前插入iframe
        function d() {
            C = K("DIV");
            C.id = "sd_" + new Date().getTime();
            C.style.display = "none";
            c.appendChild(C);
            if (M) {
                Y = K("IFRAME");
                Y.style.display = "none";
                Y.style.position = "absolute";
                Y.style.zindex = 3000;
                C.parentNode.insertBefore(Y, C)
            }
        }
        //监听鼠标移到外部的事件
        function b(e) {
            e = e || window.event;
            var f = e.target || e.srcElement;
            if (f == Z) {
                return
            }
            while (f = f.parentNode) {
                if (f == C) {
                    return
                }
            }
            D.dm({
                type: "mousedown_other"
            })
        }
        function X() {
            D.dm({
                type: "window_blur"
            })
        }
        function G() {
            var f = "#" + C.id;
            var e = [];
            D.dm({
                type: "div_ready",
                sdiv: C,
                frm: Y
            });
            setInterval(a, 100);
            P(document, "mousedown", b);
            P(window, "blur", X);
            e.push(f + "{border:1px solid #817F82;position:absolute;top:28px;left:0;z-index:999}");
            e.push(f + " table{width:100%;background:#fff;cursor:default}");
            e.push(f + " td{font:14px verdana;line-height:24px;text-indent:6px}");
            e.push(f + " td b{color:#333}");
            e.push(f + " .mo{background-color:#3399FF}");
            e.push(f + " .ml{background-color:#fff}");
            e.push(f + " dl{margin:0;padding:0}");
            e.push(f + " dt{float:left;color:#404040}");
            e.push(f + " dd{float:right;margin-right:6px;color:#999}");
            e.push(f + " .ml dt{color:#404040}");
            e.push(f + " .ml dd{color:#999}");
            e.push(f + " .mo dt{color:#FFF}");
            e.push(f + " .mo dd{color:#FFF}");
            R(e.join(""))
        }
        bdsug.sug.initial = G;
        return J.ini({
            rm: function(e) {
                switch (e.type) {
                case "start":
                    G();
                    break;
                case "init":
                    d();
                    break
                }
            }
        })
    })();
    F.on("need_data", B);
    F.on("close_div", W);
    F.on("key_enter", W);
    F.on("key_up", W);
    F.on("key_down", W);
    F.on("hide_div", W);
    F.on("start", D);
    B.on("request_data", Q);
    B.on("give_data", W);
    bdsug.on("response_data", B);
    bdsug.on("init", D);
    W.on("clk_submit", F, T);
    W.on("ent_submit", F, T);
    W.on("submit", T);
    W.on("key_select", F);
    W.on("close", F);
    W.on("mousedown_tr", F);
    D.on("mousedown_other", W);
    D.on("need_resize", W);
    D.on("div_ready", F, W);
    D.on("window_blur", W);
    window.bdsug.initSug();
};
