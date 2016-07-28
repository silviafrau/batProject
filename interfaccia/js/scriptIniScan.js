function menuOpzioni() {
  var elementoMenu=$("<menu></menu");

  var buttonMenu1 = $("<button></button>");
  $(buttonMenu1).attr("type", "button");
  $(buttonMenu1).attr("id", "START");
  buttonMenu1.text("START");
  $(elementoMenu).append($(buttonMenu1));

  var buttonMenu2 = $("<button></button>");
  $(buttonMenu2).attr("type", "button");
  $(buttonMenu2).attr("id", "RESET");
  buttonMenu2.text("RESET");
  $(elementoMenu).append($(buttonMenu2));


  $("#menuOpzioni").append(elementoMenu);

}

var flag=true;

$(document).ready(function(){
  $("#opzioni").click(function(){
    if(flag){
      menuOpzioni();
      flag=false;
    }

  });

  $("#START").click(function(){
    console.log("START");
    //funzione della scansione
  });

  $("#RESET").click(function(){
    console.log("RESET");
    //funzione reset scansione
  });

});
