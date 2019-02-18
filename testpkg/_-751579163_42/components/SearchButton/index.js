var a = require("../../utils/util.js"), e = a.gotoPage, t = (a.isCompanyAccount, 
require("../../action/user/user.js")), r = t.accountUser, n = t.userMember, i = getApp();

Component({
    properties: {
        inputText: {
            type: String,
            value: "",
            observer: "checkCanClearInputValue"
        },
        isBindTapAvatar: Boolean,
        isBindTapSearch: Boolean
    },
    data: {
        avatar: "../../libs/img/avatar_default.svg",
        memberIcon: "",
        isInSearchPage: !1,
        inputText: "",
        isFocus: !1,
        canClearInputValue: !1
    },
    attached: function() {
        var a = getCurrentPages(), e = a && a[a.length - 1] || {};
        "pages/search/search" === (e.route || e.__route__ || "") ? this.setData({
            isInSearchPage: !0,
            isFocus: !0,
            canClearInputValue: !1
        }) : this.setData({
            isInSearchPage: !1,
            isFocus: !1,
            canClearInputValue: !1
        });
    },
    methods: {
        loadAvatar: function() {
            var a = this;
            i.callAfterLogin(function() {
                a._updateAvatar() || r().then(function(e) {
                    i.initAccountUser(), a._updateAvatar();
                });
            });
        },
        _updateAvatar: function() {
            var a = i.globalData.accountUser;
            return !(!a || !a.userid) && (this.loadMember(a.userid), a.pic && a.pic !== this.data.avatar && this.setData({
                avatar: a.pic
            }), !0);
        },
        loadMember: function(a) {
            var e = this;
            this._updateMember() || n(a).then(function(a) {
                i.initUserMember(), e._updateMember();
            });
        },
        _updateMember: function() {
            if (i.globalData.userMember) {
                var a = i.getMemberIconAndMsg().memberIcon;
                return a !== this.data.memberIcon && this.setData({
                    memberIcon: a
                }), !0;
            }
            return !1;
        },
        tapAvatar: function() {
            this.properties.isBindTapAvatar ? this.triggerEvent("tapAvatarEvent") : i.isLogined() && (i.stat("recent_mine_click"), 
            e("tabBars/home"));
        },
        tapSearch: function(a) {
            this.properties.isBindTapSearch ? this.triggerEvent("tapSearchEvent") : this.data.isInSearchPage || (e("search"), 
            i.stat("search_click"));
        },
        tapClearSearchValue: function(a) {
            this.setData({
                inputText: "",
                isFocus: !0,
                canClearInputValue: !1
            }), this.triggerEvent("searchNameConfirmed", {
                name: ""
            }, {});
        },
        searchNameConfirmed: function(a) {
            var e = a.detail.value;
            this.setData({
                inputText: e
            }), this.triggerEvent("searchNameConfirmed", {
                name: e
            }, {});
        },
        searchNameChanged: function(a) {
            var e = a.detail.value;
            this.checkCanClearInputValue(e), this.triggerEvent("searchNameChanged", {
                name: e
            }, {});
        },
        checkCanClearInputValue: function(a) {
            0 === a.length ^ !this.data.canClearInputValue && this.setData({
                isFocus: !0,
                canClearInputValue: !this.data.canClearInputValue
            });
        }
    }
});