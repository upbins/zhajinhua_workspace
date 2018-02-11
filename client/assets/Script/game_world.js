var global = require("./global");
var EventListener = require("./event_listener")
cc.Class({
  extends: cc.Component,

  properties: {
    player_node_prefab: {
      default: null,
      type: cc.Prefab
    },
    player_pos_list: {
      default: [],
      type: cc.Node
    },
    game_ready_ui: {
      default: null,
      type: cc.Node
    }
  },
  onLoad: function () {
    this._index = 0;
    this.playerNodeList = [];
    this.game_ready_ui.active = false;
    global.gameEventListener = EventListener({});
    //接收到同步消息的事件
    global.gameEventListener.on("sync_data", (data) => {
      console.log("game world sync data = " + JSON.stringify(data));
      global.playerData.uid = data.uid;
      global.playerData.house_manager_id = data.house_manager_id;
      //收到同步消息的时候设置一个房主开始游戏按钮
      if (data.uid === data.house_manager_id){
        this.game_ready_ui.active = true;
      }
      var _playersData = data.players_data;
      this._index = data.index;

      for (var i = 0; i < _playersData.length; i++) {
        var playerData = _playersData[i];
        this.createPlayer(playerData.uid, playerData.index);
      }
    });
    //接收到玩家参加的事件
    global.gameEventListener.on("player_join",(data)=>{
      this.createPlayer(data.uid,data.index);
    });
    //接收到玩家离线的事件
    global.gameEventListener.on("player_offline",(uid)=>{
      for(var i =0; i < this.playerNodeList.length;i++){
        var playerNode = this.playerNodeList[i];
        if (playerNode.getComponent("player_node").getUid() == uid)
        {
          playerNode.removeFromParent(true);//删除头像
          playerNode.destroy();
          this.playerNodeList.splice(i,1)
        }

      }
    });
    //收到变换房主的时候设置一个房主开始游戏按钮
    global.gameEventListener.on("change_house_manager",(uid)=>{
      global.playerData.house_manager_id = uid;
      if (global.playerData.uid === uid){
        this.game_ready_ui.active = true;
      }
    })
    //收到发牌消息之后隐藏开始按钮
    global.gameEventListener.on("push_card",()=>{
      this.game_ready_ui.active = false
    })
  },
  createPlayer: function (uid, index) {
    console.log("uid = " + uid);
    console.log("index = " + index);
    var currentIndex = index - this._index;
    if (currentIndex < 0){
      currentIndex = currentIndex + 6;
    }
    var player = cc.instantiate(this.player_node_prefab);
    player.parent = this.node;
    player.getComponent("player_node").init(uid, currentIndex);
    player.position = this.player_pos_list[currentIndex].position;
    this.playerNodeList.push(player);
  },
  onButtonClick:function (event,customData) {
    console.log("customData"+customData)
    switch (customData)
    {
      case "start_game":
        console.log("start_game")
        global.eventControllerlistener.fire("start_game");
        break;
      case "look_card":
        global.eventControllerlistener.fire("look_card");
        break;
      case "rate_one":
        global.eventControllerlistener.fire("player_choose_rate",1);
        break;
      case "rate_two":
        global.eventControllerlistener.fire("player_choose_rate",2);
        break;
      case "rate_five":
        global.eventControllerlistener.fire("player_choose_rate",5);
        break;
      case "compare":
        global.gameEventListener.fire("player_pk");
        break
      default:
        break
    }
  }
});
