var t = require("../../action/groups/index.js"), e = t.createTeam, a = t.formatTeam, r = require("../../action/share-groups/index.js").hasShareGroups, o = require("../../action/profile/index.js"), i = o.infoProfile, s = o.updateProfile, n = (o.deleteProfile, 
require("../../utils/util.js")), h = n.showLoading, u = n.hideLoading, l = n.toast, c = n.gotoPage, g = n.getTeamName, d = n.isBatter, m = n.checkGlobalIntent, p = getApp(), f = require("../../store/store.js"), w = f.StoreType;

Page({
    data: {
        showShareGroup: !1,
        from: "",
        delayShow: !0
    },
    $data: {
        lastPage: ""
    },
    onLoad: function(t) {
        var e = getCurrentPages();
        if (e && e.length > 1) {
            var a = e[e.length - 2];
            this.$data.lastPage = a.route || a.__route__ || "";
        }
        this.setData({
            delayShow: this.isFromShare()
        }), this.setTitle(), this.checkFromSharePage(), this.checkAutoNewGroup(), this.$groupList = this.selectComponent("#grouplist"), 
        this.$groupList.init({
            type: "groupList"
        }, !1);
    },
    setTitle: function() {
        this.isFromRecent() || this.isFromShare() ? wx.setNavigationBarTitle({
            title: "协作"
        }) : this.isFromMyfile() && wx.setNavigationBarTitle({
            title: "协作文档"
        }), this.setData({
            from: this.getFrom()
        });
    },
    checkFromSharePage: function() {
        this.isFromShare() && this.newGroup(!0);
    },
    checkAutoNewGroup: function() {
        var t = this;
        if (this.isFromRecent() && !p.globalData.intent && !this.isFromShare()) {
            var e = f.getCacheData(w.allTeam).teams;
            e && 0 != e.length || i("user.auto.create.team").then(function(e) {
                var a = e.data;
                a && "profileNotExist" !== a.result || t.newGroup(!0);
            }).catch(function(t) {});
        }
    },
    onShow: function() {
        var t = this;
        m(), "recent" !== this.getFrom() && "share" !== this.getFrom() || (r().then(function(e) {
            p.globalData.hasShareGroup = e.result, t.data.showShareGroup !== e.result && t.setData({
                showShareGroup: e.result
            }), e.result && p.stat("linkgroup_entrance_show");
        }).catch(function(t) {}), this.data.showShareGroup !== p.globalData.hasShareGroup && this.setData({
            showShareGroup: p.globalData.hasShareGroup
        })), this.reload();
    },
    onPullDownRefresh: function() {
        this.$groupList.firstPage({}, function() {
            wx.stopPullDownRefresh();
        });
    },
    onloadStatusChange: function(t) {
        var e = t.detail.status;
        "loaded" === e ? u() : "loading" === e && h();
    },
    tapShareGroup: function(t) {
        c("shareGroups"), p.stat("linkgroup_entrance_click");
    },
    tapNewTeamByEmpty: function() {
        d() || (p.stat("team_blank_build_button"), this.newGroup());
    },
    tapNewTeam: function() {
        d() || (p.stat("team_build_click"), this.newGroup());
    },
    isFromRecent: function() {
        return "pages/tabBars/recent/recent" === this.$data.lastPage;
    },
    isFromMyfile: function() {
        return "pages/tabBars/teams/teams" === this.$data.lastPage;
    },
    isFromShare: function() {
        return "pages/share/share" === this.$data.lastPage;
    },
    getFrom: function() {
        return this.isFromRecent() ? "recent" : this.isFromMyfile() ? "myfile" : this.isFromShare() ? "share" : "";
    },
    reload: function() {
        this.setData({
            delayShow: this.data.delayShow
        }), this.$groupList.reflesh();
    },
    newGroup: function() {
        var t = this, r = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        h(), e(g(f)).then(function(e) {
            p.stat("team_build_success"), f.addData(w.allTeam, [ a(e) ]), t.reload(), u(), r && (s("user.auto.create.team", {
                auto: !1
            }), p.stat("group_createguide_autocreate")), c("teamGuide/createdTeamGuide", {
                pid: 0,
                gid: e.id,
                fname: encodeURIComponent(e.name)
            }), t.data.delayShow = !1;
        }).catch(function(e) {
            p.stat("team_build_fail", {
                errorCode: e.result
            }), u(), t.setData({
                delayShow: !1
            }), l("" + (e.msg || "连接失败"));
        });
    }
});