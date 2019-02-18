var i = require("../../utils/util.js"), t = i.gotoPage, r = i.isCompanyAccount, e = require("../../action/invite-edit/index.js").visitEditLink, a = getApp();

Page({
    data: {
        initing: !0,
        netError: "",
        serviceError: "",
        serviceErrorMsg: "",
        linkClosed: !1
    },
    onLoad: function(i) {
        var t = i.leid, r = i.fname;
        i.sharer;
        if (t && r) a.globalData.editRedirectPage.options = {
            leid: t,
            fname: r
        }; else {
            var e = a.globalData.editRedirectPage.options;
            this.options = e, a.globalData.editRedirectPage.options = null;
        }
        a.callAfterLogin(this.init.bind(this)), a.stat("more_edit_visit", {
            from: this.options.app || "miniapp"
        });
    },
    init: function() {
        var i = this;
        if (this.showLoading(), r(a.globalData.user)) return this.hideLoading(), void this.setData({
            netError: "",
            serviceError: "无法加入文件协作",
            serviceErrorMsg: "企业用户暂不支持链接邀请"
        });
        var n = this.options, o = n.leid, s = n.fname, d = n.sharer;
        e(o).then(function(r) {
            i.hideLoading();
            var e = r.sid;
            t("preview", {
                sid: e,
                fname: s,
                referer: "shareEdit",
                sharer: d,
                app: i.options.app
            }, !0);
        }).catch(function(t) {
            i.hideLoading();
            var r = t.result;
            "InviteEditLinkNotAvailable" === r || "InviteEditLinkNotFound" === r ? i.setData({
                netError: "",
                serviceError: "邀请链接已过期",
                serviceErrorMsg: "请联系对方重新发送邀请"
            }) : "LightLinkNotExists" === r ? i.setData({
                netError: "",
                serviceError: "",
                serviceErrorMsg: "",
                linkClosed: !0
            }) : "userNotLogin" === r || "InvalidWpssid" === r ? (a.clearWpssid(), a.callAfterLogin(i.init.bind(i))) : i.setData({
                netError: "服务异常，请稍后重试",
                serviceError: "",
                serviceErrorMsg: ""
            });
        });
    },
    showLoading: function() {
        this.setData({
            initing: !0
        }), wx.showNavigationBarLoading();
    },
    hideLoading: function() {
        this.setData({
            initing: !1
        }), wx.hideNavigationBarLoading();
    },
    tapBackMain: function() {
        t("tabBars/recent");
    },
    tapRetry: function() {
        this.init();
    }
});