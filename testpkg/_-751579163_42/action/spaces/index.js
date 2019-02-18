var e = require("../../utils/request.js").drive;

module.exports = {
    spaceInfo: function() {
        return new Promise(function(s, t) {
            e({
                method: "GET",
                url: "/api/v3/spaces",
                success: function(e) {
                    var u = e.statusCode, r = e.data;
                    200 === u ? s(r) : t(r);
                },
                fail: function(e) {
                    t(e);
                }
            });
        });
    }
};