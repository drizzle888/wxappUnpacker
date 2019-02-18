var t = require("../../utils/util.js");

t.gotoPage, t.toast, getApp();

Component({
    properties: {},
    data: {},
    methods: {
        tapCancel: function() {
            this.triggerEvent("cancel");
        },
        tapComfirm: function() {
            this.triggerEvent("confirm");
        }
    }
});