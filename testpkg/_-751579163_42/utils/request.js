var e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
    return typeof e;
} : function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
}, t = require("../config/index.js").domain, o = t.Drive, r = t.Account, n = t.QR, i = t.WebOffice, s = t.Thumbnail, a = function(e, t) {
    var o = t.url, r = t.data, n = t.header, i = t.method, s = t.dataType, a = t.responseType, u = t.success, c = t.fail, f = t.complete, l = getApp(), m = "";
    if (l && l.isLogined()) m = l.getWpssid(); else try {
        m = wx.getStorageSync("wps_sid");
    } catch (e) {
        m = "";
    }
    var y = "";
    n || (n = {}), i && "GET" === i.toUpperCase() || (y = "csrf=1234567890", n["X-CSRFToken"] = "1234567890"), 
    m && (y ? y += "; wps_sid=" + m : y = "wps_sid=" + m), y && (n.Cookie ? n.Cookie = n.Cookie + "; " + y : n.Cookie = y), 
    o = e + o, wx.request({
        url: o,
        data: r || {},
        header: n,
        method: i || "GET",
        dataType: s || "json",
        responseType: a || "text",
        success: function(e) {
            u && u(e), (200 != e.statusCode || e.data && e.data.result && "ok" !== e.data.result) && p(o, m, r, i, e);
        },
        fail: function(e) {
            d(e, c), p(o, m, r, i, e);
        },
        complete: f || function(e) {}
    });
}, u = [ "https://thumbnail.wps.cn/preview/getThumbnailImg", "https://drive.wps.cn/api/v5/links/share_groups" ], c = [ "userNotLogin" ], p = function(e, t, o, r, n) {
    var i = getApp();
    if (i && !(u.indexOf(e) >= 0)) {
        var s = t && t.replace(/(.{10}).*(.{10})/g, "$1****$2") || "", a = {
            errMsg: n.errMsg || n.type || "unknown",
            errorCode: n.data && n.data.result || "unknown"
        };
        if (!(c.indexOf(a.errorCode) >= 0)) {
            var p = {
                url: e,
                wpsSid: s,
                data: o || {},
                method: r || "GET",
                fail: a
            };
            i.writeLog(p);
            var d = /[\,\:\.]+/g, f = {
                url: (e = e.replace(d, "_")) + "|" + (r || "GET") + "|" + a.errMsg.replace(d, "_") + "|" + a.errorCode
            };
            i.stat("request_error", f), i.stat("request_times", {
                url: e
            });
        }
    }
}, d = function(t, o) {
    "object" === (void 0 === t ? "undefined" : e(t)) && (t.result = "网络异常", t.msg = "网络异常"), 
    o && o(t);
};

module.exports = {
    drive: function(e) {
        a(o, e);
    },
    account: function(e) {
        a(r, e);
    },
    qr: function(e) {
        a(n, e);
    },
    weboffice: function(e) {
        a(i, e);
    },
    thumbnail: function(e) {
        a(s, e);
    }
};