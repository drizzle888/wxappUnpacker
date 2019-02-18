var e = getApp(), t = require("../../../store/store.js"), n = t.StoreType, o = require("../../../config/index.js").appShareInfo, i = require("../../../utils/util.js"), a = i.hideLoading, s = i.toast, c = i.gotoPage, l = i.showLoading, h = i.isCompanyAccount, r = i.checkGlobalIntent, u = require("../../../action/account/account.js").scanQrcodeLogin, g = (require("../../../action/files/index.js").getFirstPageFiles, 
require("../../../action/share-groups/index.js").hasShareGroups), f = require("../../../action/upload/index.js"), d = f.chooseMessageFile;

f.uploadMessageFile, f.chooseMessagePic;

Page({
    data: {
        isCompanyAccount: !1,
        showWechatFile: !0
    },
    onLoad: function(t) {
        var n = this;
        e.globalData.indexPage.options || (e.globalData.indexPage.options = t), this.$fileList = this.selectComponent("#filelist"), 
        this.$searchButton = this.selectComponent("#searchbutton"), this.$accountBindPhoneBar = this.selectComponent("#accountbindphonebar"), 
        this.checkShowWechatFile(), e.callAfterLogin(function() {
            n.init(), n.$fileList.init(null), n.fetchMyFiles(), n.fetchShareGroups();
        }), e.stat("recent_visit");
    },
    onShow: function() {
        e.isLogined() && (r(), this.reload()), this.$accountBindPhoneBar.checkBindPhoneStatus(), 
        this.$searchButton.loadAvatar();
    },
    reload: function(t) {
        this.$fileList.reflesh(t), this.setData({
            isCompanyAccount: h(e.globalData.user)
        });
    },
    fetchMyFiles: function() {
        t.getData(n.myFile, {
            offset: 0,
            count: 10
        }, !0).then(function(e) {});
    },
    fetchShareGroups: function() {
        g().then(function(t) {
            e.globalData.hasShareGroup = t.result;
        }).catch();
    },
    init: function() {
        var t = {};
        e.globalData.indexPage.options && (t = e.globalData.indexPage.options, e.globalData.indexPage.options = null);
        var n = decodeURIComponent(t.scene || "");
        n && this.scanQrcodeLogin(n, !0), this.setData({
            isCompanyAccount: h(e.globalData.user)
        });
    },
    onloadStatusChange: function(e) {
        var t = e.detail.status;
        "loaded" === t ? a() : "loading" === t && l();
    },
    checkShowWechatFile: function() {
        this.setData({
            showWechatFile: !!wx.chooseMessageFile
        });
    },
    scanQrcodeLogin: function(t) {
        var n = this, o = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        u({
            loginid: t
        }).then(function() {}).catch(function(i) {
            var a = i.result, c = i.msg;
            !o || "userNotLogin" !== a && "InvalidWpssid" !== a ? s(c || "扫码登录失败") : (e.clearWpssid(), 
            e.callAfterLogin(function() {
                n.scanQrcodeLogin(t, !1);
            }));
        });
    },
    tapOpenDocs: function() {
        c("tabBars/teams");
    },
    onReachBottom: function() {
        this.$fileList.morePage();
    },
    onPullDownRefresh: function() {
        this.$fileList.firstPage({}, function() {
            wx.stopPullDownRefresh();
        });
    },
    tapWechatFile: function() {
        d().then(function(e) {
            c("wechatMessageFile", e);
        }).catch(function(t) {
            console.log(t), e.stat("recent_wechat_cancel", {
                err: t
            });
        }), e.stat("recent_wechat_click");
    },
    onShareAppMessage: function() {
        return o;
    }
});