var e = require("../../utils/util.js"), t = e.gotoPage, a = e.toast, i = e.getTeamName, n = e.reloadCurrentPage, o = e.isCompanyAccount, r = require("../../store/store.js"), c = r.StoreType, s = require("../../config/index.js").dirMode, d = require("../../action/groups/index.js"), u = d.createTeam, p = d.formatTeam, l = getApp();

Component({
    properties: {
        groupid: Number,
        parentid: Number
    },
    data: {
        active: !1
    },
    methods: {
        tap: function() {
            this.$data = {
                groupId: 0,
                parentId: 0
            }, this.generateParentId(), this.toggle(), this.showMenu(), l.stat("new_button_click");
        },
        toggle: function() {
            var e = !this.data.active;
            this.setData({
                active: e
            });
        },
        generateParentId: function() {
            var e = this;
            return new Promise(function(t, a) {
                var i = e.properties, n = i.groupid, o = i.parentid;
                if (e.$data = {
                    groupId: n,
                    parentId: o || 0
                }, !n) {
                    var s = r.getCacheData(c.allTeam).mine.id;
                    s ? (e.$data.groupId = s, t()) : r.getData(c.allTeam, {}, !0).then(function(a) {
                        e.$data.groupId = a.mine.id, t();
                    }).catch(function() {
                        a();
                    });
                }
            });
        },
        showMenu: function() {
            var e = this, t = [ "新建文字", "新建表格", "新建文件夹" ];
            o(l.globalData.user) || t.push("新建协作"), wx.showActionSheet({
                itemList: t,
                success: function(a) {
                    e.showMenuAction(t[a.tapIndex]);
                },
                complete: function() {
                    e.toggle();
                }
            });
        },
        showMenuAction: function(e) {
            switch (e) {
              case "新建文字":
                this.createFile("w");
                break;

              case "新建表格":
                this.createFile("s");
                break;

              case "新建文件夹":
                this.createFolder();
                break;

              case "新建协作":
                this.createTeam();
                break;

              case "新建演示":
                wx.showModal({
                    title: "新建演示",
                    content: "该功能即将上线，敬请期待",
                    showCancel: !1
                });
                break;

              case "新建便签":
                wx.showModal({
                    title: "新建便签",
                    content: "该功能即将上线，敬请期待",
                    showCancel: !1
                });
            }
        },
        createFile: function(e) {
            var t = this, i = {
                w: "doc",
                s: "xls",
                p: "ppt"
            }[e];
            l.stat("new_built_click", {
                type: i
            });
            var n = this.$data, o = n.groupId;
            n.parentId;
            o ? this.gotoCreateFile(e) : this.generateParentId().then(function() {
                t.gotoCreateFile(e);
            }).catch(function() {
                a("新建失败，请重试"), l.stat("new_built_fail", {
                    type: i,
                    errorCode: "noGroupId"
                });
            });
        },
        gotoCreateFile: function(e) {
            var a = this.$data, i = a.groupId, n = a.parentId;
            t("openWin", {
                url: "https://web.wps.cn/office/" + e + "/new/" + i + "-" + n,
                groupId: i,
                parentId: n
            }), l.stat("new_built_success");
        },
        createFolder: function() {
            var e = this.$data, a = e.groupId, i = e.parentId, n = s.createDir;
            t("rename", {
                groupid: a,
                parentid: i,
                ftype: "folder",
                mode: n
            }), l.stat("new_built_click", {
                type: "folder"
            });
        },
        createTeam: function() {
            wx.showLoading({
                title: "正在新建协作...",
                mask: !0
            }), l.stat("new_built_click", {
                type: "team"
            }), u(i(r)).then(function(e) {
                r.addData(c.allTeam, [ p(e) ]), n(), wx.hideLoading(), t("teamGuide/createdTeamGuide", {
                    pid: 0,
                    gid: e.id,
                    fname: encodeURIComponent(e.name)
                });
            }).catch(function(e) {
                wx.hideLoading(), a("" + (e.msg || "连接失败"));
            });
        }
    }
});