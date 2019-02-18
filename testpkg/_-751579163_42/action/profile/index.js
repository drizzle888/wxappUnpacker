var e = require("../../utils/request.js").drive;

module.exports = {
    infoProfile: function(i) {
        return new Promise(function(n, t) {
            e({
                method: "GET",
                data: {
                    key: i
                },
                url: "/api/v3/profiles",
                success: function(e) {
                    n(e);
                },
                fail: function(e) {
                    t(e);
                }
            });
        });
    },
    updateProfile: function(i, n) {
        return new Promise(function(t, u) {
            e({
                method: "PUT",
                data: {
                    key: i,
                    value: n
                },
                url: "/api/v3/profiles",
                success: function(e) {
                    t(e);
                },
                fail: function(e) {
                    u(e);
                }
            });
        });
    },
    deleteProfile: function(i) {
        return new Promise(function(n, t) {
            e({
                method: "DELETE",
                data: {
                    key: i
                },
                url: "/api/v3/profiles",
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