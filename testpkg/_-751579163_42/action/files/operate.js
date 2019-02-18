var t = require("../../utils/request.js").drive;

module.exports = {
    copyFile: function() {
        var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return new Promise(function(e, i) {
            var a = "/api/v3/groups/" + n.groupid + "/files/batch/copy", o = Object.assign({}, n);
            t({
                url: a,
                data: o,
                method: "POST",
                success: function(t) {
                    var n = t.data;
                    "ok" === n.result ? e(n) : i(n);
                },
                fail: function(t) {
                    i(t);
                }
            });
        });
    },
    moveFile: function() {
        var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return new Promise(function(e, i) {
            var a = "/api/v3/groups/" + n.groupid + "/files/batch/move", o = Object.assign({}, n);
            t({
                url: a,
                data: o,
                method: "POST",
                success: function(t) {
                    var n = t.data;
                    200 === t.statusCode ? e(n) : i(n);
                },
                fail: function(t) {
                    i(t);
                }
            });
        });
    },
    rename: function(n, e, i) {
        return new Promise(function(a, o) {
            t({
                url: "/api/v3/groups/" + n + "/files/" + e,
                data: {
                    fname: i
                },
                method: "PUT",
                success: function(t) {
                    var n = t.data;
                    200 === t.statusCode ? a(n) : o(n);
                },
                fail: function(t) {
                    o(t);
                }
            });
        });
    },
    delRoaming: function(n) {
        return new Promise(function(e, i) {
            t({
                url: "/api/v3/roaming/" + n,
                method: "DELETE",
                success: function(t) {
                    var n = t.data;
                    200 === t.statusCode ? e(n) : i(n);
                },
                fail: function(t) {
                    i(t);
                }
            });
        });
    },
    delRoamings: function(n) {
        return new Promise(function(e, i) {
            t({
                url: "/api/v3/roaming/batch/destory",
                method: "POST",
                data: {
                    fileids: n
                },
                success: function(t) {
                    var n = t.data;
                    200 === t.statusCode ? e(n) : i(n);
                },
                fail: function(t) {
                    i(t);
                }
            });
        });
    },
    delFile: function(n, e) {
        return new Promise(function(i, a) {
            t({
                url: "/api/v3/groups/" + n + "/files/" + e,
                method: "DELETE",
                success: function(t) {
                    var n = t.data;
                    200 === t.statusCode ? i(n) : a(n);
                },
                fail: function(t) {
                    a(t);
                }
            });
        });
    },
    batchDelFile: function(n, e) {
        return new Promise(function(i, a) {
            t({
                url: "/api/v3/groups/" + n + "/files/batch/delete",
                method: "POST",
                data: {
                    fileids: e
                },
                success: function(t) {
                    var n = t.data;
                    200 === t.statusCode ? i(n) : a(n);
                },
                fail: function(t) {
                    a(t);
                }
            });
        });
    },
    mkdir: function(n, e, i) {
        return new Promise(function(a, o) {
            t({
                url: "/api/v3/groups/" + n + "/files",
                data: {
                    groupid: n,
                    parentid: e,
                    name: i
                },
                method: "POST",
                success: function(t) {
                    var n = t.data;
                    200 === t.statusCode ? a(n) : o(n);
                },
                fail: function(t) {
                    o(t);
                }
            });
        });
    }
};