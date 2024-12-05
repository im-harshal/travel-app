<?php
session_start();
require_once 'config.php';

// Function to check if user is admin
function checkAdminAuth() {
    if (!isset($_SESSION['user']) || $_SESSION['user']['Phone'] !== '222-222-2222') {
        sendJsonResponse(['error' => 'Unauthorized'], 401);
    }
}

// Count California flights
if (isset($_POST['city'])) {
    checkAdminAuth();
    
    $sql = "SELECT COUNT(*) as flight_count
            FROM flights
            WHERE destination = ?";
            
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $_POST['city']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $count = $result->fetch_assoc();
    echo json_encode($count);
    
    $stmt->close();
    
}