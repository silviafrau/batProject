<?php

function converti($array){
  $array_json = array();
  foreach($array as $elemento){
    $decode = json_decode($elemento);
    array_push ($array_json, $decode);
  }
  return $array_json;
}


  $fileElenco =fopen("ElencoMesh","r+");

  $risult=fgets($fileElenco);
  $array= explode(';',$result);
	$elementi_js = converti($array);

  echo json_encode($elementi_js);




?>
