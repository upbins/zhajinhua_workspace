const Player = require("../game/player"); 
const EventListner = require("../game/event_listener")
const Room = function () {
    var that = {};
    var player_list = [];
    var event_listner = EventListner({});

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
    event_listner.on("start_game",function () {
        console.log("房主开始游戏")
    })
    return that;
}
module.exports = Room;