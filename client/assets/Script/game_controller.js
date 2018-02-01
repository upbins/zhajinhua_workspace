
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
