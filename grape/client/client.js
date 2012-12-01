  Session.set("location","Buenos Aires");

  Template.hello.greeting = function () {
    return "Welcome to grape.";
  };
 
  Template.iniciativaForm.location = function(){
    return Session.get("location");
  }; 

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
