var e = require("../../action/link/index.js"), t = e.updateLink, i = e.closeLink, n = require("../../utils/util.js"), o = n.formatDate_MMddHHmm, r = n.toast, s = require("../../action/user/user.js").userMember, a = getApp();

Page({
    data: {
        linkLatest: !1,
        linkExpire: "",
        linkPeriod: ""
    },
    onLoad: function(e) {
        e.fid, e.sid;
        var t = e.latest, i = void 0 === t || t, n = e.expireTime, o = e.expirePeriod;
        this.initView(i, n, o), this.loadMemeberInfo();
    },
    loadMemeberInfo: function() {
        a.getDriveUser().then(function(e) {
            s(e.id).then(function(e) {
                a.initUserMember();
            }).catch();
        });
    },
    initView: function(e, t, i) {
        var n = this.formatExpireTime(t), o = this.formatPeriodTime(i);
        this.setData({
            linkLatest: e,
            linkExpire: n,
            linkPeriod: o
        });
    },
    testCode: function() {
        var e = this.formatExpireTime, t = new Date() / 1e3, i = t + 720, n = t + 10800, o = t + 172800;
        console.log(e(i)), console.log(e(n)), console.log(e(o));
    },
    formatExpireTime: function(e) {
        var t = o(e) + " 过期", i = "", n = e - Math.round(new Date() / 1e3);
        if (n > 0) {
            var r = Math.round(n / 86400), s = parseInt(n % 86400 / 3600);
            if (r > 0) i = "(剩余 " + r + " 天)"; else if (s > 0) i = "(剩余 " + s + " 小时)"; else {
                var a = parseInt(n % 86400 % 3600 / 60);
                0 == a && (a = 1), i = "(剩余 " + a + " 分钟)";
            }
        }
        return t + " " + i;
    },
    formatPeriodTime: function(e) {
        return e < 86400 ? Math.round(e / 3600) + " 小时" : Math.round(e / 86400) + " 天";
    },
    onSwitchChange: function(e) {
        r("暂不支持"), a.stat("more_share_send_set_click", {
            type: "allow"
        });
    },
    tapPeriod: function() {
        a.stat("more_share_send_set_click", {
            type: "duration"
        });
        var e = a.getIsMember() ? [ "7 天", "30 天" ] : [ "重置为 7 天" ], t = this.setPeriod;
        wx.showActionSheet({
            itemList: e,
            success: function(i) {
                t(e[i.tapIndex]);
            }
        });
    },
    tapStop: function() {
        var e = this.options.fid;
        wx.showModal({
            title: "停止分享",
            content: "停止后，其他人将无法通过链接继续查看文档",
            showCancel: !0,
            cancelText: "取消",
            confirmText: "立即停止",
            confirmColor: "#e64340",
            success: function(t) {
                t.confirm && (a.stat("more_share_send_set_click", {
                    type: "stop"
                }), i(e).then(function(e) {
                    wx.navigateBack({
                        delta: 1
                    });
                }).catch(function(e) {
                    r(e.msg);
                }));
            }
        });
    },
    setPeriod: function(e) {
        var i = this, n = 0;
        switch (e) {
          case "30 天":
            n = 2592e3, a.stat("more_share_send_duration_click", {
                type: "30"
            });
            break;

          case "7 天":
          case "重置为 7 天":
          default:
            n = 604800, a.stat("more_share_send_duration_click", {
                type: "7"
            });
        }
        var o = this.options.sid;
        t(o, null, null, n).then(function(e) {
            r("设置成功");
            var t = e.link, n = t.latest, o = void 0 === n || n, s = t.expire_time, a = t.expire_period;
            i.initView(o, s, a);
        }).catch(function(e) {
            r(e.msg);
        });
    }
});