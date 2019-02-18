var e = require("../../utils/request.js").drive;

module.exports = {
    useMdrivePreview: function() {
        return new Promise(function(i, r) {
            e({
                url: "/wxMiniProgram/v1/config",
                method: "GET",
                success: function(e) {
                    i(e.data);
                },
                fail: function(e) {
                    r(e);
                }
            });
        });
    }
};