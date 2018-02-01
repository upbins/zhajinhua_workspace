var global = require("global")
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
        house_manager_label:{
            default:null,
            type:cc.Label
        },
    },
    onLoad: function () {
        this.node.addComponent(cc.Sprite).spriteFrame = this.sprite_frames[Math.random() * this.sprite_frames.length];
        //接受到改变房主的改变信息
        const  changeHouseManager = (uid) =>{
            console.log("player node change house manager = " + uid);
            this.house_manager_label.string = "";
            if (uid === this.uid){
                this.house_manager_label.string = "房主";
            }
        };
        global.gameEventListener.on("change_house_manager",changeHouseManager);
        //global.eventlistener.on("change_house_manager",this.changeHouseManager.bind(this));
    },

    init: function (uid, index) {
        this.uid = uid;
        this.index = index;
        this.uid_label.string = uid + ""
        if (global.playerData.house_manager_id === this.uid){ //如果记录的houser_manger_id ==当前Uid那就是房主
            this.house_manager_label.string = "房主"
        }
    },
    // changeHouseManager: function (uid) {
    //     console.log("player node change house manager = " + uid);
    //     this.house_manager_label.string = "";
    //     if (uid === this.uid){
    //         this.house_manager_label.string = "房主";
    //
    //     }
    // },

    getUid:function () {
        return this.uid
    },
    onDestroy:function () {
        console.log("onDestroy")
        global.gameEventListener.off("change_house_manager",this.changeHouseManager)
    },

});
