var t = getApp(), i = require("../../utils/util.js"), e = i.gotoPage, a = (i.showLoading, 
i.hideLoading, i.toast), n = i.isCompanyAccount, s = require("../../action/files/index.js").fileMetadata, o = require("../../action/link/index.js"), l = o.info, r = o.getLink, d = o.applyEdit;

Page({
    data: {
        applyBtnLoading: !1,
        saveBtnLoading: !1
    },
    onLoad: function(i) {
        i.fid, i.sid;
        t.callAfterLogin(function() {}), t.stat("edit_visit");
    },
    onReady: function() {
        wx.setNavigationBarTitle({
            title: "编辑文件"
        });
    },
    getFileInfo: function(t, i) {
        return t ? s(t) : i ? l(i) : void 0;
    },
    isPersonalLink: function(t) {
        return !t.link || !t.link.creator || void 0 !== t.link.creator.corpid && 0 == t.link.creator.corpid;
    },
    tapApply: function() {
        var i = this;
        t.stat("edit_click_apply");
        var s = this.options, o = s.fid, l = s.sid;
        n(t.globalData.user) ? a("暂不支持企业账号") : (this.setData({
            applyBtnLoading: !0
        }), r(l || o).then(function(n) {
            i.setData({
                applyBtnLoading: !1
            }), i.isPersonalLink(n) ? "write" === n.user_permission ? a("已获得编辑权限，请重新打开文件") : d(n.link.sid).then(function() {
                e("fileEditApply"), t.stat("edit_click_apply_success");
            }).catch(function(n) {
                "WechatOAuthNotExists" === n.result ? (e("fileEditApply"), t.stat("edit_click_apply_fail", {
                    errorCode: n.result
                })) : "userNotLogin" === n.result || "InvalidWpssid" === n.result ? (t.clearWpssid(), 
                t.callAfterLogin(i.tapApply.bind(i))) : (a("发送申请失败，请重试"), t.stat("edit_click_apply_fail", {
                    errorCode: n.result
                }));
            }) : a("暂不支持企业账号");
        }).catch(function(e) {
            "userNotLogin" === e.result || "InvalidWpssid" === e.result ? (t.clearWpssid(), 
            t.callAfterLogin(i.tapApply.bind(i))) : (a("获取文件权限失败，请重试"), i.setData({
                applyBtnLoading: !1
            }));
        }));
    },
    tapSave: function() {
        var i = this, e = this.options, n = e.fid, s = e.sid;
        n || s ? (this.setData({
            saveBtnLoading: !0
        }), this.getFileInfo(n, s).then(function(t) {
            i.setData({
                saveBtnLoading: !1
            }), i.gotoSelect(t);
        }).catch(function(e) {
            if ("userNotLogin" === e.result || "InvalidWpssid" === e.result) t.clearWpssid(), 
            t.callAfterLogin(i.tapSave.bind(i)); else {
                i.setData({
                    saveBtnLoading: !1
                });
                e.result;
                var n = e.msg;
                a("" + (n || "获取文件信息失败"));
            }
        })) : a("无法保存"), t.stat("edit_click_preserve");
    },
    gotoSelect: function(t) {
        var i = {
            fid: t.fid || t.id || t.fileid,
            gid: t.groupid,
            pid: t.parentid || t.parent,
            fname: encodeURIComponent(t.fname),
            ftype: t.ftype
        };
        e("select", {
            aimFile: i,
            opttype: "saveAndEdit"
        }, !1);
    }
});