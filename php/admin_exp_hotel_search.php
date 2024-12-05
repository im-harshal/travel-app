<?php
session_start();
require_once 'config.php';

// Function to check if user is admin
function checkAdminAuth() {
    if (!isset($_SESSION['user']) || $_SESSION['user']['Phone'] !== '222-222-2222') {
        sendJsonResponse(['error' => 'Unauthorized'], 401);
    }
}

// Search expensive hotels
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    checkAdminAuth();
    
    $sql = "SELECT h.*, COUNT(hb.hotel_booking_id) as booking_count
            FROM hotels h
            LEFT JOIN hotel_bookings hb ON h.hotel_id = hb.hotel_id
            GROUP BY h.hotel_id
            HAVING AVG(hb.price_per_night) > 
                (SELECT AVG(price_per_night) FROM hotel_bookings)";
    
    $result = $conn->query($sql);
    
    $expensiveHotels = [];
    while ($row = $result->fetch_assoc()) {
        $expensiveHotels[] = $row;
    }
    
    echo json_encode($expensiveHotels);
    
}