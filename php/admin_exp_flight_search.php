<?php
session_start();
require_once 'config.php';

// Function to check if user is admin
function checkAdminAuth() {
    if (!isset($_SESSION['user']) || $_SESSION['user']['Phone'] !== '222-222-2222') {
        sendJsonResponse(['error' => 'Unauthorized'], 401);
    }
}

// Search expensive flights
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    checkAdminAuth();
    
    $sql = "SELECT f.*, COUNT(fb.flight_booking_id) as booking_count
            FROM flights f
            LEFT JOIN flight_bookings fb ON f.flightid = fb.flight_id
            GROUP BY f.flightid
            HAVING AVG(fb.total_price) > 
                (SELECT AVG(total_price) FROM flight_bookings)";
    
    $result = $conn->query($sql);
    
    $expensiveFlights = [];
    while ($row = $result->fetch_assoc()) {
        $expensiveFlights[] = $row;
    }
    
    echo json_encode($expensiveFlights);
    
}