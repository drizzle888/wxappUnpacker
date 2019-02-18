function t(t, e, a) {
    return e in t ? Object.defineProperty(t, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = a, t;
}

var e = function() {
    function t(t, e) {
        var a = [], i = !0, n = !1, s = void 0;
        try {
            for (var o, r = t[Symbol.iterator](); !(i = (o = r.next()).done) && (a.push(o.value), 
            !e || a.length !== e); i = !0) ;
        } catch (t) {
            n = !0, s = t;
        } finally {
            try {
                !i && r.return && r.return();
            } finally {
                if (n) throw s;
            }
        }
        return a;
    }
    return function(e, a) {
        if (Array.isArray(e)) return e;
        if (Symbol.iterator in Object(e)) return t(e, a);
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
    };
}(), a = getApp(), i = require("../../action/groups/index.js"), n = i.groupInfo, s = i.groupMembers, o = i.inviteInfo, r = i.joinTeamInfo, d = i.joinTeam, c = i.formatTeam, h = require("../../utils/util.js"), u = h.gotoPage, l = h.toast, f = h.decode, p = h.isCompanyAccount, m = require("../../config/index.js").appShareInfo, v = require("../../action/files/operates.js").folderTransferToGroup, g = require("../../store/store.js"), b = g.StoreType, I = require("../../action/groups/index.js").addMembers, D = require("../../action/contacts/index.js").contacts, _ = require("../../action/groups/index.js").groupMembersAll;

Page({
    data: {
        fname: "",
        showAvatarsIcon: !1,
        avatars: [],
        memberNum: 0,
        teamGroupid: "",
        mode: "",
        userRole: "",
        error: "",
        errorDesc: "",
        initing: !0,
        showMembers: !0,
        contacts: [],
        addBtnDisabled: !0,
        visibleSelectedContactAvatars: [],
        selectedContactsLength: 0,
        scrollToRight: !1,
        visibleSelectedContactsListPositionFixed: !1,
        canChooseAll: !1,
        loadMoreContactsText: "",
        showApproveInput: !1,
        defaultApproveValue: "",
        isApproveCommited: !1
    },
    $data: {
        inviteUrl: "",
        joinKey: "",
        currentStep: -1,
        loadContactOffset: 0,
        loading: !1,
        noMoreData: !1,
        selectedUserIds: [],
        pageReady: !1,
        intersectionObserver: null
    },
    onLoad: function(t) {
        this.showLoading(), this.options.selectedIdList = this.options.selectedIdList || [], 
        this.init();
        var e = getCurrentPages(), i = e && e.length > 1 && e[0];
        if (i && "pages/tabBars/recent/recent" === (i.route || i.__route__ || "") && this.setData({
            showAvatarsIcon: !0
        }), this.isInviteMode()) {
            var n = e && e.length > 1 && e[e.length - 2], s = n && (n.route || n.__route__) || "", o = Object.create(null);
            o.from = s, "folder" == t.ftype ? o.type = "普通文件夹" : "team" == t.ftype && (o.type = "共享文件夹"), 
            a.stat("invite_click", o);
        }
    },
    init: function() {
        this.isInviteMode() ? this.initInvite() : this.isReceiveMode() && this.initReceive();
    },
    initInvite: function() {
        var t = f(this.options.fname);
        "folder" === this.options.ftype ? (this.setData({
            fname: t,
            mode: this.options.mode
        }), this.nextStep(0)) : "team" === this.options.ftype && (this.setData({
            fname: t,
            mode: this.options.mode,
            teamGroupid: this.options.groupid
        }), this.nextStep(1));
    },
    initReceive: function() {
        var t = p(a.globalData.user), e = f(this.options.fname);
        this.setData({
            fname: e,
            mode: this.options.mode,
            teamGroupid: this.options.groupid,
            error: t ? this.getServiceError() : "",
            errorDesc: t ? "企业用户暂不支持链接邀请" : ""
        }), this.$data.joinKey = this.options.key, t ? this.hideLoading() : a.isLogined() ? this.nextStep(1) : this.hideLoading(), 
        this.options.from && a.stat("invite_confirm_visit", {
            from: this.options.from
        });
    },
    startIntersectionObserverIfNeed: function() {
        var t = this;
        !this.data.showMembers || this.data.initing || this.$data.intersectionObserver || (this.$data.intersectionObserver = wx.createIntersectionObserver(this), 
        this.$data.intersectionObserver.relativeToViewport({
            top: 0
        }).observe("#id-member-list-head-seperator", function(e) {
            t.setData({
                visibleSelectedContactsListPositionFixed: e.intersectionRect.bottom <= 0
            });
        }));
    },
    stopIntersectionObserver: function() {
        this.$data.intersectionObserver && (this.$data.intersectionObserver.disconnect(), 
        this.$data.intersectionObserver = null);
    },
    onReady: function() {
        this.$data.pageReady = !0, this.startIntersectionObserverIfNeed();
    },
    onShow: function() {
        this.$data.pageReady && this.startIntersectionObserverIfNeed();
    },
    onHide: function() {
        this.stopIntersectionObserver();
    },
    onUnload: function() {
        this.$data.pageReady = !1, this.stopIntersectionObserver();
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var t = this;
        !this.data.showMembers || this.$data.noMoreData || this.$data.loading || (this.$data.loading = !0, 
        this.setData({
            loadMoreContactsText: "正在加载…"
        }), D("cloud_doc", this.$data.loadContactOffset, 20).then(function(e) {
            t.setData({
                loadMoreContactsText: ""
            }), t.$data.loading = !1, t.$data.loadContactOffset += e.contacts.length, (e.contacts.length < 20 || 0 == e.contacts.length) && (t.$data.noMoreData = !0);
            for (var a = [], i = 0; i < e.contacts.length; ++i) {
                (function(i) {
                    if (t.data.contacts.find(function(t) {
                        return t.userid === e.contacts[i].userid;
                    })) return "continue";
                    a.push(e.contacts[i]);
                })(i);
            }
            a.length > 0 && t.setData({
                contacts: t.formatData(t.data.contacts.concat(a))
            });
        }).catch(function(e) {
            t.$data.loading = !1, t.setData({
                loadMoreContactsText: ""
            });
        }));
    },
    onShareAppMessage: function() {
        return this.isInviteMode() && this.$data.joinKey && this.isUserCreatorOrAmin() ? {
            title: "邀请你加入协作「" + this.data.fname + "」",
            path: "/pages/invateteam/invateteam?fname=" + this.options.fname + "&groupid=" + this.data.teamGroupid + "&mode=receive&key=" + this.$data.joinKey + "&from=miniapp",
            imageUrl: "https://qn.cache.wpscdn.cn/wxminiprogram/sharefolder/invite_icon_1.jpg"
        } : m;
    },
    showLoading: function() {
        this.data.initing || this.setData({
            initing: !0
        }), wx.showNavigationBarLoading(), this.stopIntersectionObserver();
    },
    hideLoading: function() {
        this.data.initing && this.setData({
            initing: !1
        }), wx.hideNavigationBarLoading();
    },
    isInviteMode: function() {
        return "invite" === this.options.mode;
    },
    isReceiveMode: function() {
        return "receive" === this.options.mode;
    },
    tapCopyLink: function() {
        this.isInviteMode() && (a.stat("invite_page_click", {
            type: "copylink"
        }), this.$data.inviteUrl && this.copyLink());
    },
    copyLink: function() {
        if (this.isInviteMode() && this.$data.inviteUrl) {
            var t = this.$data.inviteUrl + "\n邀请你加入协作「" + this.data.fname + "」（" + this.data.memberNum + "人已加入），点击链接查看协作文档";
            wx.setClipboardData({
                data: t
            });
        }
    },
    tapJoin: function() {
        var t = this;
        this.isReceiveMode() && (this.data.showApproveInput ? a.stat("team_invite_verify_click") : a.stat("invite_confirm_click"), 
        a.callAfterLogin(function() {
            a.getDriveUser().then(function() {
                p(a.globalData.user) ? t.setData({
                    error: t.getServiceError(),
                    errorDesc: "企业用户暂不支持链接邀请"
                }) : t.$data.joinKey && t.join();
            }).catch(function(e) {
                return t.error(e);
            });
        }));
    },
    tapAvatar: function() {
        a.stat("invite_page_click", {
            type: "member"
        }), this.data.teamGroupid && u("member", {
            groupid: this.data.teamGroupid,
            fname: this.options.fname
        });
    },
    tapRetry: function() {
        this.showLoading(), this.setData({
            error: "",
            errorDesc: ""
        }), this.runStep();
    },
    tapBackMain: function() {
        u("tabBars/recent");
    },
    formatData: function(t) {
        var e = this.$data.selectedUserIds, a = this.options.selectedIdList, i = [];
        return t && t.length > 0 && (i = t.map(function(t) {
            return {
                userid: t.userid,
                name: t.name,
                avatar: t.avatar,
                checked: a.indexOf(t.userid) > -1 || e.indexOf(t.userid) > -1,
                enabled: a.indexOf(t.userid) < 0
            };
        })), i;
    },
    checkIsContactsLimited: function() {
        var t = this, e = g.getCacheData(b.allTeam).teams.find(function(e) {
            return e.id == t.data.teamGroupid;
        });
        return !!(e && e.member_count_limit - e.member_count <= this.$data.selectedUserIds.length) && (wx.showToast({
            title: "共享成员人数达到上限"
        }), !0);
    },
    getContactsNumThatCanAdd: function() {
        var t = this, e = g.getCacheData(b.allTeam).teams.find(function(e) {
            return e.id == t.data.teamGroupid;
        });
        if (e) {
            var a = e.member_count_limit - e.member_count;
            return a < 0 ? 0 : a;
        }
        return 0;
    },
    handleChoosenUsers: function(t, e) {
        for (var a = this.$data.selectedUserIds, i = {
            visibleSelectedContactAvatars: t,
            selectedContactsLength: a.length > 99 ? "99+" : a.length
        }, n = this.options.selectedIdList, s = !0, o = 0, r = a.length; o < r; ++o) {
            var d = a[o];
            if (n && n.indexOf(d) < 0) {
                s = !1;
                break;
            }
        }
        this.data.addBtnDisabled != s && (i.addBtnDisabled = s), this.setData(i), e && this.setData({
            scrollToRight: !0
        });
    },
    tapChooseContact: function(e) {
        var a = e.currentTarget.dataset.index;
        if (this.data.contacts[a].enabled && (this.data.contacts[a].checked || !this.checkIsContactsLimited())) {
            this.setData(t({}, "contacts[" + a + "].checked", !this.data.contacts[a].checked));
            var i = this.data.contacts[a].userid, n = this.data.visibleSelectedContactAvatars;
            if (this.data.contacts[a].checked) this.$data.selectedUserIds.push(i), n.push(this.data.contacts[a].avatar); else {
                var s = this.$data.selectedUserIds.indexOf(i);
                this.$data.selectedUserIds.splice(s, 1), n.splice(s, 1);
            }
            this.handleChoosenUsers(n, !0);
        }
    },
    addTeamMembersToSelectedIdList: function(t) {
        for (var e = this.options.selectedIdList, i = a.globalData.user && a.globalData.user.id, n = 0, s = t.length; n < s; ++n) {
            var o = t[n];
            o != i && e && e.indexOf(o) < 0 && e.push(o);
        }
    },
    showMembersIfNeed: function() {
        var t = this;
        if (this.data.showMembers && "invite" === this.data.mode && this.isUserCreatorOrAmin()) {
            wx.showNavigationBarLoading(), this.$data.selectedUserIds = [], this.$data.noMoreData = !1, 
            this.$data.loading = !0;
            var a = _(this.data.teamGroupid);
            this.$data.loadContactOffset = 0;
            var i = D("cloud_doc", this.$data.loadContactOffset, 12);
            Promise.all([ a, i ]).then(function(a) {
                var i = e(a, 2), n = i[0], s = i[1];
                t.$data.loading = !1, wx.hideNavigationBarLoading(), t.addTeamMembersToSelectedIdList(n.members);
                var o = s.contacts;
                t.$data.loadContactOffset = o.length, o.length < 12 && (t.$data.noMoreData = !0), 
                o = t.formatData(o), t.setData({
                    contacts: o
                });
            }).catch(function(e) {
                console.log(e), t.$data.loading = !1, wx.hideNavigationBarLoading(), l(e.msg || "网络异常，请稍后重试");
            });
        }
    },
    tapAddMember: function() {
        var t = this, e = this.$data.selectedUserIds;
        if (e && 0 != e.length) {
            for (var i = [], n = this.options.selectedIdList, s = 0, o = e.length; s < o; ++s) {
                var r = e[s];
                n.indexOf(r) < 0 && i.push(r);
            }
            wx.showLoading({
                title: "请稍等"
            }), I(this.data.teamGroupid, i).then(function(e) {
                if (wx.hideLoading(), l("成员已添加", {
                    duration: 1e3
                }, function() {
                    wx.navigateBack({
                        delta: 1
                    });
                }), e.members.length > 0) {
                    var i = g.getCacheData(b.allTeam).teams.find(function(e) {
                        return e.id == t.data.teamGroupid;
                    });
                    i && (i.member_count += e.members.length, g.updateData(b.allTeam, {
                        team: i
                    }));
                }
                a.stat("invite_success");
            }).catch(function(t) {
                wx.hideLoading(), l(t.msg || "网络异常，请稍后重试"), a.stat("invite_fail", {
                    errorCode: t.result || t.msg
                });
            }), a.stat("invite_page_click", {
                type: "add"
            });
        }
    },
    tapUnselectContact: function(e) {
        var a = e.target.dataset.index, i = this.$data.selectedUserIds.splice(a, 1), n = this.data.visibleSelectedContactAvatars;
        n.splice(a, 1);
        for (var s = 0, o = 0; o < this.data.contacts.length; ++o) if (this.data.contacts[o].userid == i) {
            s = o;
            break;
        }
        this.setData(t({}, "contacts[" + s + "].checked", !1)), this.handleChoosenUsers(n, !1);
    },
    tapChooseAll: function() {
        if (this.data.canChooseAll) {
            var t = this.getContactsNumThatCanAdd();
            if (0 !== t) {
                var e = !!this.data.contacts.find(function(t) {
                    return t.enabled && !t.checked;
                });
                e && t <= this.$data.selectedUserIds.length && (e = !1);
                for (var a = [], i = [], n = 0; n < this.data.contacts.length; ++n) if (this.data.contacts[n].enabled) {
                    if (e && n >= t) {
                        wx.showToast({
                            title: "共享成员人数达到上限"
                        });
                        break;
                    }
                    this.data.contacts[n].checked = e, this.data.contacts[n].checked && (a.push(this.data.contacts[n].userid), 
                    i.push(this.data.contacts[n].avatar));
                }
                this.$data.selectedUserIds = a, this.setData({
                    contacts: this.data.contacts
                }), this.handleChoosenUsers(i, !0);
            }
        }
    },
    nextStep: function(t) {
        t ? this.$data.currentStep = t : this.$data.currentStep++, this.runStep();
    },
    runStep: function() {
        switch (this.$data.currentStep) {
          case 0:
            this.doFolderTransferToGroup();
            break;

          case 1:
            this.getGroupInfo();
            break;

          case 2:
            this.member();
            break;

          case 3:
            this.invite();
        }
    },
    isUserCreatorOrAmin: function() {
        return "creator" === this.data.userRole || "admin" === this.data.userRole;
    },
    doFolderTransferToGroup: function() {
        var t = this;
        v({
            gid: this.options.groupid,
            fid: this.options.fid,
            fname: this.data.fname
        }, {
            resolve: function(e) {
                t.setData({
                    teamGroupid: e.id,
                    memberNum: e.member_count,
                    userRole: e.user_role
                }), t.showMembersIfNeed(), t.nextStep(2);
            },
            reject: function(e) {
                t.error(e);
            }
        });
    },
    getGroupInfo: function() {
        var t = this;
        n(this.data.teamGroupid).then(function(e) {
            var a = c(e);
            g.updateData(b.allTeam, {
                team: a
            }), t.isReceiveMode() ? t.intentFiles() : t.isInviteMode() && (t.setData({
                memberNum: e.member_count,
                userRole: e.user_role
            }), t.showMembersIfNeed(), t.nextStep());
        }).catch(function(e) {
            t.isReceiveMode() ? e.result ? "notGroupMember" === e.result ? a.callAfterLogin(function() {
                a.getDriveUser().then(function() {
                    r(t.options.key).then(function(e) {
                        if (e.need_approve) {
                            t.$approveValue = "我是" + a.globalData.user.name;
                            var i = [];
                            if (e.members && e.members.length > 0) for (var n = 0; n < e.members.length && n < 4; ++n) e.members[n].avatar && i.push(e.members[n].avatar);
                            t.setData({
                                showApproveInput: !0,
                                defaultApproveValue: t.$approveValue,
                                avatars: i,
                                memberNum: e.member_count
                            }), a.stat("team_invite_verify_visit");
                        }
                        t.hideLoading();
                    }).catch(function(e) {
                        e.result && "teamLinkNotExist" === e.result ? t.error(e) : t.hideLoading();
                    });
                }).catch(function(e) {
                    return t.error(e);
                });
            }) : "groupNotExist" === e.result ? t.error(e) : t.hideLoading() : t.hideLoading() : t.isInviteMode() && t.error(e);
        });
    },
    member: function() {
        var t = this;
        if (this.isUserCreatorOrAmin()) this.nextStep(); else {
            s(this.data.teamGroupid, 0, 4).then(function(e) {
                var a = e.map(function(t) {
                    return t.avatar;
                });
                t.data.memberNum > 4 && a.push("https://qn.cache.wpscdn.cn/wxminiprogram/sharefolder/more_icon.png"), 
                t.setData({
                    avatars: a.reverse()
                }), t.isInviteMode() ? t.nextStep() : t.hideLoading();
            }).catch(function(e) {
                t.error(e);
            });
        }
    },
    invite: function() {
        var t = this;
        this.isUserCreatorOrAmin() ? (o(this.data.teamGroupid).then(function(e) {
            t.hideLoading(), t.$data.inviteUrl = e.invite_url, t.$data.joinKey = e.invite_link && e.invite_link.key, 
            t.startIntersectionObserverIfNeed();
        }).catch(function(e) {
            t.error(e);
        }), a.stat("creator_or_admin_invite_visit")) : this.hideLoading();
    },
    join: function() {
        var t = this;
        a.callAfterLogin(function() {
            a.getDriveUser().then(function() {
                t.data.showApproveInput && t.$approveValue != t.data.defaultApproveValue && (t.$approveValue ? t.setData({
                    defaultApproveValue: t.$approveValue
                }) : t.setData({
                    defaultApproveValue: "我是" + a.globalData.user.name
                }));
                var e = t.data.showApproveInput ? t.data.defaultApproveValue : "我是" + a.globalData.user.name;
                wx.showLoading({
                    title: "请稍等",
                    mask: !0
                }), d(t.$data.joinKey, e).then(function(e) {
                    wx.hideLoading(), a.stat("invite_confirm_success"), t.data.showApproveInput ? t.setData({
                        isApproveCommited: !0
                    }) : t.intentFiles();
                }).catch(function(e) {
                    wx.hideLoading();
                    var i = e.result;
                    "GroupMemberExists" === i || "linkMemberExist" === i ? t.intentFiles() : "userNotLogin" === i || "InvalidWpssid" === i ? (a.clearWpssid(), 
                    a.callAfterLogin(t.join.bind(t))) : t.error(e);
                });
            }).catch(function(e) {
                return t.error(e);
            });
        });
    },
    intentFiles: function() {
        a.globalData.intent = {
            pages: [ "teamList", "teamInfo" ],
            gid: this.data.teamGroupid,
            pid: 0,
            fid: 0,
            fname: this.options.fname
        }, u("tabBars/recent");
    },
    getServiceError: function() {
        return this.isInviteMode() ? "无法邀请成员共享文件夹" : this.isReceiveMode() ? "无法加入协作" : void 0;
    },
    error: function(t) {
        this.hideLoading();
        var e = t.result, i = t.msg, n = t.faillist;
        this.isInviteMode() || (this.data.showApproveInput ? a.stat("team_invite_verify_click_fail", {
            errorCode: e
        }) : a.stat("invite_confirm_fail", {
            errorCode: e
        }));
        var s = n && n[0].msg, o = "" + (i || s || "连接失败");
        switch (e) {
          case "网络异常":
            this.isReceiveMode() ? l("网络异常，请稍后重试") : this.setData({
                error: "网络异常，请稍后重试"
            });
            break;

          default:
            this.setData({
                error: this.getServiceError(),
                errorDesc: o
            });
        }
    },
    shareWXFriend: function() {
        a.stat("invite_page_click", {
            type: "send"
        });
    },
    bindApproveValue: function(t) {
        this.$approveValue = t.detail.value;
    }
});