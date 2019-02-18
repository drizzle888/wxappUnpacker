var e = getApp(), t = (require("../../config/index.js").appShareInfo, require("../../utils/util.js")), s = t.gotoPage;

t.toast, require("../../store/store.js").StoreType;

Page({
    data: {
        fname: "",
        isSuccess: !0,
        msg: ""
    },
    onLoad: function(e) {
        var t = this.options, s = t.fname, a = t.result, o = t.msg;
        s = decodeURIComponent(s) || "", this.setData({
            fname: s,
            isSuccess: "1" === a,
            msg: o
        });
    },
    tapHome: function() {
        s("tabBars/recent"), e.stat("collect_end_visit", {
            type: "home"
        });
    },
    tapRedo: function() {
        wx.navigateBack();
    }
});