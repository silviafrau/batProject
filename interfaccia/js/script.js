
function inserimentoElenco(Nome,url){
  var elementoMenu=$("<option></option>");
  console.log("inserimentoElenco");
  $(elementoMenu).attr("nome", url);
  $(elementoMenu).attr("class",Nome);
  $(elementoMenu).attr("value", Nome);
  elementoMenu.text(Nome);


  $("#elenco").append(elementoMenu);

}

function inserisciImmaggine(name){
  $.ajax({
    url: "./server/Elenco.php",
    type: "POST",
    data: {nome: name},
    datatype:"json",
    success:
      function(data){
        console.log(data);
        var jsonData = JSON.parse(data);
          for(i in jsonData){
            if(jsonData[i].nome == name){
              var img = document.createElement("img");
              img.src = jsonData[i].posizione;
              img.width="500";
              img.height="500";
              img.id=jsonData[i].nome;
              document.body.appendChild(img);
            }

          }
/*
        $(elementoMenu).attr(width="224" );
        $(elementoMenu).attr(height="69");
        $(elementoMenu).attr("link", data.posizione);

        $(elementoMenu).attr("id","Foto");
        $(elementoMenu).attr("class", data.nome);

        elementoMenu.text(data.nome);*/
        //$("#immaggine").append(elementoMenu);
      },
    error:function(e){
      console.log("errore nell'interrogazione della pagina immaggini " + e.message);
    }
  })

}

function creaElenco(){
  $.ajax({
    url: "./server/Elenco.php",
    type: "POST",
    datatype:"json",
    success:
      function(data){
        var jsonData = JSON.parse(data);
          for(i in jsonData)
            inserimentoElenco(jsonData[i].nome,jsonData[i].posizione);
        },
    error:function(e){
      console.log("errore nell'interrogazione della pagina Elenco " + e.message);
    }
  })
}

var flag=1;

$(document).ready(function(){

  creaElenco();

  $("#elenco").click(function(){
      var Ricerca = $("#elenco").val();
      console.log(Ricerca);
      inserisciImmaggine(Ricerca);

  })

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
