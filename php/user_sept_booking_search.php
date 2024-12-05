<?php
// user_searches.php - Handles all user-related searches
session_start();
require_once 'config.php';

// Function to check if user is logged in
function checkUserAuth() {
    if (!isset($_SESSION['user'])) {
        sendJsonResponse(['error' => 'Unauthorized'], 401);
    }
}

// Search September bookings
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    checkUserAuth();
    
    $sql = "SELECT fb.*, f.*, COUNT(t.ticket_id) as passenger_count
            FROM flight_bookings fb
            JOIN flights f ON fb.flight_id = f.flightid
            JOIN tickets t ON fb.flight_booking_id = t.flight_booking_id
            WHERE MONTH(f.departuredate) = 9
            GROUP BY fb.flight_booking_id";
            
    $result = $conn->query($sql);
    
    $septemberBookings = [];
    while ($row = $result->fetch_assoc()) {
        $septemberBookings[] = $row;
    }
    
    echo json_encode($septemberBookings);
}