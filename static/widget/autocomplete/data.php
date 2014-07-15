<?

$query = $_GET['q'];

if ( $query === 'a') {
    // $data = array('ac', 'ad', 'ae', 'ah','ac', 'ad', 'ae', 'ah','ac', 'ad', 'ae', 'ah');
    $data = array(
        array(
            'value' => 'ac'
        ),
        array(
            'value' => 'ab'
        ),
        array(
            'value' => 'ae'
        ),
        array(
            'value' => 'as'
        ),
        array(
            'value' => 'ad'
        ),
        array(
            'value' => 'as'
        ),
        array(
            'value' => 'ac'
        ),
        array(
            'value' => 'ac'
        ),
        array(
            'value' => 'ac'
        ),
        array(
            'value' => 'ac'
        ),
        array(
            'value' => 'ac'
        ),

    );
} else if ( $query === 'ab') {
    $data = array('abc', 'abd', 'asab', 'abd');
} else {
    $data = array();
}

echo json_encode($data);


