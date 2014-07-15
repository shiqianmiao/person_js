<?
// if jsonp(crossdomain)
$jsonp = $_GET['callback'];

$data = array(
    array(
        'data' => 'A node',
        'state' => 'open',
        'children' => array(
            array(
                'data' => array(
                    'title' => 'B node',
                    'attr' => array(
                        'href' => 'http://www.cnblogs.com/lovesueee/'
                    )
                ),
                'children' => array(
                    'C child'
                )
            )
        )
    ),
    'D node'
);

echo $jsonp . '(' . json_encode($data) . ')';