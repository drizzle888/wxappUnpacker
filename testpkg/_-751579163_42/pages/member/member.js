getApp();

var e = require("../../utils/util.js"), t = (e.toast, e.getExtName, e.decode, e.showLoading, 
e.hideLoading, e.gotoPage);

Page({
    data: {
        groupid: ""
    },
    onLoad: function(e) {
        var t = e.groupid;
        this.setData({
            groupid: t
        }), this.initMemberList();
    },
    onReady: function() {
        wx.setNavigationBarTitle({
            title: "查看共享成员"
        });
    },
    initMemberList: function() {
        this.$memberList = this.selectComponent("#memberList"), this.$memberList.firstMembers();
    },
    onReachBottom: function() {
        this.$memberList.moreMembers();
    },
    onPullDownRefresh: function() {
        this.$memberList.firstMembers();
    },
    tapAddMemberByMember: function() {
        var e = this.options, i = e.fname, o = e.groupid;
        console.log(i), t("invateteam", {
            fname: i,
            ftype: "team",
            groupid: o,
            mode: "invite"
        });
    }
});