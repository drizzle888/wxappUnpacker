var i = getApp(), e = require("../../utils/request.js").drive;

module.exports = function(t) {
    var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
    return new Promise(function(s, r) {
        var u = i.isLogined() ? "/api/v3/links/" + t : "/api/v3/links/" + t + "/public_info";
        e({
            url: u,
            method: "GET",
            data: {
                chkcode: n
            },
            success: function(i) {
                var e = i.data;
                200 === i.statusCode ? s(e) : r(e);
            },
            fail: function(i) {
                r(i);
            }
        });
    });
};