<?php

  $nome=$_POST["nome"];
  $rinomina=$_POST["rinome"];

  $fileElenco =file_get_contents('./ElencoMesh.json');

  $arraydati=json_decode($fileElenco);

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
