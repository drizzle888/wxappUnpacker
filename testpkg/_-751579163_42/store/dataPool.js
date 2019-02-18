function t(t) {
    if (Array.isArray(t)) {
        for (var a = 0, i = Array(t.length); a < t.length; a++) i[a] = t[a];
        return i;
    }
    return Array.from(t);
}

function a() {
    this.files = {
        _instance: new i(),
        mine: new r(),
        recent: new r(),
        myFile: new n()
    }, this.groups = new e(), this.logs = new s();
}

function i() {
    this.data = {};
}

function r() {
    this.dirty = !0, this.data = [];
}

function n() {}

function e() {
    this.dirty = !0, this.data = {
        mine: {},
        teams: [],
        auto: {}
    };
}

function s() {
    this.data = [];
}

var o = Object.assign || function(t) {
    for (var a = 1; a < arguments.length; a++) {
        var i = arguments[a];
        for (var r in i) Object.prototype.hasOwnProperty.call(i, r) && (t[r] = i[r]);
    }
    return t;
};

i.prototype = {
    setData: function(t) {
        var a = this.data[t.id];
        this.data[t.id] = o({}, a, t);
    },
    delData: function(t) {
        var a = t.id, i = t.ids;
        if (a) this._del(a); else if (i) {
            var r = !0, n = !1, e = void 0;
            try {
                for (var s, o = i[Symbol.iterator](); !(r = (s = o.next()).done); r = !0) {
                    var d = s.value;
                    this._del(d);
                }
            } catch (t) {
                n = !0, e = t;
            } finally {
                try {
                    !r && o.return && o.return();
                } finally {
                    if (n) throw e;
                }
            }
        }
    },
    _del: function(t) {
        var a = this.data[t];
        if (h.files.mine.delData({
            id: t
        }), h.files.recent.delData({
            id: t
        }), a) {
            var i = a.groupid, r = a.parentid, n = h.files[i + "_" + r];
            n && n.delData({
                id: t
            }), delete this.data[t];
        }
    },
    updateData: function(t) {
        var a = t.file;
        if (a) {
            var i = this.data[a.id];
            i && (this.data[a.id] = o({}, i, a));
        }
    }
}, r.prototype = {
    setDirty: function() {
        this.dirty = !0;
    },
    isDirty: function() {
        return this.dirty;
    },
    isEmpty: function() {
        return 0 === this.data.length;
    },
    getData: function() {
        return u(this.data);
    },
    setData: function(t) {
        this.data = [];
        var a = !0, i = !1, r = void 0;
        try {
            for (var n, e = t[Symbol.iterator](); !(a = (n = e.next()).done); a = !0) {
                var s = n.value;
                this.data.push(s.id), h.files._instance.setData(s);
            }
        } catch (t) {
            i = !0, r = t;
        } finally {
            try {
                !a && e.return && e.return();
            } finally {
                if (i) throw r;
            }
        }
        this.dirty = !1;
    },
    addData: function(t, a) {
        var i, r, n = [], e = !0, s = !1, o = void 0;
        try {
            for (var d, u = t[Symbol.iterator](); !(e = (d = u.next()).done); e = !0) {
                var f = d.value;
                n.push(f.id), h.files._instance.setData(f);
            }
        } catch (t) {
            s = !0, o = t;
        } finally {
            try {
                !e && u.return && u.return();
            } finally {
                if (s) throw o;
            }
        }
        a ? (i = this.data).unshift.apply(i, n) : (r = this.data).push.apply(r, n);
    },
    clearData: function() {
        this.data = [];
    },
    delData: function(t) {
        var a = t.id, i = t.ids;
        if (a) this._del(a); else if (i) {
            var r = !0, n = !1, e = void 0;
            try {
                for (var s, o = i[Symbol.iterator](); !(r = (s = o.next()).done); r = !0) {
                    var d = s.value;
                    this._del(d);
                }
            } catch (t) {
                n = !0, e = t;
            } finally {
                try {
                    !r && o.return && o.return();
                } finally {
                    if (n) throw e;
                }
            }
        }
    },
    _del: function(t) {
        for (var a = 0, i = this.data.length; a < i; a++) if (this.data[a] == t) {
            this.data.splice(a, 1);
            break;
        }
    }
}, n.prototype = {
    isDirty: function() {
        return h.files.mine.isDirty() || h.groups.isDirty();
    },
    isEmpty: function() {
        return 0 === this.getData().length;
    },
    getData: function() {
        var t = h.files.mine.getData(), a = [], i = [];
        return h.groups.data.teams.forEach(function(t) {
            "creator" === t.user_role && a.push(t);
        }), t.forEach(function(t) {
            "folder" === t.ftype ? a.push(t) : i.push(t);
        }), a.sort(d), [].concat(a, i);
    },
    addData: function(t, a) {
        h.files.mine.addData(t, a);
    }
}, e.prototype = {
    setDirty: function() {
        this.dirty = !0;
    },
    isDirty: function() {
        return this.dirty;
    },
    isEmpty: function() {
        return 0 === this.data.teams.length && !this.data.mine.id && !this.data.auto.id;
    },
    getData: function() {
        return this.data;
    },
    setData: function(a) {
        var i = a.mine, r = a.teams, n = a.auto;
        i && (this.data.mine = i), n && (this.data.auto = n), r && (this.data.teams = [].concat(t(r))), 
        this.dirty = !1;
    },
    addData: function(a, i) {
        var r, n;
        i ? (r = this.data.teams).unshift.apply(r, t(a)) : (n = this.data.teams).push.apply(n, t(a));
    },
    clearData: function() {
        this.data.mine = {}, this.data.auto = {}, this.data.teams = [];
    },
    delData: function(t) {
        var a = t.id, i = t.ids;
        if (a) this._del(a); else if (i) {
            var r = !0, n = !1, e = void 0;
            try {
                for (var s, o = i[Symbol.iterator](); !(r = (s = o.next()).done); r = !0) {
                    var d = s.value;
                    this._del(d);
                }
            } catch (t) {
                n = !0, e = t;
            } finally {
                try {
                    !r && o.return && o.return();
                } finally {
                    if (n) throw e;
                }
            }
        }
    },
    _del: function(t) {
        for (var a = 0, i = this.data.teams.length; a < i; a++) if (this.data.teams[a].id == t) {
            this.data.teams.splice(a, 1);
            break;
        }
    },
    updateData: function(t) {
        var a = t.team;
        if (a) for (var i = 0, r = this.data.teams.length; i < r; i++) {
            var n = this.data.teams[i];
            if (n.id == a.id) {
                var e = Math.max(n.mtime || 0, a.mtime || 0);
                this.data.teams[i] = o({}, n, a), this.data.teams[i].mtime = e;
                break;
            }
        }
    }
}, s.prototype = {
    isEmpty: function() {
        return 0 === this.data.length;
    },
    getData: function() {
        return [].concat(t(this.data));
    },
    setData: function(a) {
        this.data = [].concat(t(a));
    },
    addData: function(a) {
        var i;
        for ((i = this.data).push.apply(i, t(a)); this.data.length > 30; ) this.data.shift();
    },
    clearData: function() {
        this.data = [];
    }
};

var d = function(t, a) {
    return a.mtime - t.mtime;
}, u = function(t) {
    var a = [], i = !0, r = !1, n = void 0;
    try {
        for (var e, s = t[Symbol.iterator](); !(i = (e = s.next()).done); i = !0) !function() {
            var t = e.value, i = h.files._instance.data[t];
            i || (i = h.groups.data.teams.find(function(a) {
                return a.id === t;
            })), i && a.push(i);
        }();
    } catch (t) {
        r = !0, n = t;
    } finally {
        try {
            !i && s.return && s.return();
        } finally {
            if (r) throw n;
        }
    }
    return a;
}, f = function(t) {
    var a = t.split("|");
    if (1 === a.length) return h[a[0]];
    var i = h[a[0]][a[1]];
    return i || (i = new r(), h[a[0]][a[1]] = i), i;
}, h = new a();

module.exports = {
    reset: function() {
        var t = h.logs.getData();
        (h = new a()).logs.setData(t);
    },
    isEmpty: function(t) {
        var a = f(t);
        return a.isEmpty && a.isEmpty();
    },
    getData: function(t) {
        var a = f(t);
        return a.getData && a.getData() || [];
    },
    setData: function(t, a) {
        var i = f(t);
        i.setData && i.setData(a);
    },
    addData: function(t, a, i) {
        var r = f(t);
        r.addData && r.addData(a, i);
    },
    clearData: function(t) {
        var a = f(t);
        a.clearData && a.clearData();
    },
    setDirty: function(t) {
        var a = f(t);
        a.setDirty && a.setDirty();
    },
    isDirty: function(t) {
        var a = f(t);
        return a.isDirty && a.isDirty();
    },
    delData: function(t, a) {
        var i = f(t);
        i.delData && i.delData(a);
    },
    updateData: function(t, a) {
        var i = f(t);
        i.updateData && i.updateData(a);
    }
};