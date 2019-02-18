var a = require("../../action/link/index.js"), t = a.allowEdit, i = a.getLinkApplyInfo, e = require("../../utils/util.js"), o = e.gotoPage, n = e.toast, l = e.noExtName, r = getApp();

Page({
    data: {
        avatarUrl: "",
        name: "",
        fileName: "",
        noAllowed: !0,
        error: "",
        loaded: !1
    },
    onLoad: function(a) {
        a.aid;
        r.callAfterLogin(this.init.bind(this)), r.stat("apply_visit");
    },
    init: function() {
        var a = this, t = this.options.aid;
        wx.showNavigationBarLoading(), i(t).then(function(t) {
            wx.hideNavigationBarLoading();
            var i = t.fname, e = t.status, o = t.avatar, n = t.nickname, r = "applying" === e;
            a.setData({
                avatarUrl: o,
                name: n,
                fileName: l(i),
                noAllowed: r,
                error: "",
                loaded: !0
            });
        }).catch(function(t) {
            wx.hideNavigationBarLoading(), "userNotLogin" === t.result || "InvalidWpssid" === t.result ? (r.clearWpssid(), 
            r.callAfterLogin(a.init.bind(a))) : "invalidUser" === t.result ? (a.setData({
                error: "无操作权限",
                loaded: !0
            }), r.stat("apply_visit_fail")) : a.setData({
                error: "服务异常，请稍后重试",
                loaded: !0
            });
        });
    },
    tapAollow: function() {
        var a = this;
        r.stat("apply_allow_click");
        var i = this.options.aid;
        t(i).then(function(t) {
            var i = t.status;
            a.setData({
                noAllowed: "applying" === i,
                loaded: !0
            }), r.stat("apply_allow_success");
        }).catch(function(t) {
            "WechatOAuthNotExists" === t.result || "alreadyApproved" === t.result ? a.setData({
                noAllowed: !1,
                loaded: !0
            }) : (n(t.msg || "请求失败"), r.stat("apply_allow_fail", {
                errorCode: t.result
            }));
        });
    },
    tapReturn: function() {
        o("tabBars/recent", {}, !0);
    },
    tapRetry: function() {
        this.init();
    }
});