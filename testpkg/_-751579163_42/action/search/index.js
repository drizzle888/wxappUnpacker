var e = require("../../utils/request.js").drive, r = {
    count: 20
};

module.exports = {
    getRecentSearchedRecords: function() {
        var e = wx.getStorageSync("recentSearchedRecords") || [];
        return e.reverse(), e;
    },
    clearRecentSearchedRecords: function() {
        wx.setStorageSync("recentSearchedRecords", []);
    },
    updateRecentSearchedRecords: function(e) {
        var r = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], a = wx.getStorageSync("recentSearchedRecords") || [], c = !1, n = -1;
        for (var t in a) if (a[t].name === e.name) {
            n = t, c = !0;
            break;
        }
        r ? c && (a = a.splice(n, 1)) : c ? 0 !== n && (a.splice(n, 1), a.push(e)) : (a.length >= 6 && a.splice(0, 1), 
        a.push(e)), wx.setStorageSync("recentSearchedRecords", a);
    },
    fetchSearchFiles: function() {
        var a = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return new Promise(function(c, n) {
            a && a.searchname && 0 !== a.searchname.length ? e({
                method: "GET",
                url: "/api/v3/search/files",
                data: Object.assign({}, r, a),
                success: function(e) {
                    var r = e.statusCode, a = e.data;
                    if (200 === r) {
                        var t = a.files || [];
                        c(t);
                    } else n(a);
                },
                fail: function(e) {
                    n(e);
                }
            }) : n(new Error("need searchname for search!"));
        });
    },
    fetchSearchTeams: function() {
        var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return new Promise(function(a, c) {
            r && r.searchname && 0 !== r.searchname.length ? e({
                method: "GET",
                url: "/api/v3/search/groups",
                data: Object.assign({}, r),
                success: function(e) {
                    var r = e.statusCode, n = e.data;
                    if (200 === r) {
                        var t = n.groups || [];
                        a({
                            teams: t
                        });
                    } else c(n);
                },
                fail: function(e) {
                    c(e);
                }
            }) : c(new Error("need searchname for search!"));
        });
    }
};