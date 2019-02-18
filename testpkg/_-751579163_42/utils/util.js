function t(t) {
    if (Array.isArray(t)) {
        for (var e = 0, n = Array(t.length); e < t.length; e++) n[e] = t[e];
        return n;
    }
    return Array.from(t);
}

var e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, n = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
        var n = arguments[e];
        for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
    }
    return t;
}, r = require("../config/index.js"), o = r.extMap, a = r.dotviews, i = r.shares, u = {}, s = {
    s: [ "et", "xls", "xlt", "xlsx", "xlsm", "xltx", "xltm", "csv", "ett" ],
    w: [ "doc", "docx", "rtf", "txt", "xml", "mhtml", "mht", "html", "htm", "uof", "dot", "wps", "wpt", "dotx", "docm", "dotm" ]
}, c = function() {
    var t = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "").split(".");
    return (t.length > 1 ? t.pop() : "").toLowerCase();
}, f = function(t) {
    return !!~[ "wxls", "wdoc", "wppt" ].indexOf(c(t));
}, l = function(t) {
    return "pom" === c(t);
}, g = function(t) {
    return "pof" === c(t);
}, h = function(t) {
    return "h5" === c(t);
}, d = function(t) {
    try {
        return decodeURIComponent(t);
    } catch (e) {
        return t;
    }
}, m = function(t) {
    var e = o[c(t)];
    return ~i.indexOf(e) ? e : "unknown";
}, p = function(t, e) {
    if (void 0 != e && "file" !== e && "sharefile" !== e) return t;
    var n = "", r = t.split("."), o = r.length;
    if (o > 1) {
        var a = "." + r[o - 1];
        n = t.substring(0, t.length - a.length);
    } else n = t;
    return n;
}, v = function() {
    return wx.hideNavigationBarLoading();
}, w = function(t) {
    var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, r = arguments[2], o = arguments[3], a = getCurrentPages(), i = a && a[a.length - 1] || {}, u = i.route || i.__route__ || "", s = "../".repeat(Math.max(0, u.split("/").length - 1)), c = [];
    for (var f in n) {
        var l = n[f];
        "object" === (void 0 === l ? "undefined" : e(l)) ? c.push(f + "=" + JSON.stringify(l)) : void 0 !== l && c.push(f + "=" + l);
    }
    var g = c.length ? "?" + c.join("&") : "", h = [ t, t.match(/[^\/]+$/)[0] ].join("/"), d = s + "pages/" + h, m = {
        url: s + "pages/" + h + g
    };
    o && (m.fail = o), /tabBars/.test(d) ? wx.switchTab(m) : r ? wx.redirectTo(m) : wx.navigateTo(m);
}, y = function(t) {
    var e = !1;
    return t && t.corp && t.corp.id && (e = !!!t.is_plus), e;
}, x = function(t) {
    return {
        year: t.getFullYear(),
        month: t.getMonth() + 1,
        day: t.getDate(),
        hour: t.getHours(),
        minute: t.getMinutes(),
        second: t.getSeconds()
    };
}, b = function(t) {
    return t = t.replace(/[/\\:;*?",<>|%&]/g, ""), (t = t.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "")) && "我的团队" !== t ? t += "的团队" : t = "我的团队", 
    t;
}, D = function t(e, n, r, o) {
    var a = !1, i = e.getCacheData(e.StoreType.allTeam).teams, u = !0, s = !1, c = void 0;
    try {
        for (var f, l = i[Symbol.iterator](); !(u = (f = l.next()).done); u = !0) if (f.value.fname === r) {
            a = !0, r = "" + n + ++o;
            break;
        }
    } catch (t) {
        s = !0, c = t;
    } finally {
        try {
            !u && l.return && l.return();
        } finally {
            if (s) throw c;
        }
    }
    return a ? t(e, n, r, o) : r;
}, T = function(t) {
    var e = getApp(), n = y(e.globalData.user) ? 21 : 100;
    return t.length > n;
};

module.exports = {
    getExtName: c,
    isCodoc: f,
    isPom: l,
    isShowtang: h,
    isDoc: function(t) {
        var e = c(t);
        return "doc" === o[e];
    },
    isXls: function(t) {
        var e = c(t);
        return "xls" === o[e];
    },
    isPpt: function(t) {
        var e = c(t);
        return "ppt" === o[e];
    },
    isPdf: function(t) {
        var e = c(t);
        return "pdf" === o[e];
    },
    decode: d,
    getShareIcon: m,
    getShareInfo: function(t, e, n) {
        var r = t.sid, o = t.fname, a = t.ftype, i = "/pages/share/share?sid=" + r + "&fname=" + o;
        return n && (i += "&sharer=" + n), {
            title: d(p(o, a)),
            path: i,
            imageUrl: e || "https://qn.cache.wpscdn.cn/wxminiprogram/thumbs_v2/" + m(o) + ".png"
        };
    },
    getEditInvitationInfo: function(t, e, n, r, o) {
        var a = p(e, n), i = "/pages/shareEditRedirect/shareEditRedirect?leid=" + t + "&fname=" + e;
        return o && (i += "&sharer=" + o), {
            title: d("邀请你一起写 「" + a + "」"),
            path: i,
            imageUrl: r || "https://qn.cache.wpscdn.cn/wxminiprogram/thumbs_v2/" + m(e) + ".png"
        };
    },
    isPreviewAble: function(t) {
        var e = c(t);
        return "img" === o[e] || l(t) || g(t) || ~a.indexOf(e);
    },
    isThirdPreview: function(t) {
        return f(t) || l(t) || h(t) || g(t);
    },
    gotoPage: w,
    showLoading: function(t) {
        return wx.showNavigationBarLoading();
    },
    hideLoading: v,
    toast: function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
        v();
        var o = e.icon || "none";
        if (wx.showToast(n({
            title: t,
            icon: o
        }, e)), r) {
            var a = e.duration ? e.duration : 1500;
            setTimeout(r, a);
        }
    },
    noExtName: p,
    isCompanyAccount: y,
    isWpsCompanyAccount: function(t) {
        return t && t.corp && 41000207 === t.corp.id;
    },
    isWebOfficeType: function(e) {
        var n = [];
        return Object.keys(s).forEach(function(e) {
            n.push.apply(n, t(s[e]));
        }), ~n.indexOf(e);
    },
    getWebOfficeType: function(t) {
        var e = "";
        return Object.keys(s).forEach(function(n) {
            e || s[n].find(function(e) {
                return e === t;
            }) && (e = n);
        }), e;
    },
    isBatter: function() {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "lastTape", e = Date.now();
        return e - (u[t] || 0) < 1e3 || (u[t] = e, !1);
    },
    convertUnit: function(t) {
        for (var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2, n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], r = parseFloat(t), o = "B"; r >= 1024; ) if (r /= 1024, 
        "B" === o) o = "KB"; else if ("KB" === o) o = "MB"; else if ("MB" === o) o = "GB"; else if ("GB" === o) o = "TB"; else if ("TB" === o) o = "PB"; else if ("PB" === o) {
            o = "EB";
            break;
        }
        return r = r.toFixed(e), "B" === o && (r = parseInt(t)), n && r == parseInt(r) && (r = parseInt(r)), 
        r + " " + o;
    },
    formatUrl: function(t, n) {
        if ("object" !== (void 0 === n ? "undefined" : e(n))) return t;
        var r = "";
        for (var o in n) r = r + (r ? "&" : "?") + o + "=" + n[o];
        return t + r;
    },
    formatDate_MMddHHmm: function(t) {
        var e = new Date();
        e.setTime(1e3 * t);
        var n = x(e), r = n.month + "月" + n.day + "日 ";
        return r += n.hour < 10 ? "0" + n.hour : n.hour, r += ":", r += n.minute < 10 ? "0" + n.minute : n.minute;
    },
    formatDate_MMdd: function(t) {
        var e = new Date();
        e.setTime(1e3 * t);
        var n = x(e);
        return n.month + "月" + n.day + "日";
    },
    formatDate_HHmm: function(t) {
        var e = new Date();
        e.setTime(1e3 * t);
        var n = x(e), r = "";
        return r += n.hour < 10 ? "0" + n.hour : n.hour, r += ":", r += n.minute < 10 ? "0" + n.minute : n.minute;
    },
    highLightFormat: function(t, e) {
        for (var n = t.toLowerCase(), r = e.toLowerCase(), o = 0, a = "", i = n.indexOf(r, o); -1 != i; ) {
            var u = t.substring(i, i + r.length);
            a = a + t.substring(o, i) + "<em>" + u + "</em>", o = i + r.length, i = n.indexOf(r, o);
        }
        return a += t.substring(o, t.length);
    },
    checkGlobalIntent: function() {
        var t = getApp();
        if (t.globalData.intent) {
            var e = t.globalData.intent.pages, n = e.shift();
            w(n, t.globalData.intent), 0 === e.length && delete t.globalData.intent;
        }
    },
    getTeamRole: function(t, e) {
        var n = t.getCacheData(t.StoreType.allTeam).teams.find(function(t) {
            return t.id == e;
        });
        return n && n.user_role || "";
    },
    getTeamName: function(t) {
        var e = getApp(), n = e.globalData.accountUser && e.globalData.accountUser.nickname || "我的团队";
        return n = b(n), n = D(t, n, n, 0), T(n) && (n = D(t, "我的团队", "我的团队", 0)), n;
    },
    getDateDelta: x,
    reloadCurrentPage: function() {
        var t = getCurrentPages();
        t.length > 0 && t[t.length - 1].reload && t[t.length - 1].reload();
    },
    formatRemainTime: function(t) {
        var e = "", n = t - Math.round(new Date() / 1e3);
        if (n > 0) {
            var r = Math.round(n / 86400), o = parseInt(n % 86400 / 3600);
            if (r > 0) e = " " + r + " 天后"; else if (o > 0) e = " " + o + " 小时后"; else {
                var a = parseInt(n % 86400 % 3600 / 60);
                0 == a && (a = 1), e = " " + a + " 分钟后";
            }
        }
        return e;
    },
    pathtxt: function(t) {
        var e = /\/tencent\/qqfile_recv\//i, n = /com\.tencent\.mipadqq:/i, r = /com\.tencent\.mqq:/i, o = /\/Tencent\/TIMfile_recv\//i, a = /Documents\/WeChat\sFiles\/[a-z0-9]+\/Files\//i, i = /tencent\/micromsg\/download\//i, u = /com\.tencent\.xin:/i, s = /C:\/Users\/[a-z0-9]+\/Desktop\//i, c = /C:\/Users\/[a-z0-9]+\/Downloads\//i, f = /\/Download/i;
        return /\/Documents\/Tencent\sFiles\/[a-z0-9]+\/FileRecv\//i.test(t) || e.test(t) || n.test(t) || r.test(t) ? "QQ" : o.test(t) ? "TIM" : a.test(t) || i.test(t) || u.test(t) ? "微信" : s.test(t) ? "桌面" : c.test(t) || f.test(t) ? "下载" : "其他位置";
    },
    isPageShow: function(t) {
        var e = getCurrentPages();
        if (e && e.length > 0) {
            var n = e[e.length - 1];
            return (n.route || n.__route__ || "") === t;
        }
        return !1;
    },
    rpx2px: function(t) {
        return t / 750 * wx.getSystemInfoSync().windowWidth;
    }
};