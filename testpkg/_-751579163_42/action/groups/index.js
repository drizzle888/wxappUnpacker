var e = require("../../utils/request.js").drive, n = function(e) {
    var n = {
        id: e.id,
        fname: e.name || e.fname,
        groupid: e.id,
        mtime: e.mtime,
        ftype: "team",
        ficon: "share-folder",
        user_role: e.user_role,
        member_count: e.member_count,
        member_count_limit: e.member_count_limit,
        type: e.type
    };
    return n.recent_members = [], e.recent_members && e.recent_members.forEach(function(e) {
        n.recent_members.push({
            id: e.id,
            avatar: e.avatar,
            name: e.name
        });
    }), n;
}, t = function(e) {
    var t = {};
    return t.teams = [], e.forEach(function(e) {
        "normal" === e.type ? t.teams.push(n(e)) : "special" === e.type ? (e.name = "我的云文档", 
        t.mine = e) : "tmp" === e.type && (t.auto = e);
    }), t;
};

module.exports = {
    fetchGroups: function() {
        return new Promise(function(n, u) {
            e({
                method: "GET",
                url: "/api/v3/groups",
                data: {
                    order: "desc",
                    include: "recent_members"
                },
                success: function(e) {
                    var r = e.statusCode, a = e.data;
                    200 === r ? n(t(a && a.groups || [])) : u(a);
                },
                fail: function(e) {
                    u(e);
                }
            });
        });
    },
    groupInfo: function(t) {
        return new Promise(function(u, r) {
            e({
                method: "GET",
                url: "/api/v3/groups/" + t,
                data: {
                    include: "recent_members"
                },
                success: function(e) {
                    var t = e.statusCode, a = e.data;
                    200 === t ? u(n(a)) : r(a);
                },
                fail: function(e) {
                    r(e);
                }
            });
        });
    },
    createTeam: function(n) {
        return new Promise(function(t, u) {
            e({
                method: "POST",
                url: "/api/v3/groups",
                data: {
                    name: n
                },
                success: function(e) {
                    var n = e.statusCode, r = e.data;
                    200 === n ? t(r) : u(r);
                },
                fail: function(e) {
                    u(e);
                }
            });
        });
    },
    deleteTeam: function(n) {
        return new Promise(function(t, u) {
            e({
                method: "DELETE",
                url: "/api/v3/groups/" + n,
                success: function(e) {
                    var n = e.statusCode, r = e.data;
                    200 === n ? t(r) : u(r);
                },
                fail: function(e) {
                    u(e);
                }
            });
        });
    },
    deleteMember: function(n, t) {
        return new Promise(function(u, r) {
            e({
                method: "DELETE",
                url: "/api/v3/groups/" + n + "/members/" + t,
                success: function(e) {
                    var n = e.statusCode, t = e.data;
                    200 === n ? u(t) : r(t);
                },
                fail: function(e) {
                    r(e);
                }
            });
        });
    },
    updateGroup: function(n, t, u) {
        return new Promise(function(r, a) {
            var o = {};
            t && (o.name = t), void 0 != u && (o.event_alert = u), e({
                method: "PUT",
                url: "/api/v3/groups/" + n,
                data: o,
                success: function(e) {
                    var n = e.statusCode, t = e.data;
                    200 === n ? r(t) : a(t);
                },
                fail: function(e) {
                    a(e);
                }
            });
        });
    },
    groupMembers: function(n) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, u = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 50;
        return new Promise(function(r, a) {
            var o = {};
            t && (o.offset = t), u && (o.count = u), e({
                method: "GET",
                url: "/api/v3/groups/" + n + "/members",
                data: o,
                success: function(e) {
                    var n = e.statusCode, t = e.data;
                    200 === n ? r(t && t.members || []) : a(t);
                },
                fail: function(e) {
                    a(e);
                }
            });
        });
    },
    addMembers: function(n, t) {
        var u = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
        return new Promise(function(r, a) {
            var o = {};
            u && (o.role = u), o.userids = t, e({
                method: "POST",
                url: "/api/v3/groups/" + n + "/members",
                data: o,
                success: function(e) {
                    var n = e.statusCode, t = e.data;
                    200 === n ? r(t) : a(t);
                },
                fail: function(e) {
                    a(e);
                }
            });
        });
    },
    updateMember: function(n, t, u, r) {
        return new Promise(function(a, o) {
            var i = {};
            u && (i.role = u), r && (i.account = r), e({
                method: "PUT",
                url: "/api/v3/groups/" + n + "/members/" + t,
                data: i,
                success: function(e) {
                    var n = e.statusCode, t = e.data;
                    200 === n ? a(t) : o(t);
                },
                fail: function(e) {
                    o(e);
                }
            });
        });
    },
    inviteInfo: function(n) {
        return new Promise(function(t, u) {
            e({
                method: "GET",
                url: "/api/v3/groups/" + n + "/invite_info",
                success: function(e) {
                    var n = e.statusCode, r = e.data;
                    200 === n ? t(r) : u(r);
                },
                fail: function(e) {
                    u(e);
                }
            });
        });
    },
    joinTeam: function(n, t) {
        return new Promise(function(u, r) {
            e({
                method: "POST",
                url: "/api/v3/mine/team/link/" + n + "/join",
                data: {
                    msg: t || ""
                },
                success: function(e) {
                    var n = e.statusCode, t = e.data;
                    200 === n ? u(t) : r(t);
                },
                fail: function(e) {
                    r(e);
                }
            });
        });
    },
    joinTeamInfo: function(n) {
        return new Promise(function(t, u) {
            e({
                method: "GET",
                url: "/api/v3/mine/team/link/" + n,
                success: function(e) {
                    var n = e.statusCode, r = e.data;
                    200 === n ? t(r) : u(r);
                },
                fail: function(e) {
                    u(e);
                }
            });
        });
    },
    formatTeam: n,
    groupMembersAll: function(n) {
        return new Promise(function(t, u) {
            e({
                method: "GET",
                url: "/api/v3/groups/" + n + "/members/all",
                success: function(e) {
                    var n = e.statusCode, r = e.data;
                    200 === n ? t(r) : u(r);
                },
                fail: function(e) {
                    u(e);
                }
            });
        });
    },
    createTeamGuideFiles: function(n) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
        return new Promise(function(u, r) {
            var a = {};
            t && (a.parentid = t), e({
                method: "POST",
                url: "/api/v3/groups/" + n + "/guide_files",
                data: a,
                success: function(e) {
                    var n = e.statusCode, t = e.data;
                    200 === n ? u(t) : r(t);
                },
                fail: function(e) {
                    r(e);
                }
            });
        });
    }
};