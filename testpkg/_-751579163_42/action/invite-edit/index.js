var i = require("../../utils/request.js").drive;

module.exports = {
    createOrGetEditLink: function(t, n) {
        return new Promise(function(e, s) {
            i({
                method: "POST",
                url: "/api/v5/links/create_invite_edit_link",
                data: {
                    groupid: t,
                    fileid: n
                },
                success: function(i) {
                    var t = i.statusCode, n = i.data;
                    200 === t ? e(n || {}) : s(n);
                },
                fail: function(i) {
                    s(i);
                }
            });
        });
    },
    updateEditLink: function(t, n, e, s, u) {
        return new Promise(function(o, r) {
            var a = {};
            e && (a.period = e), s && (a.permission = s), u && (a.status = u), i({
                method: "PUT",
                url: "/api/v5/links/invite_edit_link/" + t + "/" + n,
                data: a,
                success: function(i) {
                    var t = i.statusCode, n = i.data;
                    200 === t ? o(n || {}) : r(n);
                },
                fail: function(i) {
                    r(i);
                }
            });
        });
    },
    closeEditLink: function(t, n) {
        return new Promise(function(e, s) {
            i({
                method: "DELETE",
                url: "/api/v5/links/invite_edit_link/" + t + "/" + n,
                success: function(i) {
                    var t = i.statusCode, n = i.data;
                    200 === t ? e(n || {}) : s(n);
                },
                fail: function(i) {
                    s(i);
                }
            });
        });
    },
    visitEditLink: function(t) {
        return new Promise(function(n, e) {
            i({
                method: "GET",
                url: "/api/v5/links/invite_edit_link/" + t,
                success: function(i) {
                    var t = i.statusCode, s = i.data;
                    200 === t ? n(s || {}) : e(s);
                },
                fail: function(i) {
                    e(i);
                }
            });
        });
    },
    resetEditLink: function(t) {
        return new Promise(function(n, e) {
            i({
                method: "PUT",
                url: "/api/v5/links/reset_invite_edit_link/" + t,
                success: function(i) {
                    var t = i.statusCode, s = i.data;
                    200 === t ? n(s || {}) : e(s);
                },
                fail: function(i) {
                    e(i);
                }
            });
        });
    }
};