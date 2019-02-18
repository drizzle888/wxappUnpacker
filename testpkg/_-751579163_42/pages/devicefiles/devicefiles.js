var i = getApp(), t = require("../../utils/util.js"), e = t.showLoading, s = t.hideLoading;

Page({
    onReady: function() {
        var t = this;
        this.$fileList = this.selectComponent("#filelist");
        var e = Object.create(null);
        e.type = "deviceFile", e.deviceid = this.options.deviceid, this.$fileList.init(e, !1), 
        i.callAfterLogin(function() {
            t.$fileList.reflesh();
        }), wx.setNavigationBarTitle({
            title: this.options.fname
        });
    },
    reload: function(i) {
        this.$fileList && this.$fileList.reflesh(i);
    },
    onShow: function() {
        this.$fileList && this.$fileList.reflesh(!1);
    },
    onloadStatusChange: function(i) {
        var t = i.detail.status;
        "loaded" === t ? (s(), wx.stopPullDownRefresh()) : "loading" === t && e();
    },
    onPullDownRefresh: function() {
        this.$fileList.reflesh(!0);
    },
    onReachBottom: function() {
        this.$fileList.morePage();
    }
});