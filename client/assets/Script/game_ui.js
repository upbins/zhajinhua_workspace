var global = require("global")
cc.Class({
  extends: cc.Component,

  properties: {
    card_node:{
      default:null,
      type:cc.Prefab
    },
    look_card_btn:{
      default:null,
      type:cc.Button
    },
    rate_one_btn:{
      default:null,
      type:cc.Button
    },
    rate_two_btn:{
      default:null,
      type:cc.Button
    },
    rate_five_btn:{
      default:null,
      type:cc.Button
    },
    compare_btn:{
      default:null,
      type:cc.Button
    },
    totalRateLabel:{
      default:null,
      type:cc.Label
    }
  },
  onLoad:function(){
    this.node.active =false;
    global.gameEventListener.on("push_card",this.pushCard.bind(this));
    global.gameEventListener.on("show_card",this.showCard.bind(this));
    global.gameEventListener.on("player_choose_rate",this.showTotalRate.bind(this));
    global.gameEventListener.on("turn_player_message",this.turnPlayerMessage.bind(this));
  },
  turnPlayerMessage:function (data) {
    var uid = data.uid
    this.currentMaxRate = data.maxRate;
    console.log("turnPlayerMessage" + uid,global.playerData.uid)
    if (uid === global.playerData.uid){
      this.activeButton();
    }else {
      this.disableButton();
    }
  },
  disableButton:function () {
    this.setButtonActive(true)
  },
  activeButton:function () {
    this.setButtonActive(false)
  },
  setButtonActive:function (value) {
    console.log("setButtonActive" + value,this.currentMaxRate)
    if (value == false)
    {
      this.rate_one_btn.interactable = value
      this.rate_two_btn.interactable = value
      this.rate_five_btn.interactable = value
    }else{
      var rate_list = [1,2,5]
      var rate_btn = ["one","two","five"];
      for (var i =0;i<rate_list.length;i++){
        if (this.currentMaxRate <= rate_list[i]){
          var str = "rate_" + rate_btn[i] + "_btn"
          console.log("setButtonActive2" + str)
          this["rate_" + rate_btn[i] + "_btn"].interactable = value
        }else {
          this["rate_" + rate_btn[i] + "_btn"].interactable = false
        }
      }
    }
    this.compare_btn.interactable = value;
  },
  pushCard:function () {
    this.node.active = true;
    this.cardNodeList = []
    for(var i=0;i<3;i++){
      var cardNode = cc.instantiate(this.card_node);
      this.node.addChild(cardNode);
      cardNode.setPosition(100 * (3 - 1) * - 0.5 + 100 * i,-60);
      this.cardNodeList.push(cardNode)
    }
  },
  showCard:function (card_data) {

    console.log("show_card" + JSON.stringify(card_data))
    for (var i = 0; i < card_data.length ; i++){
      var cardData = card_data[i]
      var cardNode = this.cardNodeList[i]
      cardNode.getComponent("card_node").showCard(cardData)
    }
    this.look_card_btn.interactable = false
    this.look_card_btn.disabledColor = cc.Color.GRAY
  },
  showTotalRate:function (data) {
    var current_total_rate = data.totlRate;
    this.totalRateLabel.string = "当前总倍数：" + current_total_rate;
  },
  onDestroy:function () {
    global.gameEventListener.off("push_card",this.pushCard)
    global.gameEventListener.off("show_card")
  }
});
