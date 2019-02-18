var e = getApp(), t = require("../../utils/util.js"), i = t.showLoading, a = t.hideLoading;

Page({
    data: {
        loading: !0,
        deviceComplete: !1,
        isLoadResultAvailable: !1
    },
    onLoad: function() {
        this.$data = Object.create(null);
    },
    onUnload: function() {
        this.$data.pageUnloaded = !0;
    },
    onReady: function() {
        var t = this;
        this.$deviceList = this.selectComponent("#deviceList"), this.$deviceList.init({
            type: "device"
        }, !1), this.$deviceList.listenLoadResult(function(e) {
            t.setData({
                isLoadResultAvailable: !0,
                deviceComplete: e.complete
            }), t.data.deviceComplete || t.refreshToCheckDeviceCompleteLater();
        }), e.callAfterLogin(function() {
            t.$deviceList.reflesh();
        }), wx.setNavigationBarTitle({
            title: "我的设备"
        });
    },
    refreshToCheckDeviceCompleteLater: function() {
        var e = this;
        setTimeout(function() {
            e.$data.pageUnloaded || e.data.deviceComplete || e.$deviceList.reflesh();
        }, 3e3);
    },
    onloadStatusChange: function(e) {
        var t = e.detail.status;
        "loaded" === t ? (a(), wx.stopPullDownRefresh(), this.setData({
            loading: !1
        })) : "loading" === t && (i(), this.setData({
            loading: !0
        }));
    },
    onPullDownRefresh: function() {
        this.$deviceList.reflesh();
    },
    onReachBottom: function() {
        this.$deviceList.morePage();
    },
    tapRefresh: function() {
        this.$deviceList.reflesh();
    }
});