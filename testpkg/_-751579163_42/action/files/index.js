var e = require("../../utils/request.js").drive, t = require("../groups/index.js").fetchGroups, i = {
    filter: "rootall",
    orderby: "mtime",
    order: "DESC",
    count: 20
}, n = function(e) {
    for (var t = 0, i = e.length; t < i; ++t) {
        var n = e[t];
        19 === n.store && (n.ftype = "wpscourselink");
    }
    return e.sort(function(e, t) {
        if (e.ftype != t.ftype) {
            if ("wpscourselink" === e.ftype) return -1;
            if ("wpscourselink" === t.ftype) return 1;
        }
        return t.mtime - e.mtime;
    }), e;
}, r = function() {
    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    return new Promise(function(n, r) {
        var s = Object.assign({}, i, t);
        e({
            url: "/api/v3/groups/special/files",
            data: s,
            method: "GET",
            success: function(e) {
                var t = e.data;
                200 === e.statusCode ? n(t && t.files || []) : r(t);
            },
            fail: function(e) {
                r(e);
            }
        });
    });
}, s = {
    lightlinkVerifying: "文件转换中"
};

module.exports = {
    fetchFiles: function() {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return new Promise(function(r, s) {
            var o = Object.assign({}, t), a = o.groupid;
            if (delete o.groupid, !a) return r([]);
            var u = "/api/v3/groups/" + a + "/files", c = Object.assign({}, i, t);
            e({
                url: u,
                data: c,
                method: "GET",
                success: function(e) {
                    var t = e.data;
                    if (200 === e.statusCode) {
                        var i = n(t && t.files || []);
                        r(i);
                    } else s(t);
                },
                fail: function(e) {
                    s(e);
                }
            });
        });
    },
    createFile: function() {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return new Promise(function(n, r) {
            var s = Object.assign({}, t), o = s.groupid;
            if (delete s.groupid, !o) return n([]);
            var a = "/api/v3/groups/" + o + "/files", u = Object.assign({}, i, t);
            e({
                url: a,
                data: u,
                method: "POST",
                success: function(e) {
                    var t = e.data;
                    200 === e.statusCode ? n(t) : r(t);
                },
                fail: function(e) {
                    r(e);
                }
            });
        });
    },
    fileMetadata: function(t) {
        return new Promise(function(i, n) {
            e({
                url: "/api/files/" + t + "/metadata",
                method: "GET",
                success: function(e) {
                    var t = e.data;
                    200 === e.statusCode ? i(t && t.fileinfo || []) : (t.msg = s[t.result] || t.msg, 
                    n(t));
                },
                fail: function(e) {
                    e.msg = s[e.result] || e.msg, n(e);
                }
            });
        });
    },
    getMines: r,
    getFirstPageFiles: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return new Promise(function(n, s) {
            var o = Object.assign({}, i, e);
            Promise.all([ r(o), t() ]).then(function(e) {
                var t = e[0], i = e[1];
                n({
                    mines: t,
                    groups: i
                });
            }).catch(function(e) {
                s(e);
            });
        });
    },
    batchProgress: function(t, i) {
        return new Promise(function(n, r) {
            e({
                url: "/api/v3/groups/" + t + "/files/batch/progress",
                data: {
                    taskid: i
                },
                method: "GET",
                success: function(e) {
                    var t = e.data;
                    200 === e.statusCode ? n(t) : r(t);
                },
                fail: function(e) {
                    r(e);
                }
            });
        });
    },
    createCollectFolder: function(t, i, n) {
        return new Promise(function(r, s) {
            e({
                url: "/api/v5/files/collect",
                data: {
                    name: t,
                    groupid: i,
                    parentid: n
                },
                method: "POST",
                success: function(e) {
                    var t = e.data;
                    200 === e.statusCode ? r(t) : s(t);
                },
                fail: function(e) {
                    s(e);
                }
            });
        });
    },
    getCollectFolderInfo: function(t) {
        return new Promise(function(i, n) {
            e({
                url: "/api/v5/files/collect/" + t,
                method: "GET",
                success: function(e) {
                    var t = e.data;
                    200 === e.statusCode ? i(t) : n(t);
                },
                fail: function(e) {
                    n(e);
                }
            });
        });
    },
    commitFileCollectFolder: function(t, i, n) {
        return new Promise(function(r, s) {
            e({
                url: "/api/v5/files/collect/" + t + "/commit",
                method: "POST",
                data: {
                    collectid: t,
                    groupid: i,
                    fileid: n
                },
                success: function(e) {
                    var t = e.data;
                    200 === e.statusCode ? r(t) : s(t);
                },
                fail: function(e) {
                    s(e);
                }
            });
        });
    },
    fetchDevices: function() {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return new Promise(function(i, n) {
            e({
                url: "/api/v5/groups/tmp/devices",
                data: t,
                method: "GET",
                success: function(e) {
                    var t = e.data;
                    200 === e.statusCode ? i(t) : n(t);
                },
                fail: function(e) {
                    n(e);
                }
            });
        });
    },
    fetchDeviceFiles: function() {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return new Promise(function(n, r) {
            var s = Object.assign({}, t), o = s.deviceid;
            if (delete s.deviceid, !o) return n([]);
            var a = "/api/v5/groups/tmp/devices/" + o + "/files", u = Object.assign({}, i, t);
            u.filter && delete u.filter, e({
                url: a,
                data: u,
                method: "GET",
                success: function(e) {
                    var t = e.data;
                    if (200 === e.statusCode) {
                        for (var i = t && t.files || [], s = 0; s < i.length; ++s) i[s].deviceid = o;
                        n(i);
                    } else r(t);
                },
                fail: function(e) {
                    r(e);
                }
            });
        });
    }
};