require("utils/ald-stat.js");

var e = require("utils/mass"), t = (require("utils/api.js"), require("action/user/user.js").driveUser), r = require("utils/util.js"), i = (r.showLoading, 
r.hideLoading, r.gotoPage, r.formatUrl), a = r.getDateDelta, n = r.isWpsCompanyAccount, o = require("action/config/index.js").useMdrivePreview, s = require("config/index.js").appTabRedDotVersion, u = require("store/store.js"), l = u.StoreType, c = require("utils/login.js");

App({
    globalData: {
        accountUser: null,
        userMember: null,
        user: null,
        mine: null,
        auto: null,
        hasRedirectedLoginUrl: !1,
        useMdrivePreview: !1,
        scene: "",
        hasShareGroup: !1,
        indexPage: {
            options: null
        },
        editRedirectPage: {
            options: null
        },
        teams: [],
        bindPhoneGuideClosed: !1
    },
    stat: function(e, t) {
        e && (t ? this.aldstat.sendEvent(e, t) : this.aldstat.sendEvent(e));
    },
    queryPreviewSwitch: function() {
        var e = this;
        o().then(function(t) {
            var r = t.UseMdrivePreview;
            e.globalData.useMdrivePreview = !!r;
        }).catch(function() {});
    },
    onLaunch: function(t) {
        c.init(), this.initWithStorage(), this.navigateToMiniProgram(t), this.mass = new e(), 
        this.initTabBarRedDot();
    },
    initWithStorage: function() {
        c.isLogined() && (this.initUserInfo(), this.initAccountUser(), this.initUserMember());
    },
    initUserInfo: function() {
        var e = wx.getStorageSync("userInfo");
        e && (this.globalData.user = e);
    },
    initAccountUser: function() {
        var e = wx.getStorageSync("accountUser");
        e && (this.globalData.accountUser = e);
    },
    initUserMember: function() {
        var e = wx.getStorageSync("userMember");
        e && (this.globalData.userMember = e);
    },
    initTabBarRedDot: function() {
        (wx.getStorageSync("appRedDotVersion") || 0) < s && wx.showTabBarRedDot({
            index: 2
        });
    },
    navigateToMiniProgram: function(e) {
        var t = e.scene, r = e.path, a = e.query;
        this.globalData.scene = t, t && 1037 === t && (this.isLogined() || this.callAfterLogin(function() {
            var e = "/" + i(r, a);
            wx.reLaunch({
                url: e
            });
        }));
    },
    callAfterLogin: function(e, t) {
        c.callAfterLogin(e, t);
    },
    authorizedCallback: function() {
        c.afterAuthorize();
    },
    isLogined: function() {
        return c.isLogined();
    },
    clearWpssid: function() {
        c.clearWpssid(), delete this.globalData.user, delete this.globalData.accountUser, 
        delete this.globalData.userMember, this.globalData.hasRedirectedLoginUrl = !1, wx.removeStorageSync("recents"), 
        wx.removeStorageSync("userInfo"), wx.removeStorageSync("accountUser"), wx.removeStorageSync("userMember"), 
        u.reset();
    },
    getMemberId: function() {
        if (!this.globalData.userMember) return 0;
        var e = this.globalData.userMember.vip;
        if (!e) return 0;
        var t = e.memberid;
        if (t < 100 || !e.enabled || 0 === e.enabled.length) return t;
        var r = 0, i = !0, a = !1, n = void 0;
        try {
            for (var o, s = e.enabled[Symbol.iterator](); !(i = (o = s.next()).done); i = !0) {
                var u = o.value;
                r = Math.max(r, u.memberid);
            }
        } catch (e) {
            a = !0, n = e;
        } finally {
            try {
                !i && s.return && s.return();
            } finally {
                if (a) throw n;
            }
        }
        return r;
    },
    getMemberIconAndMsg: function() {
        var e = void 0, t = void 0;
        switch (this.getMemberId()) {
          case 20:
            e = "", t = "member_logo.png";
            break;

          case 40:
            e = "", t = "super_member_logo.png";
            break;

          default:
            e = "超大云空间、去广告", t = "";
        }
        return {
            vipMsg: e,
            memberIcon: t
        };
    },
    writeLog: function(e) {
        if (e) {
            e.userId = this.globalData.user && this.globalData.user.id || "";
            var t = JSON.stringify(e);
            u.addData(l.log, [ t ]);
        }
    },
    getIsMember: function() {
        switch (this.getMemberId()) {
          case 20:
          case 40:
            return !0;

          default:
            return !1;
        }
    },
    getIsDocerVip: function() {
        if (!this.globalData.userMember) return !1;
        var e = this.globalData.userMember.vip;
        if (!e) return !1;
        if (12 === e.memberid) return !0;
        if (!e.enabled || 0 === e.enabled.length) return !1;
        var t = !0, r = !1, i = void 0;
        try {
            for (var a, n = e.enabled[Symbol.iterator](); !(t = (a = n.next()).done); t = !0) if (12 === a.value.memberid) return !0;
        } catch (e) {
            r = !0, i = e;
        } finally {
            try {
                !t && n.return && n.return();
            } finally {
                if (r) throw i;
            }
        }
        return !1;
    },
    getDriveUser: function() {
        var e = this;
        return new Promise(function(r, i) {
            var a = e.globalData.user;
            a ? r(a) : t().then(function(t) {
                e.globalData.user = t, r(t);
            });
        });
    },
    getRandomId: function() {
        return this.globalData && this.globalData.randomId || (this.globalData.randomId = Math.ceil(1e5 * Math.random())), 
        this.globalData.randomId;
    },
    getUserId: function() {
        var e = "";
        return this.globalData.user && this.globalData.user.id && (e = this.globalData.user.id), 
        e;
    },
    getWpssid: function() {
        return c.getWpssid();
    },
    getVerifyData: function() {
        return c.getVerifyData();
    },
    isAuthorized: function() {
        return c.isAuthorized();
    },
    afterLoginSuccess: function(e) {
        var t = this;
        e && (this.globalData.hasRedirectedLoginUrl = !1), this.getDriveUser().then(function() {
            t.checkFirstDailyLogin();
        }), this.setTabItemText();
    },
    checkFirstDailyLogin: function() {
        var e = this.getUserId();
        if (e) {
            var t = a(new Date()), r = "first_daily_login", i = t.year + "-" + t.month + "-" + t.day + "-" + e;
            i !== wx.getStorageSync(r) && (wx.setStorageSync(r, i), this.stat(r));
        }
    },
    setTabItemText: function() {
        n(this.globalData.user) && wx.setTabBarItem({
            index: 2,
            text: "工作"
        });
    }
});