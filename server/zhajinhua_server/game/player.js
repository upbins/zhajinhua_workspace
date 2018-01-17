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
        player_socket.emit("player_offline",uid);
    };
    event_listner.on("player_offline",sendPlayerOffline);
    
    that.getUid = function () {
        return player_uid
    };
    that.getIndex = function () {
        return index
    };

    that.destroy = function () {
        event_listner.off("send_create_player_message333",sendCreatePlayerMessage);  
        event_listner.off("send_create_player_message333",sendPlayerOffline);  
    };
   
    return that;
}
module.exports = Player;