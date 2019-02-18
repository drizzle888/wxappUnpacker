var t = require("../../utils/request.js").account;

module.exports = {
    modify: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return new Promise(function(i, n) {
            var s = Object.assign({}, e);
            t({
                method: "POST",
                url: "/api/v3/mine",
                data: s,
                success: function(t) {
                    var e = t.statusCode, s = t.data;
                    200 === e ? i(s) : n(s);
                },
                fail: function(t) {
                    n(t);
                }
            });
        });
    }
};