var e = require("../../utils/request.js").weboffice;

module.exports = {
    uploadCliper: function(t) {
        return new Promise(function(i, a) {
            e({
                method: "POST",
                url: "/api/office/clipboard",
                data: {
                    data: t,
                    timestamp: new Date().getTime()
                },
                success: function(e) {
                    var t = e.data;
                    i(t);
                },
                fail: function() {}
            });
        });
    }
};