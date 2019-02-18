var e = require("api.js"), t = require("../action/account/account.js"), n = t.directLogin, i = t.checkLogin, a = t.register, s = require("../utils/util.js"), o = (s.showLoading, 
s.hideLoading, s.gotoPage), r = (s.formatUrl, s.getDateDelta, s.isPageShow), c = require("../config/index.js"), u = c.appname, d = c.devicename, g = c.version, f = {
    loginReadyCallbacks: [],
    authorizedCallback: null,
    logining: !1,
    wps_sid: null,
    userInfo: null,
    verifyData: {}
}, l = function() {
    return f.wps_sid || (f.wps_sid = wx.getStorageSync("wps_sid")), f.wps_sid;
}, p = function() {
    return !!f.wps_sid || (f.wps_sid = wx.getStorageSync("wps_sid"), !!f.wps_sid);
}, w = function() {
    f.logining || (f.logining = !0, wx.getStorageSync("wps_sid") ? h() : v());
}, v = function() {
    y().then(function() {
        n(f.verifyData).then(function(e) {
            f.logining = !1;
            var t = e.data;
            e.statusCode;
            "ok" === t.result ? S(t.wps_sid, t.device_id) : "needRegister" === t.type ? k(t.ssid) : _(e);
        }).catch(function(e) {
            f.logining = !1, C();
        });
    }).catch(function(e) {
        f.logining = !1, C();
    });
}, h = function() {
    i(wpsSid).then(function(e) {
        f.logining = !1, e ? S(wpsSid) : (P(), n());
    });
}, y = function() {
    return new Promise(function(t, n) {
        wx.login({
            success: function(e) {
                f.verifyData.code = e.code, t();
            },
            fail: function(t) {
                e.showModal({
                    title: "金山文档",
                    showCancel: !1,
                    content: "调用微信登录接口失败，请稍后重试"
                }), n();
            }
        });
    });
}, D = function() {
    var e = f.verifyData, t = e.iv, n = e.encryptedData, i = e.rawData, s = e.signature, o = e.ssid;
    a({
        ssid: o,
        iv: t,
        encryptedData: n,
        rawData: i,
        signature: s
    }).then(function(e) {
        f.logining = !1;
        var t = e.data;
        e.statusCode;
        "ok" === t.result ? (getApp().stat("user_new"), S(t.wps_sid, t.device_id)) : (getApp().stat("registerWeChatFail", {
            errorCode: t.result
        }), _(e));
    });
}, S = function(e, t) {
    f.wps_sid = e, wx.setStorageSync("wps_sid", e), t && wx.setStorageSync("deviceid", t), 
    f.verifyData.deviceid = t, m(), getApp().afterLoginSuccess(!0);
}, _ = function(t) {
    var n = t.data, i = t.statusCode, a = n.msg || n.data && n.data.msg || n.type || i;
    e.showModal({
        title: "金山文档",
        showCancel: !1,
        content: "服务暂不可用，请稍后重试（错误代码: " + a + "）"
    }), C();
}, m = function() {
    for (var e = f.loginReadyCallbacks; e.length; ) {
        var t = e.shift().success;
        t && t();
    }
}, C = function() {
    for (var e = f.loginReadyCallbacks; e.length; ) {
        var t = e.shift().fail;
        t && t();
    }
}, b = function() {
    f.loginReadyCallbacks.splice(0, f.loginReadyCallbacks.length);
}, x = function(e) {
    f.loginReadyCallbacks.push({
        success: function() {
            r("pages/register/register") && o(e, {}, !0);
        },
        fail: function() {}
    });
}, R = function() {
    var e = void 0, t = !1, n = getCurrentPages();
    if (n.length > 0 && (t = "pages/register/register" === (e = n[n.length - 1].route)), 
    !t) {
        var i = r("pages/tabBars/recent/recent"), a = r("pages/shareEditRedirect/shareEditRedirect"), s = r("pages/accountBindPhone/accountBindPhone"), c = i || a || s;
        if (c) {
            b();
            var u = "tabBars/recent";
            i ? u = "tabBars/recent" : a ? u = "shareEditRedirect" : s && (u = "accountBindPhone"), 
            x(u);
        }
        o("register", {
            route: encodeURIComponent(e)
        }, c);
    }
}, k = function(e) {
    f.verifyData.ssid = e, L().then(function() {
        D();
    }).catch(function(e) {
        R();
    });
}, L = function() {
    return new Promise(function(e, t) {
        wx.getUserInfo({
            success: function(t) {
                var n = t.detail || t;
                f.userInfo = n.userInfo, f.verifyData = Object.assign({}, f.verifyData, {
                    encryptedData: n.encryptedData,
                    iv: n.iv,
                    rawData: n.rawData,
                    signature: n.signature
                }), e();
            },
            fail: function() {
                t();
            }
        });
    });
}, P = function() {
    f.wps_sid = "", wx.setStorageSync("wps_sid", "");
}, A = function() {
    wx.getSystemInfo({
        success: function(e) {
            f.verifyData = Object.assign({}, f.verifyData, {
                brand: e.brand,
                model: e.model,
                platform: e.platform,
                system: e.system,
                appname: u,
                devicename: d,
                version: g,
                deviceid: wx.getStorageSync("deviceid")
            });
        }
    });
};

module.exports = {
    init: function() {
        A(), l();
    },
    callAfterLogin: function(e, t) {
        f.wps_sid ? (e(), getApp().afterLoginSuccess(!1)) : (f.loginReadyCallbacks.push({
            success: e,
            fail: t
        }), w());
    },
    afterAuthorize: function() {
        L().then(function() {
            D();
        }).catch(function() {
            C();
        });
    },
    isLogined: p,
    clearWpssid: P,
    isAuthorized: function() {
        return p() || !!f.userInfo;
    },
    getWpssid: l,
    getVerifyData: function() {
        return f.verifyData;
    }
};