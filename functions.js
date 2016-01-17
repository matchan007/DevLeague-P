
////////////////////////////////////////////////////

var a = 10;
var b = 32;

function add (){
	x = a + b;
	return x;
}

var sum = (add());

console.log(sum);

////////////////////////////////////////////////////

function subtract (){
	x = a - b;
	return x;
}

var difference = (subtract());
console.log(difference);

////////////////////////////////////////////////////

function multiply (){
	x = a * b;
	return x;
}

var product = (multiply());

console.log(product);

////////////////////////////////////////////////////

function checkDifference (x){
	console.log('My football team lost' + x + ' times this week!');
}

checkDifference(difference);

////////////////////////////////////////////////////

function checkSum (x){
	console.log('I can add ' + x + ' numbers!!!');
}

checkSum(sum);

////////////////////////////////////////////////////

function checkProduct(x, y){
	console.log(x * y);
}

checkProduct(product, difference);

////////////////////////////////////////////////////

function name (firstName, lastName) {
	 return (firstName + ' ' + lastName);
}

var myFullName = name('leo', 'rogers');
console.log(myFullName);

////////////////////////////////////////////////////

function verifyDrinkingAge (age){
	if (age > 20){
		return true;
	} else
		return false;
}

var myAge = 20;
var canDrinkBeer = verifyDrinkingAge(myAge);
console.log(canDrinkBeer);

////////////////////////////////////////////////////

function throwParty(){
	if (canDrinkBeer){
		console.log('This party will have an open bar!');
	}else {
		console.log('No kids allowed.');
	}
}

throwParty();

////////////////////////////////////////////////////

function eatFood(firstName, lastName, food){
	console.log(firstName + ' ' + lastName + ' loves to eat ' + food);
}

eatFood('Leo', 'Rogers', 'sushi');


////////////////////////////////////////////////////






