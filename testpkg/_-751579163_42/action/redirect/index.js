var t = require("../../utils/request.js").account;

module.exports = function(s) {
    var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
    return new Promise(function(u, r) {
        t({
            url: "/p/session/redirect",
            data: {
                cb: s,
                sync_status: e
            },
            method: "POST",
            success: function(t) {
                var s = t.data;
                200 === t.statusCode ? u(s.url) : r(s);
            },
            fail: function(t) {
                r(t);
            }
        });
    });
};