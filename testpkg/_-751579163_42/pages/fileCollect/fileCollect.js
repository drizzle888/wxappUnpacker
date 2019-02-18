var e = getApp(), t = require("../../config/index.js").appShareInfo, i = require("../../utils/util.js"), a = i.gotoPage, n = (i.toast, 
i.formatRemainTime), o = (require("../../action/files/index.js").getCollectFolderInfo, 
require("../../action/files/index.js").fileMetadata);

require("../../store/store.js").StoreType;

Page({
    data: {
        expire: "",
        fname: ""
    },
    $data: {
        isRename: !1
    },
    onLoad: function(t) {
        var i = this.options, a = (i.collectid, i.fileid, i.groupid, i.fname), o = (i.parentid, 
        i.expire);
        this.setData({
            expire: n(o),
            fname: decodeURIComponent(a)
        }), e.stat("file_collect_visit");
    },
    tapRename: function() {
        this.$data.isRename = !0;
        var t = this.options, i = t.fileid, n = t.groupid, o = (t.parentid, this.data.fname);
        a("rename", {
            groupid: n,
            fid: i,
            fname: encodeURIComponent(o),
            ftype: "folder"
        }), e.stat("collect_name_click");
    },
    onShow: function() {
        var e = this, t = this.options.fileid;
        if (this.$data.isRename && t) {
            this.$data.isRename = !1;
            var i = this.data.fname;
            o(t).then(function(t) {
                var a = t.fname;
                console.log(a), a && a != i && e.setData({
                    fname: a
                });
            });
        }
    },
    tapShare: function() {
        e.stat("collect_start_click");
    },
    onShareAppMessage: function() {
        var e = this.options.collectid, i = this.data.fname;
        return e ? {
            title: "[群收文件]" + i,
            path: "pages/fileCollectReceive/fileCollectReceive?collectid=" + e,
            imageUrl: "https://qn.cache.wpscdn.cn/wxminiprogram/share/share_collect_3.png"
        } : t;
    }
});