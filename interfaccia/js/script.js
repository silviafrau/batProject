
function inserimentoElenco(Nome,url){
  var elementoMenu=$("<option></option>");
  console.log("inserimentoElenco");
  $(elementoMenu).attr("nome", url);
  $(elementoMenu).attr("class",Nome);
  $(elementoMenu).attr("value", Nome);
  elementoMenu.text(Nome);


  $("#elenco").append(elementoMenu);

}

function EliminaElemento(name){
  $.ajax({
    url: "./server/Elimina.php",
    type: "POST",
    data: {nome: name},
    datatype:"json",
    success:
      function(data){
        console.log(data);
        //var jsonData = JSON.parse(data);
        },
    error:function(e){
      console.log("errore nell'interrogazione della pagina Riname " + e.message);
    }
  })
}

function RinominaElemento(name,riname){
  $.ajax({
    url: "./server/Riname.php",
    type: "POST",
    data: {nome: name, rinome: riname},
    datatype:"json",
    success:
      function(data){
        console.log("nome cambiato " + data);
        },
    error:function(e){
      console.log("errore nell'interrogazione della pagina Riname " + e.message);
    }
  })
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
              if(jsonData[i].nome == name){//viene cercata la posizione dell'elemento selezionato

              if( document.getElementById('Foto') != null)
                $("#Foto").remove();

                var img = document.createElement("img");
                img.id="Foto";
                img.src = jsonData[i].posizione;
                img.width="500";
                img.height="500";
                img.value=jsonData[i].Nome;
                img.left="0";
                document.body.appendChild(img);
              }
            }
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

$(document).ready(function(){

  creaElenco();

  $("#RINAME").hide();
  $("#ButtonRiname").hide();

  $("#elenco").click(function(){
        var Ricerca = $("#elenco").val();
        console.log(Ricerca);
        inserisciImmaggine(Ricerca);
        $("#RINAME").hide();
        $("#ButtonRiname").hide();
  })

  $("#RINOMINA").click(function(){
    $("#RINAME").show();
    $("#ButtonRiname").show();

  });

  $("#ButtonRiname").click(function(){

    var nome = $("#elenco").val();
    var rinomina= $("#RINAME").val();

    RinominaElemento(nome,rinomina);

    $("#RINAME").hide();
    $("#ButtonRiname").hide();
    window.location.reload();
  });

  $("#VISUALIZZA").click(function(){
  });

  $("#CANCELLA").click(function(){
    var nome = $("#elenco").val();
    EliminaElemento(nome);
  });

});
