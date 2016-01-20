/////////////////////////////////////

var presidents = ['Washington', 'Adams', 'Jefferson', 'Madison', 'Monroe'];

for (var i = 0; i < presidents.length; i++){
	console.log(presidents[i]);
	console.log('The value of i is: ' + i);
}

/////////////////////////////////////

var stringOfNumbers = '';

for (var i = 10; i <= 20; i++){
stringOfNumbers = stringOfNumbers + i;
}

console.log(stringOfNumbers);

/////////////////////////////////////


// ## `Add only even numbrs to an array`
// Declare a variable named `evenNumberArray`.
// ​
// Use a _FOR_ loop to add only even numbers to an Array. 
// Add `50` even numbers to the `evenNumberArray` starting with the value `0`.

var evenNumberArray = [];

for (var i = 2; i <= 100; i += 2) {
	evenNumberArray.push(i);
	}

console.log(evenNumberArray);

/////////////////////////////////////

var oopsArray = ['turn' , , 'down' , , 'for' , , 'what'];

for (var i = 1; i < oopsArray.length; i += 2){
	oopsArray[i].push('nope');
}

console.log(oopsArray);

/////////////////////////////////////





