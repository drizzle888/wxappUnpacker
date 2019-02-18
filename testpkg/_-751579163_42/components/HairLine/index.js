var t = wx.getSystemInfoSync().pixelRatio > 1;

Component({
    properties: {
        isStatic: Boolean,
        color: String
    },
    data: {
        hasHairline: t,
        isStatic: !1,
        color: "#e6e6e6"
    },
    attached: function() {
        var t = {};
        t.isStatic = this.properties.isStatic || !1, t.color = this.properties.color || "#e6e6e6", 
        this.setData(t);
    }
});