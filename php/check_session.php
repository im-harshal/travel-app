<?php
session_start();
header('Content-Type: application/json');

$response = [
    'loggedIn' => false,
    'firstname' => '',
    'lastname' => ''
];

if (isset($_SESSION['user'])) {
    $response['loggedIn'] = true;
    $response['firstname'] = $_SESSION['user']['FirstName'];
    $response['lastname'] = $_SESSION['user']['LastName'];
}

echo json_encode($response);
exit;
?>
