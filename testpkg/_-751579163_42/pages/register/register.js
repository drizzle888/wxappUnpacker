var e = getApp();

Page({
    data: {},
    $data: {
        route: "",
        scene: ""
    },
    onLoad: function(t) {
        var a = decodeURIComponent(t.route), o = e.globalData.scene;
        this.$data = {
            route: a,
            scene: o
        }, e.stat("authorize_visit", {
            route: a,
            scene: o
        });
    },
    onUnload: function() {},
    getUserInfo: function(t) {
        var a = this.$data, o = a.route, n = a.scene, s = t.detail || t, r = (e.globalData, 
        s.userInfo);
        e.stat("authorize_click", {
            route: o,
            scene: n
        }), r ? (getCurrentPages().length > 1 && wx.navigateBack({
            delta: 1
        }), e.authorizedCallback(), e.stat("authorize_success", {
            route: o,
            scene: n
        })) : e.stat("authorize_fail", {
            route: o,
            scene: n
        });
    }
});