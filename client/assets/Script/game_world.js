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
        // game_ready_ui: {
        //     default: null,
        //     type: cc.Node
        // }
    },
    onLoad: function () {
        this._index = 0;
        this.playerNodeList = [];
        //this.game_ready_ui.active = false;
        global.eventlistener = EventListener({});
        global.eventlistener.on("sync_data", (data) => {
            console.log("game world sync data = " + JSON.stringify(data));
            global.playerData.uid = data.uid;
            global.playerData.house_manager_id = data.house_manager_id;
            var _playersData = data.players_data;
            this._index = data.index;

            for (var i = 0; i < _playersData.length; i++) {
                var playerData = _playersData[i];
                this.createPlayer(playerData.uid, playerData.index);
            }
        });
        global.eventlistener.on("player_join",(data)=>{
            this.createPlayer(data.uid,data.index);
        });
        global.eventlistener.on("player_offline",(uid)=>{
            for(var i =0; i < this.playerNodeList.length;i++){
                var playerNode = this.playerNodeList[i];
                if (playerNode.getComponent("player_node").getUid() == uid)
                {
                    playerNode.removeFromParent(true);//删除头像
                    playerNode.destroy();
                    this.playerNodeList.splice(i,1)
                }

            }
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
});
