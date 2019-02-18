var n = require("../../utils/request.js"), t = n.drive, i = n.account, e = n.qr, o = function(n) {
    return new Promise(function(t, i) {
        e({
            url: "/api/v3/login_qrcode/onconfirm",
            method: "POST",
            data: n,
            success: function(n) {
                var e = n.data;
                "ok" !== e.result ? (e.msg = r[e.result] || e.msg, i(e)) : t();
            },
            fail: function(n) {
                i();
            }
        });
    });
}, r = {
    QRCodeExpired: "二维码已过期，请重新扫码"
};

module.exports = {
    directLogin: function(n) {
        return new Promise(function(i, e) {
            t({
                url: "/wxMiniProgram/v1/login",
                data: n,
                success: function(n) {
                    i(n);
                }
            });
        });
    },
    checkLogin: function(n) {
        return new Promise(function(t, e) {
            i({
                url: "/p/auth/check",
                header: {
                    Cookie: "wps_sid=" + n
                },
                method: "POST",
                success: function(n) {
                    var i = !1;
                    t("ok" === n.data.result ? i = !0 : i);
                },
                fail: function(n) {
                    t(!1);
                }
            });
        });
    },
    register: function(n) {
        return new Promise(function(i, e) {
            t({
                url: "/wxMiniProgram/v1/register",
                data: n,
                success: function(n) {
                    i(n);
                }
            });
        });
    },
    scanQrcodeLogin: function(n) {
        return new Promise(function(t, i) {
            e({
                url: "/api/v3/login_qrcode/onscan",
                method: "POST",
                data: n,
                success: function(e) {
                    var u = e.data;
                    "ok" !== u.result ? (u.msg = r[u.result] || u.msg, i(u)) : o(n).then(function() {
                        t();
                    }).catch(function(n) {
                        i(n);
                    });
                },
                fail: function(n) {
                    i();
                }
            });
        });
    },
    verify: function(n) {
        return new Promise(function(i, e) {
            t({
                url: "/wxMiniProgram/v1/verify",
                method: "GET",
                data: {
                    code: n,
                    devicename: ""
                },
                success: function(n) {
                    var t = n.data;
                    "ok" === t.result ? i(t) : e(n);
                },
                fail: function(n) {
                    e(n);
                }
            });
        });
    },
    bindWeChatPhone: function(n, i, e) {
        return new Promise(function(o, r) {
            t({
                url: "/wxMiniProgram/v1/bindphone",
                data: {
                    code: n,
                    iv: i,
                    encryptedData: e
                },
                method: "GET",
                success: function(n) {
                    var t = n.data;
                    "ok" === t.result ? o(t) : r(t);
                },
                fail: function(n) {
                    r(n);
                }
            });
        });
    },
    bindStatus: function() {
        return new Promise(function(n, t) {
            i({
                url: "/p/bind/status",
                method: "GET",
                success: function(i) {
                    var e = i.data;
                    "ok" === e.result ? n(e) : t(e);
                },
                fail: function(n) {
                    t(n);
                }
            });
        });
    },
    loginTwiceVerify: function() {
        return new Promise(function(n, t) {
            i({
                url: "/p/signin/login_twice_verify/status",
                method: "GET",
                success: function(i) {
                    var e = i.data;
                    "ok" === e.result ? n(e) : t(e);
                },
                fail: function(n) {
                    t(n);
                }
            });
        });
    }
};