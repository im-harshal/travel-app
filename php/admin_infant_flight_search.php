<?php
session_start();
require_once 'config.php';

// Function to check if user is admin
function checkAdminAuth() {
    if (!isset($_SESSION['user']) || $_SESSION['user']['Phone'] !== '222-222-2222') {
        sendJsonResponse(['error' => 'Unauthorized'], 401);
    }
}

// Search flights with infants
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    checkAdminAuth();
    
    $sql = "SELECT DISTINCT f.*, COUNT(DISTINCT p.ssn) as infant_count
            FROM flights f
            JOIN flight_bookings fb ON f.flightid = fb.flight_id
            JOIN tickets t ON fb.flight_booking_id = t.flight_booking_id
            JOIN passengers p ON t.ssn = p.ssn
            WHERE p.category = 'infants'
            GROUP BY f.flightid";
    
    $result = $conn->query($sql);
    
    $infantFlights = [];
    while ($row = $result->fetch_assoc()) {
        $infantFlights[] = $row;
    }
    
    echo json_encode($infantFlights);
    
}