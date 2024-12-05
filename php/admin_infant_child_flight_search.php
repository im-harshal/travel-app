<?php
session_start();
require_once 'config.php';

// Function to check if user is admin
function checkAdminAuth() {
    if (!isset($_SESSION['user']) || $_SESSION['user']['Phone'] !== '222-222-2222') {
        sendJsonResponse(['error' => 'Unauthorized'], 401);
    }
}

// Search flights with both infants and children
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    checkAdminAuth();
    
    $sql = "SELECT f.*
            FROM flights f
            JOIN flight_bookings fb ON f.flightid = fb.flight_id
            JOIN tickets t ON fb.flight_booking_id = t.flight_booking_id
            JOIN passengers p ON t.ssn = p.ssn
            WHERE p.category IN ('infants', 'children')
            GROUP BY f.flightid
            HAVING COUNT(DISTINCT CASE WHEN p.category = 'infants' THEN p.ssn END) > 0
            AND COUNT(DISTINCT CASE WHEN p.category = 'children' THEN p.ssn END) > 0";
    
    $result = $conn->query($sql);
    
    $mixedFlights = [];
    while ($row = $result->fetch_assoc()) {
        $mixedFlights[] = $row;
    }
    
    echo json_encode($mixedFlights);
    
}