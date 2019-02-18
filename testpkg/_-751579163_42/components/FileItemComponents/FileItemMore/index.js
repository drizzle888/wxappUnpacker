var e = require("../../../store/store.js"), t = e.StoreType, i = require("../../../utils/util.js"), s = (i.isShowtang, 
i.gotoPage), r = i.toast, o = i.isCompanyAccount, a = i.noExtName, n = i.getExtName, c = i.isBatter, p = i.getWebOfficeType, f = i.getTeamRole, l = require("../../../action/files/operate.js"), d = l.delRoaming, h = l.delFile, m = require("../../../action/groups/index.js"), u = m.deleteTeam, g = m.deleteMember, v = getApp(), _ = require("../../../utils/api.js"), S = "pages/tabBars/recent/recent";

Component({
    properties: {
        ftype: String,
        groupid: Number,
        parentid: Number,
        deviceid: Number,
        fsrc: String,
        fid: String,
        fname: String,
        sid: String,
        path: String,
        isBindTapOperate: Boolean
    },
    data: {},
    methods: {
        tapMore: function() {
            var i = this;
            if (!c("tapMore")) if (this.data.isBindTapOperate) this.triggerEvent("operatetapevent", this.properties, {
                bubbles: !0,
                composed: !0
            }); else {
                this.fetchStoreGroups(), this.fetchStoreGroups();
                var s = [], r = this.properties, a = r.ftype, n = r.groupid, p = r.fsrc, f = o(v.globalData.user);
                if ("folder" === a) {
                    var l = e.getCacheData(t.allTeam).mine.id;
                    f || n !== l || s.push("添加成员"), s.push("复制或移动", "重命名"), this.isNeedMultiple() && s.push("选择多项"), 
                    s.push("删除");
                } else "team" === a ? (f || (s.push("添加成员"), s.push("查看成员")), s.push("重命名", "删除")) : (s.push(f ? "发给好友" : "分享"), 
                this.supportInviteEdit() && s.push("邀请他人一起写"), this.isPageShown(S) && "与我共享" === p ? s.push("另存为") : s.push("复制或移动", "重命名"), 
                this.isNeedMultiple() && s.push("选择多项"), s.push("删除"));
                wx.showActionSheet({
                    itemList: s,
                    success: function(e) {
                        i.mapHandler(s[e.tapIndex]);
                    }
                });
            }
        },
        fetchStoreGroups: function() {
            var i = e.getCacheData(t.allTeam), s = i.mine, r = i.auto;
            s.id && r.id || e.getData(t.allTeam, {}, !0).then(function(e) {});
        },
        mapHandler: function(e) {
            if (!c("mapHandler")) {
                var t = "";
                switch (e) {
                  case "发给好友":
                    this.shareFriend(), t = "more_share_click";
                    break;

                  case "分享":
                    this.shareTo(), t = "more_share_read_click";
                    break;

                  case "邀请他人一起写":
                    this.inviteEdit(), t = "more_edit_click";
                    break;

                  case "复制或移动":
                    this.copyOrMove(), t = "more_copyormove_click";
                    break;

                  case "另存为":
                    this.save(), t = "more_save_click";
                    break;

                  case "重命名":
                    this.rename(), t = "more_rename_click";
                    break;

                  case "选择多项":
                    this.multiple(), t = "more_multiselect_click";
                    break;

                  case "删除":
                    this.del(), t = "more_delete_click";
                    break;

                  case "添加成员":
                    this.inviteShare();
                    break;

                  case "查看成员":
                    this.checkMembers(), t = "more_member_click";
                }
                t.length > 0 && v.stat(t);
            }
        },
        shareFriend: function() {
            var e = this.properties, t = e.fid, i = e.fname, r = e.sid, o = e.ftype, a = e.groupid, n = e.fsrc, c = e.path;
            s("shareTypeCompany", {
                sid: r,
                fname: encodeURIComponent(i),
                fid: t,
                ftype: o,
                groupid: a,
                fsrc: n || c,
                from_: "filelist"
            }, !1);
        },
        shareTo: function() {
            var e = this.properties, t = e.fid, i = e.fname, r = e.sid, o = e.ftype, a = e.fsrc, n = e.path;
            s("shareType", {
                sid: r,
                fname: encodeURIComponent(i),
                fid: t,
                ftype: o,
                fsrc: a || n,
                from_: "filelist"
            }, !1);
        },
        inviteEdit: function() {
            var e = this.properties, t = e.groupid, i = e.fid, r = e.fname, o = e.ftype;
            s("shareEdit", {
                fname: encodeURIComponent(r),
                groupid: t,
                fid: i,
                ftype: o
            });
        },
        copyOrMove: function() {
            this.gotoSelect("copyOrMove");
        },
        save: function() {
            this.gotoSelect("save");
        },
        rename: function() {
            var e = this.properties, t = e.groupid, i = e.fid, s = e.fname, r = e.ftype;
            this.toRename(t, i, s, r);
        },
        toRename: function(e, t, i, r) {
            s("rename", {
                groupid: e,
                fid: t,
                fname: encodeURIComponent(i),
                ftype: r
            }, !1, this.navigateFail);
        },
        isNeedMultiple: function() {
            return this.isPageShown(S) || this.isPageShown("pages/tabBars/teams/teams") || this.isPageShown("pages/files/files") || this.isPageShown("pages/teamInfo/teamInfo") || this.isPageShown("pages/devicefiles/devicefiles");
        },
        multiple: function() {
            var e = {};
            this.isPageShown(S) && (e.from = "recent"), this.isPageShown("pages/tabBars/teams/teams") && (e.from = "teams"), 
            (this.isPageShown("pages/files/files") || this.isPageShown("pages/teamInfo/teamInfo")) && (e.from = "files", 
            e.groupid = this.properties.groupid, e.parentid = this.properties.parentid), this.isPageShown("pages/devicefiles/devicefiles") && (e.from = "deviceFiles", 
            e.deviceid = this.properties.deviceid), e.fid = this.properties.fid, s("multiple", e);
        },
        del: function() {
            var e = this;
            if (this.isPageShown(S)) {
                var t = [ "仅清除打开记录", "删除" ];
                wx.showActionSheet({
                    itemList: t,
                    success: function(i) {
                        switch (t[i.tapIndex]) {
                          case "仅清除打开记录":
                            v.stat("more_delete_record_click"), e.delRecord();
                            break;

                          case "删除":
                            v.stat("more_delete_delete_click"), e.delFileCore();
                        }
                    }
                });
            } else "team" === this.properties.ftype ? this.delTeam() : this.delFile();
        },
        inviteShare: function() {
            var e = this, t = this.properties, i = t.ftype, s = t.parentid;
            "folder" === i && 0 !== s ? _.showModal({
                title: "共享文件夹",
                content: "目前仅支持根目录文件夹共享，你可以将文件移动至根目录后添加共享成员。",
                confirmText: "共享",
                confirmColor: "#02BB00"
            }).then(function(t) {
                t.confirm && e.gotoInvateTeam();
            }) : this.gotoInvateTeam();
        },
        gotoInvateTeam: function() {
            s("invateteam", {
                fname: encodeURIComponent(this.properties.fname),
                ftype: this.properties.ftype,
                groupid: this.properties.groupid,
                parentid: this.properties.parentid,
                fid: this.properties.fid,
                mode: "invite"
            });
        },
        gotoSelect: function(e) {
            var t = this.properties, i = {
                fid: t.fid,
                gid: t.groupid,
                pid: t.parentid,
                fname: encodeURIComponent(t.fname),
                ftype: t.ftype
            };
            s("select", {
                aimFile: i,
                opttype: e
            }, !1);
        },
        checkMembers: function() {
            var e = this.properties, t = e.groupid, i = e.fname;
            s("member", {
                groupid: t,
                fname: encodeURIComponent(i)
            }, !1);
        },
        delFile: function() {
            var e = this, t = this.properties, i = t.ftype, s = t.fname, r = "file" === i || "sharefile" === i;
            _.showModal({
                title: r ? "删除文件" : "删除文件夹",
                content: "请确认删除 " + a(s, i),
                confirmText: "删除",
                confirmColor: "#e64340"
            }).then(function(t) {
                t.confirm && (v.stat("more_delete_dialog_click"), e.delFileCore());
            }).catch();
        },
        delFileCore: function() {
            var e = this, i = this.properties, s = i.fid, r = i.groupid;
            h(r, s).then(function(i) {
                e.delSuccess(s, t.file, "实体");
            }).catch(function(t) {
                var i = t.msg, s = t.faillist, r = t.result, o = "" + (i || s && s[0].msg || "连接失败");
                e.isPageShown(S) ? e.delRecord() : (e.failInfo(o), v.stat("more_delete_fail", {
                    errorCode: r,
                    type: "实体"
                }));
            });
        },
        delRecord: function() {
            var e = this, i = this.properties.fid;
            d(i).then(function(s) {
                e.delSuccess(i, t.recent, "记录");
            }).catch(function(t) {
                var i = t.msg, s = t.faillist, r = t.result, o = "" + (i || s && s[0].msg || "连接失败");
                e.failInfo(o), v.stat("more_delete_fail", {
                    errorCode: r,
                    type: "记录"
                });
            });
        },
        delTeam: function() {
            var i = this, s = this.properties, r = s.ftype, o = s.fname, n = s.fid;
            o = a(o, r), _.showModal({
                title: "删除共享文件夹",
                content: "请确认删除 " + o + " ? 删除后你将不能再访问该文件夹，并无法恢复。",
                confirmText: "删除",
                confirmColor: "#e64340"
            }).then(function(s) {
                if (s.confirm) {
                    v.stat("more_delete_dialog_click");
                    var r = "creator" === f(e, n), o = v.globalData.user && v.globalData.user.id;
                    (r ? u : g)(n, o).then(function(e) {
                        i.delSuccess(n, t.allTeam, "实体");
                    }).catch(function(e) {
                        var t = e.msg, s = e.faillist, r = e.result, o = "" + (t || s && s[0].msg || "连接失败");
                        i.failInfo(o), v.stat("more_delete_fail", {
                            errorCode: r,
                            type: "实体"
                        });
                    });
                }
            });
        },
        delSuccess: function(t, i, s) {
            v.stat("more_delete_success", {
                type: s
            }), e.delData(i, {
                id: t
            }), this.reload();
        },
        reload: function() {
            var e = getCurrentPages();
            e.length > 0 && e[e.length - 1].reload && e[e.length - 1].reload();
        },
        supportInviteEdit: function() {
            if (o(v.globalData.user)) return !1;
            var e = this.properties, t = e.fname, i = e.fsrc, s = n(t);
            return !!p(s) && "与我共享" !== i;
        },
        isPageShown: function(e) {
            var t = getCurrentPages();
            return t.length > 0 && t[t.length - 1].route === e;
        },
        navigateFail: function(e) {
            var t = e.errMsg, i = t ? ~t.indexOf("limit") ? "文件夹层级已超出小程序限制" : t : "请求数据错误";
            _.showModal({
                content: i,
                title: "提示",
                showCancel: !1
            });
        },
        successInfo: function(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
            r(e, {
                icon: "success",
                duration: 1500
            }, t);
        },
        failInfo: function(e) {
            r(e, {
                icon: "none",
                duration: 3e3
            });
        }
    }
});