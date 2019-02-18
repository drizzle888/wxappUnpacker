var t = require("../../action/link/index.js"), e = (t.getLink, t.updateMemberPermission), i = t.deleteMember, a = require("../../action/invite-edit/index.js"), n = a.createOrGetEditLink, s = a.updateEditLink, o = a.closeEditLink, r = a.resetEditLink, d = require("../../utils/util.js"), c = d.decode, h = d.toast, f = d.gotoPage, m = d.formatDate_MMdd, u = d.formatDate_HHmm, p = d.getEditInvitationInfo, l = require("../../utils/thumbnailUtil.js"), v = l.setShareThumbnail, g = l.setUserCode, _ = l.statFail, w = getApp(), x = "more_edit_send_click";

Page({
    data: {
        fname: "",
        ftype: "",
        loaded: !1,
        members: [],
        permissionDenied: !1,
        inviteOpen: !0,
        inviteLoaded: !1,
        inviteExpireTxt: ""
    },
    $data: {
        sid: "",
        chkcode: "",
        leid: "",
        firstShow: !0,
        gotoOther: !1
    },
    onLoad: function(t) {
        t.groupid, t.fid, t.fname, t.ftype;
        this.$data.firstShow = !0, this.reload(), this.isFromWebOffice() && w.stat("preview_edit_visit"), 
        w.stat("share_edit_visit");
    },
    onShow: function() {
        this.$data.firstShow || w.isLogined() || w.isAuthorized() || getCurrentPages().length > 1 && wx.navigateBack({
            delta: 1
        }), this.$data.firstShow && (this.$data.firstShow = !1), this.$data.gotoOther && (this.$data.gotoOther = !1, 
        this.reload());
    },
    reload: function() {
        w.callAfterLogin(this.init.bind(this));
    },
    init: function() {
        var t = this;
        wx.showNavigationBarLoading();
        var e = this.options, i = e.groupid, a = e.fid;
        n(i, a).then(function(e) {
            wx.hideNavigationBarLoading();
            var i = e.link, a = i.link_members, n = i.link;
            t.$data.sid = n.sid, t.$data.chkcode = n.chkcode;
            var s = t.formatMembers(a), o = e.expired_at, r = e.status, d = e.leid;
            t.$data.leid = d;
            var c = "open" === r && o > new Date() / 1e3, h = t.formatExpireTime(o);
            t.updateView(!1, s, c, h), t.setThumbnail(e);
        }).catch(function() {
            return t.error();
        });
    },
    error: function() {
        wx.hideNavigationBarLoading(), wx.hideShareMenu(), this.$data.sid = "", this.$data.chkcode = "", 
        this.$data.leid = "", this.updateView(!0);
    },
    setThumbnail: function(t) {
        var e = t.link, i = e.link, a = e.fname, n = e.fsha, s = i.sid, o = i.chkcode;
        v(!o || !o.length, this.$data, n, {
            fname: a,
            sid: s
        }), g(s, this.$data);
    },
    updateView: function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [], i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "", n = this.options, s = n.fname, o = n.ftype;
        this.setData({
            fname: c(s),
            ftype: o,
            members: e,
            permissionDenied: t,
            inviteOpen: i,
            inviteExpireTxt: a,
            loaded: !0,
            inviteLoaded: !0
        });
    },
    formatExpireTime: function(t) {
        return "邀请链接" + this.formatRemainTime(t) + " 失效";
    },
    formatDateTime: function(t) {
        var e = "", i = t - Math.round(new Date() / 1e3);
        return i > 0 && (e = parseInt(i / 86400) > 0 ? m(t) : u(t)), e;
    },
    formatRemainTime: function(t) {
        var e = "", i = t - Math.round(new Date() / 1e3);
        if (i > 0) {
            var a = Math.round(i / 86400), n = parseInt(i % 86400 / 3600);
            if (a > 0) e = " " + a + " 天后"; else if (n > 0) e = " " + n + " 小时后"; else {
                var s = parseInt(i % 86400 % 3600 / 60);
                0 == s && (s = 1), e = " " + s + " 分钟后";
            }
        }
        return e;
    },
    formatMembers: function(t) {
        if (!t) return [];
        for (var e = {
            read: "可查看",
            write: "可编辑"
        }, i = [], a = 0, n = t.length; a < n; ++a) {
            var s = t[a];
            "owner" != s.permission && i.push({
                id: s.id,
                avatar: s.avatar,
                name: s.name,
                permission: e[s.permission]
            });
        }
        return i;
    },
    tapPermission: function(t) {
        w.stat(x, "permission");
        var e = t.currentTarget.dataset.memberid, i = this, a = [ "可编辑", "可查看", "移出共享" ];
        wx.showActionSheet({
            itemList: a,
            success: function(t) {
                var n = a[t.tapIndex];
                "可查看" === n || "可编辑" === n ? i.setPermission(n, e) : "移出共享" === n && i.deleteMember(e);
            }
        });
    },
    setPermission: function(t, i) {
        var a = this, n = {
            "可查看": "read",
            "可编辑": "write"
        }[t], s = "read" === n ? "read" : "edit";
        w.stat("more_edit_send_permission_click", {
            type: s
        }), e(this.$data.sid, i, n).then(function(e) {
            h("设置成功");
            for (var n = a.data.members, s = 0, o = n.length; s < o; ++s) {
                var r = n[s];
                if (r.id == i) {
                    r.permission = t;
                    break;
                }
            }
            a.setData({
                members: n
            });
        }).catch(function(t) {
            h(t.msg);
        });
    },
    deleteMember: function(t) {
        var e = this;
        wx.showModal({
            title: "移出共享",
            content: "移出后，该成员将无法参与文档协作",
            showCancel: !0,
            cancelText: "取消",
            confirmText: "移出",
            confirmColor: "#e64340",
            success: function(a) {
                a.confirm && (w.stat("more_edit_send_permission_click", {
                    type: "remove"
                }), i(e.$data.sid, t).then(function(i) {
                    for (var a = e.data.members, n = 0, s = a.length; n < s; ++n) if (a[n].id == t) {
                        a.splice(n, 1);
                        break;
                    }
                    e.setData({
                        members: a
                    });
                }).catch(function(t) {
                    h(t.msg);
                }));
            }
        });
    },
    tapOpenInvite: function() {
        var t = this, e = this.options.fid;
        r(e).then(function(e) {
            t.reload();
        }).catch(function(t) {
            h(t.msg || "未知错误");
        });
    },
    tapSend: function() {
        w.stat(x, "send");
    },
    tapOthers: function() {
        w.stat(x, "other");
        var t = this.data.members.map(function(t) {
            return t.id;
        });
        this.$data.gotoOther = !0, f("shareEditOther", {
            fname: this.options.fname,
            sid: this.$data.sid,
            chkcode: this.$data.chkcode,
            leid: this.$data.leid,
            selectedIdList: t.join(","),
            groupid: this.options.groupid
        });
    },
    tapSetting: function() {
        w.stat(x, "set");
        var t = this, e = [ "重置为 7 天", "关闭编辑邀请" ];
        wx.showActionSheet({
            itemList: e,
            success: function(i) {
                var a = e[i.tapIndex];
                "重置为 7 天" === a ? t.postpone7Days() : "关闭编辑邀请" === a && t.closeEditInvite();
            }
        });
    },
    postpone7Days: function() {
        var t = this;
        w.stat("more_edit_send_set_click", {
            type: "duration"
        });
        var e = this.options, i = e.groupid, a = e.fid;
        s(i, a, 604800).then(function(e) {
            var i = e.expired_at, a = t.formatExpireTime(i);
            t.setData({
                inviteExpireTxt: a,
                inviteOpen: !0
            });
        }).catch(function(t) {
            h(t.msg || "网络异常");
        });
    },
    closeEditInvite: function() {
        var t = this, e = this.options, i = e.groupid, a = e.fid;
        wx.showModal({
            title: "关闭编辑邀请",
            content: "关闭后，其他人将无法通过链接加入文档协作",
            showCancel: !0,
            cancelText: "取消",
            confirmText: "立即关闭",
            confirmColor: "#e64340",
            success: function(e) {
                e.confirm && (w.stat("more_edit_send_set_click", {
                    type: "stop"
                }), o(i, a).then(function(e) {
                    t.setData({
                        inviteOpen: !1
                    });
                }).catch(function(t) {
                    h(t.msg || "网络异常");
                }));
            }
        });
    },
    isFromWebOffice: function() {
        return "weboffice" === this.options.from;
    },
    onShareAppMessage: function() {
        this.$data.leid || (console.error("leid is null"), w.stat("more_edit_send_fail")), 
        w.stat("more_edit_send_success");
        var t = this.options, e = t.fname, i = t.ftype, a = p(this.$data.leid, e, i, this.$data.thumbnailUrl, this.$data.userCode);
        return _(this.$data, "shareEdit", e), a;
    }
});