var t = require("../../utils/util.js"), a = t.decode, e = t.gotoPage, i = t.toast, o = require("../../store/store.js"), n = o.StoreType, s = require("../../action/groups/index.js").formatTeam, r = require("../../action/share-groups/index.js"), m = r.shareGroupInfo, d = r.upgradeShareGroup, u = getApp();

Page({
    data: {
        titleIndexAnim: {},
        tab: "home",
        fileName: "",
        time: 0,
        status: "",
        memberCount: 0,
        loaded: !1
    },
    $data: {
        group_name: "",
        status: "",
        sid: "",
        filename: "",
        backFromTeamInfo: !1
    },
    onLoad: function(t) {
        var a = this, e = t.sgid;
        t.tab;
        wx.showNavigationBarLoading(), this.$memberList = this.selectComponent("#memberList"), 
        m(e).then(function(t) {
            wx.hideNavigationBarLoading();
            var e = t.filename, i = t.link_created_at, o = t.status, n = t.members, s = t.sid, r = t.group_name;
            a.$data = {
                filename: e,
                status: o,
                sid: s,
                group_name: r
            }, a.setData({
                fileName: e,
                time: i,
                status: o,
                memberCount: n.length,
                loaded: !0
            }), a.$memberList.loadShareGroupMembers(n), wx.setNavigationBarTitle({
                title: r
            });
        }).catch(function(t) {
            wx.hideNavigationBarLoading(), i("ErrLinkShareGroupNotFound" === t.result ? "该协作已被解散" : t.msg || "获取协作组信息失败");
        });
    },
    onShow: function() {
        this.$data.backFromTeamInfo && (this.$data.backFromTeamInfo = !1, wx.navigateBack({
            delta: 2
        }));
    },
    onReady: function() {
        this.animation = wx.createAnimation({
            duration: 200,
            timingFunction: "ease"
        }), "member" === this.options.tab && this.tapMember();
    },
    upgradeAndGotoNewTeam: function(t) {
        var a = this;
        wx.showNavigationBarLoading(), d(this.options.sgid).then(function(i) {
            wx.hideNavigationBarLoading(), o.addData(n.allTeam, [ s(i) ]);
            var r = {
                pid: 0,
                gid: i.id,
                fname: encodeURIComponent(i.name)
            };
            t && (r.clickNewBtn = !0), a.$data.backFromTeamInfo = !0, e("teamInfo", r);
        }).catch(function(t) {
            wx.hideNavigationBarLoading(), i("ErrGroupCountExceedLimit" === t.result ? "超过协作数量限制" : "ErrLinkShareGroupNotFound" === t.result ? "该协作已被解散" : "" + (t.msg || "连接失败"));
        });
    },
    tapNewGroup: function() {
        this.upgradeAndGotoNewTeam(!0), u.stat("linkgroup_sharefile_click");
    },
    tapUpgradeGroup: function() {
        this.upgradeAndGotoNewTeam(!1), u.stat("linkgroup_upgradegroup");
    },
    tapHome: function() {
        "home" !== this.data.tab && (this.animation.left("25%").step(), this.setData({
            tab: "home",
            titleIndexAnim: this.animation.export()
        }));
    },
    tapMember: function() {
        "member" !== this.data.tab && (this.animation.left("75%").step(), this.setData({
            tab: "member",
            titleIndexAnim: this.animation.export()
        }), u.stat("linkgroup_member_show"));
    },
    tapFileItem: function() {
        "valid" === this.$data.status ? u.stat("linkgroup_openfile_success") : u.stat("linkgroup_openfile_fail", {
            errorCode: this.$data.status
        }), "notExist" !== this.$data.status ? e("preview", {
            fname: a(this.$data.filename),
            sid: this.$data.sid
        }) : i("文件已被删除");
    }
});