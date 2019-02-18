var e = require("../../action/files/operate.js").moveFile, t = require("../../action/files/index.js").batchProgress, r = require("../../store/store.js"), i = r.StoreType, n = function e(r, i, n, a, c, u, l) {
    t(r, i).then(function(t) {
        t.done ? (o(r, n, a, c), u()) : setTimeout(function() {
            e(r, i, n, a, c, u, l);
        }, 1e3);
    }).catch(function(e) {
        o(r, n, a, c), e.progressErr = !0, l(e);
    });
}, o = function(e, t, n, o) {
    a(t);
    var c = !0, u = !1, l = void 0;
    try {
        for (var f, s = t[Symbol.iterator](); !(c = (f = s.next()).done); c = !0) {
            var d = f.value, v = r.getCacheData(i.file, {
                id: d
            });
            v && v.deviceid && r.setDirty(i.deviceFile(v.deviceid)), r.setDirty(i.subFile(e, d)), 
            r.delData(i.file, {
                id: d
            });
        }
    } catch (e) {
        u = !0, l = e;
    } finally {
        try {
            !c && s.return && s.return();
        } finally {
            if (u) throw l;
        }
    }
    r.setDirty(i.subFile(o, n));
}, a = function(e) {
    var t = r.getCacheData(i.recent);
    if (t) {
        var n = !0, o = !1, a = void 0;
        try {
            for (var c, u = t[Symbol.iterator](); !(n = (c = u.next()).done); n = !0) {
                var l = c.value, f = !0, s = !1, d = void 0;
                try {
                    for (var v, y = e[Symbol.iterator](); !(f = (v = y.next()).done); f = !0) {
                        var h = v.value;
                        if (l.id == h) return void r.setDirty(i.recent);
                    }
                } catch (e) {
                    s = !0, d = e;
                } finally {
                    try {
                        !f && y.return && y.return();
                    } finally {
                        if (s) throw d;
                    }
                }
            }
        } catch (e) {
            o = !0, a = e;
        } finally {
            try {
                !n && u.return && u.return();
            } finally {
                if (o) throw a;
            }
        }
    }
};

module.exports = {
    moveFiles: function(t, r, i, a) {
        return new Promise(function(c, u) {
            e({
                groupid: t,
                fileids: r,
                target_parentid: i,
                target_groupid: a
            }).then(function(e) {
                e.taskid ? n(t, e.taskid, r, i, a, c, u) : (o(t, r, i, a), c());
            }).catch(function(e) {
                u(e);
            });
        });
    }
};