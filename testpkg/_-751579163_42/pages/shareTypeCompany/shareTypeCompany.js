var t = getApp(), e = require("../../utils/api.js"), a = require("../../utils/util.js"), i = a.toast, s = a.getShareInfo, n = a.isCompanyAccount, d = a.decode, o = a.getExtName, c = require("../../action/link/index.js"), h = c.getLink, l = c.open, r = c.updateLink, u = c.closeLink, f = require("../../action/recent/index.js").fetchRecents, p = require("../../utils/thumbnailUtil.js"), m = p.setShareThumbnail, k = p.setUserCode, g = p.statFail, w = require("../../store/store.js"), y = w.StoreType, v = {
    onlyMe: "仅自己可见",
    onlyTeam: "仅共享成员可见"
}, C = {
    person: "获得文档的用户",
    company: "本企业成员"
}, $ = {
    read: "r",
    edit: "w",
    close: "c"
}, _ = {
    normal: 0,
    checked: 1,
    loading: 2
}, T = "more_share_set_click";

Page({
    data: {
        fname: "",
        ftype: "",
        checkedRead: 0,
        checkedEdit: 0,
        checkedClose: 0,
        closeText: "",
        account: "",
        disabled: !1,
        showRead: !0,
        showEdit: !0,
        showClose: !0,
        onlyMe: !1,
        loaded: !1,
        permissionDenied: !1
    },
    $data: {
        isTeamFile: !1,
        isCompanyAccount: !1,
        isShareFile: !1,
        sid: "",
        status: "open",
        isExpired: !1,
        jumpToAuthPage: !1
    },
    onLoad: function(e) {
        this.isFromWebOffice() && t.stat("preview_share_visit"), wx.hideShareMenu(), wx.showNavigationBarLoading();
        var a = this.options, i = a.fname, s = a.ftype, n = void 0 === s ? "" : s;
        this.setData({
            fname: d(i),
            ftype: n
        });
        var o = this;
        this.init({
            success: this.getLinkInfo,
            fail: function(e) {
                "userNotLogin" === e.result ? (o.$data.jumpToAuthPage = !0, t.callAfterLogin(o.init.bind(o, this))) : wx.hideNavigationBarLoading();
            }
        });
    },
    isFromWebOffice: function() {
        return "weboffice" === this.options.from;
    },
    onShow: function() {
        this.$data.jumpToAuthPage && !t.isAuthorized() && getCurrentPages().length > 1 && wx.navigateBack({
            delta: 1
        });
    },
    init: function(e) {
        var a = this, i = this.options, s = i.fid, o = i.fsrc, c = i.groupid, h = i.from_, l = void 0 === h ? "" : h;
        if (o && (o = d(o)), !o && "filelist" !== l && !n(t.globalData.user)) return this.options.fsrc = "未知来源", 
        void f({
            count: 5
        }).then(function(t) {
            for (var i = t.recents, n = 0, d = i.length; n < d; ++n) {
                var o = i[n];
                if (o.id == s) {
                    a.options.fsrc = o.fsrc;
                    break;
                }
            }
            a.init(e);
        }).catch(function() {
            a.init(e);
        });
        this.$data.isCompanyAccount = n(t.globalData.user), this.$data.isShareFile = "与我共享" === o;
        var r = w.getCacheData(y.allTeam).mine, u = w.getCacheData(y.allTeam).auto;
        if (r.id && u.id) this.$data.isTeamFile = r.id != c && u.id != c, e.success(); else {
            var p = this;
            w.getData(y.allTeam, {}, !0).then(function(t) {
                p.$data.isTeamFile = t.mine.id != c && t.auto.id != c, e.success();
            }).catch(function(t) {
                e.fail(t);
            });
        }
    },
    getLinkStatusOrOpen: function() {
        var t = this.options, e = t.fid, a = t.sid;
        return new Promise(function(t, i) {
            h(a || e).then(function(e) {
                t({
                    link: e.link,
                    link_url: e.link_url,
                    fsha: e.fsha
                });
            }).catch(function(a) {
                "permissionDenied" === a.result ? i(a) : l(e).then(function(e) {
                    t({
                        link: e.link,
                        link_url: e.link_url,
                        fsha: e.fsha
                    });
                }).catch(function(t) {
                    i(t);
                });
            });
        });
    },
    getLinkInfo: function() {
        var t = this;
        this.getLinkStatusOrOpen().then(function(e) {
            var a = e.link, i = e.link_url, s = e.fsha;
            wx.hideNavigationBarLoading();
            var n = "";
            n = "group" === a.ranges || "expired" === a.status || "anyone" === a.ranges && t.$data.isCompanyAccount ? $.close : "close" === a.status ? $.close : "read" === a.permission || "download" === a.permission ? $.read : $.edit, 
            t.$data.sid = a.sid, t.$data.link_url = i, t.fill$data(a), t.setThumbnail(a, s), 
            t.data.loaded = !0, t.data.permissionDenied = !1, t.data.disabled = !1, t.checkedOpt(n);
        }).catch(function() {
            wx.hideNavigationBarLoading(), t.$data.sid = "", t.data.loaded = !0, t.data.permissionDenied = !0, 
            t.data.disabled = !0, t.updateView();
        });
    },
    setThumbnail: function(t, e) {
        if (t) {
            var a = t.sid, i = t.chkcode, s = this.options.fname;
            m(!i || !i.length, this.$data, e, {
                fname: s,
                sid: a
            }), k(a, this.$data);
        }
    },
    clickSameOpt: function(t) {
        return this.data.checkedRead == _.loading || this.data.checkedEdit == _.loading || this.data.checkedClose == _.loading || (this.data.checkedRead != _.normal && t === $.read || this.data.checkedEdit != _.normal && t === $.edit || this.data.checkedClose != _.normal && t === $.close);
    },
    checkedOpt: function(t) {
        switch (this.data.checkedRead = this.data.checkedEdit = this.data.checkedClose = _.normal, 
        t) {
          case $.read:
            this.data.checkedRead = _.checked;
            break;

          case $.edit:
            this.data.checkedEdit = _.checked;
            break;

          case $.close:
          default:
            this.data.checkedClose = _.checked;
        }
        this.updateView();
    },
    updateView: function() {
        var t = void 0;
        (t = this.$data.isCompanyAccount ? v.onlyTeam : this.$data.isTeamFile ? v.onlyTeam : v.onlyMe) === v.onlyMe && this.data.checkedClose ? this.data.onlyMe = !0 : this.data.onlyMe = !1, 
        this.$data.isShareFile ? (this.data.showRead = this.data.checkedRead == _.checked, 
        this.data.showEdit = this.data.checkedEdit == _.checked, this.data.showClose = this.data.checkedClose == _.checked) : this.data.showRead = this.data.showEdit = this.data.showClose = !0;
        var e = o(this.data.fname).toLowerCase();
        "pom" !== e && "pof" !== e || (this.data.showEdit = !1), this.setData({
            fname: this.data.fname,
            ftype: this.data.ftype,
            checkedRead: this.data.checkedRead,
            checkedEdit: this.data.checkedEdit,
            checkedClose: this.data.checkedClose,
            closeText: t,
            account: this.$data.isCompanyAccount ? C.company : C.person,
            disabled: this.data.disabled,
            showRead: this.data.showRead,
            showEdit: this.data.showEdit,
            showClose: this.data.showClose,
            onlyMe: this.data.onlyMe,
            loaded: this.data.loaded,
            permissionDenied: this.data.permissionDenied
        });
    },
    fill$data: function(t) {
        this.$data.status = t.status;
        var e = new Date().getTime() / 1e3;
        this.$data.isExpired = t.expire_period > 0 && t.expire_time > 0 && t.expire_time <= e;
    },
    postSetting: function(t) {
        var e = this, a = this.$data, i = a.sid, s = this.options.fid;
        return new Promise(function(n, d) {
            if (t === $.read || t === $.edit) {
                var o = t === $.read ? "read" : "write", c = a.isCompanyAccount ? "company" : "anyone";
                a.isExpired || "open" !== a.status ? l(s).then(function(t) {
                    r(i, o, c).then(function(t) {
                        e.fill$data(t.link), n(t);
                    }).catch(function(t) {
                        d(t);
                    }), e.setThumbnail(t.link, t.fsha);
                }).catch(function(t) {
                    d(t);
                }) : r(i, o, c).then(function(t) {
                    e.fill$data(t.link), n(t);
                }).catch(function(t) {
                    d(t);
                });
            } else t === $.close && u(s).then(function(t) {
                a.status = "close", n(t);
            }).catch(function(t) {
                d(t);
            });
        });
    },
    tapRead: function() {
        var e = this;
        t.stat(T, {
            type: "read"
        }), this.clickSameOpt($.read) || (this.setData({
            checkedRead: _.loading
        }), this.postSetting($.read).then(function(t) {
            e.checkedOpt($.read), i("设置成功");
        }).catch(function(t) {
            var a = t.msg || t.faillist && t.faillist[0].msg || "连接失败";
            i(a), e.setData({
                checkedRead: _.normal
            });
        }));
    },
    tapEdit: function() {
        var e = this;
        t.stat(T, {
            type: "edit"
        }), this.clickSameOpt($.edit) || (this.setData({
            checkedEdit: _.loading
        }), this.postSetting($.edit).then(function(t) {
            e.checkedOpt($.edit), i("设置成功");
        }).catch(function(t) {
            var a = t.msg || t.faillist && t.faillist[0].msg || "连接失败";
            i(a), e.setData({
                checkedEdit: _.normal
            });
        }));
    },
    tapClose: function() {
        var e = this, a = !this.$data.isCompanyAccount && !this.$data.isTeamFile ? "write" : "write_team";
        t.stat(T, {
            type: a
        }), this.clickSameOpt($.close) || (this.setData({
            checkedClose: _.loading
        }), this.postSetting($.close).then(function(t) {
            e.checkedOpt($.close), i("设置成功");
        }).catch(function(t) {
            var a = t.msg || t.faillist && t.faillist[0].msg || "连接失败";
            i(a), e.setData({
                checkedClose: _.normal
            });
        }));
    },
    tapSend: function() {
        t.stat(T, {
            type: "send"
        }), t.stat("more_share_set_send_click");
    },
    tapConfirm: function() {
        t.stat(T, {
            type: "confirm"
        }), wx.navigateBack({
            delta: 1
        });
    },
    tapCopy: function() {
        t.stat(T, {
            type: "copylink"
        }), t.stat("share_all");
        var e = "";
        this.$data.link_url ? e = this.$data.link_url : this.$data.sid && (e = "https://pan.wps.cn/l/" + this.$data.sid), 
        e ? wx.setClipboardData({
            data: e,
            success: function(t) {},
            fail: function() {
                i("复制失败");
            }
        }) : i("复制失败");
    },
    getSendFailOption: function() {
        return this.data.checkedRead ? "read" : this.data.checkedEdit ? "edit" : "write_team";
    },
    onShareAppMessage: function() {
        t.stat("share_all");
        var a = this.options, i = a.fname, n = a.ftype, d = s({
            sid: this.$data.sid,
            fname: i,
            ftype: n
        }, this.$data.thumbnailUrl, this.$data.userCode);
        g(this.$data, "shareTypeCompany", i);
        var o = this.getSendFailOption();
        return this.$data.sid ? (d.success = function() {
            t.stat("more_share_set_success");
        }, d.fail = function() {
            t.stat("more_share_set_fail", {
                type: o
            });
        }) : (t.stat("more_share_set_fail", {
            type: o
        }), e.showModal({
            showCancel: !1,
            content: "创建分享失败，请返回上一页重启分享"
        })), d;
    }
});