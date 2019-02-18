var e = getApp(), t = require("../../action/account/account.js"), n = t.bindStatus, i = t.bindWeChatPhone, a = require("../../utils/util.js"), o = a.gotoPage, d = a.toast;

Component({
    data: {
        showBindPhoneGuide: !1,
        isBinding: !1
    },
    attached: function() {
        this.$data = Object.create(null), this.$data.checkingBindPhoneStatus = !1;
    },
    detached: function() {
        this.$data.detached = !0;
    },
    methods: {
        checkBindPhoneStatus: function() {
            var t = this;
            e.isLogined() && !e.globalData.bindPhoneGuideClosed ? this.$data.checkingBindPhoneStatus || (wx.login({
                success: function(e) {
                    t.$data.code = e.code;
                },
                fail: function(e) {
                    t.$data.code = "";
                }
            }), this.$data.checkingBindPhoneStatus = !0, n().then(function(n) {
                t.$data.checkingBindPhoneStatus = !1, t.$data.detached || (e.isLogined() && !e.globalData.bindPhoneGuideClosed ? (t.setData({
                    showBindPhoneGuide: !n.phone
                }), t.data.showBindPhoneGuide && e.stat("recent_phone_visit")) : t.setData({
                    showBindPhoneGuide: !1
                }));
            }).catch(function(e) {
                t.$data.checkingBindPhoneStatus = !1;
            })) : this.setData({
                showBindPhoneGuide: !1
            });
        },
        tapBindPhoneGuide: function() {
            e.stat("recent_phone_click");
        },
        tapCloseBindPhoneGuide: function() {
            e.globalData.bindPhoneGuideClosed = !0, this.setData({
                showBindPhoneGuide: !1
            }), e.stat("recent_phone_close");
        },
        _onBindWeChatPhone: function() {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
            this.$data.detached || (this.setData({
                isBinding: !1
            }), e.globalData.bindPhoneGuideClosed || (t ? ("CellPhoneBind" === t.result ? o("openWin", {
                url: "https://account.wps.cn/v1/mergeaccountresult",
                bind: "phone",
                ssid: t.ssid || ""
            }) : "UserHasBindedPhone" === t.result ? (this.setData({
                showBindPhoneGuide: !1
            }), d("你已绑定了手机")) : d(t.msg || "绑定微信手机号失败"), e.stat("binding_phone_authorize_result", {
                type: "fail"
            })) : (this.setData({
                showBindPhoneGuide: !1
            }), o("usercenter/usersafe"), e.stat("binding_phone_authorize_result", {
                type: "success"
            }))));
        },
        getPhoneNumber: function(t) {
            var n = this;
            if ("getPhoneNumber:ok" === t.detail.errMsg) {
                e.stat("binding_phone_authorize_click", {
                    type: "confirm"
                });
                var a = this.$data.code;
                if (a) {
                    if (!this.$data.detached && !e.globalData.bindPhoneGuideClosed) {
                        this.setData({
                            isBinding: !0
                        });
                        var o = t.detail, s = o.iv, h = o.encryptedData;
                        i(a, s, h).then(function(e) {
                            return n._onBindWeChatPhone();
                        }).catch(function(e) {
                            return n._onBindWeChatPhone(e);
                        });
                    }
                } else d("获取code失败");
            } else e.stat("binding_phone_authorize_click", {
                type: "cancel"
            });
        }
    }
});