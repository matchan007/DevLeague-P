
// Plain object and adding properties

// Declare a variable named plainBox and set its value to be an empty object.

// Next, you will add three properties to this object. Each property declaration expression will be on its own line and ending with semicolons (;). This is just one way of adding properties to an object.

// Add a property named color and set it the name of any color.
// Add a property named size and set it to a number value between 0 and 20.
// Add a property named contents and set it to be an empty array.

var plainBox =
{
		color: 'purple',
		size: 20,
		contents: [],
};

console.log(plainBox);


// An object with properties declared line by line

// Declare a variable named stockCar and set its value to be an object with its key-value pairs separated by commas (,). This is a way of declaring a new object and also being able to add property names and values at the moment an object is created.

// add a key named automaticTransmission and give it a Boolean value of your choice.
// add a key named driver and set it to be null.
// add a key named passengers and set it to be an empty array.

var stockCar = 
	{
	model: 'Ford',
	year: 2016,
	automaticTransmission: true,
	drivers: null,
	passengers: [],
};

console.log(stockCar.model);

// Declare a variable named plainPerson. Set its value to be an empty object with no properties.

// Next, declare a function named buildPerson and then define three parameters. The first parameter 
// will be named person and the second will be nameString and the third will be age. Within this 
// function you will modify the person object by:

// adding a property called name and set its value to be the second parameter.
// adding a property called age and set its value to be the third parameter.

// The function will return the first parameter.

// Finally, invoke your new function while passing in the plainPerson object and additional agrument values, 
// then store the return value. Use console.log three times to print the entire object, just the value at name, 
// and just the value at age.

var plainPerson = {};

function buildPerson (person, nameString, age){	
	person.name = nameString; 
	person.age = age;
	return person;
}

var builtPerson = buildPerson(plainPerson,'Leo',20);
console.log(builtPerson.age);

console.log(plainPerson);

// Declare a new variable named arrayOfObjects and set it to be this array of objects.

// Declare a new function named printProcessedOrdersand set one parameter called orders. 
// Within this function you will use console.log to print order details to the page.

var arrayOfObjects = [
  {
    id: 0,
    date: "Monday Jan 25 2015 2:01 PM",
    total: "279.38"
  },
  {
    id: 1,
    date: "Monday Jan 27 2015 11:31 AM",
    total: "79.80"
  },
  {
    id: 2,
    date: "Monday Feb 1 2015 7:56 AM",
    total: "15.62"
  },
  {
    id: 3,
    date: "Monday Feb 1 2015 9:43 AM",
    total: "19.83"
  },
  {
    id: 4,
    date: "Monday Feb 1 2015 11:08 PM",
    total: "56.69"
  },
  {
    id: 5,
    date: "Monday Feb 13 2015 10:22 AM",
    total: "137.92"
  },
  {
    id: 6,
    date: "Monday Feb 14 2015 6:54 PM",
    total: "938.65"
  },
  {
    id: 7,
    date: "Monday Feb 14 2015 7:17 PM",
    total: "43.77"
  },
  {
    id: 8,
    date: "Monday Feb 14 2015 7:18 PM",
    total: "28.54"
  },
  {
    id: 9,
    date: "Monday Feb 14 2015 7:18 PM",
    total: "194.33"
  }
];

function printProcessedOrders (orders){
	console.log("id = " +orders.id);
	console.log(orders.date);
	console.log(orders.total);
	return orders;
}

printProcessedOrders(arrayOfObjects[0]);


// Declare a new variable and set it to be a new object with the properties a, b, and result.

// Declare a new function. Declare the first parameter, which will be an object. 
// Within this function, you will access the values stored a and b of the object being passed in.
// Add the these values and store the sum to this object's result property. This function will return the object.

// Invoke your function and pass in your object, store the result to a variable and use console.log to 
// inspect your results.

// Go ahead and create some more objects and pass them to this function. Have fun with it.

var Addition = {
	a: 3,
	b: 12,
	result: 0
};

var Addition2 = {
	a: 1023,
	b: 1124,
	result: 0
};

function newFunction(object){
	object.result =object.a + object.b;
	return object;
}

console.log(newFunction(Addition));

console.log(Addition.result);

// Declare a new function and a single parameter which will be the object from the challenge just above. 
// Within this function you are to print to the screen a message of the operation performed. 

// Before returning this object, add a new property to it named output and set it 
// to be the message that was printed out.

// Invoke this function and pass in your object. Further test by changing the values 
// of the object being passed in or create more objects and invoke your function multiple times

function newerFunction(object){
	object.result = object.a + object.b;
	console.log(object.a + ' + ' + object.b + ' = ' + object.result);
	object.output = object.a + ' + ' + object.b + ' = ' + object.result;
	//object.push(output(object.a + ' + ' + object.b + ' = ' + object.result));
	return object;
}

newerFunction(Addition);
newerFunction(Addition2);

console.log(Addition2.output);

// Declare a function and a single parameter which will be an object. Within this function,
//  write a FOR loop that adds 10 random number values to the array referenced at the contents
//   property of the object being passed in. This function will return the object.

// Invoke your function and pass in your object (which should be plainBox), store the 
// result to a variable and use console.log to inspect your results.


function plainBoxFunction(object){
	for (var i = 0; i < 10; i++) {
		object.contents.push(Math.floor((Math.random() * 100) + 1));
	}
	return object;
}

var shittyExercise = plainBoxFunction(plainBox);
console.log(shittyExercise.contents);

// Declare a function and a single parameter which will be an object. Within this function 
// you will check to see if the car has an automatic or manual transmission and print the results on screen.

// If automaticTransmission is true then print a message saying so. Also, provide an appropriate message for when the its false.

// Invoke your function and pass in your object, store the result to a variable and use console.log to inspect your results.

function detectingTransmission (object){
	if (object.automaticTransmission) {
		console.log('your car drives itself!');
	}else {
	 	console.log('Yabadabadoo!');
	}
}

detectingTransmission(stockCar);

var stockCar = 
	{
	model: 'Ford',
	year: 2016,
	automaticTransmission: true,
	drivers: null,
	passengers: [],
};

function driver (object, person){
	object.drivers = person;
}

driver(stockCar, builtPerson.name);

console.log('the drivers name is ' + stockCar.drivers + '!');

// The Dev League instructors want to ride your whip!

// Declare a variable named passengerList and set it to be ['Jon', 'Jason', 'Tony', 'Joe', 'Jesse', 'Nigel', 'Kelli', 'Marifel', 'Victor']

// Declare a variable named passengerAges and set it to be [19, 12, 21, 22, 16, 9, 19, 20, 15]

// Declare a function and three parameters. The first will be a car and the 
// second will be an array of names and the third will be an array of ages. The names and ages are in sequence, 
// e.g. "Jon" is "19", "Jason" is "12".

// In the end you will return the car but within the function...

// You will have to populate the passengers array on the car object with proper objects that represent a person. 
// Currently you have two arrays, one which contains names and another which contains ages.

// You should iterate through the names and ages, pass the values to your buildPerson function to
// build person objects (remember that this function returns a new object). Don't forget that this
// function actually takes three arguments, how will you handle that? (you should not have to change your function).

// Example of a loaded Car:

var passengerList = ['Jon', 'Jason', 'Tony', 'Joe', 'Jesse', 'Nigel', 'Kelli', 'Marifel', 'Victor'];
var passengerAges = [19, 12, 21, 22, 16, 9, 19, 20, 15];

function passengers (car, nameArray, ageArray){
	for (var i = 0; i < 9; i++) {
		car.passengers.push({
			name: nameArray[i],
			age: ageArray[i]
		}
		);
	}
	return car;
}

console.log(passengers(stockCar, passengerList, passengerAges).passengers);
console.log(stockCar.passengers);


// var plainPerson = {};

// function buildPerson (person, nameString, age){	
// 	person.name = nameString; 
// 	person.age = age;
// 	return person;
// }

// var builtPerson = buildPerson(plainPerson,'Leo',20);
// console.log(builtPerson.age);

// console.log(plainPerson);

// Delcare a function and set one parameter which will be a car. This function should print out each passenger's 
// name and age one line at a time.

// example output:

function displayPassengers (car){
	for (var i = 0; i < 9; i++) {
		console.log(car.passengers[i].name + ", age " + car.passengers[i].age + ", is riding dirty!");
	}
	return car;
}

displayPassengers(stockCar);













