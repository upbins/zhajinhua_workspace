cc.Class({
    extends: cc.Component,

    properties: {
        sprite_frames: {
            default: [],
            type: cc.SpriteFrame
        },
        uid_label: {
            default: null,
            type: cc.Label
        },
    },

    onLoad: function () {
    },
    init: function (uid, index) {
        this.uid = uid;
        this.index = index;
        this.uid_label.string = uid + "";
        // if (global.playerData.house_manager_id === this.uid) {
        //     this.house_manager_label.string = "房主";
        // }
    },
   
});
