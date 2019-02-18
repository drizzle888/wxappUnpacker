var t = require("../action/thumbnail/index.js").requestThumbnailImg, e = require("../action/share-groups/index.js").userCode, i = require("./util.js").getShareIcon, r = getApp(), n = 0, u = {}, a = {}, s = [ "doc", "xls", "ppt", "pdf" ], l = function(t) {
    var e = t.indexOf("?");
    if (e >= 0) {
        for (var i = t.substring(0, e), r = t.substring(e + 1).split("&"), n = "", u = 0, a = r.length; u < a; ++u) {
            var s = r[u], l = s.indexOf("="), h = s.substring(0, l), f = s.substring(l + 1);
            "k" === h && (f = o(f)), n.length > 0 && (n += "&"), n += h + "=" + f;
        }
        t = i + "?" + n;
    }
    return t;
}, o = function(t) {
    if (t && t.length < 32) {
        for (var e = 32 - t.length, i = "", r = 0; r < e; ++r) i += "0";
        return i + t;
    }
    return t;
};

module.exports = {
    setShareThumbnail: function e(r, o) {
        var h = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "", f = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {}, m = f.fname, d = f.fid, b = f.sid, c = f.chkcode;
        if (r) {
            var g = i(m);
            if (s.indexOf(g) < 0) return void (o.thumbnailUrl = "");
            if (h && u[h]) return void (o.thumbnailUrl = u[h]);
            a[h] || (o.startTime = new Date().getTime()), t(d, b, c).then(function(t) {
                if ("ok" === t.result) {
                    var i = t.url, s = i[0];
                    s || (s = i["0.jpg"]), s || (s = i["0.png"]), s || (s = i[1]), s || (s = i["1.jpg"]), 
                    s || (s = i["1.png"]), s = l(s), o.thumbnailUrl = s, h && (u[h] = s, a[h] = 0), 
                    o.thumbStatus = "ok";
                } else if ("ready" === t.result) {
                    o.thumbnailUrl = "", o.thumbStatus = "wait";
                    var f = t.sleep;
                    if (a[h] ? a[h]++ : a[h] = 1, a[h] <= 15) {
                        var g = e.bind(void 0, r, o, h, {
                            fname: m,
                            fid: d,
                            sid: b,
                            chkcode: c
                        });
                        n = setTimeout(g, 1e3 * (f + .5));
                    } else a[h] = 0;
                }
            }).catch(function(t) {
                a[h] = 0, o && (o.thumbnailUrl = "", o.thumbStatus = t.result);
            });
        } else a[h] = 0, o && (o.thumbnailUrl = "", o.thumbStatus = "ok", o.startTime = 0), 
        clearTimeout(n);
    },
    statFail: function(t, e, n) {
        if (!t.thumbnailUrl && t.startTime > 0) {
            var u = i(n);
            if ("wait" === t.thumbStatus) {
                var a = Math.round((new Date().getTime() - t.startTime) / 1e3);
                r.stat("share_thumbnail_fail_wait", {
                    time: a,
                    from: e,
                    ftype: u
                });
            } else r.stat("share_thumbnail_fail_error", {
                errorCode: t.thumbStatus,
                from: e,
                ftype: u
            });
        } else t.thumbnailUrl;
    },
    setUserCode: function(t, i) {
        t && e(t).then(function(t) {
            i.userCode = t.code;
        }).catch(function(t) {
            i.userCode = "";
        });
    }
};