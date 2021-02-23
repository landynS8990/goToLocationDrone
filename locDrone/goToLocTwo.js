const readline = require('readline');
var arDrone = require('ar-drone');
var fs = require('fs');
var client  = arDrone.createClient();
client.createRepl();

client.takeoff();
setTimeout(function(){ 
	client.calibrate(0);
}, 1000);

var yaw;
var metros;

/*function pythagorean(sideA, sideB){
    var p = Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
    var g = Math.abs(p);
    return g
}
function distToLoc() {
    var data = fs.readFileSync('distance.txt', 'utf8');
    console.log(parseFloat(data.toString()));   
    var dt = parseFloat(data.toString());
    return dt;
}*/

function distToLoc() {
    var data = fs.readFileSync('distance.txt', 'utf8');
    console.log(parseFloat(data.toString()));   
    var dt = parseFloat(data.toString());
    return dt;
}
var d = distToLoc();

var startTime, endTime;

function start() {
  startTime = new Date();
};



function end() {
  endTime = new Date();
  var timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds 
  var seconds = timeDiff;
  return seconds;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getAngle() {
	try {  
	    var data = fs.readFileSync('data.txt', 'utf8');
	    console.log(parseFloat(data.toString()));   
	    var ft = parseFloat(data.toString());
	    return ft
	} catch(e) {
	    console.log('Error:', e.stack);
	}
}

async function run() {
  // everything below is guaranteed to run after the "sleep"
  client.on('navdata', (data)=>{
  	yaw = data.demo.rotation.yaw;
  });
}

var numba = 0;
var startTimer = 0;

async function demo() {
	run();
	await sleep(1000);
	for (var i = 0; i < 200000; i++) {
		if(numba == 0) {
			run();
			console.log(yaw);
			var t = getAngle();
			var u = t + 0.5;
			var l = t - 0.5;
			if (yaw > u) {
				console.log(yaw);
				client.counterClockwise(0.2);
				console.log("Turn left");
			    client.after(100, function() {
			      this.stop();
			    });
			} else if (yaw < l)  {
				console.log(yaw);
				client.clockwise(0.2);
				console.log("Turn right");
			    client.after(100, function() {
			      this.stop();
			    });
			} else {
				console.log("Reached angle");
				client.stop();
				numba += 1;
			}
		} else {
			if (startTimer == 0) {
				start();
			}
			numba += 1;
		    client.front(0.2);
		    var timeEl = end();
		    console.log(timeEl);
		    var distTravelled = timeEl * 2.22222;
		    if (distTravelled < d) {
		      console.log("Not there yet");
		      console.log("     ");
		      console.log("Distance travelled: ");
		      console.log(d - distTravelled);
		      console.log("     ");
		    } else {
		      console.log("Arrived");
		      console.log("     ");
		      console.log("Landing...");
		      client.land();
		      console.log("     ");
		      console.log("Landed");
		    }
		    startTimer += 1;

		}

		await sleep(100);
	}
}

setTimeout(function(){ 
	console.log("Going to location...")
	demo();
}, 10000);



