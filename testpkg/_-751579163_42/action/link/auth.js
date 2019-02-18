var e = require("../../utils/request.js").drive, t = function(t) {
    return new Promise(function(s, i) {
        e({
            method: "GET",
            url: "/api/v3/skiplogin/links/" + t + "/status",
            success: function(e) {
                var t = e.data.status;
                s("pvlimit" === t || "expired" === t ? {
                    code: t
                } : {});
            },
            fail: function(e) {
                i(e);
            }
        });
    });
};

module.exports = function(s, i) {
    return new Promise(function(n, u) {
        e({
            method: "POST",
            data: {
                chkcode: i
            },
            url: "/api/v3/skiplogin/links/" + s + "/auth",
            success: function(e) {
                var i = e.data;
                200 === e.statusCode ? n(!0) : "lightlinkChkcodeWrong" === i.result ? u({
                    code: i.result
                }) : "linkClosed" === i.result ? t(s).then(function(e) {
                    var t = e.code;
                    u(t ? {
                        code: t
                    } : {
                        code: i.result
                    });
                }) : u({
                    msg: i.msg,
                    code: i.result
                });
            },
            fail: function(e) {
                u(e);
            }
        });
    });
};