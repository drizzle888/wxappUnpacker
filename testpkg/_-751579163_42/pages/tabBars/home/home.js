var e = getApp(), t = require("../../../utils/util.js"), a = t.gotoPage, i = t.isBatter, n = t.convertUnit, c = require("../../../action/spaces/index.js").spaceInfo, s = require("../../../action/user/user.js"), r = s.accountUser, o = s.userMember, f = require("../../../action/account/account.js").loginTwiceVerify, u = require("../../../config/index.js").appShareInfo;

Page({
    $data: {
        memberId: 0
    },
    data: {
        vipAppid: "wx2f333d84a103825d",
        toolAppid: "wxb7690f02223a7ab2",
        DocerVipAppid: "wx12abde44a4e5a442",
        vipPath: "/pages/pay/pay?csource=wx_xcx_document&position=personal_center&memtype=40&ald_media_id=2308&ald_link_key=b46f1de40479621a&ald_position_id=0",
        toolPath: "/pages/index/index?ald_media_id=1870&ald_link_key=baf3e73d21d48ba5&ald_position_id=0",
        DocerVipPath: "/pages/index/index?position=yunminiapp&ald_media_id=3502&ald_link_key=a84d7568f2c8c3c9",
        extraData: {
            sid: e.getWpssid()
        },
        memberIcon: "",
        avatar: "",
        nickname: "",
        vipMsg: "",
        safeMsg: "",
        spaceUsed: "",
        spaceTotal: "",
        useServiceDays: 0
    },
    onLoad: function(t) {
        e.stat("home_visit");
    },
    onShow: function() {
        var t = this;
        e.callAfterLogin(function() {
            t.refreshUserInfo(), t.refreshAccountUser(), t.refreshSafeInfo(), t.getSpaceInfo(), 
            t.getUserInfo();
        });
    },
    tapUserInfo: function() {
        i() || (e.stat("mine_personal_click"), a("usercenter/userinfo"));
    },
    tapUserSwitch: function() {
        i() || (e.stat("account_switch_click"), a("usercenter/accountswitch"));
    },
    tapPC: function() {
        i() || (e.stat("mine_computer_click"), a("usercenter/openDocs"));
    },
    tapWPSYun: function() {
        if (!i()) {
            e.stat("mine_cloud_click");
            var t = this.data, n = t.spaceUsed, c = t.spaceTotal, s = this.$data.memberId;
            a("usercenter/space", {
                spaceUsed: n,
                spaceTotal: c,
                memberId: s
            });
        }
    },
    tapVip: function() {
        i() || e.stat("mine_vip_click");
    },
    tapOfficeTool: function() {
        i() || e.stat("mine_tool_click");
    },
    tapFeedback: function() {
        i() || (e.stat("mine_feedback_click"), a("feedback", {
            ifrom: "usercenter"
        }));
    },
    tapDocerVip: function() {
        i() || e.stat("mine_docer_click");
    },
    tapSafe: function() {
        i() || (a("usercenter/usersafe"), e.stat("mine_safe_click"));
    },
    getSpaceInfo: function() {
        var e = this;
        c().then(function(t) {
            var a = n(t.used, 2, !0), i = n(t.total, 2, !0);
            e.setData({
                spaceUsed: a,
                spaceTotal: i
            });
        });
    },
    getUserInfo: function() {
        var t = this, a = !1;
        e.globalData.accountUser && (a = !0, this.getMemberInfo(e.globalData.accountUser.userid)), 
        r().then(function(i) {
            a || t.getMemberInfo(i.userid), e.initAccountUser(), t.refreshAccountUser();
        });
    },
    getMemberInfo: function(t) {
        var a = this;
        o(t).then(function(t) {
            e.initUserMember(), a.refreshUserInfo();
        });
    },
    refreshUserInfo: function() {
        var t = e.getMemberIconAndMsg(), a = t.vipMsg, i = t.memberIcon;
        a === this.data.vipMsg && i === this.data.memberIcon || this.setData({
            vipMsg: a,
            memberIcon: i
        });
    },
    refreshAccountUser: function() {
        if (e.globalData.accountUser) {
            var t = e.globalData.accountUser, a = t.pic, i = void 0 === a ? "../../../libs/img/avatar_default.svg" : a, n = t.nickname, c = void 0 === n ? "" : n, s = t.regtime, r = Math.ceil((new Date().getTime() / 1e3 - s) / 86400);
            i === this.data.avatar && c === this.data.nickname || this.setData({
                avatar: i,
                nickname: c,
                useServiceDays: r
            });
        }
    },
    refreshSafeInfo: function() {
        var e = this;
        f().then(function(t) {
            var a = 0 === t.twice_verify_status ? "存在1项风险" : "";
            e.setData({
                safeMsg: a
            });
        });
    },
    onShareAppMessage: function() {
        return u;
    }
});