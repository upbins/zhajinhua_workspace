var global = require("global")
cc.Class({
    extends: cc.Component,

    properties: {
          card_node:{
            default:null,
            type:cc.Prefab
          }
    },
    onLoad:function(){
      global.gameEventListener.on("push_card",this.pushCard.bind(this))
      global.gameEventListener.on("show_card",this.showCard.bind(this))
    },
    pushCard:function () {
        this.cardNodeList = []
        for(var i=0;i<3;i++){
          var cardNode = cc.instantiate(this.card_node);
          this.node.addChild(cardNode);
          cardNode.setPosition(100 * (3 - 1) * - 0.5 + 100 * i,0);
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
    },
    onDestroy:function () {
        global.gameEventListener.off("push_card",this.pushCard)
        global.gameEventListener.off("show_card")
    }
});
