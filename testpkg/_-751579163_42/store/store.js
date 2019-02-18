var e = require("../action/recent/index.js"), t = e.fetchRecents, n = e.openRoamingSwitch, i = require("../action/files/index.js"), r = i.fetchFiles, o = i.getMines, a = i.getFirstPageFiles, s = i.fetchDeviceFiles, c = require("../action/groups/index.js").fetchGroups, l = require("dataPool.js"), u = require("../utils/util.js").pathtxt, f = {
    file: {
        storeKey: "files|_instance"
    },
    recent: {
        firstPageFn: "_getRecentFiles",
        morePageFn: "_getRecentFiles",
        storeKey: "files|recent"
    },
    myFile: {
        firstPageFn: "_getAllFiles",
        morePageFn: "_getMineFiles",
        storeKey: "files|myFile"
    },
    mineFile: {
        firstPageFn: "_getMineFiles",
        morePageFn: "_getMineFiles",
        storeKey: "files|mine"
    },
    subFile: function(e, t) {
        return e || t ? 0 == t && e == l.getData(f.allTeam.storeKey).mine.id ? f.mineFile : {
            firstPageFn: "_getGroupFiles",
            morePageFn: "_getGroupFiles",
            storeKey: "files|" + e + "_" + t
        } : {};
    },
    allTeam: {
        firstPageFn: "_getAllTeams",
        storeKey: "groups"
    },
    log: {
        storeKey: "logs"
    },
    deviceFile: function(e) {
        return e ? {
            firstPageFn: "_getDeviceFiles",
            morePageFn: "_getDeviceFiles",
            storeKey: "files|device_" + e
        } : {};
    }
}, g = function(e) {
    l.clearData(e.storeKey);
}, F = function(e, t) {
    var n = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2];
    l.addData(e.storeKey, t, n);
}, h = {
    _getRecentFiles: function(e) {
        return new Promise(function(i, r) {
            var o = !!e.allowCache;
            delete e.allowCache, t(e, o).then(function(e) {
                var t = e.recents, n = e.cache;
                i({
                    files: t,
                    cache: n
                });
            }).catch(function(e) {
                "roamingSwitchOff" === e.result && n({
                    userid: app.globalData.user.id
                }), r(e);
            });
        });
    },
    _getAllFiles: function(e) {
        return new Promise(function(t, n) {
            a(e).then(function(e) {
                var n = e.mines, i = e.groups;
                l.setData(f.mineFile.storeKey, n), l.setData(f.allTeam.storeKey, i), t(l.getData(f.myFile.storeKey));
            }).catch(function(e) {
                n(e);
            });
        });
    },
    _getGroupFiles: function(e) {
        return new Promise(function(t, n) {
            r(e).then(function(e) {
                t(e);
            }).catch(function(e) {
                n(e);
            });
        });
    },
    _getMineFiles: function(e) {
        return new Promise(function(t, n) {
            o(e).then(function(e) {
                t(e);
            }).catch(function(e) {
                n(e);
            });
        });
    },
    _getAllTeams: function(e) {
        return new Promise(function(e, t) {
            c().then(function(t) {
                e(t);
            }).catch(function(e) {
                t(e);
            });
        });
    },
    _getDeviceFiles: function(e) {
        return new Promise(function(t, n) {
            s(e).then(function(e) {
                for (var n = 0; n < e.length; ++n) !e[n].fsrc && e[n].roaming_info && e[n].roaming_info.path && (e[n].fsrc = u(e[n].roaming_info.path));
                t(e);
            }).catch(function(e) {
                n(e);
            });
        });
    }
};

module.exports = {
    StoreType: f,
    getData: function(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
        return new Promise(function(i, r) {
            if (!n && !l.isDirty(e.storeKey)) {
                var o = l.getData(e.storeKey);
                if (!l.isEmpty(e.storeKey)) return void i(o);
            }
            e.firstPageFn ? h[e.firstPageFn](t).then(function(t) {
                var n = t.files;
                n || (n = t), l.setData(e.storeKey, n), i(t);
            }).catch(function(e) {
                r(e);
            }) : i([]);
        });
    },
    getMoreData: function(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        return new Promise(function(n, i) {
            e.morePageFn ? h[e.morePageFn](t).then(function(t) {
                var i = t.files;
                i || (i = t), F(e, i, !1), n(t);
            }).catch(function(e) {
                i(e);
            }) : n([]);
        });
    },
    getCacheData: function(e) {
        return l.getData(e.storeKey);
    },
    clearData: g,
    setDirty: function(e) {
        (!(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1]) && g(e), l.setDirty(e.storeKey);
    },
    delData: function(e, t) {
        l.delData(e.storeKey, t);
    },
    updateData: function(e, t) {
        l.updateData(e.storeKey, t);
    },
    addData: F,
    reset: function() {
        l.reset();
    }
};