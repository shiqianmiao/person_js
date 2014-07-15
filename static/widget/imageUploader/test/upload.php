<?php
$code = $_FILES["file"]['error'];

if (!$code) {
    $_FILES["file"]["name"] = time() . $_FILES["file"]["name"];
    move_uploaded_file($_FILES["file"]["tmp_name"], dirname(__FILE__) . "/upload/" . $_FILES["file"]["name"]);
    echo json_encode(array(
            'error' => 0,
            'url'      => 'http://static.273.cn/widget/imageUploader/test/upload/'.$_FILES["file"]["name"]
        ));
} else {
    echo json_encode(array(
            'error' => 1,
            'text' => '错误代码(' . $code . ')'

        ));
}
