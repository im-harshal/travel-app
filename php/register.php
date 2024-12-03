<?php
session_start();
require_once 'config.php';

header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

// Validate required fields
$required_fields = ['phone', 'password', 'firstname', 'lastname', 'dob', 'email'];
foreach ($required_fields as $field) {
    if (empty($_POST[$field])) {
        $response['message'] = 'All required fields must be filled';
        echo json_encode($response);
        exit;
    }
}

// Debug phone format
error_log("Phone number received: " . $_POST['phone']);
if (!preg_match('/^\d{3}-\d{3}-\d{4}$/', $_POST['phone'])) {
    error_log("Phone validation failed for: " . $_POST['phone']);
    $response['message'] = 'Invalid phone number format';
    $response['debug']['phone_received'] = $_POST['phone'];
    echo json_encode($response);
    exit;
}

// Check if phone number already exists
$stmt = $conn->prepare("SELECT phone FROM users WHERE phone = ?");
$stmt->bind_param("s", $_POST['phone']);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    $response['message'] = 'Phone number already exists';
    echo json_encode($response);
    exit;
}

// Insert user data
$stmt = $conn->prepare("INSERT INTO users (phone, password, firstname, lastname, dob, email, gender) VALUES (?, ?, ?, ?, ?, ?, ?)");
$hashed_password = password_hash($_POST['password'], PASSWORD_DEFAULT);
$stmt->bind_param("sssssss", 
    $_POST['phone'],
    $hashed_password,
    $_POST['firstname'],
    $_POST['lastname'],
    $_POST['dob'],
    $_POST['email'],
    $_POST['gender']
);

if ($stmt->execute()) {
    $response['success'] = true;
    $response['message'] = 'Registration successful';
} else {
    $response['message'] = 'Error during registration';
}

echo json_encode($response);
?>