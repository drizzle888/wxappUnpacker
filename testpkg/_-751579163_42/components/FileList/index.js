var e = function() {
    function e(e, t) {
        var a = [], i = !0, n = !1, r = void 0;
        try {
            for (var o, s = e[Symbol.iterator](); !(i = (o = s.next()).done) && (a.push(o.value), 
            !t || a.length !== t); i = !0) ;
        } catch (e) {
            n = !0, r = e;
        } finally {
            try {
                !i && s.return && s.return();
            } finally {
                if (n) throw r;
            }
        }
        return a;
    }
    return function(t, a) {
        if (Array.isArray(t)) return t;
        if (Symbol.iterator in Object(t)) return e(t, a);
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
    };
}(), t = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
        var a = arguments[t];
        for (var i in a) Object.prototype.hasOwnProperty.call(a, i) && (e[i] = a[i]);
    }
    return e;
}, a = getApp(), i = require("../../action/search/index.js"), n = i.fetchSearchFiles, r = i.fetchSearchTeams, o = i.updateRecentSearchedRecords, s = require("../../action/files/index.js"), h = s.fetchDevices, l = (s.fetchDeviceFiles, 
require("../../action/groups/index.js").formatTeam), c = require("../../store/store.js"), g = c.StoreType, f = require("../../utils/util.js"), u = f.toast, d = f.highLightFormat, m = f.isCompanyAccount;

Component({
    properties: {
        type: String,
        gid: String,
        pid: String,
        showOperate: Boolean,
        showTeamAvatar: Boolean,
        isbindTap: Boolean,
        showSelect: Boolean,
        selectedIndexs: Array
    },
    data: {
        files: [],
        showFrom: !1,
        showSize: !0,
        showRecentTime: !1,
        showSlot: !1,
        showPlaceHolder: !0,
        showPlaceHolderDelayOut: !1
    },
    externalClasses: [ "externalClass" ],
    methods: {
        init: function(e) {
            var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0, i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
            this.$data = {
                query: {
                    offset: 0,
                    count: 20
                },
                noMore: !1,
                loadFile: !1
            }, this.showPlaceHolder(300), this.$config = this.getConfig(e), t && this.reflesh(!1, a, i);
        },
        listenLoadResult: function(e) {
            this.$data.loadResultListener = e;
        },
        getConfig: function(e) {
            var t = e || this.properties, a = t.gid, i = t.pid, n = t.type, r = {
                file: {
                    PageFn: "getGroupFiles",
                    storeKey: g.subFile(a, i),
                    param: {
                        groupid: Number(a),
                        parentid: Number(i)
                    },
                    noMoreText: "无更多文档",
                    checkNoMore: !0
                },
                all: {
                    PageFn: "getAllFiles",
                    storeKey: g.myFile,
                    noMoreText: "无更多文档",
                    checkNoMore: !0
                },
                allTeams: {
                    PageFn: "getAllTeams",
                    storeKey: g.allTeam,
                    noMoreText: "无更多文档",
                    checkNoMore: !0,
                    noPage: !0
                },
                recent: {
                    PageFn: "getRecentFiles",
                    storeKey: g.recent,
                    param: {
                        allowCache: !0
                    },
                    noMoreText: "无更早的记录",
                    checkNoMore: !1
                },
                search: {
                    PageFn: "getSearchFiles",
                    noMoreText: "已显示全部结果",
                    checkNoMore: !1,
                    offsetWithInFolder: !0
                },
                groupList: {
                    PageFn: "getAllTeams",
                    storeKey: g.allTeam,
                    noMoreText: "无更多文档",
                    noPage: !0
                },
                device: {
                    PageFn: "getDevices",
                    noMoreText: "无更多设备",
                    checkNoMore: !1
                },
                deviceFile: {
                    PageFn: "getDeviceFiles",
                    param: {
                        deviceid: e && e.deviceid
                    },
                    storeKey: g.deviceFile(e && e.deviceid),
                    noMoreText: "无更多文档",
                    checkNoMore: !1
                }
            };
            return "recent" === n ? this.setData({
                showRecentTime: !0,
                showFrom: !0,
                showSize: !1
            }) : "search" == n ? this.setData({
                showFrom: !1,
                showSize: !1
            }) : "groupList" == n ? this.setData({
                showSize: !1
            }) : "deviceFile" == n ? this.setData({
                showFrom: !0
            }) : this.setData({
                showRecentTime: !1
            }), r[n];
        },
        reflesh: function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0], t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null, i = this.getOffset() || this.$data.query.count;
            i < 20 && (i = 20), this.firstPage({
                count: i
            }, a, !1, e, t);
        },
        fileListEvent: function(e) {
            var t = e.files, i = e.beginTime;
            if (0 == t.length) {
                var n = getCurrentPages();
                if (n.length > 0) {
                    var r = n[n.length - 1].route;
                    "pages/tabBars/recent/recent" === r ? a.stat("recent_blank_visit") : "pages/teamList/teamList" === r && n.length > 1 && "pages/tabBars/recent/recent" === n[n.length - 2].route && a.stat("team_blank_visit");
                }
            }
            var o = new Date().getTime() - i;
            if ("search" === this.properties.type) {
                var s = this.$data, h = s.searchname, l = s.searchTeamCount;
                a.stat("search_all", {
                    keyword: h,
                    type: "file",
                    groupnum: l,
                    userid: a.globalData.user && a.globalData.user.id
                }), a.stat("search_timeall", {
                    timeall: o
                });
            }
        },
        firstPage: function(e, i) {
            var n = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2], r = this, o = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], s = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0;
            if (this.$data && !this.$data.loadFile) {
                this.$data.loadFile = !0, !n && this.triggerEvent("loadStatus", {
                    status: "loading"
                }, {
                    bubbles: !0,
                    composed: !0
                }), this.$data.query.offset = 0, delete this.$data.query.max_mtime, this.$data.noMore = !1, 
                this.setData({
                    loadMoreText: ""
                });
                var h = t({}, this.$config.param, this.$data.query, e);
                o && h.allowCache && delete h.allowCache;
                var l = new Date().getTime();
                this[this.$config.PageFn](this.$config.storeKey, h, o, !0).then(function(e) {
                    r.$data.loadResultListener && r.$data.loadResultListener(e);
                    var t = e.files, a = e.cache;
                    t || (t = e), r.fileListEvent({
                        files: t,
                        beginTime: l
                    }), s > 0 && s < t.length && (t = t.slice(0, s)), r.setData({
                        files: t,
                        loaded: !0,
                        showSlot: !t.length,
                        showPlaceHolder: !1
                    }), r.checkNoMore(t), r.$data.loadFile = !1, !n && r.triggerEvent("loadStatus", {
                        status: "loaded"
                    }, {
                        bubbles: !0,
                        composed: !0
                    }), a && r.firstPage(), i && i();
                }).catch(function(e) {
                    var t = e.result, o = e.msg;
                    "userNotLogin" === t || "InvalidWpssid" === t ? (a.clearWpssid(), wx.reLaunch({
                        url: "/pages/tabBars/recent/recent"
                    })) : u("文件列表加载失败：" + (o || t || "")), r.setData({
                        showPlaceHolder: !1
                    }), r.$data.loadFile = !1, !n && r.triggerEvent("loadStatus", {
                        status: "loaded"
                    }, {
                        bubbles: !0,
                        composed: !0
                    }), i && i(e);
                });
            }
        },
        morePage: function(e) {
            var a = this;
            if (!this.$data.loadFile && !this.$data.noMore && !this.$config.noPage) {
                this.$data.loadFile = !0, this.setData({
                    loadMoreText: "正在加载…"
                }), this.$data.query.offset = this.getOffset();
                var i = this.getMaxMtime();
                i > 0 && (this.$data.query.max_mtime = i);
                var n = t({}, this.$config.param, this.$data.query, e, {
                    filter: "file"
                });
                this.$config.storeKey == g.recent && delete n.filter, n.allowCache && delete n.allowCache, 
                this[this.$config.PageFn](this.$config.storeKey, n).then(function(e) {
                    a.$data.loadResultListener && a.$data.loadResultListener(e);
                    var t = e.files;
                    t || (t = e), a.$data.loadFile = !1, a.checkNoMore(t), t = a.data.files.concat(t), 
                    a.setData({
                        files: t,
                        loadMoreText: a.$data.noMore ? a.$config.noMoreText : ""
                    });
                }).catch(function(e) {
                    var t = e.result, i = e.msg;
                    a.$data.loadFile = !1, u("文件列表加载失败：" + (i || t || ""));
                });
            }
        },
        _loadData: function(e, t, a, i) {
            return i ? c.getData(e, t, a) : c.getMoreData(e, t);
        },
        getGroupFiles: function(e, t, a, i) {
            var n = this;
            return new Promise(function(r, o) {
                n._loadData(e, t, a, i).then(function(e) {
                    r(e);
                }).catch(function(e) {
                    o(e);
                });
            });
        },
        getRecentFiles: function(e, t, a, i) {
            var n = this;
            return new Promise(function(r, o) {
                n._loadData(e, t, a, i).then(function(e) {
                    var t = e.files, a = e.cache;
                    t || (t = e);
                    var i = n.getMaxMtime(t);
                    i > 0 && (n.$data.query.max_mtime = i), r({
                        files: t,
                        cache: a
                    });
                }).catch(function(e) {
                    o(e);
                });
            });
        },
        getAllFiles: function(e, t, a, i) {
            var n = this;
            return new Promise(function(r, o) {
                n._loadData(e, t, a, i).then(function(e) {
                    r(e);
                }).catch(function(e) {
                    o(e);
                });
            });
        },
        getAllTeams: function(e, t, a, i) {
            var n = this;
            return new Promise(function(r, o) {
                n._loadData(e, t, a, i).then(function(e) {
                    r(e.teams);
                }).catch(function(e) {
                    o(e);
                });
            });
        },
        getDevices: function(e, t, a, i) {
            return new Promise(function(e, a) {
                h(t).then(function(t) {
                    if (t.complete) {
                        for (var a = [], i = 0; i < t.devices.length; ++i) {
                            var n = Object.create(null);
                            n.id = t.devices[i].id, n.fname = t.devices[i].name, n.ftype = "device", "我的电脑" == n.fname ? n.ficon = "/libs/img/device_pc.png" : n.ficon = "/libs/img/device_phone.png", 
                            n.mtime = t.devices[i].mtime, n.detail = t.devices[i].detail, a.push(n);
                        }
                        t.files = a;
                    } else t.files = [];
                    e(t);
                }).catch(function(e) {
                    a(e);
                });
            });
        },
        getDeviceFiles: function(e, t, a, i) {
            var n = this;
            return new Promise(function(r, o) {
                n._loadData(e, t, a, i).then(function(e) {
                    r(e);
                }).catch(function(e) {
                    o(e);
                });
            });
        },
        getSearchFiles: function(t, i, o, s) {
            var h = this;
            if (this.$data.searchname = i.searchname, m(a.globalData.user)) return new Promise(function(e, t) {
                n(i).then(function(t) {
                    if (i.searchname === h.$data.searchname) {
                        if (s) {
                            var a = h.getSearchTeams(i.searchname);
                            t = a.concat(t), h.$data.searchTeamCount = a.length;
                        }
                        e(h.fliterSearchResults(t));
                    }
                }).catch(function(e) {
                    t(e);
                });
            });
            if (s) {
                var f = {
                    searchname: this.$data.searchname,
                    include: "recent_members"
                };
                return new Promise(function(t, a) {
                    Promise.all([ n(i), r(f) ]).then(function(a) {
                        var n = e(a, 2), r = n[0], o = n[1].teams;
                        if (i.searchname === h.$data.searchname) {
                            if (r = h.fliterSearchResults(r), o.length > 0) {
                                o.sort(function(e, t) {
                                    return t.ctime - e.ctime;
                                });
                                var s = c.getCacheData(g.allTeam).teams, f = [];
                                o.forEach(function(e) {
                                    var t = l(e);
                                    s.find(function(t) {
                                        return t.id == e.id;
                                    }) || c.addData(g.allTeam, [ l(e) ]), t.highlight = e.highlight, t.path || (t.path = "协作"), 
                                    t.highlight && t.highlight.group_name && t.highlight.group_name.length > 0 && (t.highlight.group_name instanceof Array && (t.highlight.group_name = t.highlight.group_name[0]), 
                                    t.highlight.file_name && delete t.highlight.file_name), f.push(t);
                                }), h.$data.searchTeamCount = f.length, r = f.concat(r);
                            }
                            t(r);
                        }
                    }).catch(function(e) {
                        a(e);
                    });
                });
            }
            return new Promise(function(e, t) {
                n(i).then(function(t) {
                    i.searchname === h.$data.searchname && e(h.fliterSearchResults(t));
                }).catch(function(e) {
                    t(e);
                });
            });
        },
        getSearchTeams: function(e) {
            for (var t = c.getCacheData(g.allTeam).teams, a = [], i = t.length, n = 0; n < i; n++) {
                var r = t[n].fname.toLowerCase(), o = e.toLowerCase();
                if (-1 != r.indexOf(o)) {
                    var s = {};
                    for (var h in t[n]) s[h] = t[n][h];
                    var l = d(s.fname, e);
                    s.highlight = {
                        file_name: l
                    }, a.push(s);
                }
            }
            return a.sort(function(e, t) {
                return t.mtime - e.mtime;
            }), a;
        },
        fliterSearchResults: function(e) {
            return e.forEach(function(e, t, i) {
                if (e.highlight && e.highlight.creator_name) {
                    var n = e.highlight.creator_name[0];
                    n = (n = n.split("<em>").join("")).split("</em>").join(""), a.globalData.user && n === a.globalData.user.name && delete e.highlight.creator_name;
                }
                if (e.highlight && e.highlight.sharer_name) {
                    var r = e.highlight.sharer_name[0];
                    r = (r = r.split("<em>").join("")).split("</em>").join(""), a.globalData.user && r === a.globalData.user.name && delete e.highlight.sharer_name;
                }
                var o = e.highlight && e.highlight.file_name || e.fname;
                e.highlight ? e.highlight.file_name = o : e.highlight = {
                    file_name: o
                };
            }), e;
        },
        checkNoMore: function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
            if (this.$config.noPage) this.$data.noMore = !0; else {
                var t = this.getOffset(e);
                this.$data.noMore = this.$config.checkNoMore ? t < 20 : 0 === t;
            }
        },
        getOffset: function(e) {
            for (var t = this.$config, a = (t.param, t.offsetWithInFolder), i = e || this.getCacheData() || this.data.files || [], n = i.length, r = 0, o = 0; o < n && ("team" === i[o].ftype || "folder" === i[o].ftype && !a); o++) r = o + 1;
            return n - r;
        },
        getCacheData: function() {
            var e = this.$config.storeKey;
            if (e) {
                var t = c.getCacheData(e);
                return t.teams || t;
            }
            return null;
        },
        getMaxMtime: function(e) {
            var t = this.$config.storeKey, a = 0;
            if (t && t == g.recent) {
                var i = e || c.getCacheData(t) || this.data.files || [];
                i.length && i.length > 1 && (a = i[i.length - 1].mtime_recent);
            }
            return a;
        },
        showPlaceHolder: function(e) {
            var t = this;
            setTimeout(function() {
                t.setData({
                    showPlaceHolderDelayOut: !0
                });
            }, e);
        },
        captureTapFileItem: function(e) {
            if ("search" === this.properties.type) {
                var t = this.$data.searchname;
                t && o({
                    name: t
                });
            }
        }
    }
});