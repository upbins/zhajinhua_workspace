const EventListener = function (obj) {
    let register = {};
    obj.on = function (name,method) {
        if (!register.hasOwnProperty(name)) //如果这个注册事件不存在,久添加一个数组
        {
            register[name] = [];
        }
        register[name].push(method);
    };
    obj.fire = function (name) {
        if (register.hasOwnProperty(name))
        {
            var handlerList = register[name];
            for (let i = 0; i < handlerList.length; i++) {
                const handler = handlerList[i];
                let args = [];
                for (let j = 1; j< arguments.length; j++) {
                    args.push(arguments[j]);
                }
                handler.apply(this, args);
            }
        }
    }; 
    obj.off = function (name,method) {
        console.log("off handler name = " + name);
        if (register.hasOwnProperty(name)) {
            var handlerList = register[name];
            for (var i = 0; i < handlerList.length; i++) {
                if (handlerList[i] === method) {
                    handlerList.splice(i, 1);
                }
            }
        }
    };
    obj.destroy = function() {
        register = {};
    };
    return obj;
}
module.exports = EventListener