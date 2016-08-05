<?php
/*
  function trasmormastringa ($stringa){

    $arraytrasformato = array();
     foreach ($stringa as $elemento) {
       $trajson=json_decode($elemento);
       array_push($arraytrasformato,$trajson);
     }
    return $arraytrasformato;
  }

  function Rinomina($elementoricerca,$stringa,$rinomina){

      foreach ($stringa as $elemento) {
        if($elementoricerca == $elemento->{'nome'}){
          $elemento->{'nome'}=$rinomina;
        }
      }
      return $stringa;
  }
*/
  $nome=$_POST["nome"];
  $rinomina=$_POST["rinome"];

  $fileElenco =file_get_contents('./ElencoMesh.json');

  $arraydati=json_decode($fileElenco);

  //$elementijsone = trasmormastringa($arraydati);

  //echo $elementijsone;

  //$arraynuovo = Rinomina($nome,$elementijsone,$rinomina);

  foreach ($arraydati as $value) {
    if($value->nome==$nome){
      $value->nome=$rinomina;
    }
  }

  $filejason = fopen("./ElencoMesh.json","w");

  $arraynuovo=json_encode($arraydati);

  fwrite($filejason, $arraynuovo);

  fclose($filejason);

  echo $arraynuovo;
?>
