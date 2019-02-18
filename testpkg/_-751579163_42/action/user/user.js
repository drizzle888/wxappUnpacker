function t(t) {
    try {
        wx.setStorageSync(c, t);
    } catch (t) {}
}

function e(t) {
    try {
        wx.setStorageSync("accountUser", t);
        var e = !!t.is_plus, n = wx.getStorageSync("userInfo");
        n && n.is_plus != e && (n.is_plus = e, wx.setStorageSync("userInfo", n));
    } catch (t) {}
}

function n(t) {
    try {
        wx.setStorageSync("userMember", t);
    } catch (t) {}
}

var u = require("../../utils/request.js"), s = u.drive, r = u.account, c = "userInfo";

module.exports = {
    driveUser: function() {
        return new Promise(function(e, n) {
            s({
                method: "GET",
                url: "/api/v3/userinfo",
                success: function(u) {
                    var s = u.data;
                    200 === u.statusCode ? (t(s), e(s)) : n(s);
                },
                fail: function(t) {
                    n(t);
                }
            });
        });
    },
    accountUser: function() {
        return new Promise(function(t, n) {
            r({
                method: "POST",
                url: "/p/auth/check",
                success: function(u) {
                    var s = u.data;
                    200 === u.statusCode ? (e(s), t(s)) : n(s);
                },
                fail: function(t) {
                    n(t);
                }
            });
        });
    },
    userMember: function(t) {
        return new Promise(function(e, u) {
            r({
                method: "GET",
                url: "/api/users/" + t,
                success: function(t) {
                    var s = t.data;
                    200 === t.statusCode ? (n(s), e(s)) : u(s);
                },
                fail: function(t) {
                    u(t);
                }
            });
        });
    }
};