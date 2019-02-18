var t = getApp(), e = require("../../store/store.js"), a = e.StoreType, i = require("../../utils/api.js"), n = require("../../action/link/index.js"), s = n.open, o = n.authAndLink, r = n.getDownloadUrlBySid, c = n.getDownloadUrlByFid, d = require("../../utils/util.js"), h = d.getShareInfo, l = d.getShareIcon, f = d.gotoPage, u = d.decode, g = d.isCompanyAccount, p = d.showLoading, _ = d.hideLoading, m = d.toast, v = d.getExtName, D = (require("../../action/user/user.js").driveUser, 
require("../../action/contacts/index.js").contacts), w = require("../../utils/thumbnailUtil.js"), L = w.setShareThumbnail, k = w.setUserCode, $ = w.statFail, C = require("../../action/user/user.js").accountUser, b = require("../../action/account/account.js"), S = b.bindStatus, P = b.bindWeChatPhone, x = function(e) {
    var a = e.id;
    return (t.globalData.user && t.globalData.user.id) === a;
};

Page({
    data: {
        sid: "",
        fsize: 0,
        fname: "",
        shareicon: "",
        close: !1,
        creator: !1,
        openLoading: !1,
        sendClientDialogVisible: !1,
        sendClientStatus: 0,
        sendClientStatusText: "",
        sendClientStatusAnimation: {},
        outOfDateTxt: "",
        isLogin: !1,
        showLoginDialog: !1,
        recentFiles: [],
        contacts: [],
        contactsLoaded: !1,
        pdfAppId: "",
        pdfPath: "/pages/change/index?type=air_doc&ald_media_id=4445&ald_link_key=7aa47edaa9bcee1b",
        pdfExtraData: {},
        showBindPhoneBtn: !1,
        isCompanyAccount: !1,
        isShowFakeHome: !1,
        allowShowFakeHome: !1
    },
    onUnload: function() {
        this.$data.pageUnloaded = !0, t.mass.del(this);
    },
    onLoad: function() {
        t.mass.add(this), this.$data = Object.create(null), this.$data.onloadLock = !0, 
        this.$data.settingOpened = !1, this.$data.checkingBindPhoneStatus = !1, this.$data.alreadyGotoHome = !1, 
        this.init(), t.isLogined() || t.stat("share_notlogged_visit"), t.stat("more_share_visit", {
            from: this.options.app || "miniapp"
        });
    },
    onShow: function() {
        if (this.data.isShowFakeHome) {
            if (this.$data.onloadLock ? this.$data.onloadLock = !1 : t.isLogined() ? this.gotoHome() : (this.setData({
                allowShowFakeHome: !0
            }), wx.setNavigationBarColor({
                frontColor: "#000000",
                backgroundColor: "#ffffff"
            })), this.options.fname) {
                var e = v(u(this.options.fname));
                e && t.stat("fake_home_visit", {
                    type: e
                });
            }
        } else {
            if (this.$data.onloadLock || this.data.fname) this.$data.onloadLock = !1; else {
                var a = u(this.options.fname);
                this.setData({
                    fname: a,
                    sid: this.options.sid,
                    shareicon: l(a)
                });
            }
            if (this.$data.settingOpened && (this.$data.settingOpened = !1, this.callAfterLogin(this.showSendClientDialog.bind(this))), 
            this.refreshRecent(), this.refreshContacts(), this.checkBindPhoneStatus(), this.data.fname) {
                var i = v(this.data.fname);
                i && t.stat("share_visit", {
                    type: i
                });
            }
        }
    },
    init: function() {
        var t = this, e = this.options, a = e.sid, i = e.q;
        if (void 0 === a) {
            if (void 0 !== i) {
                var n = u(i), s = n.substr(n.lastIndexOf("/") + 1);
                this.$data.sid !== s && (this.$data.sid = s, this.options.sid = s, p(), o(s).then(function(e) {
                    _();
                    var a = e.link, i = e.id, n = e.fsize, s = e.fname, o = "close" === a.status, r = x(a.creator);
                    t.setLinkInfo({
                        id: i,
                        fsize: n,
                        fname: s,
                        close: o,
                        creator: r
                    }, e), t.options.fname = s;
                }).catch(function(e) {
                    _(), t.toPreview();
                }));
            }
        } else this.$data.sid !== a && (this.$data.sid = a, this.setData({
            sid: a,
            isShowFakeHome: !0
        }), wx.hideShareMenu(), this.toPreview());
    },
    checkBindPhoneStatus: function() {
        var e = this;
        this.data.isLogin && (wx.login({
            success: function(t) {
                e.$data.wxLoginCode = t.code;
            },
            fail: function(t) {
                e.$data.wxLoginCode = "";
            }
        }), this.$data.checkingBindPhoneStatus || (this.$data.checkingBindPhoneStatus = !0, 
        S().then(function(a) {
            e.$data.checkingBindPhoneStatus = !1, e.$data.pageUnloaded || (e.setData({
                showBindPhoneBtn: !a.phone
            }), wx.login({
                success: function(t) {
                    e.$data.wxLoginCode = t.code;
                },
                fail: function(t) {
                    e.$data.wxLoginCode = "";
                }
            }), e.data.showBindPhoneBtn && t.stat("share_phone_visit"));
        }).catch(function(t) {
            e.$data.checkingBindPhoneStatus = !1;
        })));
    },
    setLinkInfo: function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
        this.$data.info = t, this.$data.file = e;
        var a = t.fsize, i = t.fname, n = t.close, s = t.creator;
        a = a || 0, i = i || this.options.fname, n = !!n, s = !!s, this.setData({
            fsize: a,
            fname: i,
            close: n,
            creator: s,
            sid: this.options.sid,
            shareicon: l(i)
        }), this.showOutOfDateTxt(), this.setPdfExtraData("", e), setTimeout(this.setThumbnail.bind(this, e), 2e3);
    },
    setThumbnail: function(t) {
        if (t) {
            var e = t.link, a = e.sid, i = e.chkcode, n = t.fname;
            L(!i || !i.length, this.$data, t.fsha, {
                fname: n,
                sid: a
            }), k(a, this.$data);
        }
    },
    toPreview: function() {
        var e = Object.assign(this.options, {
            referer: "share"
        });
        f("preview", e), t.queryPreviewSwitch();
    },
    tapPreview: function() {
        this.toPreview(), t.stat("share_file_click");
    },
    tapOpenLink: function() {
        var e = this;
        t.stat("share_deadline_click"), this.setData({
            openLoading: !0
        });
        var a = this.$data.info, i = a && a.id;
        i && s(i).then(function(t) {
            e.setData({
                close: !1,
                openLoading: !1
            });
        });
    },
    tapSendFriend: function() {
        t.stat("share_friend_click");
    },
    tapShareLogin: function() {
        this.callAfterLogin(null, !0);
    },
    tapSendClient: function() {
        var e = this;
        t.stat("share_computer_click"), this.callAfterLogin(function() {
            if (e.$data.sid) {
                var t = encodeURIComponent("https://pan.wps.cn/l/" + e.$data.sid);
                f("clientHelp", {
                    link_url: t,
                    referer: "share"
                });
            } else m("查看者角色无法操作");
        }, !this.$data.sid);
    },
    tapSaveFile: function() {
        if (t.isLogined()) {
            t.stat("share_preserve_click");
            var e = this.$data.file;
            if (e) {
                var a = {
                    fid: e.id || e.fileid,
                    gid: e.groupid,
                    pid: e.parentid,
                    fname: encodeURIComponent(e.fname),
                    ftype: e.ftype,
                    fsize: e.fsize,
                    storeid: e.storeid,
                    fsha: e.fsha,
                    store: e.store
                };
                f("select", {
                    aimFile: a,
                    opttype: "save"
                }, !1);
            } else m("文件无法保存");
        } else {
            var i = this.options.sid, n = this;
            this.callAfterLogin(function() {
                o(i, "").then(function() {
                    n.tapSaveFile();
                }).catch(function() {});
            }, !this.$data.file);
        }
    },
    tapNavigatorPdf: function() {
        t.stat("share_PDF_click");
    },
    tapToWord: function() {
        var e = this;
        t.stat("share_PDF_click"), t.isLogined() ? t.stat("share_PDF_fail", {
            errorCode: this.$data.info && this.$data.info.code || "unknown"
        }) : t.stat("share_PDF_fail", {
            errorCode: "unLogin"
        }), this.callAfterLogin(function() {
            e.setPdfExtraData("", e.$data.file, t.getWpssid(), !0);
        }, !0);
    },
    bindPdfFail: function(e) {
        t.stat("share_PDF_fail", {
            errorCode: e.detail.errMsg
        });
    },
    bindPdfSuccess: function() {
        t.stat("share_PDF_success");
    },
    showSendClientDialog: function() {
        g(t.globalData.user) ? i.showModal({
            showCancel: !1,
            content: "暂不支持企业账号"
        }) : this.setData({
            sendClientDialogVisible: !0
        });
    },
    showSendClientStatusBanner: function(t, e) {
        var a = this, i = wx.createAnimation({
            duration: 1e3,
            timingFunction: "ease"
        });
        i.bottom(0).step(), this.setData({
            sendClientStatus: t,
            sendClientStatusText: e,
            sendClientDialogVisible: !1,
            sendClientStatusAnimation: i.export()
        }), i.bottom("-100rpx").step(), setTimeout(function() {
            return a.setData({
                sendClientStatusAnimation: i.export()
            });
        }, 3e3);
    },
    showOutOfDateTxt: function() {
        if (this.$data.file) {
            var t = this.$data.file.link, e = "close" === t.status, a = x(t.creator), i = t.expire_period, n = t.expire_time - Math.round(new Date() / 1e3);
            if (!e && !a && i > 0) {
                var s = parseInt(n / 86400), o = parseInt(n % 86400 / 3600), r = void 0;
                r = s > 0 ? s + "天后过期" : o > 0 ? o + "小时后过期" : "1小时内过期", this.setData({
                    outOfDateTxt: r
                });
            }
        }
    },
    onDialogSendClientCancel: function() {
        this.setData({
            sendClientDialogVisible: !1
        });
    },
    onDialogSendClientConfirm: function(t) {
        var e = t.detail;
        this.showSendClientStatusBanner(e ? 1 : -1, e ? "文件已成功发送至 PC 设备上" : "文件发送失败");
    },
    onShareAppMessage: function() {
        t.stat("share_all");
        var e = h(this.options, this.$data.thumbnailUrl, this.$data.userCode);
        return $(this.$data, "share", this.options.fname), e.success = function() {
            t.stat("share_friend_success");
        }, e.fail = function() {
            t.stat("share_friend_fail");
        }, e;
    },
    tapRecentCard: function() {
        t.stat("share_recent_click"), this.callAfterLogin(function() {
            f("tabBars/recent", {}, !0);
        });
    },
    tapNewGroupCard: function() {
        t.isLogined() ? (f("teamList"), this.data.contacts.length > 2 ? t.stat("share_team_member_click") : t.stat("share_team_blank_click")) : (this.callAfterLogin(null, !0), 
        t.stat("share_team_notlogged_click"));
    },
    tapRecentItem: function(e) {
        t.stat("share_recent_doc_click");
        var a = e.currentTarget.dataset.index, i = this.data.recentFiles[a];
        f("preview", {
            sid: i.sid,
            fid: i.id,
            fname: encodeURIComponent(i.fname),
            ftype: i.ftype,
            groupid: i.groupid
        });
    },
    tapViewNow: function() {
        t.stat("share_recent_notlogged_click"), this.callAfterLogin(null, !0);
    },
    tapNewDoc: function() {
        t.stat("share_newbuild_click"), this.callAfterLogin(this.getMineId.bind(this));
    },
    getMineId: function() {
        var t = this, i = e.getCacheData(a.allTeam).mine.id;
        i ? this.togoNewDoc(i) : e.getData(a.allTeam, {}, !0).then(function(e) {
            t.togoNewDoc(e.mine.id);
        }).catch(function(t) {
            m("" + (t.msg || "连接失败"));
        });
    },
    togoNewDoc: function(e) {
        t.globalData.intent = {
            pages: [ "openWin" ],
            url: "https://web.wps.cn/office/w/new/" + e + "-0",
            groupId: e,
            parentId: "0"
        }, f("tabBars/recent");
    },
    tapPc: function() {
        t.stat("share_PC_click"), f("usercenter/openDocs");
    },
    refreshContacts: function() {
        var e = this;
        t.isLogined() && D("cloud_doc", 0, 10).then(function(a) {
            var i = a.contacts;
            i = e.checkContacts(i), e.setData({
                contacts: i,
                contactsLoaded: !0,
                isCompanyAccount: g(t.globalData.user)
            }), i.length > 2 ? t.stat("share_team_member_visit") : t.stat("share_team_blank_visit");
        }).catch(function(a) {
            var i = a.result;
            "userNotLogin" !== i && "InvalidWpssid" !== i || (e.data.contactsLoaded = !1, t.clearWpssid(), 
            e.updateLogin());
        });
    },
    checkContacts: function(t) {
        for (var e = [], a = 0, i = t.length; a < i; ++a) {
            var n = t[a];
            if (n.avatar && e.push(n), 3 === e.length) break;
        }
        return e;
    },
    refreshRecent: function() {
        var i = this;
        this.updateLogin(), t.isLogined() && e.getData(a.recent, {}, !0).then(function(t) {
            var e = [], a = !0, n = !1, s = void 0;
            try {
                for (var o, r = t.files[Symbol.iterator](); !(a = (o = r.next()).done); a = !0) {
                    var c = o.value;
                    if (3 === e.length) break;
                    i.$data.file && i.$data.file.id == c.id || (i.$data.info && i.$data.info.id == c.id || e.push(c));
                }
            } catch (t) {
                n = !0, s = t;
            } finally {
                try {
                    !a && r.return && r.return();
                } finally {
                    if (n) throw s;
                }
            }
            i.setData({
                recentFiles: e
            });
        }).catch(function(e) {
            var a = e.result;
            "userNotLogin" === a || "InvalidWpssid" === a ? (t.clearWpssid(), i.updateLogin()) : m("" + (e.msg || "连接失败"));
        });
    },
    updateLogin: function() {
        var e = !t.isLogined();
        this.setData({
            isLogin: t.isLogined(),
            showLoginDialog: e,
            contactsLoaded: this.data.contactsLoaded
        }), this.setPdfExtraData("", "", t.getWpssid()), e && t.stat("share_authorize_visit");
    },
    getDownloadUrl: function(e, a, i) {
        var n = this;
        r(e).then(function(t) {
            n._setStaticUrl(t);
        }).catch(function(e) {
            t.isLogined() && c(a, i).then(function(t) {
                n._setStaticUrl(t);
            }).catch(function(t) {});
        });
    },
    _setStaticUrl: function(t) {
        var e = t.fileinfo;
        e && (e.static_url || e.url) && this.setPdfExtraData(e.static_url || e.url);
    },
    setPdfExtraData: function(e, a, i, n) {
        if (g(t.globalData.user)) n && m("企业帐号暂不支持"); else if (e || a || i) {
            var s = this.data.pdfExtraData;
            e && (s.static_url = e), a && (s.fid = a.id || a.fileid, s.fname = a.fname, s.fsize = a.fsize, 
            s.groupid = a.groupid, s.static_url || "pdf" !== this.data.shareicon || this.getDownloadUrl(this.$data.sid, a.groupid, s.fid)), 
            i && (s.sid = i), s.sid && s.static_url && s.fid && s.fname && s.fsize && s.groupid ? this.setData({
                pdfExtraData: s,
                pdfAppId: "wx13cd99d542d173c1"
            }) : (n && m("无法转换"), this.setData({
                pdfExtraData: s
            }));
        }
    },
    callAfterLogin: function(e) {
        var a = this, i = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        if (t.isLogined() && t.globalData.user) e && e(); else {
            var n = this;
            t.callAfterLogin(function() {
                t.getDriveUser().then(function(t) {
                    if (e && e(), n.$data.file && n.$data.file.link && n.$data.file.link.creator) {
                        var s = x(n.$data.file.link.creator);
                        n.setData({
                            creator: s
                        });
                    }
                    a.getUserInfo(), i && (n.refreshRecent(), n.refreshContacts(), n.checkBindPhoneStatus());
                });
            });
        }
    },
    getUserInfo: function() {
        C().then(function(e) {
            t.initAccountUser();
        });
    },
    loginDialogCancel: function() {
        var e = this.data.showLoginType;
        this.setData({
            showLoginDialog: !1
        }), t.stat("share_authorize_close_" + e);
    },
    loginDialogConfirm: function() {
        var e = this, a = this.data.showLoginType;
        this.callAfterLogin(function() {
            e.setData({
                showLoginDialog: !1
            });
        }, !0), t.stat("share_authorize_click_" + a);
    },
    getPhoneNumber: function(e) {
        var a = this;
        if ("getPhoneNumber:ok" === e.detail.errMsg) if (t.stat("binding_phone_authorize_click", {
            type: "confirm"
        }), this.$data.wxLoginCode) {
            wx.showLoading({
                title: "请稍等",
                mask: !0
            });
            var i = e.detail, n = i.iv, s = i.encryptedData;
            P(this.$data.wxLoginCode, n, s).then(function(e) {
                a.$data.pageUnloaded ? t.stat("share_phone_success") : (wx.hideLoading(), m("绑定成功"), 
                a.setData({
                    showBindPhoneBtn: !1
                }), t.stat("share_phone_success"));
            }).catch(function(e) {
                a.$data.pageUnloaded ? t.stat("UserHasBindedPhone" === e.result ? "share_phone_success" : "share_phone_fail") : (wx.hideLoading(), 
                "CellPhoneBind" === e.result ? (f("openWin", {
                    url: "https://account.wps.cn/v1/mergeaccountresult",
                    bind: "phone",
                    ssid: e.ssid
                }), t.stat("share_phone_fail")) : "UserHasBindedPhone" === e.result ? (m("该帐号已绑定手机号"), 
                a.setData({
                    showBindPhoneBtn: !1
                }), t.stat("share_phone_success")) : (m(e.msg || "绑定微信手机号失败"), t.stat("share_phone_fail")));
            });
        } else m("获取code失败"), t.stat("share_phone_fail"); else t.stat("binding_phone_authorize_click", {
            type: "cancel"
        });
    },
    tapBindPhone: function(e) {
        t.stat("share_phone_click");
    },
    requestLogin: function() {
        var t = this;
        this.callAfterLogin(function() {
            o(t.options.sid, "").then(function() {
                t.gotoHome();
            }).catch(function() {
                t.gotoHome();
            });
        });
    },
    gotoHome: function() {
        this.$data.alreadyGotoHome || (this.$data.alreadyGotoHome = !0, f("tabBars/recent"));
    }
});