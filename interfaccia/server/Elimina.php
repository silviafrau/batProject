<?php
function TrovaIndice($arrayconvert,$nome){
  foreach ($arrayconvert as $key => $value) {
    if($value->{'nome'}==$nome){
      return $key;
    }
  }
}

function converti($array){
  $array_json = array();
  foreach($array as $elemento){
    array_push ($array_json, $elemento);
  }
  return $array_json;
}

$nome=$_POST["nome"];

$fileElenco =file_get_contents('./ElencoMesh.json');

$arraydati=json_decode($fileElenco);

$arrayconvert = converti($arraydati);

unset($arrayconvert[TrovaIndice($arrayconvert,$nome)]);

$filejason = fopen("./ElencoMesh.json","w");

$arraynuovo=json_encode($arrayconvert);

fwrite($filejason, $arraynuovo);

fclose($filejason);

echo $arraynuovo;
?>
