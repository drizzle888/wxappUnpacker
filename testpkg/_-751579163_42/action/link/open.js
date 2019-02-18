var t = require("../../utils/request.js").drive;

module.exports = function(e, s) {
    return new Promise(function(i, u) {
        var r = {
            fileid: e
        };
        s && (r.status = s), t({
            method: "POST",
            url: "/api/v3/links",
            data: r,
            success: function(t) {
                var e = t.statusCode, s = t.data;
                200 === e ? i(s || {}) : u(s);
            },
            fail: function(t) {
                u(t);
            }
        });
    });
};