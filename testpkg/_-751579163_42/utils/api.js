var n = function(n, t, e, o) {
    var i = wx[n];
    if ("function" == typeof i) {
        var r = {};
        o && (r.fail = o), e && (r.success = e), i.call(wx, Object.assign({}, t, r));
    }
};

module.exports = {
    showModal: function(t) {
        return new Promise(function(e, o) {
            n("showModal", t, e, o);
        });
    },
    authorize: function(t) {
        return new Promise(function(e, o) {
            n("authorize", t, e, o);
        });
    },
    getSetting: function(t) {
        return new Promise(function(e, o) {
            n("getSetting", t, e, o);
        });
    }
};