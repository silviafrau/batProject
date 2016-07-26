function menu(){
  var elementoMenu=$("<menu></menu");
//<button type="button" name="Rinomina" id="RINOMINA">RINOMINA</button>
//<button type="button" name="Visualizza" id="VISUALIZZA">VISUALIZZA</button>
//<button type="button" name="Cancella" id="CANCELLA">CANCELLA</button>
  var buttonMenu1 = $("<button></button>");
  $(buttonMenu1).attr("type", "button");
  $(buttonMenu1).attr("name", "Rinomina");
  $(buttonMenu1).attr("id", "RINOMINA");
  buttonMenu1.text("RINOMINA");
  $(elementoMenu).append($(buttonMenu1));

var buttonMenu2 = $("<button></button>");
  $(buttonMenu2).attr("type", "button");
  $(buttonMenu2).attr("name", "Visualizza");
  $(buttonMenu2).attr("id", "VISUALIZZA");
  buttonMenu2.text("VISUALIZZA");
  $(elementoMenu).append($(buttonMenu2));

var buttonMenu3 = $("<button></button>");
  $(buttonMenu3).attr("type", "button");
  $(buttonMenu3).attr("name", "Cancella");
  $(buttonMenu3).attr("id", "CANCELLA");
  buttonMenu3.text("CANCELLA");
  $(elementoMenu).append($(buttonMenu3));


  $("#name").append(elementoMenu);

}
/*
*/

$(document).ready(function(){

  $("#name").click(function(){
    menu();
  });

});
