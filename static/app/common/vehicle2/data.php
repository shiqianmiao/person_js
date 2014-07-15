<?

$action = $_GET['action'];

if ($action === 'getBrand') {

    $carType = $_GET['car_type'];

    $result = array(
        "A" => array(
            array(
                "value" => 1,
                "text" => "奥迪"
            ),
            array (
                "value" => 2,
                "text" => "安驰"
            )
        ),
        "B" => array(
            array(
                "value" => 3,
                "text" => "比特"
            ),
            array (
                "value" => 4,
                "text" => "比丘"
            )
        )
    );
} else if ($action === 'getSeries') {

    $brandId = $_GET['brand_id'];

    $result = array(
        array(
            "value" => 1,
            "text" => "雅阁"
        ),
        array(
            "value" => 2,
            "text" => "思域"
        )

    );
} else if ($action === 'getModel') {

    $seriesId = $_GET['series_id'];

    $result = array(
        array(
            "value" => 1,
            "text" => "2012款 1.8EXI手动舒适版"
        ),
        array(
            "value" => 2,
            "text" => "2012款 1.8EXI手动舒适版"
        )

    );
} else if ($action === 'getType') {

    $brandId = $_GET['brand_id'];
    $seriesId = $_GET['series_id'];
    $modelId = $_GET['model_id'];

    $result = array(
        "value" => '4'
    );
}


echo json_encode($result);