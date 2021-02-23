var fs = require('fs');
var dt = 0;
var d = distToLoc();

class velo {
  constructor(sideA, sideB) {
    this.sideA = sideA;
    this.sideB = sideB;
  }
  // Getter
  get area() {
    return this.calcVelo();
  }
  // Method
  calcVelo() {
  	console.log(this.sideA);
  	console.log(this.sideB);
	var s1 = this.sideA * 0.001;
	var s2 = this.sideB * 0.001;
    var p = Math.sqrt(Math.pow(s1, 2) + Math.pow(s2, 2));
    var g = Math.abs(p);
    return g
  }
}

function distToLoc() {
    var data = fs.readFileSync('distance.txt', 'utf8');
    console.log(parseFloat(data.toString()));   
    var dt = parseFloat(data.toString());
    return dt;
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

var velo1 = 200;
var velo2 = 100;

function myLoop() {         //  create a loop function
  velo1 += 15;
  velo2 += 15;
  const p = new velo(velo1, velo2);
  setTimeout(function() {   //  call a 3s setTimeout when the loop is called
    dt += p.area;                    //  increment the counter
    console.log("   ");
    console.log("Distance remaining:");
    console.log(d - dt);
    console.log("   ");
    if (dt < d) {           //  if the counter < 10, call the loop function
      myLoop();             //  ..  again which will trigger another 
    } else {
    	console.log("Reached location");
    }
  }, 1000)
}

myLoop();
