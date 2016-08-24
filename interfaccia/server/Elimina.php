<?php
function converti($array){
  $array_json = array();
  foreach($array as $elemento){
    $decode = json_decode($elemento);
    array_push ($array_json, $decode);
  }
  return $array_json;
}

$nome=$_POST["nome"];

$fileElenco =file_get_contents('./ElencoMesh.json');

$arraydati=json_decode($fileElenco);

$arrayconvert=converti($arraydati);

unset($arrayconvert[array_search($nome,$arrayconvert)]);

$filejason = fopen("./ElencoMesh.json","w");

$arraynuovo=json_encode($arrayconvert);

fwrite($filejason, $arraynuovo);

fclose($filejason);

echo $arraynuovo;
?>
