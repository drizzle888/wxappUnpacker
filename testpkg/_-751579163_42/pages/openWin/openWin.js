var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, e = getApp(), i = require("../../action/redirect/index.js"), r = require("../../config/index.js").wxmp2DriveQs, o = require("../../action/weboffice/index.js").uploadCliper, a = require("../../store/store.js"), n = a.StoreType;

Page({
    data: {
        url: ""
    },
    onLoad: function(e) {
        this.clearCache();
        var i = e.url;
        i = i + "?from=" + r + "&product=drive";
        var o = [];
        for (var a in e) if ("url" !== a) {
            var n = e[a];
            "object" === (void 0 === n ? "undefined" : t(n)) ? o.push(a + "=" + JSON.stringify(n)) : void 0 !== n && o.push(a + "=" + n);
        }
        var c = o.length ? "&" + o.join("&") : "";
        c && (i = "" + i + c), this.loginRedirect(i), this.$data = {
            cliperData: ""
        };
    },
    onShow: function() {
        this.handlerCliper();
    },
    loginRedirect: function(t) {
        var r = this;
        e.globalData.hasRedirectedLoginUrl ? this.setWebViewUrl(t) : i(t, !0).then(function(t) {
            e.globalData.hasRedirectedLoginUrl = !0, r.setWebViewUrl(t);
        }).catch(function() {
            return r.setWebViewUrl(t);
        });
    },
    setWebViewUrl: function(t) {
        this.setData({
            url: t
        });
    },
    handlerCliper: function() {
        var t = this;
        wx.getClipboardData({
            success: function(e) {
                e.data && t.$data.cliperData !== e.data && (t.$data.cliperData = e.data, o(e.data).then(function(t) {}));
            }
        });
    },
    clearCache: function() {
        var t = this.options, e = t.groupId, i = t.parentId;
        e && i && (a.setDirty(n.subFile(e, i)), a.setDirty(n.recent));
    }
});