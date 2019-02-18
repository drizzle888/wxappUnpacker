var t = getApp(), e = require("../../store/store.js"), i = e.StoreType, s = require("../../config/index.js").appShareInfo, a = require("../../action/files/index.js"), n = a.createFile, o = a.fileMetadata, r = require("../../action/files/operate.js"), l = r.copyFile, c = r.moveFile, f = require("operate.js").moveFiles, u = require("../../utils/util.js"), d = u.showLoading, h = u.gotoPage, p = u.hideLoading, m = u.toast, g = u.decode, v = u.noExtName;

Page({
    data: {
        ready: !1,
        loadMoreText: "",
        emptyText: "",
        btnDisable: !0,
        btnLoading: !1,
        btnTexts: [],
        allTeamsVisible: !0,
        showSelect: !1,
        selectedIndexs: []
    },
    $data: {
        noMore: !1,
        isLoadingMore: !1,
        offset: 0,
        path: "",
        firstShow: !0,
        selectedFiles: []
    },
    getConfig: function(t) {
        return {
            save: {
                btnTexts: [ "另存至当前位置" ],
                optBtnTapFn: [ "save" ]
            },
            copy: {
                btnTexts: [ "复制至当前位置" ],
                optBtnTapFn: [ "copy" ]
            },
            move: {
                btnTexts: [ "移动至当前位置" ],
                optBtnTapFn: [ "move" ]
            },
            multiMove: {
                btnTexts: [ "移动至当前位置" ],
                optBtnTapFn: [ "multiMove" ]
            },
            saveAndEdit: {
                btnTexts: [ "保存并编辑" ],
                optBtnTapFn: [ "saveAndEdit" ]
            },
            externSelectFile: {
                btnTexts: [ "选择文件上传" ],
                optBtnTapFn: [ "externSelectFile" ],
                showSingleSelect: !0
            },
            externMultiSelectFile: {
                btnTexts: [ "选择文件上传" ],
                optBtnTapFn: [ "externMultiSelectFile" ],
                showMultiSelect: !0
            },
            copyOrMove: {
                btnTexts: [ "复制", "移动" ],
                optBtnTapFn: [ "copy", "move" ]
            }
        }[t.opttype];
    },
    onLoad: function(e) {
        this.$config = this.getConfig(e);
        var i = this.$config, s = i.btnTexts, a = i.showSingleSelect, n = i.showMultiSelect;
        this.setData({
            btnTexts: s,
            showSelect: !(!a && !n)
        });
        var o = this.options, r = o.path, l = o.from;
        this.options.aimFile ? this.$data.aimFile = JSON.parse(this.options.aimFile) : this.options.aimFiles && (this.$data.aimFiles = JSON.parse(this.options.aimFiles)), 
        this.$data.firstShow = !0, void 0 !== r && (this.$data.path = r), this.checkSaveBtnAndTips(), 
        t.callAfterLogin(this.initFileList.bind(this)), e.toastMsg && (m(g(e.toastMsg)), 
        delete this.options.toastMsg), this.isFromWebOffice() ? t.stat("preview_preserve_visit") : l && t.stat("select_visit", {
            from: l
        });
    },
    onShow: function() {
        this.$data.firstShow || t.isLogined() || t.isAuthorized() || getCurrentPages().length > 1 && wx.navigateBack({
            delta: 1
        }), this.$data.firstShow && (this.$data.firstShow = !1);
    },
    onReady: function() {
        if (this.$data.aimFile) {
            var t = this.$data.aimFile, e = t.fname, i = t.ftype;
            e && wx.setNavigationBarTitle({
                title: g(v(e, i))
            });
        } else this.$data.aimFiles && wx.setNavigationBarTitle({
            title: "已选中" + this.$data.aimFiles.length + "项"
        });
    },
    initFileList: function() {
        var t = this, e = this.options, i = e.gid, s = e.fid, a = e.ftype;
        e.type;
        this.$fileList = this.selectComponent("#filelist"), "allTeams" === a ? this.$fileList.init({
            type: "allTeams"
        }) : "folder" === a || "team" === a ? this.$fileList.init({
            gid: i,
            pid: s,
            type: "file"
        }) : this.$fileList.init({
            gid: i,
            pid: s,
            type: "all"
        }, !0, 10, function() {
            t.$fileList.reflesh(!1);
        });
    },
    onloadStatusChange: function(t) {
        var s = this.options, a = s.gid, n = (s.fid, s.ftype, t.detail.status);
        "loaded" === n ? (a || (this.options.gid = e.getCacheData(i.allTeam).mine.id, this.options.fid = 0), 
        this.checkSaveBtnAndTips(), p()) : "loading" === n && d();
    },
    isMyFile: function() {
        return !this.options.ftype;
    },
    onPullDownRefresh: function() {
        this.$fileList.firstPage({}, function() {
            wx.stopPullDownRefresh();
        });
    },
    onReachBottom: function() {
        this.$fileList.morePage();
    },
    onShareAppMessage: function() {
        return s;
    },
    checkSaveBtnAndTips: function() {
        var t = this.options, e = t.gid, i = t.fid, s = t.opttype, a = t.ftype, n = !1;
        ("allTeams" === a || this.$data.aimFile && this.$data.aimFile.gid == e && this.$data.aimFile.pid == i && "save" == s) && (n = !0);
        var o = !a || "all" === a;
        this.setData({
            btnDisable: n,
            allTeamsVisible: o
        });
    },
    fileItemTap: function(t) {
        var s = t.detail, a = s.groupid, n = s.fid, o = s.ftype, r = s.fname, l = s.type;
        r = r ? encodeURIComponent(r) : r;
        var c = this.options.opttype;
        if (-1 !== "team".indexOf(o) ? n = 0 : -1 !== "all".indexOf(o) && (a = e.getCacheData(i.allTeam).mine.id, 
        n = 0), ~[ "file", "sharefile" ].indexOf(o)) this.data.showSelect && this.fileSelect(t.detail); else {
            var f = {
                gid: a,
                fid: n,
                fname: r,
                ftype: o,
                type: l,
                path: this.$data.path,
                opttype: c
            };
            this.$data.aimFile ? f.aimFile = this.$data.aimFile : this.$data.aimFiles && (f.aimFiles = this.$data.aimFiles), 
            h("select", f, !1);
        }
    },
    optBtnTap: function(t) {
        var e = t.currentTarget.dataset.index;
        this.$config.optBtnTapFn && this[this.$config.optBtnTapFn[e]]();
    },
    save: function() {
        var s = this;
        t.stat("share_preserve_select_click");
        var a = Number(this.options.fid), r = Number(this.options.gid);
        this.buttonStatus(!0, !0), o(this.$data.aimFile.fid).then(function(o) {
            n({
                groupid: r,
                parentid: a,
                name: o.fname,
                size: o.fsize,
                sha1: o.fsha,
                storeid: o.storeid || o.storid,
                store: o.store,
                fileid: -1
            }).then(function() {
                t.stat("share_preserve_select_success"), e.setDirty(i.subFile(r, a)), s.successInfo("保存成功", function() {
                    s.buttonStatus(!1, !1), s.goBack(!0);
                });
            }).catch(function(e) {
                var i = e.result, a = e.msg;
                s.buttonStatus(!1, !1), s.failInfo("" + (a || i || "连接失败")), t.stat("share_preserve_select_fail", {
                    errorCode: i
                });
            });
        }).catch(function(e) {
            var i = e.result, a = e.msg;
            s.buttonStatus(!1, !1), s.failInfo("" + (a || i || "连接失败")), t.stat("share_preserve_select_fail", {
                errorCode: i
            });
        });
    },
    copy: function() {
        var s = this;
        t.stat("more_copy_select_click");
        var a = Number(this.options.fid), n = Number(this.options.gid), o = this.$data.aimFile, r = o.fid, c = o.gid;
        this.buttonStatus(!0, !0), l({
            groupid: Number(c),
            fileids: [ Number(r) ],
            target_parentid: a,
            target_groupid: n
        }).then(function() {
            e.setDirty(i.subFile(n, a)), s.successInfo("复制成功", function() {
                s.buttonStatus(!1, !1), s.goBack(!0);
            }), t.stat("more_copy_success");
        }).catch(function(e) {
            s.buttonStatus(!1, !1);
            var i = e.msg, a = e.faillist, n = e.result, o = a && a[0].msg;
            s.failInfo("" + (i || o || "连接失败")), t.stat("more_copy_fail", {
                errorCode: n
            });
        });
    },
    move: function() {
        var s = this;
        t.stat("more_move_select_click");
        var a = Number(this.options.fid), n = Number(this.options.gid), o = this.$data.aimFile, r = o.fid, l = o.gid;
        o.pid;
        this.buttonStatus(!0, !0), c({
            groupid: Number(l),
            fileids: [ Number(r) ],
            target_parentid: a,
            target_groupid: n
        }).then(function() {
            s.checkReloadRecent(r), e.delData(i.file, {
                id: r
            }), e.setDirty(i.subFile(n, a)), s.successInfo("移动成功", function() {
                s.buttonStatus(!1, !1), s.goBack(!0);
            }), t.stat("more_move_success");
        }).catch(function(e) {
            s.buttonStatus(!1, !1);
            var i = e.msg, a = e.faillist, n = e.result, o = a && a[0].msg;
            s.failInfo("" + (i || o || "连接失败")), t.stat("more_move_fail", {
                errorCode: n
            });
        });
    },
    multiMove: function() {
        var e = this;
        t.stat("more_multiselect_move_select_click");
        var i = Number(this.options.fid), s = Number(this.options.gid), a = Number(this.$data.aimFiles[0].gid), n = this.$data.aimFiles.map(function(t) {
            return Number(t.fid);
        });
        this.buttonStatus(!0, !0), f(a, n, i, s).then(function() {
            t.stat("more_multiselect_move_click_success"), e.successInfo("移动成功", function() {
                e.buttonStatus(!1, !1), e.goBackByMulti();
            });
        }).catch(function(i) {
            e.buttonStatus(!1, !1);
            var s = i.msg, a = i.faillist, n = i.result, o = a && a[0].msg, r = "" + (s || o || "连接失败");
            if (t.stat("more_multiselect_move_click_fail", {
                errorCode: n
            }), i.progressErr) e.failInfo(r, function() {
                e.goBackByMulti();
            }); else switch (n) {
              case "网络异常":
                e.failInfo(r);
                break;

              default:
                e.failInfo(r, function() {
                    e.goBackByMulti(!0);
                });
            }
        });
    },
    saveAndEdit: function() {
        var e = this;
        t.stat("edit_preserve_select_click");
        var i = this.options, s = i.gid, a = i.fid;
        this.buttonStatus(!0, !0), o(this.$data.aimFile.fid).then(function(i) {
            n({
                groupid: Number(s),
                parentid: Number(a),
                name: i.fname,
                size: i.fsize,
                sha1: i.fsha,
                storeid: i.storeid || i.storid,
                store: i.store,
                fileid: -1
            }).then(function(i) {
                t.stat("edit_preserve_select_success"), e.successInfo("保存成功", function() {
                    e.buttonStatus(!1, !1), e.gotoPreview(i);
                });
            }).catch(function(i) {
                t.stat("edit_preserve_select_fail", {
                    errorCode: s
                });
                var s = i.result, a = i.msg;
                e.buttonStatus(!1, !1), e.failInfo("" + (a || s || "连接失败"));
            });
        }).catch(function(i) {
            t.stat("edit_preserve_select_fail", {
                errorCode: s
            });
            var s = i.result, a = i.msg;
            e.buttonStatus(!1, !1), e.failInfo("" + (a || s || "连接失败"));
        });
    },
    fileSelect: function(t) {
        var e = t.index, i = this.data.selectedIndexs, s = this.$data.selectedFiles, a = this.$config, n = a.showSingleSelect, o = a.showMultiSelect, r = i.indexOf(e);
        n ? -1 !== r ? (i = [], s = []) : (i = [ e ], s = [ t ]) : o && (-1 !== r ? (i.splice(r, 1), 
        s.splice(r, 1)) : (i.push(e), s.push(t))), this.setData({
            selectedIndexs: i
        }), this.$data.selectedFiles = s;
    },
    externSelectFile: function() {
        var t = this.$data.selectedFiles;
        if (0 == t.length) m("请选择一个文件"); else {
            var e = t[0], i = e.fid, s = e.groupid, a = e.fname, n = e.fsize;
            wx.navigateBackMiniProgram({
                extraData: {
                    fid: i,
                    groupid: s,
                    fname: a,
                    fsize: n
                },
                success: function(t) {}
            });
        }
    },
    externMultiSelectFile: function() {
        var t = this.$data.selectedFiles;
        if (0 == t.length) m("请至少选择一个文件"); else {
            var e = [];
            for (var i in t) {
                var s = t[i], a = s.fid, n = s.fsize, o = s.groupid, r = s.parentid, l = s.fname;
                e.push({
                    fid: a,
                    fsize: n,
                    groupid: o,
                    parentid: r,
                    fname: l
                });
            }
            console.log(e), wx.navigateBackMiniProgram({
                extraData: {
                    files: e
                },
                success: function(t) {}
            });
        }
    },
    checkReloadRecent: function(t) {
        var s = e.getCacheData(i.recent);
        if (s) for (var a = 0, n = s.length; a < n; ++a) if (s[a].id == t) {
            e.setDirty(i.recent);
            break;
        }
    },
    successInfo: function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
        m(t, {
            icon: "success",
            duration: 1e3
        }, e);
    },
    failInfo: function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
        m(t, {
            icon: "none",
            duration: 3e3
        }, e);
    },
    goBack: function(t) {
        for (var e = getCurrentPages(), i = 0, s = void 0, a = e[e.length - 1].route, n = e.length; n--; ) {
            if (e[n].route !== a) {
                s = e[n];
                break;
            }
            i++;
        }
        wx.navigateBack({
            delta: i
        }), t && s.reload && s.reload();
    },
    goBackByMulti: function() {
        for (var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0], e = getCurrentPages(), i = 0, s = e.length; s--; ) {
            if ("pages/multiple/multiple" === e[s].route) {
                t || i++;
                break;
            }
            i++;
        }
        wx.navigateBack({
            delta: i
        });
    },
    buttonStatus: function(t, e) {
        this.setData({
            btnLoading: t,
            btnDisable: e
        });
    },
    gotoPreview: function(e) {
        t.globalData.intent = {
            pages: [ "preview" ],
            fid: e.fid || e.id,
            groupid: e.groupid || e.gid,
            fname: encodeURIComponent(e.fname),
            ftype: e.ftype
        }, h("tabBars/teams");
    },
    isFromWebOffice: function() {
        return "weboffice" === this.options.from;
    },
    myDeviceTap: function() {
        m("我的设备暂不支持选择");
    }
});