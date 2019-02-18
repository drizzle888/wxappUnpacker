var e = require("../../store/store.js"), t = e.StoreType, i = require("../../config/index.js").usePrivate, o = require("../../action/link/index.js").getLinkOrOpen, r = require("../../action/files/operate.js"), s = r.delRoaming, a = r.delFile, n = require("../../action/groups/index.js"), l = n.deleteTeam, c = n.deleteMember, f = require("../../utils/util.js"), p = f.isShowtang, d = f.gotoPage, m = f.toast, h = (f.isCompanyAccount, 
f.noExtName), u = f.getExtName, g = (f.isBatter, f.getWebOfficeType, f.getTeamRole), v = f.reloadCurrentPage, w = require("../../utils/api.js"), _ = getApp(), S = "pages/tabBars/recent/recent";

Component({
    properties: {
        fid: String,
        sid: String,
        index: Number,
        ficon: String,
        mtime_recent: Number,
        mtime: Number,
        fsize: Number,
        fsrc: String,
        ftype: String,
        fname: String,
        groupid: Number,
        parentid: Number,
        deviceid: Number,
        nobottomline: Boolean,
        type: String,
        isbindTap: Boolean,
        isBindTapOperate: Boolean,
        userRole: String,
        recent_members: Array,
        showOperate: {
            type: Boolean,
            value: !0
        },
        showSelect: Boolean,
        selectedIndexs: Array,
        showFrom: Boolean,
        showSize: Boolean,
        showRecentTime: Boolean,
        showTeamAvatar: Boolean,
        path: String,
        highlightFname: String,
        highlightCreator: String,
        highlightSharer: String,
        wpsCourseId: String,
        detail: String
    },
    data: {
        fileSid: "",
        platform: "",
        wpsCourseAppid: "wx8b11aa0e50eb061a",
        wpsCoursePath: "src/pages/timetable/index"
    },
    attached: function() {
        var e = this.properties.wpsCourseId;
        if (e) {
            this.data.wpsCoursePath = "src/pages/timetable/index?p1=" + e + "&wpsSid=" + _.globalData.wps_sid;
            var t = _.getVerifyData().platform;
            this.setData({
                wpsCoursePath: this.data.wpsCoursePath,
                platform: t
            });
        }
    },
    methods: {
        tapFile: function() {
            var e = this.properties, t = e.isbindTap, i = e.groupid, o = e.fid, r = e.ftype, s = e.fname, a = e.type, n = e.sid;
            if (this.triggerEvent("filetapevent", this.properties, {
                bubbles: !0,
                composed: !0
            }), !t) if ("groupList" === a) this.toGroupList(o, s); else if ("teamlist" === a) this.toTeamList(); else if ("devicelist" === a) this.toDeviceList(); else if ("teamroot" === a) this.toTeamRoot(s); else if ("tmp" === a) this.toTmp(s); else if ("starroot" === a) this.toStar(s); else if ("team" === r) this.toTeamOrFolder(i, 0, this.properties.parentid, s, r); else if ("folder" === r) this.toTeamOrFolder(i, o, this.properties.parentid, s, r); else if ("device" === r) this.toDeviceFiles(o, s, r); else if (~[ "file", "sharefile" ].indexOf(r)) this.toFile(i, o, s, r, n); else if ("wpscourselink" === r) {
                this.tapWpsSource();
                var l = this.data.wpsCourseId;
                d("openWin", {
                    url: "https://edu-m.wps.cn/schedule",
                    courseId: l,
                    from: "wps_cloud_documents",
                    wpsSid: _.globalData.wps_sid
                });
            }
        },
        tapWpsSource: function() {
            var e = {
                courseid: this.properties.wpsCourseId,
                groupid: this.properties.groupid,
                platform: this.data.platform
            };
            _.stat("fission_team_show", e);
        },
        getEntrance: function() {
            var e = "teams", t = getCurrentPages();
            if (t.length > 0) {
                var i = t[t.length - 1].route || "";
                e = i == S ? "recent" : "pages/search/search" == i ? "search" : "pages/devicefiles/devicefiles" == i ? "my_device" : "teams";
            }
            return e;
        },
        getFrom: function() {
            var e = this.properties, t = e.fsrc, i = e.groupid;
            return "全部文档" === t ? "my_doc" : "与我共享" === t ? "share" : this.getTeamById(i) ? "team_doc" : "auto_upload";
        },
        getTeamById: function(i) {
            return e.getCacheData(t.allTeam).teams.find(function(e) {
                return e.id == i;
            });
        },
        isPageShown: function(e) {
            var t = getCurrentPages();
            return t.length > 0 && t[t.length - 1].route === e;
        },
        multiple: function() {
            var e = {};
            this.isPageShown(S) && (e.from = "recent"), this.isPageShown("pages/tabBars/teams/teams") && (e.from = "teams"), 
            (this.isPageShown("pages/files/files") || this.isPageShown("pages/teamInfo/teamInfo")) && (e.from = "files", 
            e.groupid = this.properties.groupid, e.parentid = this.properties.parentid), e.fid = this.properties.fid, 
            d("multiple", e);
        },
        del: function() {
            var e = this;
            if (this.isPageShown(S)) {
                var t = [ ClearRecord, Del ];
                wx.showActionSheet({
                    itemList: t,
                    success: function(i) {
                        switch (t[i.tapIndex]) {
                          case ClearRecord:
                            _.stat("more_delete_record_click"), e.delRecord();
                            break;

                          case Del:
                            _.stat("more_delete_delete_click"), e.delFileCore();
                        }
                    }
                });
            } else "team" === this.properties.ftype ? this.delTeam() : this.delFile();
        },
        checkMembers: function() {
            var e = this.properties, t = e.groupid, i = e.fname;
            d("member", {
                groupid: t,
                fname: encodeURIComponent(i)
            }, !1);
        },
        delFile: function() {
            var e = this, t = this.properties, i = t.ftype, o = t.fname, r = "file" === i || "sharefile" === i;
            w.showModal({
                title: r ? "删除文件" : "删除文件夹",
                content: "请确认删除 " + h(o, i),
                confirmText: "删除",
                confirmColor: "#e64340"
            }).then(function(t) {
                t.confirm && (_.stat("more_delete_dialog_click"), e.delFileCore());
            }).catch();
        },
        delFileCore: function() {
            var e = this, i = this.properties, o = i.fid, r = i.groupid;
            a(r, o).then(function(i) {
                e.delSuccess(o, t.file, "实体");
            }).catch(function(t) {
                var i = t.msg, o = t.faillist, r = t.result, s = "" + (i || o && o[0].msg || "连接失败");
                e.isPageShown(S) ? e.delRecord() : (e.failInfo(s), _.stat("more_delete_fail", {
                    errorCode: r,
                    type: "实体"
                }));
            });
        },
        delRecord: function() {
            var e = this, i = this.properties.fid;
            s(i).then(function(o) {
                e.delSuccess(i, t.recent, "记录");
            }).catch(function(t) {
                var i = t.msg, o = t.faillist, r = t.result, s = "" + (i || o && o[0].msg || "连接失败");
                e.failInfo(s), _.stat("more_delete_fail", {
                    errorCode: r,
                    type: "记录"
                });
            });
        },
        delTeam: function() {
            var i = this, o = this.properties, r = o.ftype, s = o.fname, a = o.fid;
            s = h(s, r), w.showModal({
                title: "删除共享文件夹",
                content: "请确认删除 " + s + " ? 删除后你将不能再访问该文件夹，并无法恢复。",
                confirmText: "删除",
                confirmColor: "#e64340"
            }).then(function(o) {
                if (o.confirm) {
                    _.stat("more_delete_dialog_click");
                    var r = "creator" === g(e, a), s = _.globalData.user && _.globalData.user.id;
                    (r ? l : c)(a, s).then(function(e) {
                        i.delSuccess(a, t.allTeam, "实体");
                    }).catch(function(e) {
                        var t = e.msg, o = e.faillist, r = e.result, s = "" + (t || o && o[0].msg || "连接失败");
                        i.failInfo(s), _.stat("more_delete_fail", {
                            errorCode: r,
                            type: "实体"
                        });
                    });
                }
            });
        },
        delSuccess: function(t, i, o) {
            _.stat("more_delete_success", {
                type: o
            }), e.delData(i, {
                id: t
            }), v();
        },
        gotoSelect: function(e) {
            var t = this.properties, i = {
                fid: t.fid,
                gid: t.groupid,
                pid: t.parentid,
                fname: encodeURIComponent(t.fname),
                ftype: t.ftype
            };
            d("select", {
                aimFile: i,
                opttype: e
            }, !1);
        },
        navigateFail: function(e) {
            var t = e.errMsg, i = t ? ~t.indexOf("limit") ? "文件夹层级已超出小程序限制" : t : "请求数据错误";
            w.showModal({
                content: i,
                title: "提示",
                showCancel: !1
            });
        },
        toTeamList: function() {
            d("teamList"), this.isPageShown(S) ? _.stat("recent_team_click") : _.stat("file_team_click");
        },
        toTeamRoot: function(e) {
            d("files", {
                type: "teamroot",
                fname: encodeURIComponent(e)
            }, !1, this.navigateFail);
        },
        toTmp: function(e) {
            d("files", {
                type: "tmp",
                fname: encodeURIComponent(e)
            }, !1, this.navigateFail);
        },
        toStar: function(e) {
            d("star", {
                fname: encodeURIComponent(e)
            }, !1, this.navigateFail);
        },
        toTeamOrFolder: function(e, t, i, o, r) {
            d("files", {
                fid: t,
                pid: i,
                fname: encodeURIComponent(o),
                gid: e,
                ftype: r
            }, !1, this.navigateFail), "folder" === r ? _.stat("file_click", {
                type: "普通文件夹"
            }) : "team" === r && _.stat("file_click", {
                type: "共享文件夹"
            });
        },
        toFile: function(e, t, i, o, r) {
            this.getPreviewInfo(t, i, o, r, e);
            var s = u(i), a = this.getEntrance(), n = this.getFrom();
            _.stat("doc_click", {
                type: s,
                entrance: a,
                from: n
            });
        },
        toDeviceList: function() {
            d("devicelist"), _.stat("file_click", {
                type: "我的设备文件夹"
            });
        },
        toDeviceFiles: function(e, t, i) {
            d("devicefiles", {
                deviceid: e,
                fname: t
            }), _.stat("file_click", {
                type: "设备文件夹"
            });
        },
        getPreviewInfo: function(e, t, r, s, a) {
            var n = this;
            if (p(t)) return w.showModal({
                title: "提示",
                showCancel: !1,
                content: "秀堂文件不支持在线预览"
            });
            "sharefile" === r && s ? this.toPreview("", s, t, r, a) : i ? this.toPreview(e, "", t, r, a) : o(e).then(function(i) {
                var o = i.link.sid;
                o && n.toPreview(e, o, t, r, a);
            }).catch(function(e) {
                var t = e.result, i = e.msg;
                return m("打开链接失败：" + (i || t));
            });
        },
        toPreview: function(e, t, o, r, s) {
            d("preview", {
                sid: t,
                fid: i ? e : "",
                fname: encodeURIComponent(o),
                ftype: r,
                groupid: s
            }, !1, this.navigateFail), _.queryPreviewSwitch();
        },
        toGroupList: function(e, t) {
            var i = getCurrentPages();
            if (i && i.length > 1) {
                var o = i[i.length - 2], r = o.route || o.__route__ || "";
                "pages/tabBars/recent/recent" === r || "pages/share/share" === r ? (_.stat("team_all_click"), 
                d("teamInfo", {
                    pid: 0,
                    gid: e,
                    fname: encodeURIComponent(t)
                })) : "pages/tabBars/teams/teams" === r && (_.stat("teamfile_all_click"), d("files", {
                    fid: 0,
                    fname: encodeURIComponent(t),
                    gid: e,
                    ftype: "team"
                }), _.stat("file_click", {
                    type: "共享文件夹"
                }));
            }
        }
    }
});