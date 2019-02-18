Component({
    properties: {
        from: String
    },
    data: {
        isShowGuide: !1
    },
    attached: function() {
        var e = this, t = null;
        this.properties.from && ("recent" == this.properties.from ? t = "page_recent" : "share" == this.properties.from && (t = "page_share")), 
        t && (this.$page_key = "canShowAddMiniProgramGuide_" + t, wx.getStorage({
            key: this.$page_key,
            success: function(t) {
                "false" != t.data && e.setData({
                    isShowGuide: !0
                });
            },
            fail: function(t) {
                t.errMsg && t.errMsg.indexOf("data not found") >= 0 && e.setData({
                    isShowGuide: !0
                });
            }
        }));
    },
    methods: {
        handleTap: function() {
            this.setData({
                isShowGuide: !1
            }), wx.setStorage({
                key: this.$page_key,
                data: "false"
            });
        }
    }
});