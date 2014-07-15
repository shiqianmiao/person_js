<?php
// var_export($_FILES["file"]);exit;
$code = $_FILES["file"]['error'];
if (!$code) {
    move_uploaded_file($_FILES["file"]["tmp_name"], dirname(__FILE__) . "/upload/" . $_FILES["file"]["name"]);
    echo json_encode(array(array(
            'error' => 0,
            'url'      => 'http://static.273.cn/lib/imageCroper/test/upload/'.$_FILES["file"]["name"]
        )));
} else {
    echo json_encode(array(array(
            'error' => 1,
            'text' => '错误代码(' . $code . ')'

        )));
}
