const Player = function (data) {
    var that = {};
    var player_uid = data.uid;
    var player_socket = data.socket;
    var event_listner = data.event;
    var index = data.index;

    player_socket.on("disconnect",function () {
        console.log("玩家掉线")
        event_listner.fire("disconnect",player_uid);
    });
    that.sendSyncData = function (data) {
        console.log("send sync data  = " + JSON.stringify(data));
        player_socket.emit("sync_data", data);
    };
    const sendCreatePlayerMessage = function (data) {
        if (data.uid != player_uid) {
            console.log("send create player messga222 = " + JSON.stringify(data))
            player_socket.emit("player_join",data)
        }

    };
    event_listner.on("send_create_player_message",sendCreatePlayerMessage);

    const sendPlayerOffline = function (uid) {
        console.log("player-sendPlayerOffline")
        player_socket.emit("player_offline",uid);
    };
    event_listner.on("player_offline",sendPlayerOffline);

    const sendChangeHouseMangaer = function (uid) { //通知客户端修改UID
        console.log("@@@@@@@@@@sendChangeHouseMangaer",uid)
        player_socket.emit("change_house_manager_id",uid);
    }
    event_listner.on("change_house_manager_id",sendChangeHouseMangaer)
    that.getUid = function () {
        return player_uid
    };
    that.getIndex = function () {
        return index
    };

    that.destroy = function () {
        event_listner.off("send_create_player_message",sendCreatePlayerMessage);
        event_listner.off("player_offline",sendPlayerOffline);
        event_listner.off("change_house_manager_id",sendChangeHouseMangaer);
    };
   
    return that;
}
module.exports = Player;