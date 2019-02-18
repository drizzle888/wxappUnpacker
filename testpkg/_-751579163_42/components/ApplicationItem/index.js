var t = getApp();

Component({
    properties: {
        appid: String,
        path: String,
        img: String,
        desc: String,
        type: String,
        show: Boolean,
        isNew: Boolean
    },
    data: {
        extraData: {
            sid: t.getWpssid()
        }
    },
    methods: {
        tapEvent: function(t) {
            this.triggerEvent("tapEvent", this.properties);
        }
    }
});