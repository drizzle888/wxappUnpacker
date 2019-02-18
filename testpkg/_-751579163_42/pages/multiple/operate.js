var e = require("../../action/files/operate.js"), t = e.delRoaming, i = e.delRoamings, n = e.delFile, c = e.batchDelFile, r = require("../../action/files/index.js").batchProgress, o = require("../../store/store.js"), l = o.StoreType, u = getApp(), s = function e(t, i, n, c, o) {
    r(t, i).then(function(r) {
        r.done ? (a(t, n), c()) : setTimeout(function() {
            e(t, i, n, c, o);
        }, 1e3);
    }).catch(function(e) {
        a(t, n), e.progressErr = !0, o(e);
    });
}, a = function(e, t) {
    var i = !0, n = !1, c = void 0;
    try {
        for (var r, u = t[Symbol.iterator](); !(i = (r = u.next()).done); i = !0) {
            var s = r.value, a = o.getCacheData(l.file, {
                id: s
            });
            a && a.deviceid && o.setDirty(l.deviceFile(a.deviceid)), o.setDirty(l.subFile(e, s)), 
            o.delData(l.file, {
                id: s
            });
        }
    } catch (e) {
        n = !0, c = e;
    } finally {
        try {
            !i && u.return && u.return();
        } finally {
            if (n) throw c;
        }
    }
};

module.exports = {
    deleteRecent: function(e, i) {
        return new Promise(function(c, r) {
            n(e, i).then(function(e) {
                u.stat("more_multiselect_delete_click_success", {
                    type: "实体"
                }), o.delData(l.file, {
                    id: i
                }), c({
                    result: "ok"
                });
            }).catch(function(e) {
                u.stat("more_multiselect_delete_click_fail", {
                    errorCode: e.result,
                    type: "实体"
                }), t(i).then(function(e) {
                    u.stat("more_multiselect_delete_click_success", {
                        type: "记录"
                    }), o.delData(l.recent, {
                        id: i
                    }), c({
                        result: "ok"
                    });
                }).catch(function(e) {
                    u.stat("more_multiselect_delete_click_fail", {
                        errorCode: e.result,
                        type: "记录"
                    }), c({
                        result: e.result
                    });
                });
            });
        });
    },
    deleteRoamings: function(e) {
        return new Promise(function(t, n) {
            i(e).then(function(i) {
                u.stat("more_multiselect_delete_click_success", {
                    type: "记录"
                }), o.delData(l.recent, {
                    ids: e
                }), t();
            }).catch(function(e) {
                u.stat("more_multiselect_delete_click_fail", {
                    errorCode: e.result,
                    type: "记录"
                }), n(e);
            });
        });
    },
    deleteFiles: function(e, t) {
        return new Promise(function(i, n) {
            c(e, t).then(function(c) {
                c.taskid ? s(e, c.taskid, t, i, n) : (a(e, t), i());
            }).catch(function(e) {
                n(e);
            });
        });
    },
    getRecents: function(e, t) {
        return new Promise(function(i, n) {
            var c = {
                count: e,
                max_mtime: t,
                allowCache: !1
            };
            o.getMoreData(l.recent, c).then(function(e) {
                i(e.files);
            }).catch(function(e) {
                n(e);
            });
        });
    },
    getTeams: function(e, t) {
        return new Promise(function(i, n) {
            var c = {
                count: e,
                offset: t,
                filter: "file"
            };
            o.getMoreData(l.myFile, c).then(function(e) {
                i(e);
            }).catch(function(e) {
                n(e);
            });
        });
    },
    getFiles: function(e, t, i, n) {
        return new Promise(function(c, r) {
            var u = {
                groupid: e,
                parentid: t,
                count: i,
                offset: n,
                filter: "file"
            };
            o.getMoreData(l.subFile(e, t), u).then(function(e) {
                c(e);
            }).catch(function(e) {
                r(e);
            });
        });
    },
    getDeviceFiles: function(e, t, i) {
        return new Promise(function(n, c) {
            var r = {
                deviceid: e,
                count: t,
                offset: i,
                filter: "file"
            };
            o.getMoreData(l.deviceFile(e), r).then(function(e) {
                n(e);
            }).catch(function(e) {
                c(e);
            });
        });
    }
};