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
    },
    player_compare_btn:{
      default:null,
      type:cc.Button
    },
    pk_result_label:{
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
    this.player_compare_btn.node.active = false;
    global.gameEventListener.on("player_pk",this.playerPk.bind(this));
    global.gameEventListener.on("palyer_compare_choosed",this.playerChoosed.bind(this))
    global.gameEventListener.on("pk_reuslt",this.pkResult.bind(this))
  },
  playerChoosed:function () {
    this.player_compare_btn.node.active = false
  },
  playerPk:function () {
      if (this.uid != global.playerData.uid) // 选择比牌的人不包括自己
      {
        this.player_compare_btn.node.active = true
      }
  },
  pkResult:function (data) {
    //console.log("player_node ++++pkResult" + JSON.stringify(data))
    var data_list = undefined
    if(data.win_uid === this.uid){
      this.pk_result_label.string = "pk win";
      data_list = data.win_card_list
    }else if(data.lose_uid === this.uid){
      this.pk_result_label.string = "pk lose";
      data_list = data.lose_card_list

    }
    if (this.uid != global.playerData.uid ){
      var temp_list = undefined
      if (data.win_uid != global.playerData.uid){
        temp_list =  data.win_card_list
      }else{
        temp_list =  data.lose_card_list
      }
      for (var i = 0; i < temp_list.length; i++){
        var cardData = temp_list[i]
        console.log(cardData)
        var cardNode = this.cardNodeList[i]
        cardNode.getComponent("card_node").showCard(cardData)
      }
    }else {
      global.gameEventListener.fire("result_only_card",data_list)
    }

  },
  pushCard:function () {
    //如果是自己的话就不再发牌了
    if (this.getUid() === global.playerData.uid){
      return ;
    }
    this.cardNodeList = []
    for (var i =0;i <3;i++){
      var card_node = cc.instantiate(this.card_node_prefab);
      card_node.setScale(0.6,0.6)
      this.node.addChild(card_node);
      card_node.setPosition(cc.pAdd(this.card_pos[this.index].position,cc.p((3 - 1) * - 0.5 + 40 * i,0)));
      this.cardNodeList.push(card_node)
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

  onButtonClick:function (sender,customData) {
    if (customData){
      switch (customData){
        case "compare_player":
          cc.log("compare_player")
          global.eventControllerlistener.fire("player_compare_choose",this.uid);
          //暂时等待客户端选择了比牌的人,就马上要隐藏其他人的选择图标
          global.gameEventListener.fire("palyer_compare_choosed");
          break;
        default:
          break;
      }
    }
  },
  onDestroy:function () {
    console.log("onDestroy")
    //global.gameEventListener.off("change_house_manager",this.changeHouseManager)
    global.gameEventListener.off("push_card",this.pushCard);
    global.gameEventListener.off("push_card",this.playerChooseRate);
    global.gameEventListener.off("player_pk",this.playerPk);
    global.gameEventListener.off("palyer_compare_choosed",this.playerChoosed);
    global.gameEventListener.off("pk_reuslt",this.pkResult)
  },

});
