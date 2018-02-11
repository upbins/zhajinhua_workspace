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
    //比较特殊牌型的检测

    //检测对子
    const checkDouble = function (card_list) {
        var map = {}
        for(var i = 0;i>card_list.length;i++){
          var card = card_list[i]
          var number = card.value;
          map[number] = true;
        }
        if (Object.keys(map).length == 2 ){
          return true
        }
        return false
    };
    //检测顺子
    const checkStraight = function (card_list) {
      var value_list = [];
      for(var i = 0 ;i < card_list.length;i++){
        value_list.push(Defines.cardsValues[card_list[i].value])
      }
      value_list.sort(function (a,b) {
        return a < b
      })
      if(value_list[0] - value_list[1] === 1 && value_list[1] - value_list[2] === 1){
        return true
      }
      //特殊检测下等于a的时候
      if(value_list[0] === 14){
        value_list[0] = 1
      }
      value_list.sort(function (a,b) {
        return a < b
      })
      if(value_list[0] - value_list[1] === 1 && value_list[1] - value_list[2] === 1){
        return true
      }
      return false
    };
    //检测同花
    const checkColor = function (card_list) {
       var map = {}
       for(var i =0;i<card_list.length;i++){
         var card = card_list[i]
         map[card.shape] = true
       }

       if (Object.keys(map).length === 1){
         return true
       }
       return false
    };
    //检测同花顺
    const checkColorStraight = function (card_list) {
      if (checkStraight(card_list) && checkColor(card_list)){
        return true
      }else{
        return false
      }
    };
    //检测boss,3条
    const  checkBoss = function (card_list) {
      var map = {}
      for(var i =0;i <card_list.length;i++){
        map[card_list[i].value] = true
      }
      if (Object.keys(map).length == 3 ){
        return true
      }
      return false
    };
    var checkMethod = {
      "Double":checkDouble,
      "Straight":checkStraight,
      "Color":checkColor,
      "ColorStraight":checkColorStraight,
      "Boss":checkBoss,
      };
    var checkCardScore = {
      "Double":1,
      "Straight":2,
      "Color":3,
      "ColorStraight":4,
      "Boss":5,
    }
    const sordCard = function (card) {
        card.sort(function (a,b) {
          return Defines.cardsValues[a.value] < Defines.cardsValues[b.value];
        })
    }
    that.compareCard = function (card1,card2) {
      console.log("card1" + JSON.stringify(card1))
      console.log("card2" + JSON.stringify(card2))
      // var result = checkColorStraight([{value: "5", shape:Defines.cardShapes.Heart},
      //   {value: "2", shape:Defines.cardShapes.Heart},
      //   {value: "3", shape:Defines.cardShapes.Heart}])
      // console.log("result++++++",result)
      card1 = [{value: "5", shape:Defines.cardShapes.Heart},
        {value: "2", shape:Defines.cardShapes.Heart},
        {value: "3", shape:Defines.cardShapes.Heart}]
      card2 = [{value: "a", shape:Defines.cardShapes.Heart},
        {value: "2", shape:Defines.cardShapes.Club},
        {value: "4", shape:Defines.cardShapes.Heart}]
      var card_list = [card1, card2]
      var score_map = {
        "0" : 0,
        "1": 0
      }
      for(var i = 0;i < 2;i++){
        for(var j in checkCardScore){
          var method = checkMethod[j]
          if (method(card_list[i]) === true){
            if (score_map[i + ""] < checkCardScore[j]){
              score_map[i + ""] = checkCardScore[j];
            }
          }
        }
      }
      if (score_map[0] === score_map[1]) //积分相等
      {
        card1 = sordCard(card1)
        card2 = sordCard(card2)
        console.log("card1++++++",JSON.stringify(card1))
        console.log("card2++++++",JSON.stringify(card2))
      }else if(score_map[0] > score_map[1]){
          return true
      }
      return false
      console.log("score_map",JSON.stringify(score_map))
    }
    return that;
};
module.exports = CardController
