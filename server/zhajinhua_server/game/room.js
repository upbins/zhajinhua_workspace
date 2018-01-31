const Player = require("../game/player"); 
const EventListner = require("../game/event_listener")
const Room = function () {
    var that = {};
    var player_list = [];
    var event_listner = EventListner({});
    that.createPlayer = function (uid,socket) {
        console.log("create player =" + uid)
        var player = Player({
            uid:uid,
            socket:socket,
            event:event_listner,
            index:player_list.length,
        })
        player_list.push(player);

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
    
        event_listner.fire("send_create_player_message", {
            uid: uid,
            index: player.getIndex()
        })
    };
   
    that.getPlayerCount = function () {
      return player_list.length;
    };
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
    return that;
}
module.exports = Room;