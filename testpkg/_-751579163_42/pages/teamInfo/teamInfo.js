var t = require("../../utils/util.js"), e = t.showLoading, a = t.hideLoading, i = t.decode, o = t.gotoPage, n = t.isCompanyAccount, s = require("../../store/store.js"), m = s.StoreType, r = getApp();

Page({
    data: {
        titleIndexAnim: {},
        tab: "home",
        groupid: "",
        member_count: 0,
        newTeamPrompt: !1,
        alreadyClose: !1,
        teamHeaderTitle: "",
        showRedPoint: !1,
        showEditTeamNameBtn: !1
    },
    onLoad: function(t) {
        var e = this;
        this.setTitle();
        var a = this.options, o = a.gid, n = a.pid;
        this.$fileList = this.selectComponent("#filelist"), this.$fileList.init({
            gid: o,
            pid: n,
            type: "file"
        }, !1), this.$memberList = this.selectComponent("#memberList"), this.$data = {
            lastMemberCount: ""
        };
        var r = {
            teamHeaderTitle: i(this.options.fname),
            groupid: this.options.gid
        }, d = s.getCacheData(m.allTeam).teams.find(function(t) {
            return t.id == e.options.gid;
        });
        d && 0 !== d.member_count && (r.member_count = d.member_count, r.showRedPoint = 1 === r.member_count), 
        this.setData(r);
    },
    setTitle: function() {
        wx.setNavigationBarTitle({
            title: ""
        }), this.updateHeadTitleIfNeed();
    },
    onReady: function() {
        var t = this;
        this.animation = wx.createAnimation({
            duration: 200,
            timingFunction: "ease"
        }), this.$memberList.firstMembers(function(e) {
            t.setData({
                newTeamPrompt: t.isShowNewTeamPrompt(e)
            }), t.updateMemberCountIfNeed(!1);
        }), this.options.clickNewBtn && this.selectComponent("#newButton").tap();
    },
    onShow: function() {
        "" !== this.$data.lastMemberCount && this.updateMemberCountIfNeed(!0), this.$fileList.reflesh(), 
        this.updateHeadTitleIfNeed(), this.updateShowEditNameBtnIfNeed();
    },
    updateMemberCountIfNeed: function(t) {
        var e = this;
        if (this.options.gid) {
            var a = 0, i = s.getCacheData(m.allTeam).teams.find(function(t) {
                return t.id == e.options.gid;
            });
            i && (a = i.member_count), this.$data.lastMemberCount != a && (t && "" !== this.$data.lastMemberCount && this.$memberList.firstMembers(), 
            this.$data.lastMemberCount = a, this.setData({
                member_count: this.$data.lastMemberCount,
                showRedPoint: 1 === this.$data.lastMemberCount
            }));
        }
    },
    updateHeadTitleIfNeed: function() {
        var t = this, e = "", a = s.getCacheData(m.allTeam).teams.find(function(e) {
            return e.id == t.options.gid;
        });
        a && (e = a.fname), e && e != this.data.teamHeaderTitle && this.setData({
            teamHeaderTitle: e
        });
    },
    updateShowEditNameBtnIfNeed: function() {
        var t = this, e = s.getCacheData(m.allTeam).teams.find(function(e) {
            return e.id == t.options.gid;
        }), a = !1;
        e && (n(r.globalData.user) ? "creator" != e.user_role && "admin" != e.user_role || (a = !0) : "creator" == e.user_role && (a = !0)), 
        this.setData({
            showEditTeamNameBtn: a
        }), a && r.stat("team_top_rename_show");
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        var t = this;
        "home" !== this.data.tab ? "member" !== this.data.tab || this.$memberList.firstMembers(function(e) {
            wx.stopPullDownRefresh(), t.updateMemberCountIfNeed(!1), t.updateShowEditNameBtnIfNeed(), 
            t.setData({
                newTeamPrompt: t.isShowNewTeamPrompt(e)
            });
        }) : this.$fileList.firstPage({}, function() {
            wx.stopPullDownRefresh();
        });
    },
    onReachBottom: function() {
        "home" !== this.data.tab ? "member" !== this.data.tab || this.$memberList.moreMembers() : this.$fileList.morePage();
    },
    tapHome: function() {
        "home" !== this.data.tab && (r.stat("team_home_click"), this.animation.left("25%").step(), 
        this.setData({
            tab: "home",
            titleIndexAnim: this.animation.export()
        }), this.$lastPageScrollTopForTabHome = this.$lastPageScrollTop, wx.pageScrollTo({
            scrollTop: this.$lastPageScrollTopForTabMemeber || 0,
            duration: 0
        }));
    },
    tapMember: function() {
        "member" !== this.data.tab && (r.stat("team_member_click"), this.animation.left("75%").step(), 
        this.setData({
            tab: "member",
            titleIndexAnim: this.animation.export()
        }), this.$lastPageScrollTopForTabMemeber = this.$lastPageScrollTop, wx.pageScrollTo({
            scrollTop: this.$lastPageScrollTopForTabHome || 0,
            duration: 0
        }));
    },
    tapClosePrompt: function() {
        this.setData({
            alreadyClose: !0,
            newTeamPrompt: !1
        });
    },
    tapAddMemberByMember: function() {
        r.stat("team_member_invite_click"), this.addMember();
    },
    tapAddMemberByHome: function() {
        r.stat("team_home_invite_click"), this.addMember();
    },
    isShowNewTeamPrompt: function(t) {
        return !t || t.length < 2;
    },
    addMember: function() {
        o("invateteam", {
            fname: this.getEncodedTeamName(),
            ftype: "team",
            groupid: this.options.gid,
            mode: "invite"
        });
    },
    onloadStatusChange: function(t) {
        var i = t.detail.status;
        "loaded" === i ? (a(), this.updateShowEditNameBtnIfNeed()) : "loading" === i && e();
    },
    reload: function() {
        "home" === this.data.tab && this.$fileList.reflesh();
    },
    onMemberRemoved: function(t) {
        this.updateMemberCountIfNeed(!1), this.updateShowEditNameBtnIfNeed();
    },
    tapShareTeam: function() {
        o("invateteam", {
            fname: this.getEncodedTeamName(),
            ftype: "team",
            groupid: this.options.gid,
            parentid: this.options.pid,
            fid: 0,
            mode: "invite"
        }, !1), r.stat("team_top_share_click");
    },
    tapEditTeamName: function() {
        o("rename", {
            groupid: this.options.gid,
            fid: this.options.gid,
            fname: this.getEncodedTeamName(),
            ftype: "team"
        }, !1), r.stat("team_top_rename_click");
    },
    getEncodedTeamName: function() {
        return encodeURIComponent(this.data.teamHeaderTitle);
    },
    onPageScroll: function(t) {
        this.$lastPageScrollTop = t.scrollTop;
    }
});