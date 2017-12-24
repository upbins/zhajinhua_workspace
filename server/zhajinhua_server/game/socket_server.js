var Socket = require("socket.io");
var Room = require("../game/room");
const SocketServer = function (server) {
    var that = Socket(server);
    var _roomList = [];
    that.on("connection", function (socket) {
        console.log("a user connection");
        socket.on("login_player", function (uid) { //接受客户端返回的信息
            console.log("玩家注册" + uid);

            if (_roomList.length === 0) { //如果房间列表为空,默认创建一个房间
                _roomList.push(Room());
            }
            if (_roomList[_roomList.length - 1].getPlayerCount() >= 6) { //如果一个房间多余6个人.则要创建另外的房间
                _roomList.push(Room());
            }
            _roomList[_roomList.length - 1].createPlayer(uid, socket); //向房间添加一个人
        });

       
    });
    return that;
};
module.exports = SocketServer;