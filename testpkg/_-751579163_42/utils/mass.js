function t() {
    this.masses = Object.create(null);
}

t.prototype.add = function(t) {
    var e = t.route || t.__route__;
    this.masses[e] = t;
}, t.prototype.get = function(t) {
    return this.masses[t];
}, t.prototype.del = function(t) {
    var e = t.route || t.__route__;
    try {
        delete this.masses[e];
    } catch (t) {}
}, module.exports = t;