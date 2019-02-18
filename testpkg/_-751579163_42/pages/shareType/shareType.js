var t = getApp(), a = require("../../utils/api.js"), i = require("../../utils/util.js"), e = i.toast, n = i.getShareInfo, s = i.decode, d = (i.getExtName, 
i.gotoPage), o = i.isCompanyAccount, r = require("../../action/link/index.js"), h = r.getLink, l = r.open, c = require("../../action/recent/index.js").fetchRecents, f = require("../../utils/thumbnailUtil.js"), p = f.setShareThumbnail, u = f.setUserCode, g = f.statFail;

require("../../store/store.js");

Page({
    data: {
        fname: "",
        ftype: "",
        loaded: !1,
        permissionDenied: !1,
        linkOpen: !0,
        canOpen: !1,
        canSet: !1
    },
    $data: {
        sid: "",
        firstShow: !0,
        getLinkErrResult: "",
        gotoSetting: !1,
        isShareFile: !1
    },
    onLoad: function(a) {
        var i = this, e = a.fid, n = (a.sid, a.fname, a.ftype, a.fsrc), s = a.from_, r = void 0 === s ? "" : s;
        o(t.globalData.user) ? d("shareTypeCompany", this.options, !0) : (this.isFromWebOffice() && t.stat("preview_share_visit"), 
        wx.hideShareMenu(), this.$data.firstShow = !0, n || "filelist" === r ? (this.$data.isShareFile = "与我共享" === n, 
        this.reload()) : c({
            count: 5
        }).then(function(t) {
            for (var a = t.recents, n = 0, s = a.length; n < s; ++n) {
                var d = a[n];
                if (d.id == e) {
                    i.$data.isShareFile = "与我共享" === d.fsrc;
                    break;
                }
            }
            i.reload();
        }).catch(function() {
            i.reload();
        }), t.stat("share_type_visit"));
    },
    isFromWebOffice: function() {
        return "weboffice" === this.options.from;
    },
    reload: function() {
        t.callAfterLogin(this.init.bind(this));
    },
    init: function() {
        var a = this, i = this.options, e = i.fname, n = i.ftype, d = void 0 === n ? "" : n;
        this.data.fname = s(e), this.data.ftype = d, t.getDriveUser().then(function() {
            a.getLinkInfo();
        });
    },
    onShow: function() {
        this.$data.firstShow || t.isLogined() || t.isAuthorized() || getCurrentPages().length > 1 && wx.navigateBack({
            delta: 1
        }), this.$data.firstShow && (this.$data.firstShow = !1), this.$data.gotoSetting && (this.$data.gotoSetting = !1, 
        this.reload());
    },
    getLinkStatusOrOpen: function() {
        var t = this.options, a = t.fid, i = t.sid, e = this;
        return new Promise(function(t, n) {
            h(i || a).then(function(a) {
                t(a);
            }).catch(function(i) {
                var s = i.result;
                e.$data.getLinkErrResult = s, "permissionDenied" === s ? n(i) : l(a).then(function(a) {
                    t(a);
                }).catch(function(t) {
                    n(t);
                });
            });
        });
    },
    getLinkInfo: function() {
        var a = this;
        wx.showNavigationBarLoading();
        var i = this;
        this.getLinkStatusOrOpen().then(function(e) {
            wx.hideNavigationBarLoading();
            var n = e.link, s = n.sid, d = n.chkcode;
            i.$data.sid = s, i.$data.link = n, i.$data.link_url = e.link_url;
            var o = e.fname;
            p(!d || !d.length, i.$data, e.fsha, {
                fname: o,
                sid: s
            }), u(s, i.$data), i.data.loaded = !0, i.data.permissionDenied = !1, i.data.canSet = !a.$data.isShareFile;
            n.creator.id, t.globalData.user.id;
            i.data.linkOpen = "open" === n.status, i.data.canOpen = !0, i.updateView();
        }).catch(function() {
            wx.hideNavigationBarLoading(), i.$data.sid = "", i.$data.link = null, p(!1, i.$data), 
            i.data.loaded = !0, i.data.permissionDenied = !0, i.data.canSet = !1, i.data.canOpen = !1;
            var t = a.$data.getLinkErrResult;
            "linkClosed" === t ? (i.data.linkOpen = !1, i.data.permissionDenied = !1) : i.data.linkOpen = !0, 
            i.updateView();
        });
    },
    updateView: function() {
        this.setData({
            fname: this.data.fname,
            ftype: this.data.ftype,
            loaded: this.data.loaded,
            permissionDenied: this.data.permissionDenied,
            linkOpen: this.data.linkOpen,
            canSet: this.data.canSet,
            canOpen: this.data.canOpen
        });
    },
    tapSetting: function() {
        t.stat("more_share_send_click", {
            type: "set"
        }), this.$data.gotoSetting = !0;
        var a = this.$data.link;
        d("shareTypeSetting", {
            fid: a.fileid,
            sid: this.$data.sid,
            latest: a.latest,
            expireTime: a.expire_time,
            expirePeriod: a.expire_period
        });
    },
    tapSend: function() {
        t.stat("more_share_send_click", {
            type: "send"
        });
    },
    tapCopy: function() {
        t.stat("more_share_send_click", {
            type: "copylink"
        }), t.stat("share_all");
        var a = "";
        if (this.$data.link_url ? a = this.$data.link_url : this.$data.sid && (a = "https://pan.wps.cn/l/" + this.$data.sid), 
        a) {
            var i = this.data.fname ? a + "\n[文件] " + this.data.fname : "" + a;
            wx.setClipboardData({
                data: i,
                success: function(t) {},
                fail: function() {
                    e("复制失败");
                }
            });
        } else e("复制失败");
    },
    tapOpenLink: function() {
        var t = this, a = this.options.fid;
        wx.showNavigationBarLoading(), l(a).then(function(a) {
            wx.hideNavigationBarLoading();
            var i = a.link, e = a.link_url, n = i.sid, s = i.chkcode;
            t.$data.sid = n, t.$data.link = i, t.$data.link_url = e;
            var d = a.fname;
            p(!s || !s.length, t.$data, a.fsha, {
                fname: d,
                sid: n
            }), u(n, t.$data), t.data.loaded = !0, t.data.permissionDenied = !1, t.data.linkOpen = !0, 
            t.data.canSet = !0, t.updateView();
        }).catch(function(a) {
            wx.hideNavigationBarLoading();
            var i = a.msg;
            e(i || "未知异常"), p(!1, t.$data);
        });
    },
    onShareAppMessage: function() {
        t.stat("share_all");
        var i = this.options, e = i.fname, s = i.ftype, d = n({
            sid: this.$data.sid,
            fname: e,
            ftype: s
        }, this.$data.thumbnailUrl, this.$data.userCode);
        return g(this.$data, "shareType", e), this.$data.sid ? t.stat("more_share_send_success") : (a.showModal({
            showCancel: !1,
            content: "创建分享失败，请返回上一页重启分享"
        }), t.stat("more_share_send_fail")), d;
    }
});