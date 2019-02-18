Component({
    properties: {
        scrollToRight: {
            type: Boolean,
            value: !1,
            observer: "watchScrollToRight"
        },
        scrollViewWidth: {
            type: Number,
            value: 0
        }
    },
    data: {
        scrollViewWidth: "",
        scrollToView: "id-right-end-view"
    },
    methods: {
        watchScrollToRight: function() {
            this.properties.scrollToRight = !1, this.$data && !this.$data.detached && this.$data.ready && this.scrollToRight();
        },
        scrollToRight: function() {
            var t = this;
            this.$data.scrollingToRight ? this.$data.needScrollToRight = !0 : (this.setData({
                scrollToView: this.data.scrollToView
            }), this.$data.scrollingToRight = !0, this.$data.needScrollToRight = !1, setTimeout(function() {
                t.$data.scrollingToRight = !1, t.$data.needScrollToRight && t.scrollToRight();
            }, 400));
        }
    },
    ready: function() {
        var t = this;
        this.$data = {
            ready: !0,
            detached: !1,
            needScrollToRight: !1,
            scrollingToRight: !1
        };
        var i = this.createSelectorQuery();
        i && (i.select("#id-justable-scroll-view").boundingClientRect(), i.exec(function(i) {
            if (!t.data.detached) {
                var e = i[0].right - i[0].left;
                t.setData({
                    scrollViewWidth: e
                });
            }
        }));
    },
    detached: function() {
        this.$data.detached = !0;
    }
});