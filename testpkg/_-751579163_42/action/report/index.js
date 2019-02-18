var e = require("../../utils/request.js").drive;

module.exports = {
    report: function(t, r) {
        return new Promise(function(i, s) {
            e({
                method: "POST",
                url: "/api/report",
                data: {
                    fileid: t,
                    reason_detail: r
                },
                success: function(e) {
                    var t = e.statusCode, r = e.data;
                    200 === t ? i(r) : s(r);
                },
                fail: function(e) {
                    s(e);
                }
            });
        });
    }
};