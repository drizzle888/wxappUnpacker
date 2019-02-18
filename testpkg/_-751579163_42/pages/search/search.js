var e = require("../../action/search/index.js"), t = e.getRecentSearchedRecords, a = e.clearRecentSearchedRecords, s = e.updateRecentSearchedRecords, i = require("../../utils/util.js"), c = i.showLoading, n = i.hideLoading, r = i.isPageShow, h = getApp();

Page({
    data: {
        recentSearchedRecords: [],
        searchingName: "",
        inputText: "",
        showNoSearchResult: !1
    },
    $data: {
        last_search_input_text: ""
    },
    onLoad: function(e) {
        this.$data.isOnLoad = !0, this.showRecentSearchedRecords();
    },
    onShow: function() {
        this.$data.isOnLoad ? delete this.$data.isOnLoad : this.doSearchFiles();
    },
    onloadStatusChange: function(e) {
        var t = e.detail.status;
        "loaded" === t ? (n(), this.setData({
            showNoSearchResult: !0
        })) : "loading" === t && c();
    },
    onReachBottom: function() {
        this.$fileList.morePage({
            searchname: this.data.searchingName,
            search_operator_name: !0,
            search_file_content: !1,
            search_file_name: !0
        });
    },
    reload: function() {
        r("pages/search/search") && this.doSearchFiles();
    },
    doSearchFiles: function() {
        this.$fileList = this.selectComponent("#filelist"), this.$fileList.init(null, !1), 
        this.$fileList.firstPage({
            searchname: this.data.searchingName,
            search_operator_name: !0,
            search_file_content: !1,
            search_file_name: !0
        }, function() {}, !1);
    },
    doSearchEvent: function(e) {
        var t = this, a = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], i = e.detail.name.trim();
        a && !!i && s({
            name: i
        }), i !== this.$data.last_search_input_text && (this.$data.last_search_input_text = i, 
        0 !== i.length ? (this.setData({
            searchingName: i,
            showNoSearchResult: !1
        }), setTimeout(function() {
            i === t.data.searchingName && t.doSearchFiles();
        }, 200)) : this.showRecentSearchedRecords());
    },
    searchNameConfirmed: function(e) {
        this.doSearchEvent(e, !0);
    },
    searchNameChanged: function(e) {
        this.doSearchEvent(e);
    },
    tapRecentSearchedRecord: function(e) {
        var t = parseInt(e.currentTarget.dataset.index);
        if (t < this.data.recentSearchedRecords.length) {
            var a = this.data.recentSearchedRecords[t].name;
            this.setData({
                searchingName: a,
                inputText: a
            }), this.$data.last_search_input_text = a, s({
                name: a
            }), this.doSearchFiles();
        }
    },
    tapClearRecentSearchedRecords: function(e) {
        a(), this.showRecentSearchedRecords();
    },
    showRecentSearchedRecords: function() {
        var e = t();
        n(), this.setData({
            searchingName: "",
            recentSearchedRecords: e
        });
    },
    fileItemTap: function(e) {
        console.log(e);
        var t = e.detail.index, a = this.caculateSearchTeamNum(), s = this.data.searchingName;
        h.stat("search_itemclick", {
            keyword: s,
            index: t,
            groupnum: a,
            type: "file"
        });
    },
    caculateSearchTeamNum: function() {
        for (var e = this.$fileList.data.files, t = 0; t < e.length; t++) if ("team" != e[t].ftype) return t;
        return e.length;
    }
});