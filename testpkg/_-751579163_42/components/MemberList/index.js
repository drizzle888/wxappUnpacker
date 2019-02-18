getApp();

var e = require("../../store/store.js"), t = e.StoreType, r = require("../../action/groups/index.js"), a = r.groupMembers, o = (r.deleteMember, 
r.groupInfo), s = require("../../utils/util.js"), i = s.toast;

s.getExtName, s.decode, s.showLoading, s.hideLoading;

Component({
    properties: {
        groupid: String
    },
    data: {
        members: [],
        isAdmin: !1,
        isCreator: !1,
        empty: !1
    },
    methods: {
        firstMembers: function(r) {
            var a = this;
            this.$data = {
                user_role: "",
                offset: 0,
                noMore: !1
            };
            var s = this.properties.groupid;
            o(s).then(function(o) {
                a.$data.user_role = o.user_role, e.updateData(t.allTeam, {
                    team: o
                }), a.getMembers(r, !0);
            }).catch(function(e) {
                console.log(e), r && r();
                e.result;
                var t = e.msg;
                i("" + (t || "获取成员失败"));
            });
        },
        moreMembers: function(e) {
            this.getMembers(e, !1);
        },
        getMembers: function(e, t) {
            var r = this;
            this.$data.noMore || a(this.properties.groupid, this.$data.offset, 100).then(function(a) {
                var o = t ? [] : r.data.members, s = r.$data.user_role, i = "creator" == s, n = "admin" == s, m = a.length < 100;
                r.$data.offset += 100, r.$data.noMore = m, a.length > 0 && (o = o.concat(a));
                var u = o.length <= 0;
                r.setData({
                    members: o,
                    isCreator: i,
                    isAdmin: n,
                    empty: u,
                    loadMoreText: m ? "" : "正在加载更多"
                }), e && e(o);
            }).catch(function(t) {
                console.log(t), e && e();
                t.result;
                var r = t.msg;
                i("" + (r || "获取成员失败"));
            });
        },
        delEvent: function(r) {
            for (var a = this, o = this.data.members, s = 0; s < o.length && o[s].id != r.detail.memberid; s++) ;
            o.splice(s, 1), this.setData({
                members: o
            });
            var i = e.getCacheData(t.allTeam).teams.find(function(e) {
                return e.id == a.properties.groupid;
            });
            i && (i.member_count -= 1, e.updateData(t.allTeam, {
                team: i
            })), this.triggerEvent("memberRemoved", {
                memberid: r.detail.memberid
            });
        },
        loadShareGroupMembers: function(e) {
            this.setData({
                members: this.formatShareGroupMembers(e)
            });
        },
        formatShareGroupMembers: function(e) {
            return e.map(function(e) {
                return {
                    avatar: e.avatar,
                    name: e.name,
                    role: ""
                };
            });
        }
    }
});