var t = getApp();

Component({
    properties: {
        fname: String
    },
    data: {
        mtime: new Date().getTime()
    },
    methods: {
        gotoLogin: function() {
            this.triggerEvent("requestLogin");
        },
        gotoPreview: function() {
            this.triggerEvent("requestPreview");
        },
        doNothing: function() {},
        tapAvatar: function() {
            this.gotoLogin(), t.stat("fake_home_click", {
                type: "avatar"
            });
        },
        tapSearch: function() {
            this.gotoLogin(), t.stat("fake_home_click", {
                type: "search"
            });
        },
        tapTeamListItem: function() {
            this.gotoLogin(), t.stat("fake_home_click", {
                type: "teamlist"
            });
        },
        tapFileItem: function() {
            this.gotoPreview(), t.stat("fake_home_click", {
                type: "file"
            });
        },
        tapFileMore: function() {
            this.gotoLogin(), t.stat("fake_home_click", {
                type: "more"
            });
        },
        tapRecent: function() {
            this.gotoLogin(), t.stat("fake_home_click", {
                type: "recent"
            });
        },
        tapDocs: function() {
            this.gotoLogin(), t.stat("fake_home_click", {
                type: "docs"
            });
        },
        tapApplication: function() {
            this.gotoLogin(), t.stat("fake_home_click", {
                type: "application"
            });
        },
        tapHome: function() {
            this.gotoLogin(), t.stat("fake_home_click", {
                type: "home"
            });
        },
        tapNew: function() {
            this.gotoLogin(), t.stat("fake_home_click", {
                type: "new"
            });
        }
    }
});