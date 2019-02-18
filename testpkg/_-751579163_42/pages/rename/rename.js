var t = getApp(), e = require("../../store/store.js"), a = e.StoreType, i = require("../../action/files/operate.js"), s = i.rename, r = i.mkdir, n = require("../../action/groups/index.js").updateGroup, o = require("../../utils/util.js"), l = o.toast, d = o.getExtName, h = o.decode, m = o.gotoPage, u = require("../../config/index.js").dirMode, c = {
    lengthLimit: "文件(夹)名不能超过100个字符",
    empty: "文件(夹)名不能为空",
    illegalChar: '文件(夹)名不能包含非法字符和特殊符号\\/:*?"<>|'
}, g = {
    lengthLimit: "文件(夹)名不能超过100个字符",
    empty: "文件(夹)名不能为空",
    illegalChar: '文件(夹)名不能包含非法字符和特殊符号\\/;:*?"<>|%&'
}, f = /[\\/:*?"<>|]/, p = /[\\/;:*?"<>|%&]/;

Page({
    data: {
        fname: "",
        loading: !1,
        disabled: !0,
        focus: !0,
        selectStart: 0,
        selectEnd: 0,
        errTip: ""
    },
    $data: {
        mode: u.renameDir
    },
    onLoad: function(t) {
        void 0 !== t.mode && (this.$data.mode = t.mode);
        var e = this.isRename();
        wx.setNavigationBarTitle({
            title: e ? "重命名" : "新建文件夹"
        });
        var a = h(t.fname || ""), i = t.ftype;
        this.extName = "", "file" !== i && "sharefile" !== i || (this.extName = d(a), this.extName.length > 0 && (this.extName = "." + this.extName)), 
        this.srcName = a.substring(0, a.length - this.extName.length), this.setData({
            fname: this.srcName,
            selectEnd: this.srcName.length
        });
    },
    throttleUpdateData: function(t, e) {
        var a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], i = this.updateData;
        void 0 != i.tId && (clearTimeout(i.tId), i.tId = void 0), i.tId = setTimeout(function() {
            i.call(this, t, e, a);
        }, 300);
    },
    updateData: function(t, e, a) {
        this.setData({
            disabled: e,
            errTip: t,
            loading: a
        });
    },
    checkInput: function(t) {
        if (!this.data.loading) {
            var e = t.detail.value, a = "";
            if (e !== this.srcName) {
                var i = this.isTeam() ? g : c;
                0 === e.length ? a = i.empty : e.length >= 101 ? a = i.lengthLimit : this.illegalChar(e) && (a = i.illegalChar), 
                a.length > 0 ? this.throttleUpdateData(a, !0) : 0 === a.length && this.throttleUpdateData(a, !1, this.data.loading);
            } else this.throttleUpdateData("", !0);
        }
    },
    isTeam: function() {
        return "team" === this.options.ftype;
    },
    isRename: function() {
        return this.$data.mode === u.renameDir;
    },
    isCreate: function() {
        return this.$data.mode === u.createDir;
    },
    illegalChar: function(t) {
        var e = this.isTeam();
        return t.match(e ? p : f);
    },
    submitRename: function(i) {
        var o = this, d = this.isRename();
        d && t.stat("more_rename_set_click");
        var h = i.detail.value.fname;
        if (h !== this.srcName) {
            h += this.extName, this.setData({
                loading: !0,
                disabled: !0
            });
            var m = this.isTeam();
            (d ? m ? n(this.options.groupid, h) : s(this.options.groupid, this.options.fid, h) : r(this.options.groupid, this.options.parentid, h)).then(function(i) {
                if (d ? t.stat("more_rename_success") : t.stat("new_built_success"), d) m ? e.updateData(a.allTeam, {
                    team: {
                        id: o.options.fid,
                        fname: h
                    }
                }) : e.updateData(a.file, {
                    file: {
                        id: o.options.fid,
                        fname: h
                    }
                }); else {
                    var s = i.parentid, r = i.groupid;
                    e.addData(a.subFile(r, s), [ i ]);
                }
                l(d ? "重命名成功" : "新建成功", {
                    icon: "success",
                    duration: 1e3
                }, function() {
                    o.setData({
                        loading: !1,
                        disabled: !1
                    }), o.goBack(!0);
                });
            }).catch(function(e) {
                var a = e.result, i = "" + (e.msg || "连接失败");
                if ("illegalFname" === a) {
                    var s = o.isTeam() ? g : c;
                    o.throttleUpdateData(s.illegalChar, !0, !1);
                } else o.throttleUpdateData("", !1, !1), l(i, {
                    icon: "none",
                    duration: 3e3
                });
                d ? t.stat("more_rename_fail", {
                    errorCode: a
                }) : t.stat("new_built_fail", {
                    type: "folder",
                    errorCode: a
                });
            });
        } else this.goBack(!1);
    },
    goBack: function(t) {
        var e = getCurrentPages();
        if (e.length > 1) {
            var a = e[e.length - 2], i = a.route || a.__route__ || "";
            this.isCreate() && "pages/tabBars/recent/recent" === i ? m("tabBars/teams") : (wx.navigateBack({
                delta: 1
            }), t && a.reload && a.reload());
        }
    }
});