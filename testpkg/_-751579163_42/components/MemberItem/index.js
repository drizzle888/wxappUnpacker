var e = getApp(), t = require("../../action/groups/index.js"), r = t.updateMember, s = t.deleteMember, i = require("../../utils/util.js").toast;

Component({
    properties: {
        groupid: String,
        memberid: String,
        img: String,
        name: String,
        role: String,
        creatorOpera: Boolean,
        adminOpera: Boolean
    },
    methods: {
        tapItem: function() {
            var t = this, r = [];
            this.properties.creatorOpera ? r = "admin" == this.properties.role ? [ "移除管理员", "移出共享" ] : [ "设为管理员", "移出共享" ] : this.properties.adminOpera && (r = [ "移出共享" ]), 
            r.length > 0 && wx.showActionSheet({
                itemList: r,
                success: function(e) {
                    t.handleChoose(r[e.tapIndex]);
                }
            }), e.stat("more_team_set_click");
        },
        handleChoose: function(e) {
            switch (e) {
              case "移除管理员":
                this.setAsRole("member");
                break;

              case "设为管理员":
                this.setAsRole("admin");
                break;

              case "移出共享":
                this.moveOut();
            }
        },
        setAsRole: function(t) {
            var s = this, o = this.properties.groupid, a = this.properties.memberid;
            r(o, a, t).then(function(r) {
                i("设置成功"), s.setData({
                    role: t
                }), e.stat("more_team_set_success");
            }).catch(function(r) {
                var s = r.result, o = r.msg;
                i("" + (o || "设置失败")), e.stat("more_team_set_fail", {
                    type: t,
                    errorCode: s
                });
            });
        },
        moveOut: function() {
            var t = this, r = this.properties.groupid, o = this.properties.memberid;
            s(r, o).then(function(r) {
                i("移出成功"), t.triggerEvent("delEvent", {
                    memberid: o
                }), e.stat("more_team_set_success");
            }).catch(function(t) {
                var r = t.result, s = t.msg;
                i("" + (s || "移出失败")), e.stat("more_team_set_fail", {
                    type: "delete",
                    errorCode: r
                });
            });
        }
    }
});