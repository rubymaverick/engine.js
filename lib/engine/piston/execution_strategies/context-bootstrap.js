"use strict";

Function.prototype.constructor = function(){  };
Function.prototype.toString = function(){  };

var SecurityError = function(message){
    this.message = message;
    this.name = "SecurityError";
};
SecurityError.prototype = Error.prototype;
