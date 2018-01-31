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
        global.eventlistener = EventListener({});
        global.eventlistener.on("login", function (uid) {
            console.log("button click uid= " + uid);
            global.socket.emit("login_player", uid);
        });

        //进入游戏
        global.socket.on("sync_data", (data) => {
            console.log("@@@@global.socket")
            console.log("sync data = " + JSON.stringify(data));
            this.enterGameWorld(data);
        });
        global.socket.on("player_join", (data) =>{
            global.eventlistener.fire("player_join",data);
        });
        global.socket.on("player_offline", (uid) => {
            global.eventlistener.fire("player_offline",uid)
        });
        global.socket.on("change_house_manager_id",(uid)=>{
            global.eventlistener.fire("change_house_manager",uid)
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
        global.eventlistener.fire("sync_data", data);
    }
});
