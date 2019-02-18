var e = getApp(), t = require("../../store/store.js"), a = t.StoreType, o = require("../../action/upload/index.js"), n = (o.fetchUploadFileUrl, 
o.uploadMessageFile), r = require("../../utils/util.js"), i = r.gotoPage, s = (r.toast, 
r.isCompanyAccount, r.convertUnit), c = require("../../action/spaces/index.js").spaceInfo;

Page({
    data: {
        name: "",
        err: "",
        percent: "0"
    },
    $data: {
        isUnload: !1
    },
    onLoad: function(t) {
        var a = this;
        e.callAfterLogin(function() {
            a.beginUpload();
        });
    },
    onUnload: function() {
        this.$data.isUnload = !0;
    },
    beginUpload: function() {
        var o = this, r = this.options, i = r.name, s = r.path, c = r.size, d = t.getCacheData(a.allTeam).mine.id;
        this.setData({
            name: i
        }), n(d, "0", i, s, c, this.progressUpload).then(function(t) {
            o.reloadAndPreview(t), e.stat("wechat_upload_success");
        }).catch(function(t) {
            o.checkError(t), e.stat("wechat_upload_fail");
        });
    },
    progressUpload: function(e) {
        var t = e.progress;
        e.totalBytesSent, e.totalBytesExpectedToSend;
        this.setData({
            percent: t
        });
    },
    getBezier: function(e) {
        return .07 * Math.pow(1 - e, 3) + 3 * Math.pow(1 - e, 2) * e * 1 + 3 * Math.pow(e, 2) * (1 - e) * .68 + 1 * Math.pow(e, 3);
    },
    reloadAndPreview: function(e) {
        if (!this.$data.isUnload) {
            var t = getCurrentPages();
            t.length > 1 && t[t.length - 2].reload && t[t.length - 2].reload(!0);
            var a = e.id, o = e.groupid, n = e.fname, r = e.ftype;
            i("preview", {
                fid: a,
                groupid: o,
                ftype: r,
                fname: encodeURIComponent(n)
            }, {}, !0);
        }
    },
    checkError: function(t) {
        var a = t.result, o = t.msg || t || "上传失败";
        this.setData({
            err: o
        });
        var n = e.getMemberId();
        40 !== n && "SpaceFull" === a && c().then(function(e) {
            var t = s(e.used, 2, !0), a = s(e.total, 2, !0);
            i("usercenter/space", {
                spaceUsed: t,
                spaceTotal: a,
                memberId: n
            });
        });
    }
});