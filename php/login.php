<?php
session_start();
require_once 'config.php';

header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

if (empty($_POST['phone']) || empty($_POST['password'])) {
    $response['message'] = 'Please enter both phone and password';
    echo json_encode($response);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM users WHERE phone = ?");
$stmt->bind_param("s", $_POST['phone']);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    if (password_verify($_POST['password'], $row['password'])) {
        $_SESSION['user'] = [
            'FirstName' => $row['firstname'],
            'LastName' => $row['lastname'],
            'Phone' => $row['phone']
        ];
        $response['success'] = true;
        $response['message'] = 'Login successful';
    } else {
        $response['message'] = 'Invalid password';
    }
} else {
    $response['message'] = 'User not found';
}

echo json_encode($response);
?>