const Player = require("../game/player"); 
const Room = function () {
    var that = {};
    var player_list = [];
    that.createPlayer = function (uid,socket) {
        player_list.push(Player(uid,socket))
    };
    that.getPlayerCount = function () {
      return player_list.length;
    };
    return that;
}
module.exports = Room;