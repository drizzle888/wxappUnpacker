var t = require("../../utils/request.js").drive;

module.exports = {
    contacts: function(e, n, a) {
        return new Promise(function(s, c) {
            t({
                method: "GET",
                url: "/api/v5/contacts/list",
                data: {
                    label: e,
                    offset: n,
                    count: a
                },
                success: function(t) {
                    var e = t.statusCode, n = t.data;
                    200 === e ? s(n || {}) : c(n);
                },
                fail: function(t) {
                    c(t);
                }
            });
        });
    },
    deleteContacts: function(e, n) {
        return new Promise(function(a, s) {
            var c = {};
            n ? c.all = !0 : c.contacts = e, t({
                method: "DELETE",
                url: "/api/v5/contacts/delete",
                data: c,
                success: function(t) {
                    var e = t.statusCode, n = t.data;
                    200 === e ? a(n || {}) : s(n);
                },
                fail: function(t) {
                    s(t);
                }
            });
        });
    }
};