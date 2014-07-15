<?php
$cookie = empty($_COOKIE['eqs_uuid']) ? null : $_COOKIE['eqs_uuid'];
$etag = empty($_SERVER['HTTP_IF_NONE_MATCH']) ? null : $_SERVER['HTTP_IF_NONE_MATCH'];

// cache-control: 前端缓存
// etag: 后端缓存
if ($cookie) {
    header('X-uuid-from: cookie');
    header('Cache-Control: public, max-age=31536000');
    header('ETag: ' . $cookie, true, 200);
    echo 'window.__EQS_UUID__="' . $cookie . '";';
} else if ($etag) {
    header('X-uuid-from: etag');
    header('Cache-Control: public, max-age=31536000');
    header('ETag: ' . $etag, true, 200);
    echo 'window.__EQS_UUID__="' . $etag . '";';
} else {
    header('X-uuid-from: not-found');
    header("Cache-Control: no-cache");
    exit;
}