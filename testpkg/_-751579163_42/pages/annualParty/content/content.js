getApp();

var e = require("../../../utils/util.js"), n = (e.toast, e.gotoPage), t = e.rpx2px;

e.isWpsCompanyAccount, wx.getSystemInfoSync(), t(500);

Page({
    onLoad: function(e) {},
    tapCheckin: function() {
        n("preview", {
            sid: "stukzdj",
            fname: encodeURIComponent("年会指南"),
            ftype: "sharefile"
        });
    },
    tapPrize: function() {
        n("preview", {
            sid: "s3hq8ay",
            fname: encodeURIComponent("年会座位"),
            ftype: "sharefile"
        });
    },
    onShareAppMessage: function() {
        return {
            title: "WPS-2019企业年会",
            imageUrl: "https://qn.cache.wpscdn.cn/wxminiprogram/application/annual-share-2.jpg",
            path: "pages/annualParty/content/content"
        };
    }
});