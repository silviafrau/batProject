<?php

$nome=$_POST["nome"];

$fileElenco =file_get_contents('./ElencoMesh.json');

echo $fileElenco;
/*
$arraydati = json_decode($fileElenco);

$nuovo = eliminaElemento($arraydati,$nome);

unset($arraydati[]);

$filejason = fopen("./ElencoMesh.json","w");

$arraynuovo=json_encode($arraydati);

fwrite($filejason, $arraynuovo);

fclose($filejason);

echo "eliminato";
*/
?>
