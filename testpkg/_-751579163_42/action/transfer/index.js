var t = require("../../utils/request.js").drive;

module.exports = function(e) {
    return new Promise(function(r, s) {
        t({
            method: "POST",
            url: "/api/v3/links/" + e + "/transfer",
            data: {
                sid: e,
                platform: "pc"
            },
            success: function(t) {
                var e = t.statusCode, i = t.data;
                200 === e ? r(i) : s(i);
            },
            fail: function(t) {
                s(t);
            }
        });
    });
};