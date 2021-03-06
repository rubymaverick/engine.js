var engine = require("../../engine").engine,
    _ = require("underscore"),
    helpers = require("../helpers/component_factories").helpers;

var run_parameterized_system_test = function(scheme, num_clients, tasks_per_client, num_cylinders){
    
    var components = {};
    runs(function(){
	if (scheme == "tcp") {
	    components['intake'] = helpers.create_tcp_intake(5555, 5556);
	    components['exhaust'] = helpers.create_tcp_exhaust(5557, 5558);
	    components['clients'] = helpers.create_tcp_clients(num_clients, 5555, 5558);
	    components['cylinders'] = helpers.create_tcp_cylinders(num_cylinders, 5556, 5557);
	} else if (scheme == "ipc") {
	    var identifier = helpers.num_to_s(num_clients) + "-" + 
	     helpers.num_to_s(tasks_per_client) + "-" +
	     helpers.num_to_s(num_cylinders);

	    components['intake'] = helpers.create_ipc_intake(identifier);
	    components['exhaust'] = helpers.create_ipc_exhaust(identifier);
	    components['clients'] = helpers.create_ipc_clients(num_clients, identifier);
	    components['cylinders'] = helpers.create_ipc_cylinders(num_cylinders, identifier);
	} else {
	    throw "'scheme' must be either 'ipc' or 'tcp'";
	}
    });
    
    waits(1000);

    var tasks = {}, task, callback, int1, int2, start_time;
    runs(function(){
	start_time = new Date();
	
	_.each(components['clients'], function(client){
	    for(var i = 1; i <= tasks_per_client; i++){
		int1 = Math.random(0,100);
		int2 = Math.random(0,200);
		task = client.createTask();
		task.setContext("(function(locals){ return { add: function(a,b){ return a+b; } } })");
		task.setLocals({});	    
		task.setCode("add("+int1+","+int2+")");
		callback = jasmine.createSpy();
		task.on('eval', callback);
		tasks[task.id] = {};
		tasks[task.id]['task'] = task;
		tasks[task.id]['callback'] = callback;
		tasks[task.id]['expected_result'] = int1+int2;
		task.run();
	    }
	});
    });

    waitsFor(function(){
	return _.all(tasks, function(data, task_id){
	    return data['callback'].callCount > 0;
	});
    },100000);

    runs(function(){
	_.each(tasks, function(data, task_id){
	    expect(data['callback'].mostRecentCall.args[0]).toBe(data['expected_result']);
	});
    });    

    runs(function(){
	components['intake'].close();
	components['exhaust'].close();
	_.each(components['cylinders'], function(cylinder){
	    cylinder.close();
	});
	_.each(components['clients'], function(client){
	    client.close();
	});
	report_results(scheme, num_clients, tasks_per_client, num_cylinders, start_time, new Date());
    });

    waits(5000);
};  

var report_results = function(transport_scheme, num_clients, tasks_per_client, num_cylinders, start_time, end_time){
    var total_tasks = num_clients * tasks_per_client;
    var total_time = (end_time - start_time) / 1000;
    var tasks_per_second = total_tasks / total_time;

    console.log("\n["+transport_scheme+"] " + total_tasks + " tasks from " + 
		num_clients + " clients against " + num_cylinders + " cylinders " +
		"completed in " + total_time + " seconds " + 
		"(" + Math.floor(tasks_per_second) + " tps)");
};

describe("Many simple addition tasks", function(){
    describe("from one client", function(){
	it("with 1 cylinder", function(){
            run_parameterized_system_test('tcp',1,2500,1);
            run_parameterized_system_test('ipc',1,2500,1);
	});

	it("with 25 cylinders", function(){
            run_parameterized_system_test('tcp',1,2500,25);
            run_parameterized_system_test('ipc',1,2500,25);
	});

	it("with 50 cylinders", function(){
            run_parameterized_system_test('tcp',1,2500,50);
            run_parameterized_system_test('ipc',1,2500,50);
	});

	it("with 75 cylinders", function(){
            run_parameterized_system_test('tcp',1,2500,75);
            run_parameterized_system_test('ipc',1,2500,75);
	});

	it("with 100 cylinders", function(){
            run_parameterized_system_test('tcp',1,2500,100);
            run_parameterized_system_test('ipc',1,2500,100);
	});
    });

    describe("from many clients", function(){
	it("with 1 cylinder", function(){
            run_parameterized_system_test('tcp',50,50,1);
            run_parameterized_system_test('ipc',50,50,1);
	});

	it("with 25 cylinders", function(){
            run_parameterized_system_test('tcp',50,50,25);
            run_parameterized_system_test('ipc',50,50,25);
	});

	it("with 50 cylinders", function(){
            run_parameterized_system_test('tcp',50,50,50);
            run_parameterized_system_test('ipc',50,50,50);
	});

	it("with 75 cylinders", function(){
            run_parameterized_system_test('tcp',50,50,75);
            run_parameterized_system_test('ipc',50,50,75);
	});

	it("with 100 cylinders", function(){
            run_parameterized_system_test('tcp',50,50,100);
            run_parameterized_system_test('ipc',50,50,100);
	});
    });

});