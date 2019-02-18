var t = require("../../utils/util.js"), n = t.gotoPage, i = t.toast, e = require("../../action/transfer/index.js"), r = require("../../action/link/index.js").getLinkOrOpen;

getApp();

Component({
    properties: {
        fid: String,
        sid: String,
        fname: String,
        closeOnClickMask: Boolean
    },
    data: {
        sending: !1
    },
    methods: {
        tapMask: function() {
            this.properties.closeOnClickMask && this.triggerEvent("cancel");
        },
        tapCancel: function() {
            this.triggerEvent("cancel");
        },
        tapConfirm: function() {
            var t = this;
            this.toggleSending(!0);
            var n = this.properties, e = n.fid, s = n.sid;
            s ? this.transfer(s) : e && r(e).then(function(n) {
                var i = n.link.sid;
                t.transfer(i);
            }).catch(function(t) {
                var n = t.result, e = t.msg;
                return i("打开链接失败：" + (e || n));
            });
        },
        transfer: function(t) {
            var n = this;
            e(t).then(function() {
                n.toggleSending(!1), n.triggerEvent("confirm", !0);
            }).catch(function() {
                n.toggleSending(!1), n.triggerEvent("confirm", !1);
            });
        },
        tapHowto: function() {
            n("receive");
        },
        toggleSending: function(t) {
            this.setData({
                sending: t
            });
        }
    }
});