var e = getApp(), a = require("../../../config/index.js").appShareInfo, i = require("../../../utils/util.js"), c = i.gotoPage, t = i.toast, o = i.isCompanyAccount, p = i.isWpsCompanyAccount, d = require("../../../action/files/index.js").createCollectFolder, n = require("../../../config/index.js").appTabRedDotVersion, s = require("../../../store/store.js"), r = s.StoreType;

Page({
    data: {
        toolmap: [ {
            img: "app-img2word",
            desc: "图片转文字",
            appid: "wxe66629a225dbd0ef",
            path: "pages/img2doc/img2doc?g_csource=wx_xcx_document&g_position=wx_ocr&ald_media_id=1872&ald_link_key=e7749d1a67ac2441",
            event: "app_imgdoc_click",
            type: "imgdoc",
            show: !0
        }, {
            img: "app-pdf",
            desc: "PDF转Word",
            appid: "wx13cd99d542d173c1",
            path: "pages/index/index?g_position=xcx_pdf2word&g_csource=wx_xcx_document&ald_media_id=7790&ald_link_key=c16347a427ce09ec",
            event: "app_pdf_click",
            type: "pdf",
            show: !0
        }, {
            img: "app-img2pdf",
            desc: "图片转PDF",
            appid: "wxe30a622cc9cdc70b",
            path: "pages/imgTopdf_index/imgTopdf?g_csource=wx_xcx_document&g_position=xcx_img2pdf&ald_media_id=7791&ald_link_key=6b5820487efe4fa8",
            event: "app_imgpdf_click",
            type: "imgpdf",
            show: !0
        } ],
        serviceMap: [ {
            img: "app-filecollect",
            desc: "群收文件",
            event: "app_imgdoc_click",
            type: "filecollect",
            show: !o(e.globalData.user)
        }, {
            img: "app-resume",
            desc: "简历助手",
            appid: "wx5890bb82aed1dd7a",
            path: "pages/edit/editResume/editResume?position=docer_xcx_resumehelp_yun&ald_media_id=10280&ald_link_key=153379b4ecec32a4",
            event: "app_resume_click",
            type: "resume"
        } ],
        affairMap: [ {
            img: "app-affairs",
            desc: "会务",
            event: "app_affairs_click",
            type: "affairs",
            show: !0
        } ],
        extraData: {
            sid: e.getWpssid()
        },
        showAffairMap: !1,
        bannerUrl: ""
    },
    onLoad: function(a) {
        this.clearRedDot(), this.showBannerAndMap(), e.stat("application_visit");
    },
    clearRedDot: function() {
        wx.hideTabBarRedDot({
            index: 2
        }), wx.setStorageSync("appRedDotVersion", n);
    },
    showBannerAndMap: function() {
        var a = !!p(e.globalData.user);
        this.setData({
            bannerUrl: "",
            showAffairMap: a
        });
    },
    onShareAppMessage: function() {
        return a;
    },
    tapApp: function(a) {
        var i = this;
        console.log(a.detail), e.callAfterLogin(function() {
            var c = a.detail, t = c.type, o = c.event;
            switch (t) {
              case "filecollect":
                i.createCollectFolder();
                break;

              case "affairs":
                i.checkAffairs();
            }
            e.stat(o);
        });
    },
    createCollectFolder: function() {
        var e = s.getCacheData(r.allTeam).mine.id + "";
        d("群收文件夹", e, "0").then(function(e) {
            console.log(e);
            var a = e.collectid, i = e.fileid, t = e.groupid, o = e.name, p = e.parentid, d = e.expire;
            c("fileCollect", {
                collectid: a,
                fileid: i,
                groupid: t,
                parentid: p,
                fname: encodeURIComponent(o),
                expire: d
            });
        }).catch(function(e) {
            console.log(e), t("" + (e.msg || "发生错误"));
        });
    },
    checkAffairs: function() {
        c("annualParty/affairs");
    },
    tapBanner: function() {
        c("annualParty/content");
    }
});