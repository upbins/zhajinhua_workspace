
var global = require("./global");
var EventListener = require("./event_listener")
cc.Class({
  extends: cc.Component,

  properties: {
    main_world_prefab: {
      default: null,
      type: cc.Prefab
    },
    game_world_prefab: {
      default: null,
      type: cc.Prefab
    }
  },

  // use this for initialization
  onLoad: function () {
    global.socket = io("localhost:3000");
    global.eventControllerlistener = EventListener({});
    //接受登陆事件
    global.eventControllerlistener.on("login", function (uid) {
      console.log("button click uid= " + uid);
      //发送给服务器有玩家登陆了
      global.socket.emit("login_player", uid);
    });
    //接收到客户端开消息
    global.eventControllerlistener.on("start_game",  ()=> {
      console.log("player house manager click start game");
      global.socket.emit("start_game");
    });

    //接收到看牌信息
    global.eventControllerlistener.on("look_card",()=>{
      global.socket.emit("look_card")
    })

    global.eventControllerlistener.on("player_choose_rate",  (data)=> {
      console.log("player_choose_rate");
      global.socket.emit("player_choose_rate",data);
    });

    //接收到和谁比牌的消息，然后告诉服务器
    global.eventControllerlistener.on("player_compare_choose",(uid)=>{
      global.socket.emit("player_compare_choose",uid);
    })

    //接受到服务器返回玩家同步信息
    global.socket.on("sync_data", (data) => {
      console.log("sync data = " + JSON.stringify(data));
      this.enterGameWorld(data);
    });

    //接受到服务器返回玩家参加信息
    global.socket.on("player_join", (data) =>{
      global.gameEventListener.fire("player_join",data);
    });
    //接受到服务器返回玩家离线
    global.socket.on("player_offline", (uid) => {
      global.gameEventListener.fire("player_offline",uid)
    });
    //接收到服务器返回房主更改
    global.socket.on("change_house_manager_id",(uid)=>{
      global.gameEventListener.fire("change_house_manager",uid)
    });

    //接收到服务器返回发送卡片
    global.socket.on("push_card",()=>{
      global.gameEventListener.fire("push_card")
    })

    //接收显示牌
    global.socket.on("show_card",(card_list)=>{
      global.gameEventListener.fire("show_card",card_list);
    })

    //接收到选择倍数消息
    global.socket.on("player_choose_rate",(data)=>{
      global.gameEventListener.fire("player_choose_rate",data);
    })

    //接收到轮流出手信息返回
    global.socket.on("turn_player_message",(data)=>{
      global.gameEventListener.fire("turn_player_message",data);
    })
    //接收到比牌结果
    global.socket.on("pk_result",(data)=>{
      console.log("pk_result"+JSON.stringify(data));
      global.gameEventListener.fire("pk_reuslt",data);
    })
    this.enterMainWorld();
  },
  enterMainWorld: function () {
    if (this.runningWorld != undefined) {
      this.runningWorld.removeFromParent(true);
    }
    this.runningWorld = cc.instantiate(this.main_world_prefab);
    this.runningWorld.parent = this.node;
  },
  enterGameWorld: function (data) {
    if (this.runningWorld != undefined) {
      this.runningWorld.removeFromParent(true);
    }
    console.log("enterGameWorld")
    this.runningWorld = cc.instantiate(this.game_world_prefab);
    this.runningWorld.parent = this.node;
    global.gameEventListener.fire("sync_data", data);
  }
});
