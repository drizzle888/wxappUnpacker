var e = getApp(), t = require("../../store/store.js"), i = t.StoreType, a = require("../../action/redirect/index.js"), s = require("../../action/link/index.js"), n = s.authAndLink, r = s.getLinkOrOpenCloseLink, o = s.open, h = require("../../config/index.js").wxmp2DriveQs, c = require("../../action/files/index.js").fileMetadata, f = require("../../action/weboffice/index.js").uploadCliper, d = require("../../action/share-groups/index.js").createOrJoinShareGroup, l = require("../../utils/thumbnailUtil.js"), u = l.setShareThumbnail, p = l.setUserCode, g = l.statFail, k = require("../../utils/util.js"), v = k.isDoc, w = k.isXls, m = k.isPpt, b = k.isPdf, $ = k.toast, L = require("../../action/user/user.js").accountUser, U = require("../../utils/util.js"), P = U.noExtName, T = U.decode, x = U.gotoPage, D = U.getExtName, S = U.getShareInfo, _ = U.showLoading, y = U.hideLoading, C = (U.isThirdPreview, 
U.getWebOfficeType), j = U.isCompanyAccount, E = require("../../utils/api.js"), O = /\d+/, q = function() {
    return e.isLogined();
}, F = function(t) {
    var i = t.id;
    return (e.globalData.user && e.globalData.user.id) === i;
}, W = function(e) {
    return ~[ "notGroupMember", "notCompanyMember" ].indexOf(e);
};

Page({
    data: {
        webViewUrl: ""
    },
    onLoad: function(t) {
        t.fid, t.sid, t.fname, t.chkcode, t.groupid, t.sharer, t.app__;
        e.mass.add(this), this.$data = Object.create(null), this.$data.backToSharePage = !1, 
        this.$data.referer = this.options.referer || "", this.$data.thumbnailUrl = "", this.init(!1), 
        "share" === this.$data.referer && q() && e.stat("preview_share_login");
    },
    checkShareGroup: function() {
        "share" !== this.$data.referer && "shareEdit" !== this.$data.referer || q() && !j(e.globalData.user) && d(this.options.sid, this.options.sharer).then(function(e) {}).catch(function(e) {});
    },
    onUnload: function() {
        e.mass.del(this), this.$data.isOnUnload = !0;
        var t = getCurrentPages();
        t.length > 1 && "pages/share/share" === t[t.length - 2].route && e.stat("share_back_visit");
    },
    onShow: function() {
        this.$data.backToSharePage && (this.$data.backToSharePage = !1, getCurrentPages().length > 1 && wx.navigateBack({
            delta: 1
        })), this.handlerCliper(), this.checkNetWorkState();
    },
    onReady: function() {
        this.setTitle();
    },
    handlerCliper: function() {
        var e = this;
        q() && wx.getClipboardData({
            success: function(t) {
                t.data && e.$data.cliperData !== t.data && (e.$data.cliperData = t.data, f(t.data).then(function(e) {}));
            }
        });
    },
    init: function(e) {
        _();
        var t = this.options.fname, i = t ? T(t) : t;
        this.$data.fname = i, this.checkLink(), this.checkShareGroup(), e && this.getUserInfo();
    },
    getUserInfo: function() {
        L().then(function(t) {
            e.initAccountUser();
        });
    },
    getPreviewType: function() {
        var e = this.options.fid;
        return O.test(e) ? "p" : "l";
    },
    openPLink: function(e) {
        var a = this;
        c(e).then(function(s) {
            a.openLink(e, !0), a.options.needUpdateRecent && t.setDirty(i.recent);
        }).catch(function() {
            a.openLink(e, !1);
        });
    },
    checkLink: function() {
        var e = this.options, t = e.fid, i = e.sid, a = e.chkcode;
        "p" === this.getPreviewType() ? (this.setLoginUrl(t, "p"), this.openPLink(t)) : (this.setLoginUrl(i, "l"), 
        n(i, a).then(this.linkOk).catch(this.linkError));
    },
    openLink: function(e, a) {
        var s = this;
        r(e).then(function(e) {
            var n = e.link, r = n.sid, o = n.chkcode;
            s.options.sid = r, s.$data.getLink = "success";
            var h = e.fname;
            u(!o || !o.length, s.$data, e.fsha, {
                fname: h,
                sid: r
            }), p(r, s.$data), !a && s.options.needUpdateRecent && t.setDirty(i.recent), wx.showShareMenu();
        }).catch(function(e) {
            a || s.linkError(e), s.$data.getLink = "fail", u(!1, s.$data), wx.hideShareMenu();
        });
    },
    isLinkClose: function(e) {
        var t = new Date().getTime() / 1e3;
        return "close" === e.status || e.expire_period > 0 && e.expire_time > 0 && e.expire_time <= t;
    },
    setSharePageOkData: function(e) {
        var t = e.link, i = e.id, a = e.fsize, s = e.fname, n = this.isLinkClose(t), r = F(t.creator);
        this.setSharePageData({
            id: i,
            fsize: a,
            fname: s,
            close: n,
            creator: r
        }, e);
    },
    linkOk: function(e) {
        this.$data.file = e, this.setSharePageOkData(e);
        var a = e.link, s = a.chkcode, n = a.sid, r = e.user_permission, o = e.id, h = e.fname;
        u(!s || !s.length, this.$data, e.fsha, {
            fname: h,
            sid: n
        }), p(n, this.$data), this.setTitle(), this.checkFileEdit({
            sid: n,
            fid: o,
            user_permission: r
        }), this.options.needUpdateRecent && t.setDirty(i.recent);
    },
    linkError: function(e) {
        this.setTitle(), u(!1, this.$data);
        var t = e.code, i = (e.msg, e.result);
        if (t || (t = i), "p" !== this.getPreviewType()) {
            var a = this.$data.fname;
            this.setSharePageData({
                code: t,
                fname: a
            });
        }
        W(t) && !q() && this.askForLogin();
    },
    setSharePageData: function(t) {
        var i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "", a = e.mass.get("pages/share/share");
        a && "function" == typeof a.setLinkInfo && a.setLinkInfo(t, i);
    },
    choosePreviewUrl: function(t, i) {
        var a = void 0, s = D(this.$data.fname), n = C(s);
        if (n && !e.globalData.useMdrivePreview) {
            var r = e.getRandomId() % 2 == 0 ? "a" : "b";
            a = "p" === i ? "https://web.wps.cn/office/" + n + "/" + this.options.groupid + "-" + t + "?from=" + h + "&product=drive&login=" + r : "https://web.wps.cn/office/" + n + "/" + t + "?from=" + h + "&product=drive&login=" + r;
            var o = {
                w: "doc",
                s: "xls",
                p: "ppt"
            }[n];
            if (o) {
                var c = "share" === this.$data.referer ? "share" : "private", f = "share" === this.$data.referer ? "weboffice_visit_share" : "weboffice_visit_private";
                e.stat("weboffice_visit", {
                    from: c,
                    type: o
                }), e.stat(f);
            }
        } else {
            var d = this.options.chkcode;
            a = "https://drive.wps.cn/view/" + i + "/" + t + (d ? "/" + d : "") + "?from=" + h + "&product=drive";
        }
        return a;
    },
    setLoginUrl: function(t, i) {
        var s = this, n = this.choosePreviewUrl(t, i);
        this.$data.linkUrl = n, q() && !e.globalData.hasRedirectedLoginUrl ? a(n, !0).then(function(t) {
            e.globalData.hasRedirectedLoginUrl = !0, s.setWebViewUrl(t);
        }).catch(function() {
            return s.setWebViewUrl(n);
        }) : this.setWebViewUrl(n);
    },
    setWebViewUrl: function(e) {
        this.setData({
            code: "",
            webViewUrl: e
        }, function() {
            y();
        });
        try {
            wx.reportAnalytics("preview_file_types", {
                extname: D(this.$data.fname)
            });
        } catch (e) {}
    },
    askForLoginFromWebOffice: function() {
        e.clearWpssid(), this.$data.backToSharePage = !1, this.$data.goToFileEdit = !0, 
        e.callAfterLogin(this.init.bind(this, !0));
    },
    askForLogin: function() {
        e.clearWpssid(), this.$data.backToSharePage = !0, e.callAfterLogin(this.init.bind(this, !0));
    },
    checkFileEdit: function(e) {
        var t = e.sid, i = e.fid;
        "read" === e.user_permission && q() && this.$data.goToFileEdit && (this.$data.goToFileEdit = !1, 
        x("fileEdit", {
            fid: i,
            sid: t
        }));
    },
    onShareAppMessage: function() {
        e.stat("preview_official_share"), e.stat("share_all");
        var t = this.options.fid, i = S(this.options, this.$data.thumbnailUrl, this.$data.userCode);
        return g(this.$data, "preview", this.options.fname), "p" === this.getPreviewType() && ("success" === this.$data.getLink ? o(t) : E.showModal({
            showCancel: !1,
            content: "创建分享失败，请返回上一页重启分享"
        })), i;
    },
    setTitle: function() {
        var e = this.options.ftype, t = T(this.options.fname);
        this.$data.isOnUnload || wx.setNavigationBarTitle({
            title: P(t || "", e)
        });
        var i = "#ffffff", a = "#000000";
        v(t) ? (i = "#2A60B0", a = "#ffffff") : w(t) ? (i = "#1D8754", a = "#ffffff") : m(t) ? (i = "#D95136", 
        a = "#ffffff") : b(t) && (i = "#E35F3F", a = "#ffffff"), wx.setNavigationBarColor({
            backgroundColor: i,
            frontColor: a
        });
    },
    checkNetWorkState: function() {
        wx.getNetworkType({
            success: function(e) {
                "none" === e.networkType && $("网络连接异常");
            }
        });
    }
});