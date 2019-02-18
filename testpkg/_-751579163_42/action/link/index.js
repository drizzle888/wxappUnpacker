var n = require("../link/auth.js"), t = require("../link/info.js"), i = require("../link/open.js"), e = require("../../utils/request.js").drive;

module.exports = {
    auth: n,
    info: t,
    open: i,
    authAndLink: function(i, e) {
        return new Promise(function(o, u) {
            n(i, e).then(function() {
                t(i, e).then(function(n) {
                    o(n);
                }).catch(function(n) {
                    u({
                        code: n.result
                    });
                });
            }).catch(function(n) {
                u(n);
            });
        });
    },
    getLinkOrOpen: function(n, t) {
        return new Promise(function(o, u) {
            var s = "/api/v3/links/" + n;
            t && (s += "?include=members"), e({
                url: s,
                success: function(t) {
                    var e = t.statusCode, s = t.data;
                    200 === e ? "close" === s.link.status ? i(n).then(function(n) {
                        return o(n);
                    }).catch(function(n) {
                        return u(n);
                    }) : o(s || {}) : i(n).then(function(n) {
                        return o(n);
                    }).catch(function(n) {
                        return u(n);
                    });
                },
                fail: function(n) {
                    u(n);
                }
            });
        });
    },
    getLinkOrOpenCloseLink: function(n) {
        return new Promise(function(t, o) {
            e({
                url: "/api/v3/links/" + n,
                success: function(e) {
                    var u = e.statusCode, s = e.data;
                    200 === u ? t(s || {}) : i(n, "close").then(function(n) {
                        return t(n);
                    }).catch(function(n) {
                        return o(n);
                    });
                },
                fail: function(n) {
                    o(n);
                }
            });
        });
    },
    getLink: function(n) {
        var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        return new Promise(function(i, o) {
            var u = "/api/v3/links/" + n;
            t && (u += "?include=members"), e({
                url: u,
                success: function(n) {
                    var t = n.statusCode, e = n.data;
                    200 === t ? i(e || {}) : o(e);
                },
                fail: function(n) {
                    o(n);
                }
            });
        });
    },
    updateLink: function(n, t, i, o, u) {
        return new Promise(function(s, r) {
            var a = {};
            i && (a.range = i), t && (a.permission = t), void 0 != o && (a.period = o), u && (a.unregisters = u), 
            e({
                url: "/api/v3/links/" + n,
                method: "PUT",
                data: a,
                success: function(n) {
                    var t = n.statusCode, i = n.data;
                    200 === t ? s(i || {}) : r(i);
                },
                fail: function(n) {
                    r(n);
                }
            });
        });
    },
    closeLink: function(n) {
        return new Promise(function(t, i) {
            e({
                method: "DELETE",
                url: "/api/v3/links/" + n,
                success: function(n) {
                    var e = n.statusCode, o = n.data;
                    200 === e ? t(o || {}) : i(o);
                },
                fail: function(n) {
                    i(n);
                }
            });
        });
    },
    applyEdit: function(n) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "write";
        return new Promise(function(i, o) {
            e({
                method: "POST",
                url: "/api/v5/links/applications",
                data: {
                    sid: n,
                    permission: t
                },
                success: function(n) {
                    var t = n.statusCode, e = n.data;
                    200 === t ? i(e || {}) : o(e);
                },
                fail: function(n) {
                    o(n);
                }
            });
        });
    },
    allowEdit: function(n) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "approved";
        return new Promise(function(i, o) {
            e({
                method: "PUT",
                url: "/api/v5/links/applications/" + n,
                data: {
                    status: t
                },
                success: function(n) {
                    var t = n.statusCode, e = n.data;
                    200 === t ? i(e || {}) : o(e);
                },
                fail: function(n) {
                    o(n);
                }
            });
        });
    },
    getLinkApplyInfo: function(n) {
        return new Promise(function(t, i) {
            e({
                method: "GET",
                url: "/api/v5/links/applications/" + n,
                success: function(n) {
                    var e = n.statusCode, o = n.data;
                    200 === e ? t(o || {}) : i(o);
                },
                fail: function(n) {
                    i(n);
                }
            });
        });
    },
    updateMemberPermission: function(n, t) {
        var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "write";
        return new Promise(function(o, u) {
            e({
                method: "PUT",
                url: "/api/v3/links/" + n + "/members/" + t,
                data: {
                    permission: i
                },
                success: function(n) {
                    var t = n.statusCode, i = n.data;
                    200 === t ? o(i || {}) : u(i);
                },
                fail: function(n) {
                    u(n);
                }
            });
        });
    },
    deleteMember: function(n, t) {
        return new Promise(function(i, o) {
            e({
                method: "DELETE",
                url: "/api/v3/links/" + n + "/members/" + t,
                success: function(n) {
                    var t = n.statusCode, e = n.data;
                    200 === t ? i(e || {}) : o(e);
                },
                fail: function(n) {
                    o(n);
                }
            });
        });
    },
    addMembers: function(n, t, i, o, u) {
        return new Promise(function(s, r) {
            var a = {};
            t && (a.userids = t), i && (a.chkcode = i), o && (a.permission = o), u && (a.source = u), 
            e({
                method: "POST",
                url: "/api/v3/links/" + n + "/members",
                data: a,
                success: function(n) {
                    var t = n.statusCode, i = n.data;
                    200 === t ? s(i || {}) : r(i);
                },
                fail: function(n) {
                    r(n);
                }
            });
        });
    },
    getDownloadUrlBySid: function(n) {
        return new Promise(function(t, i) {
            e({
                method: "GET",
                url: "/api/v3/links/" + n + "/download?isblocks=false",
                success: function(n) {
                    var e = n.statusCode, o = n.data;
                    200 === e ? t(o || {}) : i(o);
                },
                fail: function(n) {
                    i(n);
                }
            });
        });
    },
    getDownloadUrlByFid: function(n, t) {
        return new Promise(function(i, o) {
            e({
                method: "GET",
                url: "/api/v3/groups/" + n + "/files/" + t + "/download?isblocks=false",
                success: function(n) {
                    var t = n.statusCode, e = n.data;
                    200 === t ? i(e || {}) : o(e);
                },
                fail: function(n) {
                    o(n);
                }
            });
        });
    },
    fetchRecentSendLinks: function() {
        var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return new Promise(function(t, i) {
            n.filter = "sent", n.orderby = n.orderby || "ctime", n.order = n.order || "DESC", 
            e({
                method: "GET",
                url: "/api/links",
                data: n,
                success: function(n) {
                    var e = n.statusCode, o = n.data;
                    200 === e ? t(o.lightlinks || {}) : i(o);
                },
                fail: function(n) {
                    i(n);
                }
            });
        });
    }
};