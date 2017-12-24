var global = require("./global");
var EventListener = require("./event_listener")
cc.Class({
    extends: cc.Component,

    properties: {
      
    },

    // use this for initialization
    onLoad: function () {
        global.socket = io("localhost:3000");
        global.eventlistener = EventListener({});
        global.eventlistener.on("login", function (uid) {
            console.log("button click uid= " + uid);
            global.socket.emit("login_player", uid);
        });
    },
});
