var fs = require("fs");

var engine = require("engine.js").engine;
var client = engine.client.create();

var task = client.createTask();
task.setContext(fs.readFileSync("./resources/context.js", "utf-8"));
task.setLocals({});
task.setCode(fs.readFileSync("./resources/code.js", "utf-8"));        

task.on('eval', function(data){
  console.log('your code was evaluated as:', data);
});

task.on('output', function(output){
    console.log(output);
});

task.run();