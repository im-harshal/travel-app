<?php
session_start();
require_once 'config.php';

// Function to check if user is admin
function checkAdminAuth() {
    if (!isset($_SESSION['user']) || $_SESSION['user']['Phone'] !== '222-222-2222') {
        sendJsonResponse(['error' => 'Unauthorized'], 401);
    }
}

// Search Texas flights
if (isset($_POST['city'])) {
    checkAdminAuth();
    
    $sql = "SELECT f.*, COUNT(fb.flight_booking_id) as booking_count
            FROM flights f
            LEFT JOIN flight_bookings fb ON f.flightid = fb.flight_id
            WHERE f.origin = ?
            GROUP BY f.flightid";
            
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $_POST['city']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $flights = [];
    while ($row = $result->fetch_assoc()) {
        $flights[] = $row;
    }
    
    echo json_encode($flights);
    $stmt->close();
}