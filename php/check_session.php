<?php
session_start();
header('Content-Type: application/json');

$response = [
    'loggedIn' => false,
    'firstname' => '',
    'lastname' => '',
    'phone' => ''
];

if (isset($_SESSION['user'])) {
    $response['loggedIn'] = true;
    $response['firstname'] = $_SESSION['user']['FirstName'];
    $response['lastname'] = $_SESSION['user']['LastName'];
    $response['phone'] = $_SESSION['user']['Phone'];
}

echo json_encode($response);
exit;
?>
