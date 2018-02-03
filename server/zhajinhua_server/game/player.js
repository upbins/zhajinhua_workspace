const Player = function (data) {
  var that = {};
  var player_uid = data.uid;
  var player_socket = data.socket;
  var event_listner = data.event;
  var index = data.index;
  var card_list =[];
  //接收到客户端说玩家离线
  player_socket.on("disconnect",function () {
    console.log("玩家掉线")
    event_listner.fire("disconnect",player_uid);
  });
  //接收到客户端开始游戏消息
  player_socket.on("start_game",function () {
    //给房间发送开始游戏
    console.log("player_socket-start_game")
    event_listner.fire("start_game");
  })

  //接收到看牌请求
  player_socket.on("look_card",function () {
    event_listner.fire("look_card",player_uid)
    player_socket.emit("show_card",card_list);//把牌发给玩家
  })
  //向客户端发送同步人物信息
  that.sendSyncData = function (data) {
    console.log("send sync data  = " + JSON.stringify(data));
    player_socket.emit("sync_data", data);
  };

  //向客户端发送创建人物信息
  const sendCreatePlayerMessage = function (data) {
    if (data.uid != player_uid) {
      console.log("send create player messga222 = " + JSON.stringify(data))
      player_socket.emit("player_join",data)
    }

  };
  //这里主要接受房间到发送事件之后再去向客户端操作
  event_listner.on("send_create_player_message",sendCreatePlayerMessage);

  //向客户端发离线人物信息
  const sendPlayerOffline = function (uid) {
    console.log("player-sendPlayerOffline")
    player_socket.emit("player_offline",uid);
  };
  //这里主要接受房间到发送事件之后再去向客户端操作
  event_listner.on("player_offline",sendPlayerOffline);

  //向客户端发离线更改房主信息
  const sendChangeHouseMangaer = function (uid) { //通知客户端修改UID
    console.log("@@@@@@@@@@sendChangeHouseMangaer",uid)
    player_socket.emit("change_house_manager_id",uid);
  }
  //这里主要接受房间到发送事件之后再去向客户端操作
  event_listner.on("change_house_manager_id",sendChangeHouseMangaer)

  const pushCard =  function () {
    //发送给客户端
    player_socket.emit("push_card")
  }
  //这里主要接受到房间告诉玩家我发牌了
  event_listner.on("push_card",pushCard)

  //接受到look_card事件
  const playerLookCard = function (uid) {
    player_socket.emit("player_look_card",uid)
  }
  event_listner.on("look_card",playerLookCard)

  that.getUid = function () {
    return player_uid
  };
  that.getIndex = function () {
    return index
  };
  that.pushOneCard = function (card) {
    card_list.push(card);
    console.log(player_uid +"get"+ JSON.stringify(card))
  }

  //主要释放一些事件
  that.destroy = function () {
    event_listner.off("send_create_player_message",sendCreatePlayerMessage);
    event_listner.off("player_offline",sendPlayerOffline);
    event_listner.off("change_house_manager_id",sendChangeHouseMangaer);
    event_listner.off("change_house_manager_id",pushCard);
    event_listner.off("look_card",playerLookCard)
  };

  return that;
}
module.exports = Player;