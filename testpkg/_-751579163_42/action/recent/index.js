function e(e) {
    if (0 !== e.length) {
        try {
            var t = wx.getStorageSync(s) || [];
            if (t.length >= 10 && t[t.length - 1].mtime_recent > e[0].mtime_recent) return;
            var n = void 0;
            n = e.length > 10 ? e.slice(0, 10) : e, wx.setStorageSync(s, n);
        } catch (e) {}
    } else wx.setStorageSync(s, []);
}

function t(e) {
    var t = e.name, n = e.file_src, r = e.file_src_type, s = e.original_device_type, a = e.path, c = e.original_device_name, o = i(t), u = n, l = r, f = s, m = c;
    if ("我收到的轻地址" === u || "轻地址" === u) u = "与我共享"; else if ("roaming" === l && "wpsnote" === o) u = "WPS便签"; else if ("roaming" === l && "PC" === f) {
        var g = /C:\/Users\/[a-z0-9]+\/Downloads/, d = /C:\/Users\/[a-z0-9]+\/Desktop/, v = /Documents\/Tencent\sFiles/, h = /Documents\/WeChat\sFiles/;
        u = /C:\/Users\/[a-z0-9]+\/Documents/.test(a) ? "文档" : g.test(a) ? "下载" : d.test(a) ? "电脑桌面" : v.test(a) ? "QQ" : h.test(a) ? "微信" : m;
    } else if ("roaming" === l && "android" === f) {
        var p = /Tencent\/QQfile_recv/, _ = /Tencent\/TIMfile_recv/;
        u = /tencent\/MicroMsg/.test(a) ? "手机微信" : p.test(a) ? "手机QQ" : _.test(a) ? "手机TIM" : m;
    } else "roaming" === l && a ? u = m : "私人空间" === u || "private" === l ? u = "全部文档" : "roaming" !== l && "tmp" !== l || (u = m);
    return u;
}

var n = require("../../utils/request.js").drive, i = require("../../utils/util.js").getExtName, r = {
    count: 20
}, s = "recents", a = function(e) {
    return e.map(function(e) {
        var n = t(e), i = "file";
        return "与我共享" === n && (i = "sharefile"), {
            id: e.fileid,
            sid: e.sid || "",
            fsrc: n,
            fsize: e.size,
            fname: e.name,
            ftype: i,
            mtime_recent: e.mtime,
            groupid: e.groupid
        };
    });
};

module.exports = {
    fetchRecents: function() {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, i = arguments[1];
        return new Promise(function(c, o) {
            if (i) try {
                var u = wx.getStorageSync(s);
                if (u && u.length > 0) return void c({
                    recents: u,
                    cache: !0
                });
            } catch (e) {
                console.log(e);
            }
            n({
                method: "GET",
                url: "/api/v3/roaming",
                data: Object.assign({}, r, t),
                success: function(t) {
                    var n = t.statusCode, i = t.data;
                    if (200 === n) {
                        var r = a(i || []);
                        e(r), c({
                            recents: r,
                            cache: !1
                        });
                    } else o(i);
                },
                fail: function(e) {
                    o(e);
                }
            });
        });
    },
    openRoamingSwitch: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return new Promise(function(t, i) {
            var r = "/api/users/" + e.userid + "/roamingswitch";
            n({
                method: "PUT",
                url: r,
                data: {
                    switch: 1
                },
                success: function(e) {
                    var n = e.statusCode, r = e.data;
                    200 === n ? t(r) : i(r);
                },
                fail: function(e) {
                    i(e);
                }
            });
        });
    }
};