var e = getApp(), t = require("../../config/index.js").appShareInfo, r = require("../../utils/util.js"), o = r.gotoPage, i = (r.toast, 
require("../../action/files/index.js").getCollectFolderInfo);

require("../../action/files/index.js").fileMetadata, require("../../store/store.js").StoreType;

Page({
    data: {
        loaded: !1,
        fname: "",
        avatar: "",
        creatorName: "",
        isError: !1,
        errorTitle: "",
        errorDesc: ""
    },
    $data: {
        collectid: ""
    },
    onLoad: function(t) {
        var r = this, o = t.collectid;
        this.$data.collectid = o, e.callAfterLogin(function() {
            r.checkCollect(o);
        }), e.stat("submit_visit");
    },
    checkCollect: function(e) {
        var t = this;
        i(e).then(function(e) {
            var r = e.role, o = e.groupid, i = e.parentid, a = e.fileid, c = e.name, l = e.expire, n = e.creator;
            t.isExpire(l) ? t.showExpireError(1 === r) : 1 === r ? t.gotoFiles(o, i, a, c) : t.showInfo(c, n.avatar, n.name);
        }).catch(function(e) {
            t.showError(e);
        });
    },
    isExpire: function(e) {
        return new Date().getTime() / 1e3 > e;
    },
    gotoFiles: function(e, t, r, i) {
        o("files", {
            fid: r,
            pid: t,
            fname: encodeURIComponent(i),
            gid: e,
            ftype: "folder",
            autoLoad: !0
        }, !0);
    },
    gotoHomePage: function() {
        o("tabBars/recent");
    },
    showExpireError: function(e) {
        this.setData({
            isError: !0,
            loaded: !0,
            errorTitle: "群收文件已结束",
            errorDesc: e ? "" : "可联系对方重新发起群收"
        });
    },
    showError: function(e) {
        var t = e.result, r = e.msg, o = !r || -1 !== [ "collectExpired", "collectNotExist", "collectInvalid" ].indexOf(t);
        this.setData({
            isError: !0,
            loaded: !0,
            errorTitle: o ? "群收文件已结束" : r,
            errorDesc: o ? "可联系对方重新发起群收" : ""
        });
    },
    showInfo: function(e, t, r) {
        this.setData({
            fname: e,
            avatar: t,
            creatorName: r,
            isError: !1,
            loaded: !0
        });
    },
    tapSelectFile: function() {
        var t = this.$data.collectid;
        o("fileCollectSelect", {
            collectid: t
        }), e.stat("submit_doc_click");
    },
    tapHome: function() {
        this.gotoHomePage(), e.stat("submit_home_click");
    },
    onShareAppMessage: function() {
        var e = this.$data.collectid, r = this.data.fname;
        return e ? {
            title: "[群收文件]" + r,
            path: "pages/receiveFileCollect/receiveFileCollect?collectid=" + e,
            imageUrl: "https://qn.cache.wpscdn.cn/wxminiprogram/share/share_collect_3.jpg"
        } : t;
    }
});