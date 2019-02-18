var e = require("../../utils/request.js").thumbnail;

module.exports = {
    requestThumbnailImg: function() {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "", n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "", r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0, u = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0;
        return new Promise(function(s, a) {
            var o = {};
            t && (t = Number.parseInt(t), o.fileid = t), i && (o.sid = i), n && (o.chkcode = n), 
            r && (o.start = r), u && (o.end = u), e({
                method: "GET",
                url: "/preview/getThumbnailImg",
                data: o,
                success: function(e) {
                    var t = e.data;
                    200 === e.statusCode ? s(t) : a(t);
                },
                fail: function(e) {
                    a(e);
                }
            });
        });
    }
};