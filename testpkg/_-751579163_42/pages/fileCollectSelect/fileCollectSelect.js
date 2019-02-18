var t = getApp(), e = require("../../utils/util.js"), a = e.gotoPage, i = e.toast, o = e.hideLoading, s = e.showLoading, l = require("../../action/files/index.js").commitFileCollectFolder;

require("../../store/store.js").StoreType;

Page({
    data: {
        titleIndexAnim: {},
        showTitleBar: !0,
        tabType: "recent"
    },
    $data: {
        collectid: "",
        tabType: "recent",
        groupid: "",
        parentid: "",
        needBack: !1,
        type: ""
    },
    onLoad: function(t) {
        this.$fileList = this.selectComponent("#filelist");
        var e = this.options, a = e.collectid, i = e.tabType, o = e.groupid, s = e.parentid, l = (e.fname, 
        e.type);
        this.$data.collectid = a, this.$data.tabType = i || "recent", this.$data.groupid = o, 
        this.$data.type = l, this.$data.parentid = s || "0", this.loadData();
    },
    onShow: function() {
        var t = this.options.fname;
        t && wx.setNavigationBarTitle({
            title: decodeURIComponent(t)
        }), this.$data.needBack && (this.$data.needBack = !1, this.goBack());
    },
    loadData: function() {
        var t = this.$data, e = t.tabType;
        t.groupid, t.parentid, t.type;
        "recent" === e ? this.loadRecentBar() : this.loadFilesBar();
    },
    loadRecentBar: function() {
        var t = this.$data, e = t.tabType, a = (t.groupid, t.parentid, t.type, {
            type: "recent"
        });
        this.$fileList.init(a, !1), this.$fileList.reflesh(!0), this.setData({
            showTitleBar: !0,
            tabType: e
        });
    },
    loadFilesBar: function() {
        var t = this.$data, e = t.tabType, a = t.groupid, i = t.parentid, o = {}, s = !0;
        "allTeams" === t.type ? (o = {
            type: "allTeams"
        }, s = !1) : a && i ? (o = {
            type: "file",
            gid: a,
            pid: i
        }, s = !1) : (o = {
            type: "all"
        }, s = !0), this.$fileList.init(o, !1), this.$fileList.reflesh(!0), this.setData({
            showTitleBar: s,
            tabType: e
        });
    },
    tapRecent: function() {
        this.$data.groupid = 0, this.$data.parentid = 0, this.$data.tabType = "recent", 
        this.setData({
            tabType: this.$data.tabType
        }), this.loadData();
    },
    tapFiles: function() {
        this.$data.groupid = 0, this.$data.parentid = 0, this.$data.tabType = "all", this.loadData(), 
        this.setData({
            tabType: this.$data.tabType
        });
    },
    fileItemTap: function(e) {
        var i = this.$data, o = i.tabType, s = i.collectid, l = e.detail, n = l.groupid, d = l.fid, r = l.ftype, c = l.fname, p = l.type;
        c = c ? encodeURIComponent(c) : c, "allTeams" === r ? a("fileCollectSelect", {
            type: p,
            fname: c,
            tabType: o,
            collectid: s
        }) : "team" === r ? a("fileCollectSelect", {
            type: p,
            groupid: n,
            parentid: "0",
            fname: c,
            tabType: o,
            collectid: s
        }) : "folder" === r ? a("fileCollectSelect", {
            type: p,
            groupid: n,
            parentid: d,
            fname: c,
            tabType: o,
            collectid: s
        }) : (this.tapFile(e.detail), t.stat("select_doc_click", {
            from: o
        }));
    },
    tapFile: function(e) {
        var a = this, n = e.groupid, d = e.fid, r = e.fname, c = e.fsrc, p = this.$data, h = p.tabType, f = p.collectid;
        "与我共享" === c ? i("与我共享文件不支持提交") : n && d && f ? (s(), l(f, n, d).then(function(e) {
            o(), a.gotoResult(r, !0, ""), t.stat("submit_doc_success", {
                from: h
            });
        }).catch(function(e) {
            o(), a.gotoResult(r, !1, e.msg || "提交失败"), t.stat("submit_doc_fail", {
                from: h,
                error: e.msg || "提交失败"
            });
        })) : (this.gotoResult(r, !1, "提交失败"), t.stat("submit_doc_fail", {
            from: h,
            error: "提交失败"
        }));
    },
    gotoResult: function(t, e, i) {
        a("fileCollectResult", {
            fname: encodeURIComponent(t),
            result: e ? "1" : "0",
            msg: i || ""
        });
    },
    onReachBottom: function() {
        this.$fileList.morePage();
    },
    onloadStatusChange: function() {},
    setNeedBack: function() {
        this.$data.needBack = !0;
    },
    goBack: function() {
        for (var t = getCurrentPages(), e = 0, a = t[t.length - 1].route, i = t.length; i--; ) {
            if (t[i].route !== a) {
                t[i];
                break;
            }
            e++;
        }
        wx.navigateBack({
            delta: e
        });
    }
});