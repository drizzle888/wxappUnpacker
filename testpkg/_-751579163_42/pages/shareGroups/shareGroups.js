var a = require("../../action/share-groups/index.js"), t = a.shareGroups, e = a.exitShareGroup, r = require("../../utils/util.js"), o = r.toast, s = r.gotoPage, n = r.noExtName, i = getApp();

Page({
    data: {
        shareGroups: [],
        loading: !0
    },
    $data: {
        noMoreData: !1
    },
    onLoad: function(a) {
        this.refresh();
    },
    refresh: function() {
        this.data.shareGroups = [], this.loadShareGroups(0, 20);
    },
    loadShareGroups: function(a, e) {
        var r = this;
        this.data.loading = !0, t(a, e).then(function(a) {
            var t = a.groups;
            wx.stopPullDownRefresh(), t = r.format(t);
            var o = r.data.shareGroups.concat(t);
            r.setData({
                loading: !1,
                shareGroups: o
            }), r.$data.noMoreData = t.length < e;
        }).catch(function(a) {
            "ErrLinkShareGroupMemberNotFound" === a.result ? r.setData({
                loading: !1,
                shareGroups: []
            }) : o(a.msg || "获取协作分组列表失败");
        });
    },
    tapItem: function(a) {
        var t = a.currentTarget.dataset.index;
        this.gotoShareGroupInfo(t, "home"), i.stat("linkgroup_click");
    },
    gotoShareGroupInfo: function(a, t) {
        var e = this.data.shareGroups[a];
        s("shareGroupInfo", {
            sgid: e.id,
            tab: t
        });
    },
    format: function(a) {
        return a.map(function(a) {
            return {
                id: a.group_id,
                name: a.group_name,
                fileName: n(a.filename),
                members: a.icons
            };
        });
    },
    onPullDownRefresh: function() {
        this.data.loading || this.refresh();
    },
    onReachBottom: function() {
        this.$data.noMoreData || this.data.loading || this.loadShareGroups(this.data.shareGroups.length, 20);
    },
    tapMore: function(a) {
        var t = this;
        i.stat("linkgroup_more_click");
        var e = [ "查看共享成员", "删除并退出" ], r = a.currentTarget.dataset.index, o = this.data.shareGroups[r].id;
        wx.showActionSheet({
            itemList: e,
            success: function(a) {
                var s = e[a.tapIndex];
                "查看共享成员" === s ? (t.viewMembers(r), i.stat("linkgroup_more_member_click")) : "删除并退出" === s && t.exitShareGroup(o, r);
            }
        });
    },
    viewMembers: function(a) {
        this.gotoShareGroupInfo(a, "member");
    },
    exitShareGroup: function(a, t) {
        var r = this, s = this.data.shareGroups[t].name;
        wx.showModal({
            title: "删除并退出",
            content: "请确认删除并退出 " + s,
            confirmText: "删除",
            confirmColor: "#e64340",
            showCancel: !0,
            cancelText: "取消",
            success: function(s) {
                s.confirm && e(a).then(function() {
                    i.stat("linkgroup_more_quit_click"), r.data.shareGroups.splice(t, 1), r.setData({
                        shareGroups: r.data.shareGroups
                    }), 0 == r.data.shareGroups.length && wx.navigateBack({
                        delta: 1
                    });
                }).catch(function(a) {
                    o(a.msg);
                });
            }
        });
    }
});