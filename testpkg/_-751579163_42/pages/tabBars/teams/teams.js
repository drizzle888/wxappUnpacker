var t = getApp(), e = require("../../../store/store.js"), i = e.StoreType, o = require("../../../config/index.js").appShareInfo, n = require("../../../utils/util.js"), a = (n.gotoPage, 
n.showLoading), s = n.hideLoading, r = (n.toast, n.checkGlobalIntent);

Page({
    data: {
        groupid: 0,
        parentid: 0
    },
    onLoad: function() {
        var e = this;
        this.$fileList = this.selectComponent("#filelist"), this.$searchButton = this.selectComponent("#searchbutton"), 
        t.callAfterLogin(function() {
            e.$fileList.init(null, !0, 10, function() {
                e.reload(!0);
            });
        }), t.stat("team_visit");
    },
    onShow: function() {
        t.isLogined() && (r(), this.reload()), this.$searchButton.loadAvatar();
    },
    onloadStatusChange: function(t) {
        var o = t.detail.status;
        "loaded" === o ? (this.setData({
            groupid: e.getCacheData(i.allTeam).mine.id,
            parentid: 0
        }), s()) : "loading" === o && a();
    },
    reload: function(t) {
        this.$fileList.reflesh(t);
    },
    onPullDownRefresh: function() {
        this.$fileList.firstPage({}, function() {
            wx.stopPullDownRefresh();
        });
    },
    onReachBottom: function() {
        this.$fileList.morePage();
    },
    onShareAppMessage: function() {
        return o;
    }
});