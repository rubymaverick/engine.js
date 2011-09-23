var engine = require("../../engine").engine;

describe("error scenarios", function(){
    var client, task, intake, exhaust, cylinder;
    
    intake = engine.intake.create();
    exhaust = engine.exhaust.create();
    cylinder = engine.cylinder.create();
    client = engine.client.create();

    it("throws a TimeoutError", function(){
        var callback = jasmine.createSpy();
        task = client.createTask();
        task.setContext("(function(locals){ return { sleep: function() { var now = new Date().getTime(); while(new Date().getTime() < now + 10000) { /* sleep */ } } } })");
        task.setLocals({});
        task.setCode("sleep();");        
        task.on('eval', callback);
        task.run();
        
        waitsFor(function(){
            return callback.callCount > 0;
        });

        runs(function(){
            expect(callback.mostRecentCall.args[0]).toContain("TimeoutError");
            task.done();
        });
        
    });

    it("throws a SyntaxError", function(){
        var callback = jasmine.createSpy();
        task = client.createTask();
        task.setContext("(function(locals){ return { add: function(a,b){ return a+b; } } })");
        task.setLocals({});
        task.setCode("add(1,2");        
        task.on('eval', callback);
        task.run();
        
        waitsFor(function(){
            return callback.callCount > 0;
        });

        runs(function(){
            expect(callback.mostRecentCall.args[0]).toContain("SyntaxError");
            task.done();
        });
        
    });

    it("throws a ReferenceError", function(){
        var callback = jasmine.createSpy();
        task = client.createTask();
        task.setContext("(function(locals){ return { add: function(a,b){ return a+b; } } })");
        task.setLocals({});
        task.setCode("subtract(1,1)");        
        task.on('eval', callback);
        task.run();
        
        waitsFor(function(){
            return callback.callCount > 0;
        });

        runs(function(){
            expect(callback.mostRecentCall.args[0]).toContain("ReferenceError");
            task.done();
        });
        
    });


    // This test must always run last
    it("closes all components",function(){
        exhaust.close();
        cylinder.close();
        intake.close();
        client.close();        

        waits(5000);
    });

});