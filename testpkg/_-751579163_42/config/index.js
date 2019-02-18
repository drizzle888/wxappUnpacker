module.exports = {
    version: "1.9.7",
    appname: "drive_wx_app",
    appTabRedDotVersion: 1,
    devicename: "金山文档小程序",
    domain: {
        Account: "https://account.wps.cn",
        Drive: "https://drive.wps.cn",
        QR: "https://qr.wps.cn",
        WebOffice: "https://web.wps.cn",
        Thumbnail: "https://thumbnail.wps.cn"
    },
    appShareInfo: {
        title: "邀请你查看金山文档",
        path: "pages/tabBars/recent/recent",
        imageUrl: "https://qn.cache.wpscdn.cn/wxminiprogram/logo_3.jpg"
    },
    usePrivate: !0,
    wxmp2DriveQs: "wxminiprogram",
    dotviews: [ "ppt", "xls", "doc", "txt", "pdf", "img", "xlsx", "dps", "pptx", "et", "wps", "docx", "pot", "potx", "pps", "ppsx", "dpt", "pptm", "potm", "ppsm", "xlt", "ett", "xltx", "csv", "xlsb", "xlsm", "xltm", "dot", "wpt", "dotx", "docm", "dotm", "lrc", "c", "cpp", "h", "asm", "s", "java", "asp", "bat", "bas", "prg", "cmd", "rtf", "log", "xml", "htm", "html" ],
    previewErrors: {
        pvlimit: {
            title: "文件超出访问次数",
            desc: "请联系文件拥有者重启分享"
        },
        expired: {
            title: "文件已过期",
            desc: "请联系文件拥有者重启分享",
            img: "expired"
        },
        linkClosed: {
            title: "分享的文件已失效或不存在",
            desc: "请联系文件拥有者重启分享",
            img: "linkClosed"
        },
        accessDeny: {
            title: "没有访问权限",
            desc: "请联系文件分享者授权",
            img: "accessDeny"
        },
        illegalFile: {
            title: "文件已被禁止访问",
            desc: "文件可能包含违禁内容，已停止访问"
        },
        illegalFname: {
            title: "文件已被禁止访问",
            desc: "文件可能包含违禁内容，已停止访问"
        },
        lightLinkNotExist: {
            title: "文件不存在或者已移除",
            img: "linkClosed"
        },
        lightlinkChkcodeWrong: {
            title: "文件已被设置访问密码",
            img: "lightlinkChkcodeWrong"
        },
        notGroupMember: {
            title: "没有访问权限",
            desc: "该文件已被设置为仅本协作成员可以访问",
            img: "notGroupMember"
        },
        notCompanyMember: {
            title: "没有访问权限",
            desc: "该文件已被设置为仅本企业成员可以访问",
            img: "notGroupMember"
        },
        groupNotExist: {
            title: "已不是该文件圈子的成员/圈子不存在"
        },
        unsupporttype: {
            desc: "该文件类型暂不支持在线预览"
        },
        fileNotExists: {
            desc: "分享的文件已失效或不存在",
            img: "linkClosed"
        },
        lightlinkVerifying: {
            title: "预览转换中",
            desc: "文件正在进行预览转换，请稍后刷新重试。",
            img: "lightlinkVerifying"
        }
    },
    extMap: {
        jpg: "img",
        jpeg: "img",
        png: "img",
        gif: "img",
        bmp: "img",
        zip: "zip",
        "7z": "zip",
        rar: "zip",
        iso: "zip",
        php: "code",
        py: "code",
        xml: "doc",
        js: "code",
        less: "code",
        sass: "code",
        jade: "code",
        css: "code",
        html: "code",
        htm: "code",
        java: "code",
        wps: "doc",
        wpt: "doc",
        doc: "doc",
        docx: "doc",
        dot: "doc",
        rtf: "doc",
        docm: "doc",
        dotm: "doc",
        et: "xls",
        ett: "xls",
        xls: "xls",
        xlsx: "xls",
        xlsm: "xls",
        xlsb: "xls",
        xlam: "xls",
        xltx: "xls",
        xltm: "xls",
        xlt: "xls",
        xla: "xls",
        xlw: "xls",
        odc: "xls",
        uxdc: "xls",
        txt: "text",
        dbf: "xls",
        prn: "xls",
        csv: "xls",
        dps: "ppt",
        dpt: "ppt",
        pptx: "ppt",
        ppt: "ppt",
        pptm: "ppt",
        ppsx: "ppt",
        pps: "ppt",
        ppsm: "ppt",
        potx: "ppt",
        pot: "ppt",
        potm: "ppt",
        wpd: "ppt",
        pdf: "pdf",
        wxls: "wxls",
        wdoc: "wdoc",
        pom: "pom",
        pof: "pof",
        wppt: "wppt",
        h5: "h5",
        wpsnote: "note"
    },
    shares: [ "doc", "img", "pdf", "ppt", "text", "xls", "zip", "pom", "pof" ],
    dirMode: {
        renameDir: "重命名文件夹",
        createDir: "新建文件夹"
    }
};