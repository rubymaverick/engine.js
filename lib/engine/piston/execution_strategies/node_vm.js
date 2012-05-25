var vm = require("vm");
var node_vm = function(){};

node_vm.make = function(){
    var strategy = new node_vm();
    return strategy;
};

node_vm.prototype.execute = function(code, sandbox){
    "use strict";

    Function.prototype.constructor = function(){ throw new SecurityError("The Function constructor may not be called"); };
    Function.prototype.toString = function(){ throw new SecurityError("'toString' may not be called on functions"); };

    var last_eval;

    try {
        last_eval = vm.runInNewContext(code,sandbox);
    } catch (e) {
        last_eval = e.name + ': ' + e.message;
    }

    return last_eval;
};


var SecurityError = function(message){
    this.message = message;
    this.name = "SecurityError";
};
SecurityError.prototype = Error.prototype;

exports.node_vm = node_vm;
