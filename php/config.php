<?php
$db_host = 'mysql';
$db_user = 'user';
$db_pass = 'userpassword';
$db_name = 'travel_app';

$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>