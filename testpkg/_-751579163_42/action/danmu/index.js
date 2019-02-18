var n = require("../../utils/request.js").account;

module.exports = {
    submitDanmu: function(t) {
        return new Promise(function(u, s) {
            n({
                url: "/wxminiprogram/danmu/msg",
                data: t,
                method: "POST",
                success: function(n) {
                    var t = n.data;
                    200 === n.statusCode ? u(t) : s(t);
                },
                fail: function(n) {
                    s(n);
                }
            });
        });
    },
    getDanmus: function(t) {
        return new Promise(function(u, s) {
            var a = t.msgId;
            n({
                url: "/wxminiprogram/danmu/msg?msgid=" + a,
                method: "GET",
                success: function(n) {
                    var t = n.data;
                    200 === n.statusCode ? u(t) : s(t);
                },
                fail: function(n) {
                    s(n);
                }
            });
        });
    }
};