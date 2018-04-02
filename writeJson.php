<?php

$fileOutput = "drawing.json";

if(!empty($_GET['put'])){
  $saveJson = $_GET['put'];
}

$file = fopen($fileOutput, "w") or die ("can't open file");
fwrite($file, $saveJson);
fclose($file);

?>
