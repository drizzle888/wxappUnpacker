var r = require("../../utils/request.js").drive;

module.exports = {
    createOrJoinShareGroup: function(u, t) {
        return new Promise(function(e, n) {
            var s = {
                sid: u
            };
            t && (s.code = t), r({
                method: "POST",
                url: "/api/v5/links/share_groups",
                data: s,
                success: function(r) {
                    var u = r.data;
                    200 === r.statusCode ? e(u) : n(u);
                },
                fail: function(r) {
                    n(r);
                }
            });
        });
    },
    hasShareGroups: function() {
        return new Promise(function(u, t) {
            r({
                method: "GET",
                url: "/api/v5/links/share_groups",
                data: {
                    offset: 0,
                    count: 20
                },
                success: function(r) {
                    var e = r.data;
                    if (200 === r.statusCode) {
                        var n = e.groups;
                        u(n.length > 0 ? {
                            result: !0
                        } : {
                            result: !1
                        });
                    } else "ErrLinkShareGroupMemberNotFound" === e.result ? u({
                        result: !1
                    }) : t(e);
                },
                fail: function(r) {
                    t(r);
                }
            });
        });
    },
    shareGroups: function(u) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 20;
        return new Promise(function(e, n) {
            r({
                method: "GET",
                url: "/api/v5/links/share_groups",
                data: {
                    offset: u,
                    count: t
                },
                success: function(r) {
                    var u = r.data;
                    200 === r.statusCode ? e(u) : n(u);
                },
                fail: function(r) {
                    n(r);
                }
            });
        });
    },
    shareGroupInfo: function(u) {
        return new Promise(function(t, e) {
            r({
                method: "GET",
                url: "/api/v5/links/share_group_info",
                data: {
                    group_id: u
                },
                success: function(r) {
                    var u = r.data;
                    200 === r.statusCode ? t(u) : e(u);
                },
                fail: function(r) {
                    e(r);
                }
            });
        });
    },
    exitShareGroup: function(u) {
        return new Promise(function(t, e) {
            r({
                method: "DELETE",
                url: "/api/v5/links/share_groups",
                data: {
                    share_group_id: u
                },
                success: function(r) {
                    var u = r.data;
                    200 === r.statusCode ? t(u) : e(u);
                },
                fail: function(r) {
                    e(r);
                }
            });
        });
    },
    upgradeShareGroup: function(u) {
        return new Promise(function(t, e) {
            r({
                method: "POST",
                url: "/api/v5/links/share_groups/upgrade",
                data: {
                    share_group_id: u
                },
                success: function(r) {
                    var u = r.data;
                    200 === r.statusCode ? t(u) : e(u);
                },
                fail: function(r) {
                    e(r);
                }
            });
        });
    },
    userCode: function(u) {
        return new Promise(function(t, e) {
            r({
                method: "GET",
                url: "/api/v5/links/user_code",
                data: {
                    sid: u
                },
                success: function(r) {
                    var u = r.data;
                    200 === r.statusCode ? t(u) : e(u);
                },
                fail: function(r) {
                    e(r);
                }
            });
        });
    }
};