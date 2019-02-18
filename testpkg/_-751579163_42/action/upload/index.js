var e = require("../../utils/request.js").drive, n = function(n) {
    return new Promise(function(t, i) {
        e({
            url: "/api/files/upload/request",
            data: n,
            method: "GET",
            success: function(e) {
                var n = e.data;
                200 === e.statusCode ? t(n || []) : i(n);
            },
            fail: function(e) {
                i(e);
            }
        });
    });
}, t = function(n) {
    return new Promise(function(t, i) {
        e({
            url: "/api/v3/groups/" + n.groupid + "/files",
            data: n,
            method: "POST",
            success: function(e) {
                var n = e.data;
                200 === e.statusCode ? t(n) : i(n);
            },
            fail: function(e) {
                i(e);
            }
        });
    });
}, i = function(e, n, t, i, s, u, c, r) {
    return new Promise(function(a, f) {
        var l = {
            "Content-Type": "multipart/form-data"
        }, d = wx.uploadFile({
            url: s,
            name: "file",
            filePath: u,
            header: l,
            formData: c,
            success: function(s) {
                if (200 == s.statusCode) {
                    var u = JSON.parse(s.data).newfilename;
                    o(e, n, t, u, i).then(function(e) {
                        a(e);
                    }).catch(function(e) {
                        f(e);
                    });
                } else f("上传失败");
            },
            fail: function(e) {
                f("上传失败");
            }
        });
        r && d.onProgressUpdate(r);
    });
}, o = function(e, n, i, o, s) {
    return new Promise(function(u, c) {
        t({
            groupid: e,
            parentid: n,
            name: i,
            isUpNewVer: !1,
            store: "ks3",
            size: s,
            sha1: o
        }).then(function(e) {
            u(e);
        }).catch(function(e) {
            c(e);
        });
    });
};

module.exports = {
    fetchUploadFileUrl: n,
    setUploadFileCommitInfo: t,
    chooseMessageFile: function() {
        return new Promise(function(e, n) {
            wx.chooseMessageFile ? wx.chooseMessageFile({
                type: "file",
                count: 1,
                success: function(t) {
                    var i = t.tempFiles;
                    !i || i.length <= 0 ? n("选择微信文件为空") : e(i[0]);
                },
                fail: function(e) {
                    n("选择微信文件失败");
                }
            }) : n("当前微信版本暂不支持");
        });
    },
    uploadMessageFile: function(e, t, o, s, u, c) {
        return new Promise(function(r, a) {
            n({
                groupid: e,
                parentid: t,
                name: o,
                size: u,
                store: "ks3",
                method: "POST",
                encrypt: !0
            }).then(function(n) {
                var f = {
                    key: n.key,
                    Policy: n.Policy,
                    submit: "Upload to KS3",
                    Signature: n.Signature,
                    KSSAccessKeyId: n.KSSAccessKeyId,
                    "x-kss-server-side-encryption": n["x-kss-server-side-encryption"],
                    "x-kss-newfilename-in-body": "true"
                };
                i(e, t, o, u, n.url, s, f, c).then(function(e) {
                    r(e);
                }).catch(function(e) {
                    a(e);
                });
            }).catch(function(e) {
                a(e);
            });
        });
    },
    chooseMessagePic: function() {
        return new Promise(function(e, n) {
            wx.chooseImage({
                count: 1,
                sizeType: [ "original", "compressed" ],
                sourceType: [ "album", "camera" ],
                success: function(n) {
                    var t = n.tempFiles;
                    e(t[0]);
                },
                fail: function(e) {
                    n(e);
                }
            });
        });
    }
};