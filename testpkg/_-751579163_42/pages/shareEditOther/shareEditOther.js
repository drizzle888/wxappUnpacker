var t = function() {
    function t(t, a) {
        var e = [], i = !0, n = !1, o = void 0;
        try {
            for (var s, d = t[Symbol.iterator](); !(i = (s = d.next()).done) && (e.push(s.value), 
            !a || e.length !== a); i = !0) ;
        } catch (t) {
            n = !0, o = t;
        } finally {
            try {
                !i && d.return && d.return();
            } finally {
                if (n) throw o;
            }
        }
        return e;
    }
    return function(a, e) {
        if (Array.isArray(a)) return a;
        if (Symbol.iterator in Object(a)) return t(a, e);
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
    };
}(), a = require("../../action/link/index.js").addMembers, e = require("../../action/contacts/index.js"), i = e.contacts, n = (e.deleteContacts, 
require("../../action/groups/index.js").groupMembersAll), o = require("../../utils/util.js").toast, s = getApp(), d = "more_edit_send_other_click";

Page({
    data: {
        contacts: [],
        addBtnDisabled: !0
    },
    $data: {
        selectedUserIds: [],
        noMoreData: !1,
        loading: !1
    },
    onLoad: function(t) {
        t.sid, t.chkcode, t.leid;
        var a = t.selectedIdList;
        t.groupid;
        this.options.selectedIdList = 0 == a.length ? [] : a.split(",").map(function(t) {
            return Number(t);
        }), this.reload();
    },
    reload: function() {
        s.callAfterLogin(this.init.bind(this));
    },
    init: function() {
        var a = this;
        if (!this.$data.loading) {
            wx.showNavigationBarLoading(), this.$data.selectedUserIds = [], this.$data.noMoreData = !1, 
            this.$data.loading = !0;
            var e = n(this.options.groupid), o = i("cloud_doc", 0, 21);
            Promise.all([ e, o ]).then(function(e) {
                var i = t(e, 2), n = i[0], o = i[1];
                a.$data.loading = !1, wx.hideNavigationBarLoading(), a.addTeamMembersToSelectedIdList(n.members);
                var s = o.contacts;
                s.length < 21 && (a.$data.noMoreData = !0), s = a.formatData(s), a.setData({
                    contacts: s
                });
            }).catch(function(t) {
                a.$data.loading = !1, wx.hideNavigationBarLoading();
            });
        }
    },
    addTeamMembersToSelectedIdList: function(t) {
        for (var a = this.options.selectedIdList, e = s.globalData.user && s.globalData.user.id, i = 0, n = t.length; i < n; ++i) {
            var o = t[i];
            o != e && a.indexOf(o) < 0 && a.push(o);
        }
    },
    checkboxChange: function(t) {
        var a = t.detail.value.map(function(t) {
            return Number(t);
        });
        this.$data.selectedUserIds = a;
        for (var e = this.options.selectedIdList, i = !0, n = 0, o = a.length; n < o; ++n) {
            var s = a[n];
            if (e.indexOf(s) < 0) {
                i = !1;
                break;
            }
        }
        this.data.addBtnDisabled != i && this.setData({
            addBtnDisabled: i
        });
    },
    formatData: function(t) {
        var a = this.$data.selectedUserIds, e = this.options.selectedIdList, i = [];
        return t && t.length > 0 && (i = t.map(function(t) {
            return {
                userid: t.userid,
                name: t.name,
                avatar: t.avatar,
                checked: e.indexOf(t.userid) > -1 || a.indexOf(t.userid) > -1,
                enabled: e.indexOf(t.userid) < 0
            };
        })), i;
    },
    tapCopy: function() {
        if (s.stat(d, {
            type: "copylink"
        }), this.options.leid) {
            var t = "https://drive.wps.cn/el/" + this.options.leid, a = decodeURIComponent(this.options.fname) || "";
            wx.setClipboardData({
                data: t + "\n邀请你一起写 「" + a + "」",
                success: function(t) {},
                fail: function() {
                    o("复制失败");
                }
            });
        } else o("复制失败");
    },
    tapAddMember: function() {
        s.stat(d, {
            type: "add"
        });
        var t = this.$data.selectedUserIds;
        if (t && 0 != t.length) {
            for (var e = [], i = this.options.selectedIdList, n = 0, r = t.length; n < r; ++n) {
                var c = t[n];
                i.indexOf(c) < 0 && e.push(c);
            }
            a(this.options.sid, e, this.options.chkcode, "write").then(function(t) {
                o("成员已添加", {
                    duration: 1e3
                }, function() {
                    wx.navigateBack({
                        delta: 1
                    });
                });
            }).catch(function(t) {
                o(t.msg);
            });
        }
    },
    onReachBottom: function() {
        var t = this;
        if (!this.$data.noMoreData && !this.$data.loading) {
            var a = this.data.contacts;
            this.$data.loading = !0, i("cloud_doc", a.length, 20).then(function(e) {
                t.$data.loading = !1, (e.contacts.length < 20 || 0 == e.contacts.length) && (t.$data.noMoreData = !0);
                var i = a.concat(e.contacts);
                i = t.formatData(i), t.setData({
                    contacts: i
                });
            }).catch(function(a) {
                t.$data.loading = !1;
            });
        }
    }
});