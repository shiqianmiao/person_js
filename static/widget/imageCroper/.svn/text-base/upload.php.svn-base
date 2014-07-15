<?php

$data = $GLOBALS["HTTP_RAW_POST_DATA"];
$path = 'temp.jpg';

$result = array();

if(empty($data)) {
	$data = file_get_contents('php://input');
}

try {
	$resource = fopen($path, 'w');

	if ($resource) {
		fwrite($resource, $data);
		fclose($resource);
		$result['code'] = 200;
		$result['url'] = $path; // 路径
	} else {
		$result['code'] = 500;
	}

} catch (Exception $e) {
	$result['code'] = 500;
}

echo json_encode($result);
exit;