
const readline = require('readline');
var arDrone = require('ar-drone');

var client  = arDrone.createClient();
client.createRepl();

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
keyName = null;

process.stdin.on('keypress', (str, key) => {
 if (key.ctrl && key.name === 'c') {
   process.exit();
 } else {
  console.log(key.name);

  if(key.name == 't') {
  	client.takeoff();
	client.after(500, function() {
		this.stop();
	});
  }

  if(key.name == 'l') {
  	client.land();
  }

  if(key.name == 'w') {
  	client.front(0.2);
	client.after(200, function() {
		this.stop();
	});
  }

  if(key.name == 's') {
  	client.back(0.2);
	client.after(200, function() {
		this.stop();
	});
  }

  if(key.name == 'd') {
  	client.right(0.2);
	client.after(200, function() {
		this.stop();
	});
  }

  if(key.name == 'a') {
  	client.left(0.2);
	client.after(200, function() {
		this.stop();
	});
  }

 }
});
console.log('Initialized');
