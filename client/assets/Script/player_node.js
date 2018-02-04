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
        card_node_prefab:{
            default:null,
            type:cc.Prefab
        },
        card_pos:{
            default:[],
            type:cc.Node
        },
        player_choose_label:{
            default:null,
            type:cc.Label
        }
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
        //global.gameEventListener.on("change_house_manager",this.changeHouseManager.bind(this));
        global.gameEventListener.on("push_card",this.pushCard.bind(this));
        global.gameEventListener.on("player_choose_rate",this.playerChooseRate.bind(this));
    },
    pushCard:function () {
        //如果是自己的话就不再发牌了
        if (this.getUid() === global.playerData.uid){
            return ;
        }
        for (var i =0;i <3;i++){
            var card_node = cc.instantiate(this.card_node_prefab);
            card_node.setScale(0.6,0.6)
            this.node.addChild(card_node);
            card_node.setPosition(cc.pAdd(this.card_pos[this.index].position,cc.p((3 - 1) * - 0.5 + 40 * i,0)));
        }
    },
    init: function (uid, index) {
        this.uid = uid;
        this.index = index;
        this.uid_label.string = uid + ""
        if (global.playerData.house_manager_id === this.uid){ //如果记录的houser_manger_id ==当前Uid那就是房主
            this.house_manager_label.string = "房主"
        }
    },
    playerChooseRate:function (data) {
          if (data.uid === this.uid){
              this.player_choose_label.string = "已选择" + data.rate + "倍";
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
        //global.gameEventListener.off("change_house_manager",this.changeHouseManager)
        global.gameEventListener.off("push_card",this.pushCard)
        global.gameEventListener.off("push_card",this.playerChooseRate)
    },

});
