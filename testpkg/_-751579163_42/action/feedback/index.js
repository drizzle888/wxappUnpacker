var e = require("../../utils/request.js").drive;

module.exports = {
    feedbackPreview: function(i) {
        return new Promise(function(n, t) {
            e({
                url: "/api/feedback/preview",
                data: i,
                method: "POST",
                success: function(e) {
                    n(e);
                },
                fail: function(e) {
                    t(e);
                }
            });
        });
    },
    feedback: function(i) {
        return new Promise(function(n, t) {
            e({
                url: "/api/feedback",
                data: i,
                method: "POST",
                success: function(e) {
                    n(e);
                },
                fail: function(e) {
                    t(e);
                }
            });
        });
    }
};