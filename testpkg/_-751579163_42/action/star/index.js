var t = require("../../utils/request.js").drive;

module.exports = {
    fetchStar: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return new Promise(function(n, s) {
            t({
                method: "GET",
                url: "/api/v3/tags/1/files",
                data: Object.assign({}, e),
                success: function(t) {
                    var e = t.data;
                    200 === t.statusCode ? n(e) : s(e);
                },
                fail: function(t) {
                    s(t);
                }
            });
        });
    },
    star: function(e, n) {
        return new Promise(function(s, a) {
            t({
                method: "POST",
                url: "/api/v3/files/" + e + "/tags/1",
                data: {
                    groupid: n
                },
                success: function(t) {
                    var e = t.data;
                    200 === t.statusCode ? s(e) : a(e);
                },
                fail: function(t) {
                    a(t);
                }
            });
        });
    },
    cancelStar: function(e) {
        return new Promise(function(n, s) {
            t({
                method: "DELETE ",
                url: "/api/v3/files/" + e + "/tags/1",
                success: function(t) {
                    var e = t.data;
                    200 === t.statusCode ? n(e) : s(e);
                },
                fail: function(t) {
                    s(t);
                }
            });
        });
    }
};