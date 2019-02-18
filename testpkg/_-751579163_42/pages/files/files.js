var e = getApp(), t = require("../../config/index.js").appShareInfo, i = require("../../store/store.js"), a = i.StoreType, o = require("../../utils/util.js"), n = o.showLoading, s = o.hideLoading, r = o.decode, d = o.isCompanyAccount, h = o.gotoPage, f = require("../../action/files/operates.js").folderTransferToGroup;

Page({
    data: {
        groupid: 0,
        parentid: 0,
        showFolderHeader: !1,
        folderHeaderTitle: "",
        ftype: "",
        member_count: 0,
        hidePage: !1,
        error: "",
        errorDetail: "",
        canRetry: !1
    },
    onLoad: function() {
        var t = this, i = this.options, a = i.gid, o = i.fid, n = i.autoLoad;
        this.$fileList = this.selectComponent("#filelist"), this.$data = {
            isFirstShow: !0,
            canGotoInvateTeamPage: !!this.options.needGotoInvateTeamPage,
            isPageUnloaded: !1
        }, this.setData({
            hidePage: this.$data.canGotoInvateTeamPage
        }), e.callAfterLogin(function() {
            t.$fileList.init({
                gid: a,
                pid: o,
                type: "file"
            }, !!n), t.init();
        });
    },
    onUnload: function() {
        this.$data.isPageUnloaded = !0;
    },
    onShow: function() {
        var e = this.options.autoLoad;
        this.$data.isFirstShow ? this.$data.isFirstShow = !1 : this.data.hidePage && this.setData({
            hidePage: !1
        }), this.reload(!!e), this.updateMemberCountIfNeed();
    },
    reload: function(e) {
        this.$fileList.reflesh(e);
    },
    getDecodedFName: function() {
        return r(this.fname || this.options.fname);
    },
    updateNavigationBarTitle: function(e) {
        wx.setNavigationBarTitle({
            title: e
        });
    },
    updateMemberCountIfNeed: function() {
        if (this.data.groupid) {
            for (var e = 0, t = i.getCacheData(a.allTeam).teams, o = 0, n = t.length; o < n; ++o) if (t[o].id == this.data.groupid) {
                e = t[o].member_count;
                break;
            }
            this.data.member_count !== e && this.setData({
                member_count: e
            });
        }
    },
    init: function() {
        var t = this.options, o = t.gid, n = t.fid, s = t.pid, r = t.ftype, h = t.from;
        o = Number(o), n = Number(n || 0);
        for (var f = 0, l = !0, p = i.getCacheData(a.allTeam).teams, g = 0, u = p.length; g < u; ++g) if (p[g].id == o) {
            f = p[g].member_count, l = "special" === p[g].type;
            break;
        }
        var c = 0 === Number(s || 0) && ("team" === r || l);
        this.setData({
            groupid: o,
            parentid: n,
            showFolderHeader: !d(e.globalData.user) && c && !h,
            folderHeaderTitle: this.getDecodedFName(),
            ftype: r,
            member_count: f
        }), this.updateNavigationBarTitle(this.data.showFolderHeader ? "" : this.getDecodedFName());
    },
    onReady: function() {
        this.updateNavigationBarTitle(this.data.showFolderHeader ? "" : this.getDecodedFName()), 
        this.$data.canGotoInvateTeamPage && (delete this.$data.canGotoInvateTeamPage, this.gotoInviteTeamPage());
    },
    onloadStatusChange: function(e) {
        var t = e.detail.status;
        "loaded" === t ? s() : "loading" === t && n();
    },
    onPullDownRefresh: function() {
        this.$fileList.firstPage({}, function() {
            wx.stopPullDownRefresh();
        });
    },
    onReachBottom: function() {
        this.$fileList.morePage();
    },
    onShareAppMessage: function() {
        return t;
    },
    tapShareFolder: function() {
        var t = this;
        "folder" === this.options.ftype ? (wx.showLoading({
            title: "请稍等",
            mask: !0
        }), f({
            gid: this.options.gid,
            fid: this.options.fid,
            fname: decodeURIComponent(this.options.fname)
        }, {
            resolve: function(e) {
                t.$data.isPageUnloaded || (wx.hideLoading(), h("files", {
                    fid: "0",
                    pid: "0",
                    fname: t.options.fname,
                    gid: e.id,
                    ftype: "team",
                    needGotoInvateTeamPage: !0
                }, !0));
            },
            reject: function(e) {
                if (!t.$data.isPageUnloaded) {
                    wx.hideLoading();
                    var i = e.result, a = e.msg, o = e.faillist, n = o && o[0].msg, s = "" + (a || n || "连接失败");
                    switch (i) {
                      case "网络异常":
                        t.setData({
                            error: "网络异常，请稍后重试",
                            errorDetail: "",
                            canRetry: !0
                        });
                        break;

                      default:
                        t.setData({
                            error: "无法邀请成员共享文件夹",
                            errorDetail: s,
                            canRetry: !1
                        });
                    }
                }
            }
        })) : "team" === this.options.ftype && this.gotoInviteTeamPage(), "folder" === this.options.ftype ? e.stat("file_share_click", {
            type: "普通文件夹"
        }) : "team" === this.options.ftype && e.stat("file_share_click", {
            type: "共享文件夹"
        });
    },
    gotoInviteTeamPage: function() {
        h("invateteam", {
            fname: decodeURIComponent(this.options.fname),
            ftype: this.options.ftype,
            groupid: this.options.gid,
            parentid: this.options.pid,
            fid: this.options.fid,
            mode: "invite"
        }, !1);
    },
    tapRetry: function() {
        this.setData({
            error: "",
            errorDetail: ""
        }), this.tapShareFolder();
    }
});