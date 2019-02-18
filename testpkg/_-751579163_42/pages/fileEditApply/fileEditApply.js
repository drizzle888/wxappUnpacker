var t = require("../../utils/util.js").gotoPage, a = getApp();

Page({
    tapFollow: function() {
        a.stat("follow_offical_account_click"), t("followWPS");
    },
    tapReturn: function() {
        getCurrentPages().length > 2 && wx.navigateBack({
            delta: 2
        });
    }
});