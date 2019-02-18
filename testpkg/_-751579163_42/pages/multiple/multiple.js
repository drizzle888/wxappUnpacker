var e = require("../../store/store.js"), t = e.StoreType, i = require("../../utils/util.js"), o = i.toast, s = i.gotoPage, a = i.getTeamRole, n = require("operate.js"), r = n.deleteRecent, c = n.deleteRoamings, l = n.deleteFiles, d = n.getRecents, f = n.getTeams, h = n.getFiles, u = n.getDeviceFiles, m = getApp();

Page({
    data: {
        from: "",
        files: [],
        selected: {},
        toView: "",
        loadMoreText: "正在加载…"
    },
    $data: {
        files: [],
        noMore: !1,
        isLoading: !1
    },
    onLoad: function(e) {},
    onReady: function() {
        var i = this.options, o = i.from, s = [], a = {};
        switch (o) {
          case "recent":
            s = e.getCacheData(t.recent);
            break;

          case "teams":
            s = e.getCacheData(t.myFile);
            break;

          case "files":
            s = e.getCacheData(t.subFile(i.groupid, i.parentid));
            break;

          case "deviceFiles":
            s = e.getCacheData(t.deviceFile(i.deviceid));
        }
        this.$data.files = s;
        var n = void 0, r = s.length;
        if (i.fid && r > 0) for (var c = 0; c < r; c++) {
            var l = s[c], d = l.id.toString();
            if (d === i.fid) {
                a[d] = l, n = "file_" + d, s = s.slice(0, c + 10);
                break;
            }
        }
        this.updateTitle(Object.keys(a).length);
        var f = {
            from: o,
            files: s,
            selected: a
        };
        n && (f.toView = n), this.setData(f), s.length === this.$data.files.length && this.loadMore();
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    loadMore: function() {
        var e = this;
        if (!this.$data.isLoading && !this.$data.noMore) {
            var t = this.$data.files.length, i = this.data.files.length;
            if (0 !== t && 0 !== i) {
                if (this.$data.isLoading = !0, this.setData({
                    loadMoreText: "正在加载…"
                }), i < t) {
                    var o = this.$data.files.slice(i, i + 20), s = this.data.files.concat(o);
                    return this.$data.isLoading = !1, void this.setData({
                        files: s,
                        loadMoreText: this.getLoadMoreText()
                    });
                }
                this.isFromRecent() ? d(20, this.data.files[i - 1].mtime_recent).then(function(t) {
                    e.onLoadSuccess(t);
                }).catch(function(t) {
                    e.onLoadError(t);
                }) : this.isFromTeams() ? f(20, this.getOffset(this.data.files)).then(function(t) {
                    e.onLoadSuccess(t);
                }).catch(function(t) {
                    e.onLoadError(t);
                }) : (this.isFromFiles() && h(this.options.groupid, this.options.parentid, 20, this.getOffset(this.data.files)).then(function(t) {
                    e.onLoadSuccess(t);
                }).catch(function(t) {
                    e.onLoadError(t);
                }), this.isFromDeviceFiles() && u(this.options.deviceid, 20, this.getOffset(this.data.files)).then(function(t) {
                    e.onLoadSuccess(t);
                }).catch(function(t) {
                    e.onLoadError(t);
                }));
            }
        }
    },
    onLoadSuccess: function(e) {
        this.$data.isLoading = !1, this.checkNoMore(e), 0 === e.length ? this.setData({
            loadMoreText: this.getLoadMoreText()
        }) : (e = this.data.files.concat(e), this.setData({
            files: e,
            loadMoreText: this.getLoadMoreText()
        }));
    },
    onLoadError: function(e) {
        this.$data.isLoading = !1;
        var t = e.result, i = e.msg;
        o("文件列表加载失败：" + (i || t));
    },
    checkNoMore: function(e) {
        this.$data.noMore = this.isFromRecent() ? 0 === e.length : this.getOffset(e) < 20;
    },
    getOffset: function(e) {
        var t = 0, i = !0, o = !1, s = void 0;
        try {
            for (var a, n = e[Symbol.iterator](); !(i = (a = n.next()).done); i = !0) {
                var r = a.value;
                if ("team" !== r.ftype && "folder" !== r.ftype) break;
                t++;
            }
        } catch (e) {
            o = !0, s = e;
        } finally {
            try {
                !i && n.return && n.return();
            } finally {
                if (o) throw s;
            }
        }
        return e.length - t;
    },
    getLoadMoreText: function() {
        return this.$data.noMore ? this.isFromRecent() ? "无更早的记录" : "无更多文档" : "";
    },
    updateTitle: function(e) {
        wx.setNavigationBarTitle({
            title: "已选中" + e + "项"
        });
    },
    isFromRecent: function() {
        return "recent" === this.options.from;
    },
    isFromTeams: function() {
        return "teams" === this.options.from;
    },
    isFromFiles: function() {
        return "files" === this.options.from;
    },
    isFromDeviceFiles: function() {
        return "deviceFiles" === this.options.from;
    },
    tapFileItem: function(e) {
        var t = e.currentTarget.dataset.index, i = this.data.files.slice(t, t + 1)[0];
        if ("team" !== i.ftype) {
            var s = i.id.toString(), a = this.data.selected;
            a[s] ? delete a[s] : a[s] = i, this.updateTitle(Object.keys(a).length), this.setData({
                selected: a
            });
        } else o("共享文件夹暂不支持多选");
    },
    tapMove: function() {
        if (!this.isFromRecent()) {
            var i = Object.values(this.data.selected);
            if (0 !== i.length) {
                m.stat("more_multiselect_move_click");
                var o = [], n = !0, r = !1, c = void 0;
                try {
                    for (var l, d = i[Symbol.iterator](); !(n = (l = d.next()).done); n = !0) {
                        var f = l.value, h = {
                            fid: f.id,
                            gid: f.groupid,
                            pid: f.parentid,
                            fname: encodeURIComponent(f.fname),
                            ftype: f.ftype
                        };
                        o.push(h);
                    }
                } catch (e) {
                    r = !0, c = e;
                } finally {
                    try {
                        !n && d.return && d.return();
                    } finally {
                        if (r) throw c;
                    }
                }
                var u = {
                    aimFiles: o,
                    opttype: "multiMove"
                };
                if (this.isFromFiles()) {
                    var g = this.options, v = g.groupid;
                    g.parentid;
                    v != e.getCacheData(t.allTeam).mine.id && "member" === a(e, v) && (u.gid = v, u.fid = 0, 
                    u.ftype = "team", u.toastMsg = encodeURIComponent("普通成员仅可在目录内移动文件(夹)"));
                }
                s("select", u, !1);
            }
        }
    },
    tapDelete: function() {
        var e = this, t = Object.values(this.data.selected);
        if (0 !== t.length) if (m.stat("more_multiselect_delete_click"), this.isFromRecent()) {
            var i = [ "仅清除打开记录", "删除" ];
            wx.showActionSheet({
                itemList: i,
                success: function(o) {
                    switch (i[o.tapIndex]) {
                      case "仅清除打开记录":
                        m.stat("more_multiselect_delete_record_click"), e._delRoamings(t);
                        break;

                      case "删除":
                        m.stat("more_multiselect_delete_delete_click"), e._doDel(t);
                    }
                }
            });
        } else wx.showModal({
            title: "删除 已选 " + t.length + " 项",
            content: "请确认删除已选择的文件",
            confirmText: "删除",
            confirmColor: "#e64340",
            success: function(i) {
                i.confirm && e._doDel(t);
            }
        });
    },
    _doDel: function(e) {
        this.isFromRecent() ? (this.showDelLoading(), this._delRecent(e)) : this._delTeams(e);
    },
    _delRoamings: function(e) {
        var t = this, i = e.map(function(e) {
            return Number(e.id);
        });
        this.showDelLoading(), c(i).then(function() {
            t.delSuccess();
        }).catch(function(e) {
            wx.hideLoading();
            var t = e.msg, i = e.faillist, s = i && i[0].msg;
            o("" + (t || s || "连接失败"));
        });
    },
    _delRecent: function(e) {
        var t = this;
        if (0 !== e.length) {
            for (var i = []; e.length > 0; ) {
                var s = e.shift();
                if (i.push(r(s.groupid, s.id, s.fname)), 5 === i.length) break;
            }
            Promise.all(i).then(function(i) {
                var s = !0, a = !1, n = void 0;
                try {
                    for (var r, c = i[Symbol.iterator](); !(s = (r = c.next()).done); s = !0) {
                        var l = r.value;
                        if ("ok" !== l.result) return wx.hideLoading(), void o("网络异常" === l.result ? "网络异常" : "删除失败", {
                            icon: "none"
                        }, t.goback);
                    }
                } catch (e) {
                    a = !0, n = e;
                } finally {
                    try {
                        !s && c.return && c.return();
                    } finally {
                        if (a) throw n;
                    }
                }
                t._delRecent(e);
            });
        } else this.delSuccess();
    },
    _delTeams: function(e) {
        var t = this, i = Number(e[0].groupid), s = e.map(function(e) {
            return Number(e.id);
        });
        this.showDelLoading(), l(i, s).then(function() {
            m.stat("more_multiselect_delete_click_success", {
                type: "实体"
            }), t.delSuccess();
        }).catch(function(e) {
            wx.hideLoading();
            var i = e.msg, s = e.faillist, a = e.result, n = s && s[0].msg, r = "" + (i || n || "连接失败");
            m.stat("more_multiselect_delete_click_fail", {
                errorCode: a,
                type: "实体"
            }), e.progressErr ? o(r, {}, t.goback) : o(r);
        });
    },
    showDelLoading: function() {
        wx.showLoading({
            title: "正在删除",
            mask: !0
        });
    },
    delSuccess: function() {
        wx.hideLoading(), this.goback();
    },
    goback: function() {
        wx.navigateBack({
            delta: 1
        });
    },
    tapMyDevice: function() {
        o("我的设备暂不支持多选");
    }
});