var global = require("./global")
cc.Class({
    extends: cc.Component,

    properties: {
        edit_box: {
            default: null,
            type: cc.EditBox
        }
    },

    // use this for initialization
    onLoad: function () {

    },
    buttoonClick: function (event, customData) {
        console.log("buttoonClick"+this.edit_box.string)
        //抛出登陆事件
        if (this.edit_box.string.length !== 0) {
            global.eventControllerlistener.fire("login",this.edit_box.string);
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
