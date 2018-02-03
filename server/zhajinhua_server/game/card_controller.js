var Card = require("../game/card");
var Defines = require("../game/defines");
const CardController = function () {
    var that = {};
    var card_list =[];
    var initCard = function () {
        card_list =[];
        var temp_cards = []
        var valueList = Object.keys(Defines.cardsValues)
        var shapes = Object.keys(Defines.cardShapes)
        //初始化牌
        for (var i = 0; i < valueList.length;i++){
            for (var j = 0;j<shapes.length;j++){
                var card = new Card(valueList[i],shapes[j])
                temp_cards.push(card);
            }
        }
        //洗牌操作
        while (temp_cards.length){
          var index = Math.floor(Math.random() * temp_cards.length)
          var card = temp_cards[index];
          card_list.push(card);
          temp_cards.splice(index,i)
        }
    };
    //初始化牌
    that.init = function () {
        initCard()
    };

    //拿出牌
    that.popCard = function () {
      var card = card_list[card_list.length - 1];
      card_list.splice(card_list.length - 1,1);
      if (card_list.length <= 0 ) {
        initCard();
      }
      return card;
    };
    return that;
};
module.exports = CardController
