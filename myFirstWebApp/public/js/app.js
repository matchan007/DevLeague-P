
  function addLastName(){

    var lastNameElem = document.createElements('span');

    var lastNameText = document.createTextNod('Rogers');

    lastNameElem.id = 'myLastName';
    lastNameElem.appendChild(lastNameText);

    var myNameElem = document.getElementById('myName');

    myNameElem.appendchilde(lastNameElem);

    console.log('last name added');
  }


  // var myName = 'Jon';

  // // function saySomeonesName(name, elementId){
  // //   document.getElementById(elementId).innerHTML = name;
  // // }

  // // saySomeonesName(myName, 'myName');

  // //THIS IS JUST AN EXAMPLE OF HOW TO CREATE ELEMENTS
  // function generateDocument(){
  //   //1. document.createElement
  //   //2. element.appendChild

  //   var element = document.createElement('div');
  //   element.id = 'someId';
  //   document.body.appendChild(element);
  //   //<div id='someId'>TEST</div>

  //   var newElement = document.createElement('span');
  //   newElement.id = 'someOtherId';
  //   document.getElementById('someId').appendChild(newElement);
  // }

  // generateDocument();
