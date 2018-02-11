const Player = require("../game/player");
const EventListner = require("../game/event_listener")
const CardController = require("../game/card_controller")
const Room = function () {
  var that = {};
  var player_list = [];
  var event_listner = EventListner({});
  var card_controller = CardController();
  card_controller.init()
  var currentTotalRate = 0;
  var trunCurrentIndex = 0;
  var currentMaxRate = 0
  const getIndex = function () {
    var seatMap ={};
    //先存储已坐作为的一些状态
    for (var i =0;i < player_list.length;i++){
      seatMap[player_list[i].getIndex()] = true
    }
    for (var i = 0;i < 6;i++){
      if (!seatMap.hasOwnProperty(i)){
        return i;
      }
    }
  }
  that.createPlayer = function (uid,socket) {
    console.log("create player =" + uid)
    var currentIndex = getIndex();

    //玩家数据
    var player = Player({
      uid:uid,
      socket:socket,
      event:event_listner,
      index:currentIndex,
    })
    player_list.push(player);

    //玩家数据数组
    var playerDatas = [];
    for (let i = 0; i < player_list.length; i++) {
      var pl = player_list[i];
      playerDatas.push({
        uid:pl.getUid(),
        index:pl.getIndex()
      });
    }
    //同步消息
    player.sendSyncData({
      uid:uid,
      index:player.getIndex(),
      house_manager_id:player_list[0].getUid(),
      players_data: playerDatas,
    });

    //发送玩家创建事件
    event_listner.fire("send_create_player_message", {
      uid: uid,
      index: player.getIndex()
    })
  };

  that.getPlayerCount = function () {
    return player_list.length;
  };
  //接受玩家选择倍数消息
  event_listner.on("choose_rate",function (data) {
    currentTotalRate += data.rate;
    currentMaxRate = data.rate;
    data.totlRate = currentTotalRate;
    event_listner.fire("update_player_rate",data)
    turnPlayer()
  })
  //玩家离线事件监听
  event_listner.on("disconnect",function (uid) {
    for (let i = 0; i < player_list.length; i++) {
      if (player_list[i].getUid() === uid ){
        player_list[i].destroy();
        player_list.splice(i,1);
      }
    }
    if (player_list.length === 0){ //如果房间没人了。直接返回
      return;
    }
    event_listner.fire("player_offline",uid);
    event_listner.fire("change_house_manager_id",player_list[0].getUid());
  });

  const playerComparePk = function (data) {
    var map ={};
    for(var i = 0;i<player_list.length;i++){
      map[player_list[i].getUid()] = player_list[i];
    }
    var player_1 = map[data.player_uid];
    var player_2 = map[data.target_uid];
    var player_1_card_list = player_1.getCardList();
    var player_2_card_list = player_2.getCardList();
    var result = card_controller.compareCard(player_1_card_list,player_2_card_list);//比牌结果
  }
  //接收到玩家比牌事件的监听
  event_listner.on("player_compare_pk",playerComparePk)
  event_listner.on("start_game",function () {
    console.log("房主开始游戏");
    pushCard();
    turnPlayer();
  })
  const pushCard = function () {
    for(var i =0;i < 3;i++){
      for (var j =0; j<player_list.length;j++){
        var player = player_list[j]
        player.pushOneCard(card_controller.popCard())
      }
    }
    //告诉玩家发送牌
    event_listner.fire("push_card")
  }
  //玩家轮流操作
  const turnPlayer = function () {
    var uid = undefined;
    for (var i = 0;i<player_list.length;i++){
      if (trunCurrentIndex === player_list[i].getIndex()){
        uid = player_list[i].getUid()
      }
    }
    event_listner.fire("turn_player_index",{
      uid:uid,
      maxRate:currentMaxRate
    });
    trunCurrentIndex ++;
    //一轮过去了
    if (trunCurrentIndex >= player_list.length){
      trunCurrentIndex = 0;
    }
  }
  return that;
}
module.exports = Room;