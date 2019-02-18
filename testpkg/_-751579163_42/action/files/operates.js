var n = require("../../store/store.js"), a = n.StoreType, i = require("index.js"), r = i.fetchFiles, t = i.batchProgress, e = require("../groups/index.js"), s = e.createTeam, o = e.formatTeam, f = require("operate.js"), u = f.moveFile, c = f.delFile, d = function() {
    var n = this;
    this.startLoad = function(a) {
        var i = a.gid, t = a.pid;
        return new Promise(function(a, e) {
            !function a(i, t, e) {
                var s = i.gid, o = i.pid;
                r({
                    count: n.innerParams.loadCount,
                    offset: n.innerParams.loadOffset,
                    groupid: s,
                    parentid: o
                }).then(function(i) {
                    var r = i.map(function(n) {
                        return n.id;
                    });
                    n.outputs.fids = n.outputs.fids.concat(r), r.length < n.innerParams.loadCount ? t(n.outputs.fids) : (n.innerParams.loadOffset += n.innerParams.loadCount, 
                    a({
                        gid: s,
                        pid: o
                    }, t, e));
                }).catch(function(n) {
                    e(n);
                });
            }({
                gid: i,
                pid: t
            }, a, e);
        });
    }, this.innerParams = {
        loadCount: 20,
        loadOffset: 0
    }, this.outputs = {
        fids: []
    };
}, l = function() {
    var i = this;
    this.registerCallback = function(n) {
        for (var a = 0, r = i.innerParams.callbacks.length; a < r; ++a) if (i.innerParams.callbacks[a] === n) return;
        i.innerParams.callbacks.push(n);
    }, this.notifyCallbacks = function(n, a) {
        for (var r = 0; r < i.innerParams.callbacks.length; ++r) n ? i.innerParams.callbacks[r].resolve(a) : i.innerParams.callbacks[r].reject(a), 
        i.innerParams.callbacks.splice(r, 1);
    }, this.startOrRetryWork = function() {
        if (i.innerParams.workingStepOffset >= i.workingSteps.length) i.notifyCallbacks(!0, i.outputs.targetGroup); else {
            if (i.innerParams.isWorking) return;
            i.innerParams.isWorking = !0;
            !function n() {
                i.workingSteps[i.innerParams.workingStepOffset](function() {
                    i.innerParams.workingStepOffset++, i.innerParams.workingStepOffset >= i.workingSteps.length ? (i.notifyCallbacks(!0, i.outputs.targetGroup), 
                    i.innerParams.isWorking = !1) : n();
                }, function(n) {
                    i.notifyCallbacks(!1, n), i.innerParams.isWorking = !1;
                });
            }();
        }
    }, this.workingSteps = [ function(n, a) {
        new d().startLoad({
            gid: i.params.gid,
            pid: i.params.fid
        }).then(function(a) {
            i.innerParams.folderSubFids = a, n();
        }).catch(function(n) {
            a(n);
        });
    }, function(r, t) {
        s(i.params.fname).then(function(t) {
            var e = o(t);
            n.addData(a.allTeam, [ e ]), i.outputs.targetGroup = e, r();
        }).catch(function(n) {
            t(n);
        });
    }, function(r, t) {
        0 != i.innerParams.folderSubFids.length ? u({
            fileids: i.innerParams.folderSubFids,
            groupid: i.params.gid,
            target_groupid: i.outputs.targetGroup.id,
            target_parentid: 0
        }).then(function(t) {
            n.setDirty(a.subFile(i.outputs.targetGroup.id, i.params.fid)), i.innerParams.movingFileTaskId = t.taskid, 
            r();
        }).catch(function(n) {
            t(n);
        }) : r();
    }, function(n, a) {
        if (i.innerParams.movingFileTaskId) {
            !function n(a, r) {
                t(i.params.gid, i.innerParams.movingFileTaskId).then(function(t) {
                    t.done ? (delete i.innerParams.movingFileTaskId, a()) : setTimeout(function() {
                        n(a, r);
                    }, 1e3);
                }).catch(function(n) {
                    r(n);
                });
            }(n, a);
        } else n();
    }, function(r, t) {
        c(i.params.gid, i.params.fid).then(function(r) {
            n.delData(a.file, {
                id: i.params.fid
            });
        }).catch(function(n) {}), r();
    } ], this.params = {
        gid: "",
        fid: "",
        fname: ""
    }, this.innerParams = {
        isWorking: !1,
        workingStepOffset: 0,
        folderSubFids: [],
        movingFileTaskId: "",
        callbacks: []
    }, this.outputs = {
        targetGroup: {}
    };
}, p = new function() {
    var n = this;
    this.dispatchWorker = function(a, i) {
        var r = a.gid, t = a.fid, e = a.fname, s = void 0;
        n.transferingMap.has(t) ? s = n.transferingMap.get(t) : ((s = new l()).params.gid = r, 
        s.params.fid = t, n.transferingMap.set(t, s)), s.params.fname = e, s.registerCallback(i), 
        s.startOrRetryWork();
    }, this.transferingMap = new Map();
}();

module.exports = {
    folderTransferToGroup: function(n, a) {
        var i = n.gid, r = n.fid, t = n.fname;
        p.dispatchWorker({
            gid: i,
            fid: r,
            fname: t
        }, a);
    }
};