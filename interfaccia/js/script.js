
function inserimentoElenco(data){
  var elementoMenu=$("<option></option>");


  $(elementoMenu).attr("value", data.nome);
  $(elementoMenu).text(data.nome);


  $("#elenco").append(elementoMenu);

}
/*
function creaElenco(){
  j.ajax({
    url: "../server/Elenco.php",
    type: "POST",
    data:{nome:nome},
    datatype:"json",
    success:
      function(){
        foreach(data as data){
          inserimentoElenco(data);
        }
      },
    error:
      console.log("errore nell'interrogazione della pagina Elenco")
  })
}
*/
$(document).ready(function(){


  $("#RINOMINA").click(function(){
    var nome=$("<input>");
    $(nome).attr("type","text");
    $(nome).attr("id","RINAME");

    var pulsante=$("<button></button>");
    $(pulsante).attr("type","button");
    $(pulsante).attr("id","conferma");
    $(pulsante).text("CONFERMA");
    $("#name").append(nome);
    $("#name").append(pulsante);

  });

  $("#VISUALIZZA").click(function(){
  });

  $("#CANCELLA").click(function(){
  });

});
