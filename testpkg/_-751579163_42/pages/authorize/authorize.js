var e = getApp(), a = function() {
    return e.isLogined();
};

Page({
    data: {},
    $data: {
        firstShow: !0
    },
    onLoad: function(a) {
        var t = this;
        e.clearWpssid(), e.callAfterLogin(function() {
            setTimeout(function() {
                t.backPage();
            }, 500);
        });
    },
    onUnload: function() {
        a() && this.checkPreviewPage();
    },
    backPage: function() {
        var e = getCurrentPages();
        e.length > 1 && "pages/authorize/authorize" === e[e.length - 1].route && wx.navigateBack({
            delta: 1
        });
    },
    checkPreviewPage: function() {
        var a = e.mass.get("pages/preview/preview");
        a && (console.log("previewPage", e.getWpssid()), a.$data.backToSharePage = !1, a.askForLoginFromWebOffice());
    }
});