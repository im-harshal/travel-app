<?php
session_start();
require_once 'config.php';

// Function to check if user is admin
function checkAdminAuth() {
    if (!isset($_SESSION['user']) || $_SESSION['user']['Phone'] !== '222-222-2222') {
        sendJsonResponse(['error' => 'Unauthorized'], 401);
    }
}

// Search Texas hotels
if (isset($_POST['city'])) {
    checkAdminAuth();
    
    $sql = "SELECT h.*, COUNT(hb.hotel_booking_id) as booking_count
            FROM hotels h
            LEFT JOIN hotel_bookings hb ON h.hotel_id = hb.hotel_id
            WHERE h.city = ?
            GROUP BY h.hotel_id";
            
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $_POST['city']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $hotels = [];
    while ($row = $result->fetch_assoc()) {
        $hotels[] = $row;
    }
    
    echo json_encode($hotels);
    $stmt->close();
}