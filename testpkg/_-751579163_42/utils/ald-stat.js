var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(n) {
    return typeof n;
} : function(n) {
    return n && "function" == typeof Symbol && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
};

!function(o, t) {
    "object" == ("undefined" == typeof exports ? "undefined" : n(exports)) && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : o.Ald = t();
}(void 0, function() {
    function o(n) {
        this.app = n;
    }
    function t(n) {
        H = n, this.aldstat = new o(this), S("app", "launch");
    }
    function e(n) {
        if (H = n, B = n.query.ald_share_src, C = n.query.aldsrc || "", F = n.query.ald_share_src, 
        T = Date.now(), I = Date.now(), !nn) {
            P = "" + Date.now() + Math.floor(1e7 * Math.random()), O = !1;
            try {
                wx.setStorageSync("ald_ifo", !1);
            } catch (n) {}
        }
        nn = !1, 0 !== A && Date.now() - A > 3e5 && (R = "" + Date.now() + Math.floor(1e7 * Math.random()), 
        I = Date.now()), n.query.ald_share_src && "1044" == n.scene && n.shareTicket ? wx.getShareInfo({
            shareTicket: n.shareTicket,
            success: function(n) {
                J = n, m("event", "ald_share_click", JSON.stringify(n));
            }
        }) : n.query.ald_share_src && m("event", "ald_share_click", 1), "" === G && wx.getSetting({
            withCredentials: !0,
            success: function(n) {
                n.authSetting["scope.userInfo"] && wx.getUserInfo({
                    withCredentials: !0,
                    success: function(n) {
                        var o = g();
                        G = n, o.ufo = y(n), k = w(n.userInfo.avatarUrl.split("/")), p(o);
                    }
                });
            }
        }), S("app", "show");
    }
    function a() {
        A = Date.now(), "" === G && wx.getSetting({
            success: function(n) {
                n.authSetting["scope.userInfo"] && wx.getUserInfo({
                    withCredentials: !0,
                    success: function(n) {
                        G = n, k = w(n.userInfo.avatarUrl.split("/"));
                        var o = g();
                        o.ufo = y(n), p(o);
                    }
                });
            }
        }), S("app", "hide");
    }
    function r(n) {
        j++, m("event", "ald_error_message", n);
    }
    function i(n) {
        Q = n;
    }
    function s() {
        W = this.route, X = Date.now(), Z = 0, Y = 0;
    }
    function c() {
        _("page", "hide"), z = this.route;
    }
    function u() {
        _("page", "unload"), z = this.route;
    }
    function l() {
        Z++;
    }
    function f() {
        Y++;
    }
    function h(n) {
        var o = v(n.path), t = {};
        for (var e in H.query) "ald_share_src" === e && (t[e] = H.query[e]);
        var a = "";
        if (a = -1 == n.path.indexOf("?") ? n.path + "?" : n.path.substr(0, n.path.indexOf("?")) + "?", 
        "" !== o) for (var e in o) t[e] = o[e];
        t.ald_share_src ? -1 == t.ald_share_src.indexOf(E) && t.ald_share_src.length < 200 && (t.ald_share_src = t.ald_share_src + "," + E) : t.ald_share_src = E;
        for (var r in t) -1 == r.indexOf("ald") && (a += r + "=" + t[r] + "&");
        return n.path = a + "ald_share_src=" + t.ald_share_src, m("event", "ald_share_status", n), 
        n;
    }
    function d() {
        function n() {
            return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
        }
        return n() + n() + n() + n() + n() + n() + n() + n();
    }
    function p(n) {
        var o = n, t = 0, e = 0;
        !function a(r) {
            e++, r ? (n = {}, n.et = Date.now(), n.at = P, n.uu = E, n.v = b, n.ak = o.ak, n.life = o.life, 
            n.ev = o.ev, n.err = "err", n.status = t) : (q++, n.at = P, n.et = Date.now(), n.uu = E, 
            n.v = b, n.ak = D.app_key, n.wsr = H, n.oifo = O, n.rq_c = q), wx.request({
                url: "https://" + M + ".aldwx.com/d.html",
                data: n,
                header: {
                    AldStat: "MiniApp-Stat",
                    waid: D.appid || "",
                    wst: D.appsecret || "",
                    se: U || "",
                    op: L || "",
                    img: k
                },
                method: "GET",
                success: function(n) {
                    t = n.statusCode, 200 != n.statusCode && e <= 3 && a("errorsend");
                },
                fail: function() {
                    e <= 3 && a("errorsend");
                }
            });
        }();
    }
    function g() {
        var n = {};
        for (var o in K) n[o] = K[o];
        return n;
    }
    function w(n) {
        for (var o = "", t = 0; t < n.length; t++) n[t].length > o.length && (o = n[t]);
        return o;
    }
    function y(n) {
        var o = {};
        for (var t in n) "rawData" != t && "errMsg" != t && (o[t] = n[t]);
        return o;
    }
    function v(n) {
        if (-1 == n.indexOf("?")) return "";
        var o = {};
        return n.split("?")[1].split("&").forEach(function(n) {
            var t = n.split("=")[1];
            o[n.split("=")[0]] = t;
        }), o;
    }
    function S(n, o) {
        var t = g();
        t.ev = n, t.life = o, t.ec = j, t.st = N, C && (t.qr = C, t.sr = C), B && (t.usr = B), 
        "launch" !== o && (t.ahs = R), "hide" === o && (t.hdr = Date.now() - I, t.dr = Date.now() - T, 
        t.ifo = !!O), p(t);
    }
    function _(n, o) {
        var t = g();
        t.ev = n, t.st = Date.now(), t.life = o, t.pp = W, t.pc = z, t.dr = Date.now() - N, 
        t.ndr = Date.now() - X, t.rc = Z, t.bc = Y, t.ahs = R, Q && "{}" != JSON.stringify(Q) && (t.ag = Q), 
        C && (t.qr = C, t.sr = C), B && (t.usr = B), V || ($ = W, V = !0, t.ifp = V, t.fp = W), 
        p(t);
    }
    function m(n, o, t) {
        var e = g();
        e.ev = n, e.tp = o, e.st = N, t && (e.ct = t), p(e);
    }
    function x(n, o, t) {
        if (n[o]) {
            var e = n[o];
            n[o] = function(n) {
                t.call(this, n, o), e.call(this, n);
            };
        } else n[o] = function(n) {
            t.call(this, n, o);
        };
    }
    var D = require("./ald-stat-conf"), b = "7.0.0", M = "log", P = "" + Date.now() + Math.floor(1e7 * Math.random()), R = "" + Date.now() + Math.floor(1e7 * Math.random()), I = "", T = 0, A = 0, U = "", L = "", k = "", q = 0, H = "", O = "", E = function() {
        var n = "";
        try {
            n = wx.getStorageSync("aldstat_uuid");
        } catch (o) {
            n = "uuid_getstoragesync";
        }
        if (n) O = !1; else {
            n = d(), O = !0;
            try {
                wx.setStorageSync("aldstat_uuid", n), wx.setStorageSync("ald_ifo", !0);
            } catch (n) {
                wx.setStorageSync("aldstat_uuid", "uuid_getstoragesync");
            }
        }
        return n;
    }(), N = Date.now(), B = "", C = "", F = "", j = 0, J = "", G = "", K = {}, V = !1, W = "", z = "", Q = "", X = "", Y = 0, Z = 0, $ = "", nn = !0;
    wx.request({
        url: "https://" + M + ".aldwx.com/config/app.json",
        header: {
            AldStat: "MiniApp-Stat"
        },
        method: "GET",
        success: function(n) {
            200 === n.statusCode && (n.data.version != b && console.warn("您的SDK不是最新版本，请尽快升级！"), 
            n.data.warn && console.warn(n.data.warn), n.data.error && console.error(n.data.error));
        }
    });
    try {
        var on = wx.getSystemInfoSync();
        K.br = on.brand, K.pm = on.model, K.pr = on.pixelRatio, K.ww = on.windowWidth, K.wh = on.windowHeight, 
        K.lang = on.language, K.wv = on.version, K.wvv = on.platform, K.wsdk = on.SDKVersion, 
        K.sv = on.system;
    } catch (o) {}
    return wx.getNetworkType({
        success: function(n) {
            K.nt = n.networkType;
        }
    }), wx.getSetting({
        success: function(n) {
            n.authSetting["scope.userLocation"] ? wx.getLocation({
                type: "wgs84",
                success: function(n) {
                    K.lat = n.latitude, K.lng = n.longitude, K.spd = n.speed;
                }
            }) : D.getLocation && wx.getLocation({
                type: "wgs84",
                success: function(n) {
                    K.lat = n.latitude, K.lng = n.longitude, K.spd = n.speed;
                }
            });
        }
    }), o.prototype.debug = function(n) {
        m("debug", "0", n);
    }, o.prototype.warn = function(n) {
        m("warn", "1", n);
    }, o.prototype.sendEvent = function(o, t) {
        if ("" !== o && "string" == typeof o && o.length <= 255) if ("string" == typeof t && t.length <= 255) m("event", o, t); else if ("object" == (void 0 === t ? "undefined" : n(t))) {
            if (JSON.stringify(t).length >= 255) return void console.error("自定义事件参数不能超过255个字符");
            m("event", o, JSON.stringify(t));
        } else void 0 === t ? m("event", o, !1) : console.error("事件参数必须为String,Object类型,且参数长度不能超过255个字符"); else console.error("事件名称必须为String类型且不能超过255个字符");
    }, o.prototype.sendSession = function(n) {
        if ("" !== n && n) if ("" !== D.appid && "" !== D.appsecret) {
            U = n;
            var o = g();
            o.st = Date.now(), o.tp = "session", o.ct = "session", o.ev = "event", "" === G ? wx.getSetting({
                success: function(n) {
                    n.authSetting["scope.userInfo"] ? wx.getUserInfo({
                        success: function(n) {
                            o.ufo = y(n), k = w(n.userInfo.avatarUrl.split("/")), "" !== J && (o.gid = J), p(o);
                        }
                    }) : "" !== J ? (o.gid = J, p(o)) : console.warn("用户未授权");
                }
            }) : (o.ufo = G, "" !== J && (o.gid = J), p(o));
        } else console.error("请在配置文件中填写小程序的appid和appsecret！"); else console.error("请传入从后台获取的session_key");
    }, o.prototype.sendOpenid = function(n) {
        if ("" !== n && n) {
            L = n;
            var o = g();
            o.st = Date.now(), o.tp = "openid", o.ev = "event", o.ct = "openid", p(o);
        } else console.error("openID不能为空");
    }, D.plugin ? {
        App: function(n) {
            var o = {};
            for (var i in n) "onLaunch" !== i && "onShow" !== i && "onHide" !== i && "onError" !== i && "onPageNotFound" !== i && "onUnlaunch" !== i && (o[i] = n[i]);
            o.onLaunch = function(o) {
                t.call(this, o), "function" == typeof n.onLaunch && n.onLaunch.call(this, o);
            }, o.onShow = function(o) {
                e.call(this, o), n.onShow && "function" == typeof n.onShow && n.onShow.call(this, o);
            }, o.onHide = function() {
                a.call(this), n.onHide && "function" == typeof n.onHide && n.onHide.call(this);
            }, o.onError = function(o) {
                r.call(this, o), n.onError && "function" == typeof n.onError && n.onError.call(this, o);
            }, o.onUnlaunch = function() {
                n.onUnlaunch && "function" == typeof n.onUnlaunch && n.onUnlaunch.call(this);
            }, o.onPageNotFound = function(o) {
                n.onPageNotFound && "function" == typeof n.onPageNotFound && n.onPageNotFound.call(this, o);
            }, App(o);
        },
        Page: function(n) {
            var o = {};
            for (var t in n) "onLoad" !== t && "onReady" !== t && "onShow" !== t && "onHide" !== t && "onUnload" !== t && "onPullDownRefresh" !== t && "onReachBottom" !== t && "onShareAppMessage" !== t && "onPageScroll" !== t && "onTabItemTap" !== t && (o[t] = n[t]);
            o.onLoad = function(o) {
                i.call(this, o), "function" == typeof n.onLoad && n.onLoad.call(this, o);
            }, o.onShow = function(o) {
                s.call(this), "function" == typeof n.onShow && n.onShow.call(this, o);
            }, o.onHide = function(o) {
                c.call(this), "function" == typeof n.onHide && n.onHide.call(this, o);
            }, o.onUnload = function(o) {
                u.call(this), "function" == typeof n.onUnload && n.onUnload.call(this, o);
            }, o.onReady = function(o) {
                n.onReady && "function" == typeof n.onReady && n.onReady.call(this, o);
            }, o.onReachBottom = function(o) {
                f(), n.onReachBottom && "function" == typeof n.onReachBottom && n.onReachBottom.call(this, o);
            }, o.onPullDownRefresh = function(o) {
                l(), n.onPullDownRefresh && "function" == typeof n.onPullDownRefresh && n.onPullDownRefresh.call(this, o);
            }, o.onPageScroll = function(o) {
                n.onPageScroll && "function" == typeof n.onPageScroll && n.onPageScroll.call(this, o);
            }, o.onTabItemTap = function(o) {
                n.onTabItemTap && "function" == typeof n.onTabItemTap && n.onTabItemTap.call(this, o);
            }, n.onShareAppMessage && "function" == typeof n.onShareAppMessage && (o.onShareAppMessage = function(o) {
                var t = n.onShareAppMessage.call(this, o);
                return void 0 === t ? (t = {}, t.path = this.route) : void 0 === t.path && (t.path = this.route), 
                h.call(this, t);
            }), Page(o);
        }
    } : void function() {
        var n = App, o = Page;
        App = function(o) {
            x(o, "onLaunch", t), x(o, "onShow", e), x(o, "onHide", a), x(o, "onError", r), n(o);
        }, Page = function(n) {
            var t = n.onShareAppMessage;
            x(n, "onLoad", i), x(n, "onUnload", u), x(n, "onShow", s), x(n, "onHide", c), x(n, "onReachBottom", f), 
            x(n, "onPullDownRefresh", l), void 0 !== t && null !== t && (n.onShareAppMessage = function(n) {
                if (void 0 !== t) {
                    var o = t.call(this, n);
                    return void 0 === o ? (o = {}, o.path = this.route) : void 0 === o.path && (o.path = this.route), 
                    h(o);
                }
            }), o(n);
        };
    }();
});